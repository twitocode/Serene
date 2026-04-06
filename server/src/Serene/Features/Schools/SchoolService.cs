using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Hybrid;
using Serene.Data;
using Serene.Entities;

namespace Serene.Features.Schools;

public class SchoolService : ISchoolService
{
    private readonly ApplicationDbContext _context;
    private readonly HybridCache _cache;

    public SchoolService(ApplicationDbContext context, HybridCache cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<List<SchoolDto>> GetAllSchoolsAsync()
    {
        var schools = await _context
            .Schools.Include(s => s.SchoolClubs)
            .Include(s => s.SchoolResources)
            .ToListAsync();

        return schools.Select(MapToDto).ToList();
    }

    public async Task<SchoolDto?> GetSchoolByIdAsync(string id)
    {
        var school = await _context
            .Schools.Include(s => s.SchoolClubs)
            .Include(s => s.SchoolResources)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (school == null)
            return null;

        return MapToDto(school);
    }

    public async Task<SchoolDto?> GetSchoolByUserIdAsync(string userId)
    {
        var profile = await _context
            .Profiles.Include(p => p.School)
                .ThenInclude(s => s!.SchoolClubs)
            .Include(p => p.School)
                .ThenInclude(s => s!.SchoolResources)
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile?.School == null)
            return null;

        return MapToDto(profile.School);
    }

    public async Task<SchoolClubDto> AddSchoolClubAsync(
        string schoolId,
        string userId,
        CreateSchoolClubRequest request
    )
    {
        var club = new SchoolClub
        {
            SchoolId = schoolId,
            UserId = userId,
            Name = request.Name,
            Summary = request.Summary,
            Tags = request.Tags,
            Links = request.Links,
        };

        _context.SchoolClubs.Add(club);
        await _context.SaveChangesAsync();

        return new SchoolClubDto
        {
            Id = club.Id,
            Name = club.Name,
            Summary = club.Summary,
            Tags = club.Tags,
            Links = club.Links,
            CreatedAt = club.CreatedAt,
        };
    }

    public async Task<SchoolDto> InstantiateSchoolAsync(InstantiateSchoolRequest request)
    {
        var existing = await _context
            .Schools.Include(s => s.SchoolClubs)
            .Include(s => s.SchoolResources)
            .FirstOrDefaultAsync(s => s.Name == request.Name);
        if (existing != null)
            return MapToDto(existing);

        var school = new School
        {
            Name = request.Name,
            CountryCode = request.CountryCode,
            RegionCode = request.RegionCode,
            City = request.City,
        };

        _context.Schools.Add(school);
        await _context.SaveChangesAsync();

        return MapToDto(school);
    }

    public async Task<SchoolDto> UpdateUserSchoolAsync(
        string userId,
        InstantiateSchoolRequest request
    )
    {
        var schoolDto = await InstantiateSchoolAsync(request);
        var schoolId = schoolDto.Id;

        var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile != null)
        {
            profile.SchoolId = schoolId;
        }
        else
        {
            profile = new Profile
            {
                UserId = userId,
                SchoolId = schoolId,
                MochiName = "Mochi",
                MochiPronouns = "They/Them",
            };
            _context.Profiles.Add(profile);
        }

        await _context.SaveChangesAsync();
        await _cache.RemoveByTagAsync($"profile-{userId}");

        return schoolDto;
    }

    public async Task<SchoolResourceDto> AddSchoolResourceAsync(
        string schoolId,
        CreateSchoolResourceRequest request
    )
    {
        var resource = new SchoolResource
        {
            SchoolId = schoolId,
            Name = request.Name,
            Url = request.Url,
            Type = request.Type,
        };

        _context.SchoolResources.Add(resource);
        await _context.SaveChangesAsync();

        return new SchoolResourceDto
        {
            Id = resource.Id,
            Name = resource.Name,
            Url = resource.Url,
            Type = resource.Type,
            CreatedAt = resource.CreatedAt,
        };
    }

    public async Task DeleteSchoolResourceAsync(string resourceId)
    {
        var resource = await _context.SchoolResources.FindAsync(resourceId);
        if (resource != null)
        {
            _context.SchoolResources.Remove(resource);
            await _context.SaveChangesAsync();
        }
    }

    private SchoolDto MapToDto(School s)
    {
        return new SchoolDto
        {
            Id = s.Id,
            Name = s.Name ?? string.Empty,
            CountryCode = s.CountryCode,
            RegionCode = s.RegionCode,
            City = s.City,
            Clubs = s
                .SchoolClubs.Select(c => new SchoolClubDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Summary = c.Summary,
                    Tags = c.Tags,
                    Links = c.Links,
                    CreatedAt = c.CreatedAt,
                })
                .OrderByDescending(c => c.CreatedAt)
                .ToList(),
            Resources = s
                .SchoolResources.Select(r => new SchoolResourceDto
                {
                    Id = r.Id,
                    Name = r.Name,
                    Url = r.Url,
                    Type = r.Type,
                    CreatedAt = r.CreatedAt,
                })
                .OrderByDescending(r => r.CreatedAt)
                .ToList(),
        };
    }
}
