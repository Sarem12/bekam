"use server"
import { PrismaClient } from "@prisma/client";
import { generateContent } from "@/lib/gemini";
import { stringifyDefaultParagraph } from "@/lib/stringifiers";
import { GetBestParagraph, ChangeToBestParagraph } from "@/lib/analyzer";

import {prisma} from "@/lib/prisma";
export async function GetParagraph(UserId: string, RealParagraphId: string) {
    // 1. Check if the user already has a preferred version in the DB
    const paragraphRecord = await GetBestParagraph(RealParagraphId, UserId);

    if (paragraphRecord) {
        await prisma.paragraph.update({
            where: { id: paragraphRecord.id },
            data: { views: { increment: 1 } }
        });
        return { content: paragraphRecord.content, id: paragraphRecord.id };
    }

    // 2. Fetch User and the static Source Text
    const CurrentUser = await prisma.user.findUnique({ where: { id: UserId } });
    if (!CurrentUser) return { error: "User not found" };

    const source = await prisma.realParagraph.findUnique({ 
        where: { id: RealParagraphId } 
    });
    if (!source) return { error: "RealParagraph source not found" };

    // 3. Generate AI content based on the RealParagraph text
    const response = await generateContent({
        requestType: 'paragraph',
        user: CurrentUser,
        target: stringifyDefaultParagraph(source)
    });

    if (response.error) throw new Error(response.error);

    // 4. Create the new AI Paragraph and link it to the RealParagraph
    return await prisma.$transaction(async (tx) => {
        // Find or create the Slot (DefaultParagraph)
        let slot = await tx.defaultParagraph.findFirst({
            where: { UserId, RealParagraphId }
        });

        const newParagraph = await tx.paragraph.create({
            data: {
                content: response.content,
                LessonId: source.LessonId,
                MasterParagraphId: RealParagraphId, // Linking to RealParagraph
                views: 1,
                usage: 1,
                tagsParagraph: {
                    create: (response.tagsUsed as string[] || []).map(tagName => ({
                        tag: {
                            connectOrCreate: {
                                where: { name: tagName },
                                create: { name: tagName }
                            }
                        }
                    }))
                },
                userActions: {
                    create: { UserId, onuse: true }
                }
            }
        });

        if (slot) {
            await tx.defaultParagraph.update({
                where: { id: slot.id },
                data: { ParagraphId: newParagraph.id }
            });
        } else {
            await tx.defaultParagraph.create({
                data: {
                    UserId,
                    ParagraphId: newParagraph.id,
                    RealParagraphId,
                    LessonId: source.LessonId,
                    order: 0
                }
            });
        }

        return { ...response, id: newParagraph.id };
    });
}

/**
 * CHANGE PARAGRAPH (Triggered when user clicks "Change" or "Re-generate")
 */
export async function ChangeParagraph(DefaultParagraphId: string, userId: string) {
    const slot = await prisma.defaultParagraph.findUnique({ where: { id: DefaultParagraphId } });
    if (!slot) return { error: "Slot not found" };

    // 1. Mark current version as skipped for this user
    await prisma.userParagraph.updateMany({
        where: { UserId: userId, ParagraphId: slot.ParagraphId },
        data: { skiped: true, onuse: false }
    });

    // 2. Try to find another high-scoring Paragraph linked to this RealParagraph
    const best = await ChangeToBestParagraph(DefaultParagraphId, userId);
    
    if (best) {
        await prisma.paragraph.update({
            where: { id: best.id },
            data: { views: { increment: 1 } }
        });
        await prisma.defaultParagraph.update({
            where: { id: DefaultParagraphId },
            data: { ParagraphId: best.id }
        });
        return best;
    }

    // 3. If no good alternatives exist, generate a brand new one
    const source = await prisma.realParagraph.findUnique({ where: { id: slot.RealParagraphId } });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!source || !user) return { error: "Source or User context missing" };

    const response = await generateContent({
        requestType: 'paragraph',
        user: user,
        target: stringifyDefaultParagraph(source)
    });

    if (response.error) return response;

    const created = await prisma.paragraph.create({
        data: {
            content: response.content,
            LessonId: slot.LessonId,
            MasterParagraphId: slot.RealParagraphId,
            defaultParagraphId: DefaultParagraphId, // Links to the pool
            userActions: { create: { UserId: userId, onuse: true } }
        }
    });

    await prisma.defaultParagraph.update({
        where: { id: DefaultParagraphId },
        data: { ParagraphId: created.id }
    });

    return { ...response, id: created.id };
}


