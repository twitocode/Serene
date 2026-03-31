import { apiFetch } from "@/lib/helpers/api-fetch";
import type { ExploreContent } from "@/lib/types";
import type { Result } from "@/lib/types/api-types";

export interface CreateExploreContentRequest {
	title: string;
	description: string;
	url: string;
	type: "Article" | "Video";
	tags: string;
}

export async function getAllContent(): Promise<Result<ExploreContent[]>> {
	return await apiFetch<ExploreContent[]>("/explore/all");
}

export async function addContent(
	data: CreateExploreContentRequest,
): Promise<Result<{ id: string }>> {
	return await apiFetch<{ id: string }>("/explore", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function updateContent(
	id: string,
	data: CreateExploreContentRequest,
): Promise<Result<{ success: boolean }>> {
	return await apiFetch<{ success: boolean }>(`/explore/${id}`, {
		method: "PUT",
		body: JSON.stringify(data),
	});
}

export async function deleteContent(
	id: string,
): Promise<Result<{ success: boolean }>> {
	return await apiFetch<{ success: boolean }>(`/explore/${id}`, {
		method: "DELETE",
	});
}

export interface ScrapedContentResponse {
	title: string;
	description: string;
	type: "Article" | "Video";
}

export async function scrapeContent(
	url: string,
): Promise<Result<ScrapedContentResponse>> {
	return await apiFetch<ScrapedContentResponse>("/explore/scrape", {
		method: "POST",
		body: JSON.stringify({ url }),
	});
}

export async function populateContent(
	query: string,
	count: number,
): Promise<Result<number>> {
	return await apiFetch<number>("/explore/populate", {
		method: "POST",
		body: JSON.stringify({ query, count }),
	});
}

export interface FeedbackDto {
	date: string;
	userId: string;
	message: string;
}

export interface FeedbackListResponse {
	feedback: FeedbackDto[];
}

export async function getFeedback(): Promise<Result<FeedbackListResponse>> {
	return await apiFetch<FeedbackListResponse>("/feedback");
}
