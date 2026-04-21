namespace Serene.Common;

public class IdResponse
{
    public string Id { get; set; } = string.Empty;

    public IdResponse() { }

    public IdResponse(string id)
    {
        Id = id;
    }
}