export async function LikeEventParagraph(UserId: string, ParagraphId: string) {
    return await prisma.$transaction(async (tx) => {
        // 1. Get the user's specific record for this AI paragraph
        const userAction = await tx.userParagraph.findFirst({
            where: { UserId, ParagraphId }
        });

        if (!userAction) {
            // If it doesn't exist, create it so we can track the like
            return await tx.userParagraph.create({
                data: { UserId, ParagraphId, status: 'liked', onuse: true }
            });
        }

        const isCurrentlyLiked = userAction.status === 'liked';
        const wasDisliked = userAction.status === 'disliked';
        
        // Toggle: If already liked, go to neutral. Otherwise, go to liked.
        const newStatus = isCurrentlyLiked ? 'neutral' : 'liked';
        const change = isCurrentlyLiked ? -1 : 1;

        // 2. Update User Action status
        await tx.userParagraph.update({
            where: { id: userAction.id },
            data: { status: newStatus }
        });

        // 3. Update Global Paragraph Stats
        await tx.paragraph.update({
            where: { id: ParagraphId },
            data: { 
                likes: { increment: change },
                // If we are moving from Disliked -> Liked, remove the dislike
                dislikes: (wasDisliked && !isCurrentlyLiked) ? { decrement: 1 } : undefined
            }
        });

        // 4. Update Tag Relators (So the "Scoring Brain" learns what tags are popular)
        await tx.tagRelatorParagraph.updateMany({
            where: { ParagraphId },
            data: { 
                likes: { increment: change },
                dislikes: (wasDisliked && !isCurrentlyLiked) ? { decrement: 1 } : undefined
            }
        });

        return { success: true, newStatus };
    });
}

/**
 * DISLIKE EVENT FOR PARAGRAPH
 */
export async function DislikeEventParagraph(UserId: string, ParagraphId: string) {
    return await prisma.$transaction(async (tx) => {
        const userAction = await tx.userParagraph.findFirst({
            where: { UserId, ParagraphId }
        });

        if (!userAction) return { error: "User record not found" };

        const isCurrentlyDisliked = userAction.status === 'disliked';
        const wasLiked = userAction.status === 'liked';
        
        const newStatus = isCurrentlyDisliked ? 'neutral' : 'disliked';
        const change = isCurrentlyDisliked ? -1 : 1;

        await tx.userParagraph.update({
            where: { id: userAction.id },
            data: { status: newStatus }
        });

        await tx.paragraph.update({
            where: { id: ParagraphId },
            data: { 
                dislikes: { increment: change },
                likes: (wasLiked && !isCurrentlyDisliked) ? { decrement: 1 } : undefined
            }
        });

        await tx.tagRelatorParagraph.updateMany({
            where: { ParagraphId },
            data: { 
                dislikes: { increment: change },
                likes: (wasLiked && !isCurrentlyDisliked) ? { decrement: 1 } : undefined
            }
        });

        return { success: true, newStatus };
    });
}

/**
 * FLAG EVENT FOR PARAGRAPH
 */
export async function FlagEventParagraph(UserId: string, ParagraphId: string) {
    return await prisma.$transaction(async (tx) => {
        const userAction = await tx.userParagraph.findFirst({
            where: { UserId, ParagraphId }
        });

        if (!userAction) return { error: "User record not found" };

        const newFlagState = !userAction.flaged;
        const change = newFlagState ? 1 : -1;

        await tx.userParagraph.update({
            where: { id: userAction.id },
            data: { flaged: newFlagState }
        });

        // Update Global Stats
        await tx.paragraph.update({
            where: { id: ParagraphId },
            data: { flags: { increment: change } }
        });

        // Update Tag Relators
        await tx.tagRelatorParagraph.updateMany({
            where: { ParagraphId },
            data: { flags: { increment: change } }
        });

        return { success: true, flagged: newFlagState };
    });
}