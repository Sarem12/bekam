import { GetBestNote, ChangeToBestNote } from "@/lib/analyzer";
import { generateContent } from "@/lib/gemini";
import { 
    Note, UserNote, Lesson, User, Tag, TagRelatorNote, NoteDefault as DefaultNote 
} from "@/lib/types";
import { 
    user, lesson, note as noted, noteOut, 
    userNote, userNoteOut, tag, tagRelatorNote, tagRelatorNoteOut, 
    noteDefault, noteDefaultOut 
} from "@/datarelated/data";
import { stringifyLesson } from "@/lib/stringifiers";

/**
 * GET NOTE
 * Retrieves the best existing note or generates a new one via Gemini.
 */
export async function GetNote(UserId: string, lessonId: string) {
    const noteRecord = await GetBestNote(UserId, lessonId);
    
    if (noteRecord !== null) {
        const n = (noted as Note[]).find(x => x.id === noteRecord.id);
        if (n) {
            n.views += 1;
            const dn = (noteDefault as DefaultNote[]).find(d => d.NoteId === n.id);
            if (dn) dn.views += 1;
            
            noteOut(noted);
            noteDefaultOut(noteDefault);
        }
        return { content: noteRecord.content, id: noteRecord.id };
    }

    const CurrentUser = user.find(u => u.id === UserId) as User;
    const CurrentLesson = (lesson as Lesson[]).find(l => l.id === lessonId);
    if (!CurrentLesson || !CurrentUser) return { error: "User or Lesson not found" };

    const response = await generateContent({
        requestType: 'note',
        user: CurrentUser,
        target: stringifyLesson(CurrentLesson)
    });

    if (response.error) throw new Error(response.error);

    const timestamp = Date.now();
    const noteId = `note-${timestamp}`;
    const defaultNoteId = `defnote-${timestamp}`;

    // Map AI tags to system tags
    const noteTags: TagRelatorNote[] = (response.tagsUsed || [])
        .map((ta: string) => {
            const specificTag = (tag as Tag[]).find(t => t.name.toLowerCase() === ta.toLowerCase());
            if (!specificTag) return null;
            return {
                id: `tagrel-n-${timestamp}-${Math.random()}`,
                TagId: specificTag.id,
                NoteId: noteId,
                likes: 0, dislikes: 0, views: 0, usage: 0, flags: 0,
            };
        })
        .filter(Boolean) as TagRelatorNote[];

    const newNote: Note = {
        id: noteId,
        content: response.content,
        LessonId: lessonId,
        UserId: UserId,
        likes: 0, dislikes: 0, views: 1, usage: 1, flags: 0,
        defaultNoteId: defaultNoteId,
        createdAt: new Date().toISOString(),
    } as Note;

    const defaultNote: DefaultNote = {
        id: defaultNoteId,
        content: response.content,
        LessonId: lessonId,
        likes: 0, dislikes: 0, views: 1, usage: 1, flags: 0,
        NoteId: noteId,
        UserId: UserId,
        createdAt: new Date().toISOString(),
        
    } as DefaultNote;

    const usernote: UserNote = {
        id: `usernote-${timestamp}`,
        UserId,
        NoteId: noteId,
        flaged: false,
        onuse: true,
        status: 'neutral',
        lastSeenAt: new Date().toISOString(),
        skiped: false
    };

    noted.push(newNote);
    noteDefault.push(defaultNote);
    userNote.push(usernote);
    tagRelatorNote.push(...noteTags);

    noteOut(noted);
    noteDefaultOut(noteDefault);
    userNoteOut(userNote);
    tagRelatorNoteOut(tagRelatorNote);

    return { ...response, id: noteId };
}

/**
 * CHANGE NOTE
 * Marks current note as skipped and finds/generates an alternative.
 */
export async function ChangeNote(DefaultNoteId: string, userId: string) {
    const defNoteRecord = (noteDefault as DefaultNote[]).find(dn => dn.id === DefaultNoteId);
    if (!defNoteRecord) return { error: "Default Note record not found" };

    // 1. mark current as skipped
    const currentUA = (userNote as UserNote[]).find(ua => 
        ua.UserId === userId && ua.NoteId === defNoteRecord.NoteId
    );
    
    if (currentUA) {
        currentUA.skiped = true;
        currentUA.onuse = false;
        userNoteOut(userNote);
    }

    // 2. try DB alternative
    const note = await ChangeToBestNote(DefaultNoteId, userId);
  
    if (note !== null && note.id !== defNoteRecord.NoteId) {
        defNoteRecord.NoteId = note.id;
        defNoteRecord.content = note.content;
        defNoteRecord.likes = note.likes;
        defNoteRecord.dislikes = note.dislikes;
        defNoteRecord.views = note.views + 1;
        defNoteRecord.usage = note.usage;
        defNoteRecord.flags = note.flags;

        noteDefaultOut(noteDefault);
        return note;
    }

    // 3. 🔥 generate NEW directly (NO GetNote reuse)
    const CurrentUser = user.find(u => u.id === userId) as User;
    const CurrentLesson = (lesson as Lesson[]).find(l => l.id === defNoteRecord.LessonId);

    if (!CurrentUser || !CurrentLesson) return { error: "User or Lesson not found" };

    const response = await generateContent({
        requestType: 'note',
        user: CurrentUser,
        target: stringifyLesson(CurrentLesson)
    });

    if (response.error) return response;

    const timestamp = Date.now();
    const noteId = `note-${timestamp}`;

    const newNote: Note = {
        id: noteId,
        content: response.content,
        LessonId: defNoteRecord.LessonId,
        UserId: userId,
        likes: 0, dislikes: 0, views: 1, usage: 1, flags: 0,
        defaultNoteId: DefaultNoteId,
        createdAt: new Date().toISOString(),
    } as Note;

    const usernote: UserNote = {
        id: `usernote-${timestamp}`,
        UserId: userId,
        NoteId: noteId,
        flaged: false,
        onuse: true,
        status: 'neutral',
        lastSeenAt: new Date().toISOString(),
        skiped: false
    };

    defNoteRecord.NoteId = noteId;
    defNoteRecord.content = response.content;
    defNoteRecord.likes = 0;
    defNoteRecord.dislikes = 0;
    defNoteRecord.views = 1;
    defNoteRecord.usage = 1;
    defNoteRecord.flags = 0;

    noted.push(newNote);
    userNote.push(usernote);

    noteOut(noted);
    noteDefaultOut(noteDefault);
    userNoteOut(userNote);

    return response;
}
/**
 * LIKE EVENT
 */
