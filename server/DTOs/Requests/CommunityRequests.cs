using System.ComponentModel.DataAnnotations;

namespace Serene.DTOs;

public class QOTDPostRequest
{
    [Required(ErrorMessage = "Provide a QOTD Id")]
    public string? QOTDId { get; set; }

    [Required(ErrorMessage = "Did not prove a response to the question")]
    public string? Response { get; set; }
}