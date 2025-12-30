export type Gender = "Male" | "Female" | "Non-Binary" | "Prefer not to say";

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  age: number;
  gender: Gender; //TODO: change to enum
  pronouns: string;
  createdAt: Date;
  updatedAt: Date;
  preferences: Preference
}

export interface School {
  id: string;
  name: string;
}

export interface Profile {
  id: string;
  koalaName: string;
  koalaColour: string;
  longestStreak: number;
  currentStreak: number;

  schoolId: string | null;
  userId: string | null;

  school?: School;
  user?: User;

  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
  id: string;
  slug: string;
  title: string;
  points: number;
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: Date;
}

export enum ResourceType {
  Article,
  Video,
}

export interface Resource {
  markdownLink: string | null;
  title: string;
  summary: string;
  thumbnail: string | null;
  author: string;
  resourceType: ResourceType;
  users: User[];
  id: string;
  createdAt: Date;
}


export enum Theme {
  Light,
  Dark,
}

export interface Preference {
  theme: Theme;
  pageLock: string | null;
}
