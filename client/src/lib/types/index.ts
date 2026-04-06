export enum Gender {
	Male,
	Female,
	NonBinary,
	PreferNotToSay,
}

export enum Theme {
	Dark,
	Light,
	System,
}

export interface IdentityUser {
	id: string;
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

export interface User extends IdentityUser {
	name: string | null;
	image: string | null;
	age: number;
	gender: string;
	roles: string[];
	pronouns: string;
	countryCode: string | null;
	onboardingCompleted: boolean;
	onboardingStep: number;
	onboardingStarted: boolean;
	createdAt: string;
	updatedAt: string;
	profile: Profile | null;
	safetyPlan: SafetyPlan | null;
	settings: Settings | null;
	userAchievements: UserAchievement[];
	checkins: Checkin[];
	posts: Post[];
}

export interface Profile {
	id: string;
	mochiName: string;
	mochiPronouns: string;
	currentStreak: number;
	longestStreak: number;
	schoolId: string | null;
	school: School | null;
	userId: string;
	user: User;
	struggles: string[];
	createdAt: string;
	updatedAt: string;
}

export interface Verification {
	id: string;
	identifier: string;
	value: string;
	expiresAt: string;
	createdAt: string;
	updatedAt: string;
}

export interface SafetyPlan {
	id: string;
	professionalResources: string | null;
	safeContacts: string | null;
	copingStrategies: string[];
	userId: string;
	user: User;
	createdAt: string;
	updatedAt: string;
}

export interface Settings {
	id: string;
	passwordLock: string | null;
	theme: string;
	userId: string;
	user: User;
	createdAt: string;
	updatedAt: string;
}

export interface School {
	id: string;
	name: string | null;
	countryCode: string;
	regionCode: string | null;
	city: string | null;
	logo?: string;
	clubs?: SchoolClub[];
	resources?: SchoolResource[];
}

export interface SchoolClub {
	id: string;
	name: string;
	summary: string;
	tags: string | null;
	links: string | null;
	createdAt: string;
}

export interface SchoolResource {
	id: string;
	name: string;
	url: string;
	type: string;
	createdAt: string;
}

export interface Achievement {
	id: string;
	slug: string;
	title: string;
	points: number;
}

export interface UserAchievement {
	userId: string;
	user: User;
	achievementId: string;
	achievement: Achievement;
	unlockedAt: string;
}

export interface Checkin {
	id: string;
	userId: string;
	user: User;
	moodLabel: string;
	moodSeverity: number;
	promptQuestion: string | null;
	promptAnswer: string | null;
	dateCompleted: string;
	somaticState: { [key: string]: GridPoint } | null;
	lingeringThoughts: string | null;
	reframedThought: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface GridPoint {
	x: number;
	y: number;
	sensations: string[];
}

export interface QuestionOfTheDay {
	id: string;
	question: string;
	createdAt: string;
	updatedAt: string;
}

export interface Post {
	id: string;
	answer: string;
	userId: string;
	user: User;
	qotdId: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface ExploreContent {
	id: string;
	title: string;
	description: string;
	url: string;
	type: "Article" | "Video";
}

export enum ActivityCategory {
	Mindfulness = "Mindfulness",
	Movement = "Movement",
	Creative = "Creative",
	Social = "Social",
	SelfCare = "Self-Care",
	Learning = "Learning",
}

export interface Activity {
	id: string;
	title: string;
	description: string;
	category: ActivityCategory;
	duration: string;
	icon: string;
}
