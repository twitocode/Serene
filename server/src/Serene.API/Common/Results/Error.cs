using System.Text.Json.Serialization;
using Newtonsoft.Json.Converters;

namespace Serene.API.Common.Results;

public record Error
{
    public Error(string code, string message)
    {
        Code = code.ToAppError();
        Message = message;
    }

    public Error(AppErrors code, string message)
    {
        Code = code;
        Message = message;
    }

    public AppErrors Code { get; }
    public string Message { get; }
}

