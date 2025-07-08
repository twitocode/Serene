using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using NSubstitute;
using Serene.API.Data;
using Serene.API.Data.Entities;
using Serene.API.Features.Auth.Endpoints.RefreshToken;
using Serene.API.Features.Auth.Services;
using Shouldly;

namespace Serene.Tests.Features.Auth;

public class GetRefreshTokenTests
{
    private readonly UserManager<User> userManager;
    private readonly HttpContext httpContext;
    private readonly HttpRequest requestMock;
    private readonly IHeaderDictionary headers;
    private readonly IJwtService jwtService;
    private readonly RefreshTokenEndpoint endpoint;
    private readonly AppDbContext db;

    public GetRefreshTokenTests()
    {
        endpoint = new RefreshTokenEndpoint();
        
        userManager = Substitute.For<UserManager<User>>();
        httpContext = Substitute.For<HttpContext>();
        requestMock = Substitute.For<HttpRequest>();
        headers = Substitute.For<IHeaderDictionary>();
        jwtService = Substitute.For<IJwtService>();
        db = Substitute.For<AppDbContext>();
    }
    
    [Fact]
    public async Task Endpoint_Should_InternalServerError_WhenUserIsNull()
    {
        //Arrange
        var refreshToken = "1234";
        var cancellationToken = CancellationToken.None;
        
        requestMock.Headers.Returns(headers);
        requestMock.Cookies["REFRESH_TOKEN"].Returns(refreshToken);
        httpContext.Request.Returns(requestMock);

        //Act
        var result = await endpoint.Handle(jwtService, db, userManager, httpContext, cancellationToken);
        
        //Assert
        result.Value.ShouldBe("Successfully registered user and assigned token");
    }
}
