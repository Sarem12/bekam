export type Lesson = {
    id: string;
    title: string;
}

export type Analogy = {
    id:string;
    content: string;
    logic: string;
    lessonId?: string;
    ParagraphId?: string; // The ID of the related Paragraph
    likes: number;
    dislikes: number;
    defaultAnalogyId: string; // The ID of the related Analogy (for personalized versions)
}
export type UserAnalogy = {
    id: string;
    UserId: string; // The ID of the related User
    AnalogyId: string; // The ID of the related Analogy
    status: 'like' | 'dislike' | 'neutral';
    flaged: boolean;
    // User's preference for this analogy
}

export type AnalogyDefault = {
    id:string;
    content: string;
    logic: string;
    lessonId?: string;
    ParagraphId?: string; // The ID of the related Paragraph
    likes: number;
    UserId: string; // The ID of the User who created this default analogy
    order: number; // The order of this analogy among the defaults for the same context
    dislikes: number;
    AnalogyId: string; // The ID of the related Analogy (for personalized versions)
}
export type Tag = {
id:string; 
name:string;
linkedWith: string[]; // Array of Tag names this tag is linked to

}
export type  TagRelator = {
    likes: number; // true for like, false for dislike
    dislikes: number;
    id: string;
    TagId: string; // The ID of the Tag
    AnalogyId?: string; // The ID of the related Analogy
   // analogy table for prisma
    ParagraphId?: string; // The ID of the related Lesson // The ID of the related Unit
    SummaryId?: string; // The ID of the related Summary
    KeyWordId?: string;
    
    // The ID of the related Keyword
    // The ID of the related Paragraph
}
export type User = {
    id: string;
    gender:string;
    age: number;
    name: string;
    
}
export type UserTag = {
    id: string;
    UserId: string;
    TagId: string;
    likingLevel: number; // negative for dislike, 0 for neutral, positive for like
}
export type Paragraph = {
    id: string;
    content: string;
    LessonId: string; // The ID of the related Lesson
    likes: number;
    dislikes: number;
    MasterParagraphId?: string; // The ID of the related MasterParagraph, if this is a personalized version
}
export type MasterParagraph = {
    id: string;
    content: string;
    LessonId: string; 
    RealParagraphId?: string;

    // The ID of the related Lesson
}
export type RealParagraph = {
    id:string;
    content:string;
    LessonId:string;
    MasterParagraphId?:string;
    AnalogyId?:string[];
}