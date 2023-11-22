/** IQuestion - Interface representing the structure of a question */
export interface IQuestion {
    id: string;
    questionText: string;
    questionType: 'single' | 'multiple' | 'open';
    options: string[];
    answer?:  string | string[] | null;
    answered: boolean; 
    createdAt: Date;
}