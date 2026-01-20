using System.ComponentModel.DataAnnotations;

namespace Serene.Features.Community;

public class QOTDPostRequest
{
    public string? QOTDId { get; set; }
    public string? Response { get; set; }
}
