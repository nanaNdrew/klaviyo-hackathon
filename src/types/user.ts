export interface PersonalityPrompt {
  id: string;
  question: string;
}

export interface User {
  id: string;
  name: string;
  age: number;
  imageUrl: string;
  prompts: PersonalityPrompt[];
  sharedInterest?: string;
}
