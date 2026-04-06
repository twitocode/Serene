import { apiFetch } from "@/lib/helpers/api-fetch";
import type { School, SchoolClub, SchoolResource } from "@/lib/types";
import type { Result } from "@/lib/types/api-types";

export interface InstantiateSchoolRequest {
	name: string;
	countryCode: string;
	regionCode?: string | null;
	city?: string | null;
}

export interface CreateSchoolClubRequest {
	name: string;
	summary: string;
	tags?: string;
	links?: string;
}

export interface CreateSchoolResourceRequest {
	name: string;
	url: string;
	type: string;
}

export async function getMySchool(): Promise<Result<School>> {
	return await apiFetch<School>("/schools/my-school");
}

export async function updateMySchool(
	data: InstantiateSchoolRequest,
): Promise<Result<School>> {
	return await apiFetch<School>("/schools/my-school", {
		method: "PUT",
		body: JSON.stringify(data),
	});
}

export async function addSchoolClub(
	schoolId: string,
	data: CreateSchoolClubRequest,
): Promise<Result<SchoolClub>> {
	return await apiFetch<SchoolClub>(`/schools/${schoolId}/clubs`, {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function getAllSchools(): Promise<Result<School[]>> {
	return await apiFetch<School[]>("/admin/schools");
}

export async function instantiateSchool(
	data: InstantiateSchoolRequest,
): Promise<Result<School>> {
	return await apiFetch<School>("/admin/schools/instantiate", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function addSchoolResource(
	schoolId: string,
	data: CreateSchoolResourceRequest,
): Promise<Result<SchoolResource>> {
	return await apiFetch<SchoolResource>(
		`/admin/schools/${schoolId}/resources`,
		{
			method: "POST",
			body: JSON.stringify(data),
		},
	);
}

export async function deleteSchoolResource(
	resourceId: string,
): Promise<Result<{ success: boolean }>> {
	return await apiFetch<{ success: boolean }>(
		`/admin/schools/resources/${resourceId}`,
		{
			method: "DELETE",
		},
	);
}
