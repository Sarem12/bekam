import { GetBestNote, ChangeToBestNote } from "@/lib/analyzer";
import { generateContent } from "@/lib/gemini";
import { Lesson, stringifiedContent, User, Note, NoteDefault, UserNote, TagRelatorNote, Tag } from "@/lib/types";
import { stringifyLesson } from "@/lib/stringifiers";
import { 
    user, lesson, note, noteDefault, noteDefaultOut, noteOut, 
    userNote, userNoteOut, tag, tagRelatorNote, tagRelatorNoteOut 
} from "@/datarelated/data";

/**
 * GET NOTE
 * Fetches the best note from the DB or generates a new one via AI if none meet the quality threshold.
 */
export async function GetNote(UserId: string, lessonId: string) {
    const bestNote = await GetBestNote(lessonId, UserId);
    
    if (bestNote === null) {
        const CurrentUser = user.find(u => u.id === UserId) as User;
        if (!CurrentUser) return { error: "User not found" };

        const CurrentLesson = (lesson as Lesson[]).find(l => l.id === lessonId);
        if (!CurrentLesson) return { error: "Lesson not found" };

        const stringified = stringifyLesson(CurrentLesson);

        // Generate AI Content
        const response = await generateContent({
            requestType: 'note',
            user: CurrentUser,
            target: stringified
        });

        if (response.error) return response;

        const timestamp = Date.now();
        const noteId = `note-${timestamp}`;
        const defaultNoteId = `defnote-${timestamp}`;

        // Map Tags
        const noteTags: TagRelatorNote[] = (response.tagsUsed || [])
            .map((ta: string) => {
                const specificTag = (tag as Tag[]).find(t => t.name.toLowerCase() === ta.toLowerCase());
                if (!specificTag) return null;
                return {
                    id: `tagrel-note-${timestamp}-${Math.random()}`,
                    TagId: specificTag.id,
                    NoteId: noteId,
                    likes: 0, dislikes: 0, views: 0, usage: 0, flags: 0,
                };
            })
            .filter(Boolean) as TagRelatorNote[];

        const newNote: Note = {
            id: noteId,
            content: response.content,
            UserId: UserId,
            LessonId: lessonId,
            likes: 0, dislikes: 0, views: 1, usage: 1, flags: 0,
            createdAt: new Date().toISOString(),
        } as Note;

        const newDefaultNote: NoteDefault = {
            id: defaultNoteId,
            content: response.content,
            UserId: UserId,
            LessonId: lessonId,
            UnitId: CurrentLesson.unitId, // Logic for notes usually requires the unit context
        } as NoteDefault;

        const userNoteEntry: UserNote = {
            id: `usernote-${timestamp}`,
            UserId: UserId,
            NoteId: noteId,
            flaged: false,
            onuse: true,
            status: 'neutral',
            lastSeenAt: new Date().toISOString(),
            skiped: false
        };

        // Persistence
        note.push(newNote);
        noteDefault.push(newDefaultNote);
        userNote.push(userNoteEntry);
        tagRelatorNote.push(...noteTags);

        noteOut(note);
        noteDefaultOut(noteDefault);
        userNoteOut(userNote);
        tagRelatorNoteOut(tagRelatorNote);

        return response; 
    } 

    return bestNote;
}

/**
 * CHANGE NOTE
 * Marks current as skipped and rotates to the next best existing one, or generates new AI content.
 */
export async function ChangeNote(currentNoteId: string, userId: string) {
    // 1. Mark current as skipped
    const currentUN = (userNote as UserNote[]).find(un => 
        un.UserId === userId && un.NoteId === currentNoteId
    );
    
    if (currentUN) {
        currentUN.skiped = true;
        currentUN.onuse = false;
    }

    // 2. Try to find existing
    const existingBest = await ChangeToBestNote(currentNoteId, userId);
    if (existingBest !== null) return existingBest;

    // 3. Generate New via AI
    const noteRecord = (note as Note[]).find(n => n.id === currentNoteId);
    if (!noteRecord) return { error: "Reference note not found" };

    return await GetNote(userId, noteRecord.LessonId);
}

/**
 * EVENTS (Like / Dislike / Flag)
 */
export async function LikeEventNote(UserId: string, NoteId: string) {
    const target = (userNote as UserNote[]).find(un => un.UserId === UserId && un.NoteId === NoteId);
    if (!target) return { error: "UserNote not found" };

    const wasDisliked = target.status === 'disliked';
    if (target.status !== 'liked') {
        target.status = 'liked';
        const n = (note as Note[]).find(x => x.id === NoteId);
        if (n) {
            n.likes += 1;
            if (wasDisliked) n.dislikes = Math.max(0, n.dislikes - 1);
        }
        tagRelatorNote.filter(tr => tr.NoteId === NoteId).forEach(tr => {
            tr.likes += 1;
            if (wasDisliked) tr.dislikes = Math.max(0, tr.dislikes - 1);
        });
    } else {
        target.status = 'neutral';
        const n = (note as Note[]).find(x => x.id === NoteId);
        if (n) n.likes = Math.max(0, n.likes - 1);
        tagRelatorNote.filter(tr => tr.NoteId === NoteId).forEach(tr => tr.likes = Math.max(0, tr.likes - 1));
    }

    userNoteOut(userNote);
    noteOut(note);
    tagRelatorNoteOut(tagRelatorNote);
    return { success: true, newStatus: target.status };
}

export async function DislikeEventNote(UserId: string, NoteId: string) {
    const target = (userNote as UserNote[]).find(un => un.UserId === UserId && un.NoteId === NoteId);
    if (!target) return { error: "UserNote not found" };

    const wasLiked = target.status === 'liked';
    if (target.status !== 'disliked') {
        target.status = 'disliked';
        const n = (note as Note[]).find(x => x.id === NoteId);
        if (n) {
            n.dislikes += 1;
            if (wasLiked) n.likes = Math.max(0, n.likes - 1);
        }
        tagRelatorNote.filter(tr => tr.NoteId === NoteId).forEach(tr => {
            tr.dislikes += 1;
            if (wasLiked) tr.likes = Math.max(0, tr.likes - 1);
        });
    } else {
        target.status = 'neutral';
        const n = (note as Note[]).find(x => x.id === NoteId);
        if (n) n.dislikes = Math.max(0, n.dislikes - 1);
        tagRelatorNote.filter(tr => tr.NoteId === NoteId).forEach(tr => tr.dislikes = Math.max(0, tr.dislikes - 1));
    }

    userNoteOut(userNote);
    noteOut(note);
    tagRelatorNoteOut(tagRelatorNote);
    return { success: true, newStatus: target.status };
}

export async function FlagEventNote(UserId: string, NoteId: string) {
    const target = (userNote as UserNote[]).find(un => un.UserId === UserId && un.NoteId === NoteId);
    if (!target) return { error: "UserNote not found" };

    target.flaged = !target.flaged;
    const change = target.flaged ? 1 : -1;

    const n = (note as Note[]).find(x => x.id === NoteId);
    if (n) n.flags = Math.max(0, n.flags + change);

    tagRelatorNote.filter(tr => tr.NoteId === NoteId).forEach(tr => tr.flags = Math.max(0, tr.flags + change));

    userNoteOut(userNote);
    noteOut(note);
    tagRelatorNoteOut(tagRelatorNote);
    return { success: true, flagged: target.flaged };
}