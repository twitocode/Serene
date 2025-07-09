using Serene.API.Data.Entities;

namespace Serene.API.Features;

public static class HttpContextExtensions
{
    /// <summary>
    ///     Assumes the user exists
    /// </summary>
    /// <param name="ctx"></param>
    /// <returns></returns>
    public static User GetUser(this HttpContext ctx) => ctx.Items["User"] as User ??
                                                        throw new InvalidOperationException(
                                                            "User does not exists in the request's context");

    public static bool TryGetUser(this HttpContext ctx, out User user)
    {
        user = ctx.Items["User"] as User;
        return user is not null;
    }
}