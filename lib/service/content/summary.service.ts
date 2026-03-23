// import { GetBestSummery, ChangeToBestSummery } from "@/lib/analyzer";
// import { generateContent } from "@/lib/gemini";
// import {
//     Summery, DefaultSummery, UserSummery, Tag, TagRelatorSummery, User, Lesson
// } from "@/lib/types";

// import {
//     summery as summeryData, summeryOut,
//     defaultSummery, defaultSummeryOut,
//     userSummery, userSummeryOut,
//     tag, tagRelatorSummery, tagRelatorSummeryOut,
//     user, lesson
// } from "@/datarelated/data";

// import { stringifyLesson } from "@/lib/stringifiers";

// /**
//  * GET SUMMARY
//  */
// export async function GetSummery(UserId: string, lessonId: string) {
//     const best = await GetBestSummery(lessonId, 'lesson', UserId);

//     if (best !== null) {
//         const s = summeryData.find(x => x.id === best.id);
//         if (s) {
//             s.views += 1;

//             const ds = defaultSummery.find(d => d.SummeryId === s.id);
//             if (ds) ds.views += 1;

//             summeryOut(summeryData);
//             defaultSummeryOut(defaultSummery);
//         }

//         return { content: best.content, id: best.id };
//     }

//     const CurrentUser = user.find(u => u.id === UserId) as User;
//     const CurrentLesson = lesson.find(l => l.id === lessonId) as Lesson;

//     if (!CurrentUser || !CurrentLesson) return { error: "User or Lesson not found" };

//     const response = await generateContent({
//         requestType: 'summary',
//         user: CurrentUser,
//         target: stringifyLesson(CurrentLesson)
//     });

//     if (response.error) return response;

//     const timestamp = Date.now();
//     const summeryId = `sum-${timestamp}`;
//     const defaultId = `defsum-${timestamp}`;

//     const tagsMapped: TagRelatorSummery[] = (response.tagsUsed || [])
//         .map((t: string) => {
//             const found = tag.find(x => x.name.toLowerCase() === t.toLowerCase());
//             if (!found) return null;
//             return {
//                 id: `tagrel-s-${timestamp}-${Math.random()}`,
//                 TagId: found.id,
//                 SummeryId: summeryId,
//                 likes: 0, dislikes: 0, views: 0, usage: 0, flags: 0
//             };
//         }).filter(Boolean) as TagRelatorSummery[];

//     const newSummery: Summery = {
//         id: summeryId,
//         content: response.content,
//         LessonId: lessonId,
//         likes: 0, dislikes: 0,
//         views: 1, usage: 1, flags: 0,
//         DefaultSummeryId: defaultId,
//         createdAt: new Date().toISOString()
//     };

//     const def: DefaultSummery = {
//         id: defaultId,
//         content: response.content,
//         LessonId: lessonId,
//         UnitId: CurrentLesson.unitId,
//         likes: 0, dislikes: 0,
//         SummeryId: summeryId,
//         UserId,
//         order: 0,
//         views: 1, usage: 1, flags: 0,
//         createdAt: new Date().toISOString()
//     };

//     const us: UserSummery = {
//         id: `usersum-${timestamp}`,
//         UserId,
//         SummeryId: summeryId,
//         status: 'neutral',
//         flaged: false,
//         onuse: true,
//         skiped: false,
//         lastSeenAt: new Date().toISOString()
//     };

//     summeryData.push(newSummery);
//     defaultSummery.push(def);
//     userSummery.push(us);
//     tagRelatorSummery.push(...tagsMapped);

//     summeryOut(summeryData);
//     defaultSummeryOut(defaultSummery);
//     userSummeryOut(userSummery);
//     tagRelatorSummeryOut(tagRelatorSummery);

//     return { ...response, id: summeryId };
// }

// /**
//  * CHANGE SUMMARY
//  */
// export async function ChangeSummery(DefaultSummeryId: string, userId: string) {
//     const def = defaultSummery.find(d => d.id === DefaultSummeryId);
//     if (!def) return { error: "DefaultSummery not found" };

//     const current = userSummery.find(u => u.UserId === userId && u.SummeryId === def.SummeryId);

//     if (current) {
//         current.skiped = true;
//         current.onuse = false;
//         userSummeryOut(userSummery);
//     }

//     const best = await ChangeToBestSummery(DefaultSummeryId, userId);

//     if (best !== null && best.id !== def.SummeryId) {
//         def.SummeryId = best.id;
//         def.content = best.content;
//         def.likes = best.likes;
//         def.dislikes = best.dislikes;
//         def.views = best.views + 1;
//         def.usage = best.usage;
//         def.flags = best.flags;

//         defaultSummeryOut(defaultSummery);
//         return best;
//     }

//     const CurrentUser = user.find(u => u.id === userId) as User;
//     const CurrentLesson = lesson.find(l => l.id === def.LessonId) as Lesson;

//     const response = await generateContent({
//         requestType: 'summary',
//         user: CurrentUser,
//         target: stringifyLesson(CurrentLesson)
//     });

