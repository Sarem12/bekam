
export type Book ={
    id: string;
    subject: string;
    grade: number;
    imgUrl: string;

}


export type Lesson = {
    id: string;
    title: string;
    unitId: string; // The ID of the related Unit
    ParentLessonId?: string; // The ID of the related Parent Lesson, if this is a sub-lesson
}

export type Unit = {
    id: string;
    title: string;
    BookId: string; // The ID of the related Lesson
}
export type Tag = {
id:string; 
name:string;
linkedWith: string[]; // Array of Tag names this tag is linked to

}
export type UniversalTag = {
    id:string;
   TagId: string; // The ID of the related Tag
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

export type DefaultAnalogy = {
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
export type  TagRelatorAnalogy = {
    likes: number; // true for like, false for dislike
    dislikes: number;
    id: string;
    TagId: string; // The ID of the Tag
    AnalogyId: string; // The ID of the related Analogy
   // analogy table for prisma

    // The ID of the related Keyword
    // The ID of the related Paragraph
}

export type Paragraph = {
    id: string;
    content: string;
    LessonId: string; // The ID of the related Lesson
    likes: number;
    dislikes: number;
    order: number; // The order of this paragraph within the lesson
    MasterParagraphId?: string; // The ID of the related MasterParagraph, if this is a personalized version
}
export type UserParagraph = {
    id: string;
    UserId: string; // The ID of the related User
    ParagraphId: string; // The ID of the related Paragraph
    status: 'like' | 'dislike' | 'neutral';
    flaged: boolean;
    order: number; // The order of this paragraph among the personalized versions for the same context
    // User's preference for this paragraph
}
export type DefaultParagraph = {
    id: string;
    content: string;
    LessonId: string;
    order: number; // The order of this paragraph within the lesson
    RealParagraphId?: string;

    // The ID of the related Lesson
}
export type RealParagraph = {
    id:string;
    content:string;
    LessonId:string;
    MasterParagraphId?:string;
    order: number; // The order of this paragraph within the lesson
    AnalogyId?:string[];

}
export type TagRelatorParagraph = {
    likes: number; // true for like, false for dislike
    dislikes: number;
    id: string;
    TagId: string; // The ID of the Tag
    ParagraphId: string; // The ID of the related Paragraph
}


export type Summery = {
    id: string;
    content: string;
    LessonId: string;
    UnitId: string; // The ID of the related Unit
    likes: number;
    dislikes: number;
    DefaultSummeryId?: string; // The ID of the related MasterSummery, if this is a personalized version
}


export type DefaultSummery = {
    id: string;
    content: string;
    LessonId: string;
    UnitId: string; // The ID of the related Unit
    likes: number;
    dislikes: number;
    UserId: string; // The ID of the User who created this default summery
    order: number; // The order of this summery among the defaults for the same context
    SummeryId: string; // The ID of the related Summery (for personalized versions)
}

export type UserSummery = {
    id: string;
    UserId: string; // The ID of the related User
    SummeryId: string; // The ID of the related Summery
    status: 'like' | 'dislike' | 'neutral';
    flaged: boolean;
    // User's preference for this summery
}
export type TagRelatorSummery = {
    likes: number; // true for like, false for dislike
    dislikes: number;
    id: string;
    TagId: string; // The ID of the Tag
    SummeryId: string; // The ID of the related Summery
   // analogy table for prisma
}
export type KeyWord = {
    id: string;
    word: string;
    definition: string;
     // Group for Simple vs. Technical versions
}

// The "Assignment" - Connects the Dictionary to the Lesson
export type KeyWords = {
    id: string;
    lessonId?: string;      
    ParagraphId?: string;        // Foreign Key to the KeyWord table
    isCoreConcept: boolean; 
    DefinitionId?: string; // Is this essential for the whole lesson?
}
export type UserKeyWords = {
    id: string;
    UserId: string; // The ID of the related User
    KeyWordsId: string; // The ID of the related KeyWord
    status: 'like' | 'dislike' | 'neutral';
    flaged: boolean;
    // User's preference for this keyword
}
export type KeyWordDefault = {
    id: string;
    lessonId?: string;
    ParagraphId?: string;        // Foreign Key to the KeyWord table
    isCoreConcept: boolean;  // Is this essential for the whole lesson?
    UserId: string; // The ID of the User who created this default keyword assignment
    order: number; // The order of this keyword among the defaults for the same context
     // The ID of the related KeyWords (for personalized versions)
}
export type TagRelatorKeyWords = {
    likes: number; // true for like, false for dislike
    dislikes: number;
    id: string;
    TagId: string; // The ID of the Tag
    KeyWordsId: string; // The ID of the related KeyWord
   // analogy table for prisma
}