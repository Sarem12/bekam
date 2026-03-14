export type Analogy = {
    content: string;
    logic: string;
    lesson: string; // The ID of the related Lesson
    likes: number;
    dislikes: number;
}

export type Tag = {
id:string; 
name:string;
linkedWith: string[]; // Array of Tag names this tag is linked to

}
export type  TagRelator = {
    liked: boolean; // true for like, false for dislike
    disliked: boolean;
    id: string;
    tagId: string; // The ID of the Tag
    analogyId?: string; // The ID of the related Analogy
   // analogy table for prisma
    paragraphId?: string; // The ID of the related Lesson // The ID of the related Unit
    summaryId?: string; // The ID of the related Summary
    keywordId?: string;
    
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
    userId: string;
    tagId: string;
    likingLevel: number; // negative for dislike, 0 for neutral, positive for like
}