export async function LikeEventNote(UserId: string, NoteId: string) {
    const target = (userNote as UserNote[]).find(un => un.UserId === UserId && un.NoteId === NoteId);
    if (!target) return { error: "UserNote not found" };

    const wasdisliked = target.status === 'disliked';
    const isLiked = target.status === 'liked';
    
    target.status = isLiked ? 'neutral' : 'liked';
    const change = isLiked ? -1 : 1;

    const n = (noted as Note[]).find(s => s.id === NoteId);
    if (n) { 
        n.likes += change; 
        if (!isLiked && wasdisliked) n.dislikes = Math.max(0, n.dislikes - 1);
    }

    const dn = (noteDefault as DefaultNote[]).find(d => d.NoteId === NoteId);
    if (dn) {
        dn.likes += change;
        if (!isLiked && wasdisliked) dn.dislikes = Math.max(0, dn.dislikes - 1);
    }

    const tags = (tagRelatorNote as TagRelatorNote[]).filter(t => t.NoteId === NoteId);
    tags.forEach(t => {
        t.likes += change;
        if (!isLiked && wasdisliked) t.dislikes = Math.max(0, t.dislikes - 1);
    });

    noteOut(noted);
    noteDefaultOut(noteDefault);
    userNoteOut(userNote);
    tagRelatorNoteOut(tagRelatorNote);

    return { success: true, newStatus: target.status };
}

/**
 * DISLIKE EVENT
 */
export async function DislikeEventNote(UserId: string, NoteId: string) {
    const target = (userNote as UserNote[]).find(un => un.UserId === UserId && un.NoteId === NoteId);
    if (!target) return { error: "UserNote not found" };

    const wasliked = target.status === 'liked';
    const isDisliked = target.status === 'disliked';
    
    target.status = isDisliked ? 'neutral' : 'disliked';
    const change = isDisliked ? -1 : 1;

    const n = (noted as Note[]).find(s => s.id === NoteId);
    if (n) { 
        n.dislikes += change; 
        if (!isDisliked && wasliked) n.likes = Math.max(0, n.likes - 1);
    }

    const dn = (noteDefault as DefaultNote[]).find(d => d.NoteId === NoteId);
    if (dn) {
        dn.dislikes += change;
        if (!isDisliked && wasliked) dn.likes = Math.max(0, dn.likes - 1);
    }

    const tags = (tagRelatorNote as TagRelatorNote[]).filter(t => t.NoteId === NoteId);
    tags.forEach(t => {
        t.dislikes += change;
        if (!isDisliked && wasliked) t.likes = Math.max(0, t.likes - 1);
    });

    userNoteOut(userNote);
    noteOut(noted);
    noteDefaultOut(noteDefault);
    tagRelatorNoteOut(tagRelatorNote);

    return { success: true, newStatus: target.status };
}

/**
 * FLAG EVENT
 */
export async function FlagEventNote(UserId: string, NoteId: string) {
    const target = (userNote as UserNote[]).find(un => un.UserId === UserId && un.NoteId === NoteId);
    if (!target) return { error: "UserNote not found" };

    target.flaged = !target.flaged;
    const change = target.flaged ? 1 : -1;

    const n = (noted as Note[]).find(s => s.id === NoteId);
    if (n) n.flags = Math.max(0, n.flags + change);

    const dn = (noteDefault as DefaultNote[]).find(d => d.NoteId === NoteId);
    if (dn) dn.flags = Math.max(0, dn.flags + change);

    const tags = (tagRelatorNote as TagRelatorNote[]).filter(t => t.NoteId === NoteId);
    tags.forEach(t => t.flags = Math.max(0, t.flags + change));

    userNoteOut(userNote);
    noteOut(noted);
    noteDefaultOut(noteDefault);
    tagRelatorNoteOut(tagRelatorNote);

    return { success: true, flagged: target.flaged };
}