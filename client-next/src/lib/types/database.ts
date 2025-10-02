interface IdentityUser<TKey> {
	id: TKey;
	userName: string | null;
	normalizedUserName: string | null;
	email: string | null;
	normalizedEmail: string | null;
	emailConfirmed: boolean;
	passwordHash: string | null;
	securityStamp: string | null;
	concurrencyStamp: string | null;
	phoneNumber: string | null;
	phoneNumberConfirmed: boolean;
	twoFactorEnabled: boolean;
	lockoutEnd: string | null;
	lockoutEnabled: boolean;
	accessFailedCount: number;
}

export enum Gender {
	Male,
	Female,
	NonBinary,
	Transgender,
	None
}

export interface User extends IdentityUser<string> {
	firstName: string;
	lastName: string;
	fullName: string;
	isSetupCompleted: boolean;
	country: string;
	avatarUrl: string;
	pronouns: string;
	gender: Gender;
	dateOfBirth: Date;
	lastMoodCheckin: Date;
	refreshToken: string | null;
	refreshTokenExpirationDate: Date | null;
	userPreferences: Preference;
	moods: MoodEntry[];
	journals: Journal[];
	savedResources: Resource[];
	createdAt: Date;
}

export enum Theme {
	Light,
	Dark
}

export interface Preference {
	theme: Theme;
	pageLock: string | null;
	user: User;
	createdAt: Date;
	userId: string;
}

export enum MoodType {
	Anxious,
	Sad,
	Neutral,
	Happy,
	Fantastic
}

export enum EnergyLevelType {
	Exhausted,
	Low,
	Moderate,
	High,
	Refreshed
}

export interface MoodEntry {
	overallMood: MoodType;
	energyLevel: EnergyLevelType;
	bestPartOfDay: string | null;
	worstPartOfDay: string | null;
	hadPhysicalOrEmotionalDiscomfort: boolean;
	user: User;
	id: string;
	createdAt: Date;
	userId: string;
}

export enum ActivityType {}

export interface Journal {
	title: string;
	whatsOnYourMind: string | null;
	whatAreYouGratefulForToday: string | null;
	activities: ActivityType[];
	isDraft: boolean;
	user: User;
	id: string;
	createdAt: Date;
	userId: string;
}

export enum ResourceType {
	Article,
	Video
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
