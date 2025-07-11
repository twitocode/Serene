namespace Serene.API.Features.Mood.Endpoints.PaginatedMoodEntries;

public record PaginatedMoodEntriesRequest(int Page, int PageSize);