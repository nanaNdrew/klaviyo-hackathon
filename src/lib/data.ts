import { User } from "../types/user";

export const MOCK_USERS: User[] = [
  {
    id: "u1",
    name: "Alex",
    age: 22,
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000",
    prompts: [
      { id: "p1", question: "My most controversial opinion is..." }
    ],
    sharedInterest: "Netflix Drama"
  },
  {
    id: "u2",
    name: "Jordan",
    age: 23,
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1000",
    prompts: [
      { id: "p2", question: "The best way to spend a Sunday..." }
    ],
    sharedInterest: "Computer Science"
  },
  {
    id: "u3",
    name: "Sam",
    age: 20,
    imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=1000",
    prompts: [
      { id: "p3", question: "I'm looking for someone who..." }
    ],
    sharedInterest: "Philosophy"
  }
];
