import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/helpers/api-fetch";

export interface TrendsResponse {
	year: number;
	moodBreakdown: MoodBreakdownData;
	moodCalendar: MoodCalendarMonth[];
	topActivities: TopActivityItem[];
	energyLevels: EnergyLevelPoint[];
	somaticData?: SomaticData;
	activityImpact?: ActivityImpactItem[];
	communityStats?: CommunityStats;
}

export interface CommunityStats {
	answersCount: number;
	matchesCount: number;
	supportCount: number;
}

export interface SomaticData {
	partCounts: Record<string, number>;
	topSensations: { sensation: string; count: number }[];
}

export interface ActivityImpactItem {
	activity: string;
	moodImprovement: number;
}

export interface MoodBreakdownData {
	thisYear: MoodCount[];
	previousYear: MoodCount[];
}

export interface MoodCount {
	moodLabel: string;
	count: number;
	averageSeverity: number;
}

export interface MoodCalendarMonth {
	month: number;
	monthName: string;
	days: MoodCalendarDay[];
}

export interface MoodCalendarDay {
	day: number;
	moodLabel: string | null;
	moodSeverity: number | null;
}

export interface TopActivityItem {
	activity: string;
	count: number;
	percentage: number;
}

export interface EnergyLevelPoint {
	month: number;
	monthName: string;
	averageLevel: number;
}

export function useTrends(year: number) {
	return useQuery({
		queryKey: ["trends", year],
		queryFn: async () => {
			const response = await apiFetch<TrendsResponse>(`/trends?year=${year}`);
			return response.data;
		},
	});
}
