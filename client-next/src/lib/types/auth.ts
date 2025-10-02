import type { EnergyLevelType, MoodType } from "@/lib/types/database";

type RegisterRequest = {
  email: string;
  password: string;
};


type LoginRequest = {
	email: string;
	password: string;
};

type PaginatedMoodEntriesRequest = {
  page: number;
  pageSize: number;
}

type PaginatedMoodEntriesResponse = {
  overallMood: MoodType;
  energy: EnergyLevelType
  bestPartOfDay?: string;
  worstPartOfDay?: string;
  hasPhysicalOrEmotionalDiscomfort: boolean;
  createdAt: string;
}

type SubmitMoodEntryRequest = {
  overallMood: MoodType;
  energy: EnergyLevelType;
  bestPartOfDay?: string;
  worstPartOfDay?: string;
  hasPhysicalOrEmotionalDiscomfort: boolean;
}

type SubmitMoodEntryResponse = {
  overallMood: MoodType;
  energy: EnergyLevelType;
  bestPartOfDay?: string;
  worstPartOfDay?: string;
  hasPhysicalOrEmotionalDiscomfort: boolean;
}