//     const timestamp = Date.now();
//     const newId = `sum-${timestamp}`;

//     const newSummery: Summery = {
//         id: newId,
//         content: response.content,
//         LessonId: def.LessonId,
//         likes: 0, dislikes: 0,
//         views: 1, usage: 1, flags: 0,
//         DefaultSummeryId: DefaultSummeryId,
//         createdAt: new Date().toISOString()
//     };

//     const us: UserSummery = {
//         id: `usersum-${timestamp}`,
//         UserId: userId,
//         SummeryId: newId,
//         status: 'neutral',
//         flaged: false,
//         onuse: true,
//         skiped: false,
//         lastSeenAt: new Date().toISOString()
//     };

//     def.SummeryId = newId;
//     def.content = response.content;
//     def.likes = 0;
//     def.dislikes = 0;
//     def.views = 1;
//     def.usage = 1;
//     def.flags = 0;

//     summeryData.push(newSummery);
//     userSummery.push(us);

//     summeryOut(summeryData);
//     defaultSummeryOut(defaultSummery);
//     userSummeryOut(userSummery);

//     return response;
// }

// /**
//  * LIKE
//  */
// export async function LikeEventSummery(UserId: string, SummeryId: string) {
//     const target = userSummery.find(u => u.UserId === UserId && u.SummeryId === SummeryId);
//     if (!target) return { error: "UserSummery not found" };

//     const wasDisliked = target.status === 'disliked';
//     const isLiked = target.status === 'liked';

//     target.status = isLiked ? 'neutral' : 'liked';
//     const change = isLiked ? -1 : 1;

//     const s = summeryData.find(x => x.id === SummeryId);
//     if (s) {
//         s.likes += change;
//         if (!isLiked && wasDisliked) s.dislikes = Math.max(0, s.dislikes - 1);
//     }

//     const ds = defaultSummery.find(d => d.SummeryId === SummeryId);
//     if (ds) {
//         ds.likes += change;
//         if (!isLiked && wasDisliked) ds.dislikes = Math.max(0, ds.dislikes - 1);
//     }

//     const tags = tagRelatorSummery.filter(t => t.SummeryId === SummeryId);
//     tags.forEach(t => {
//         t.likes += change;
//         if (!isLiked && wasDisliked) t.dislikes = Math.max(0, t.dislikes - 1);
//     });

//     summeryOut(summeryData);
//     defaultSummeryOut(defaultSummery);
//     userSummeryOut(userSummery);
//     tagRelatorSummeryOut(tagRelatorSummery);

//     return { success: true, newStatus: target.status };
// }

// /**
//  * DISLIKE
//  */
// export async function DislikeEventSummery(UserId: string, SummeryId: string) {
//     const target = userSummery.find(u => u.UserId === UserId && u.SummeryId === SummeryId);
//     if (!target) return { error: "UserSummery not found" };

//     const wasLiked = target.status === 'liked';
//     const isDisliked = target.status === 'disliked';

//     target.status = isDisliked ? 'neutral' : 'disliked';
//     const change = isDisliked ? -1 : 1;

//     const s = summeryData.find(x => x.id === SummeryId);
//     if (s) {
//         s.dislikes += change;
//         if (!isDisliked && wasLiked) s.likes = Math.max(0, s.likes - 1);
//     }

//     const ds = defaultSummery.find(d => d.SummeryId === SummeryId);
//     if (ds) {
//         ds.dislikes += change;
//         if (!isDisliked && wasLiked) ds.likes = Math.max(0, ds.likes - 1);
//     }

//     const tags = tagRelatorSummery.filter(t => t.SummeryId === SummeryId);
//     tags.forEach(t => {
//         t.dislikes += change;
//         if (!isDisliked && wasLiked) t.likes = Math.max(0, t.likes - 1);
//     });

//     summeryOut(summeryData);
//     defaultSummeryOut(defaultSummery);
//     userSummeryOut(userSummery);
//     tagRelatorSummeryOut(tagRelatorSummery);

//     return { success: true, newStatus: target.status };
// }

// /**
//  * FLAG
//  */
// export async function FlagEventSummery(UserId: string, SummeryId: string) {
//     const target = userSummery.find(u => u.UserId === UserId && u.SummeryId === SummeryId);
//     if (!target) return { error: "UserSummery not found" };

//     target.flaged = !target.flaged;
//     const change = target.flaged ? 1 : -1;

//     const s = summeryData.find(x => x.id === SummeryId);
//     if (s) s.flags = Math.max(0, s.flags + change);

//     const ds = defaultSummery.find(d => d.SummeryId === SummeryId);
//     if (ds) ds.flags = Math.max(0, ds.flags + change);

//     const tags = tagRelatorSummery.filter(t => t.SummeryId === SummeryId);
//     tags.forEach(t => t.flags = Math.max(0, t.flags + change));

//     summeryOut(summeryData);
//     defaultSummeryOut(defaultSummery);
//     userSummeryOut(userSummery);
//     tagRelatorSummeryOut(tagRelatorSummery);

//     return { success: true, flagged: target.flaged };
// }