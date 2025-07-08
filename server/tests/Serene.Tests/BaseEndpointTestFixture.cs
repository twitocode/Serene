using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using NSubstitute;
using Serene.API.Data;
using Serene.API.Data.Entities;
using Serene.API.Features.Auth.Services;

namespace Serene.Tests;

[CollectionDefinition(nameof(BaseEndpointTestFixture))]
public class BaseEndpointTestFixtureCollection : ICollectionFixture<BaseEndpointTestFixture>
{
    // This class has no code, and is never created. Its purpose is simply
    // to be the place to apply [CollectionDefinition] and all the
    // ICollectionFixture<> interfaces.
}

public class BaseEndpointTestFixture : IDisposable
{
    public BaseEndpointTestFixture()
    {
        // Setup UserStore
        UserStore = Substitute.For<IUserStore<User>>();
        UserManager = FakeUserManager.GetMockUserManager(UserStore);

        // Setup SignInManager
        SignInManager = FakeSignInManager.GetMockSignInManager(UserManager);

        // Setup HttpContext and related mocks
        HttpContext = Substitute.For<HttpContext>();
        RequestMock = Substitute.For<HttpRequest>();
        ResponseMock = Substitute.For<HttpResponse>();
        Headers = Substitute.For<IHeaderDictionary>();
        Cookies = Substitute.For<IRequestCookieCollection>();
        ResponseCookies = Substitute.For<IResponseCookies>();

        // Setup HttpContext properties
        HttpContext.Request.Returns(RequestMock);
        HttpContext.Response.Returns(ResponseMock);
        RequestMock.Headers.Returns(Headers);
        RequestMock.Cookies.Returns(Cookies);
        ResponseMock.Cookies.Returns(ResponseCookies);

        // 1. Create and configure substitute for IHttpContextAccessor
        var httpContextAccessor = Substitute.For<IHttpContextAccessor>();
        httpContextAccessor.HttpContext.Returns(HttpContext);

        // 2. Create and configure substitute for IOptions<JwtOptions>
        var jwtOptions = new JwtOptions
        {
            Secret = "a-super-secret-key-for-testing-that-is-long-enough-for-sha256",
            Audiences = new[] { "test-audience" },
            Issuers = new[] { "test-issuer" },
            ExpirationTimeInMinutes = 15
        };
        var options = Substitute.For<IOptions<JwtOptions>>();
        options.Value.Returns(jwtOptions);

        // 3. Create a partial substitute for the concrete JwtService class, providing all dependencies
        JwtService = Substitute.ForPartsOf<JwtService>(options, httpContextAccessor);


        // Setup AppDbContext
        var dbContextOptions = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;


        var inMemorySettings = new Dictionary<string, string>
        {
            { "TopLevelKey", "TopLevelValue" },
            { "SectionName:SomeKey", "SectionValue" }
            //...populate as needed for the test
        };

        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings!)
            .Build();

        Db = new AppDbContext(configuration, dbContextOptions);
    }

    public IRequestCookieCollection Cookies { get; }
    public AppDbContext Db { get; }
    public IHeaderDictionary Headers { get; }
    public HttpContext HttpContext { get; }
    public IJwtService JwtService { get; }
    public HttpRequest RequestMock { get; }
    public IResponseCookies ResponseCookies { get; }
    public HttpResponse ResponseMock { get; }
    public SignInManager<User> SignInManager { get; }
    public UserManager<User> UserManager { get; }
    public IUserStore<User> UserStore { get; }

    public void Dispose()
    {
        Db.Dispose();
        UserManager.Dispose();
        UserStore.Dispose();
    }
}