namespace Serene.Features.Schools;

public class SchoolDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? CountryCode { get; set; }
    public string? RegionCode { get; set; }
    public string? City { get; set; }
    public List<SchoolClubDto> Clubs { get; set; } = new();
    public List<SchoolResourceDto> Resources { get; set; } = new();
}

public class SchoolClubDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string? Tags { get; set; }
    public string? Links { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class SchoolResourceDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateSchoolClubRequest
{
    public string Name { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string? Tags { get; set; }
    public string? Links { get; set; }
}

public class CreateSchoolResourceRequest
{
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
}

public class InstantiateSchoolRequest
{
    public string Name { get; set; } = string.Empty;
    public string CountryCode { get; set; } = string.Empty;
    public string? RegionCode { get; set; }
    public string? City { get; set; }
}
