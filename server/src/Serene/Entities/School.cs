using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Serene.Entities;

[Table("school")]
public class School
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("name")]
    public string? Name { get; set; }

    [Column("country_code")]
    [Required]
    [MaxLength(2)]
    public string CountryCode { get; set; } = string.Empty;

    [Column("region_code")]
    [MaxLength(2)]
    public string? RegionCode { get; set; }

    [Column("city")]
    public string? City { get; set; }
}
