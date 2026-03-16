export type PromptType = 'analogy' | 'keyword' | 'summary' | 'paragraph'|'note';
 // Ensure this is set in your environment variables
export type UserProfile = {
    gender: 'MALE' | 'FEMALE';
    age: number;
    tags: string[]; // These are the Tag names from your DB
};
export type stringifiedContent = {
    content: string;
    depth: number;
}
export type MasterParagraph = {
    content: string;
    lessonId: string;
};

export type Lesson = {
    index: number; // Position within the unit
    title: string;
    paragraphs: MasterParagraph[];
    sublessons: Lesson[]; 
    // Allow nested lessons for flexibility
};

export type Unit = {
    title: string;
    lessons: Lesson[];
};
