using System.ComponentModel.DataAnnotations;

namespace Serene.DTOs;

public class QOTDPostRequest
{
    public string? QOTDId { get; set; }
    public string? Response { get; set; }
}