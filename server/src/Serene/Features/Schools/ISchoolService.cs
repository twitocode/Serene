namespace Serene.Features.Schools;

public interface ISchoolService
{
    Task<List<SchoolDto>> GetAllSchoolsAsync();
    Task<SchoolDto?> GetSchoolByIdAsync(string id);
    Task<SchoolDto?> GetSchoolByUserIdAsync(string userId);
    Task<SchoolClubDto> AddSchoolClubAsync(string schoolId, string userId, CreateSchoolClubRequest request);
    Task<SchoolDto> UpdateUserSchoolAsync(string userId, InstantiateSchoolRequest request);

    Task<SchoolDto> InstantiateSchoolAsync(InstantiateSchoolRequest request);
    Task<SchoolResourceDto> AddSchoolResourceAsync(string schoolId, CreateSchoolResourceRequest request);
    Task DeleteSchoolResourceAsync(string resourceId);
}
