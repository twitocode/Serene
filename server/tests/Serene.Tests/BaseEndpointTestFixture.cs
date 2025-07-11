using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Moq;
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
        var userStoreMock = new Mock<IUserStore<User>>();
        UserStore = userStoreMock.Object;
        UserManager = FakeUserManager.GetMockUserManager(UserStore);

        // Setup SignInManager
        SignInManager = FakeSignInManager.GetMockSignInManager(UserManager);

        // Setup HttpContext and related mocks
        var httpContextMock = new Mock<HttpContext>();
        var requestMock = new Mock<HttpRequest>();
        var responseMock = new Mock<HttpResponse>();
        var headersMock = new Mock<IHeaderDictionary>();
        var cookiesMock = new Mock<IRequestCookieCollection>();
        var responseCookiesMock = new Mock<IResponseCookies>();

        // Setup HttpContext properties
        httpContextMock.Setup(x => x.Request).Returns(requestMock.Object);
        httpContextMock.Setup(x => x.Response).Returns(responseMock.Object);
        requestMock.Setup(x => x.Headers).Returns(headersMock.Object);
        requestMock.Setup(x => x.Cookies).Returns(cookiesMock.Object);
        responseMock.Setup(x => x.Cookies).Returns(responseCookiesMock.Object);

        HttpContext = httpContextMock;
        RequestMock = requestMock.Object;
        ResponseMock = responseMock.Object;
        Headers = headersMock.Object;
        Cookies = cookiesMock.Object;
        ResponseCookies = responseCookiesMock.Object;

        // Setup IHttpContextAccessor
        var httpContextAccessorMock = new Mock<IHttpContextAccessor>();
        httpContextAccessorMock.Setup(x => x.HttpContext).Returns(HttpContext.Object);

        // Setup JwtOptions
        var jwtOptions = new JwtOptions
        {
            Secret = "a-super-secret-key-for-testing-that-is-long-enough-for-sha256",
            Audiences = new[] { "test-audience" },
            Issuers = new[] { "test-issuer" },
            ExpirationTimeInMinutes = 15
        };
        var optionsMock = new Mock<IOptions<JwtOptions>>();
        optionsMock.Setup(x => x.Value).Returns(jwtOptions);

        // Create JwtService
        JwtService = new JwtService(optionsMock.Object, httpContextAccessorMock.Object);

        // Setup AppDbContext
        var dbContextOptions = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        var inMemorySettings = new Dictionary<string, string>
        {
            { "TopLevelKey", "TopLevelValue" },
            { "SectionName:SomeKey", "SectionValue" }
        };

        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings!)
            .Build();

        Db = new Mock<AppDbContext>(configuration, dbContextOptions);
    }

    public IRequestCookieCollection Cookies { get; }
    public Mock<AppDbContext> Db { get; }
    public IHeaderDictionary Headers { get; }
    public Mock<HttpContext> HttpContext { get; }
    public IJwtService JwtService { get; }
    public HttpRequest RequestMock { get; }
    public IResponseCookies ResponseCookies { get; }
    public HttpResponse ResponseMock { get; }
    public SignInManager<User> SignInManager { get; }
    public UserManager<User> UserManager { get; }
    public IUserStore<User> UserStore { get; }

    public void Dispose()
    {
        Db.Object.Dispose();
        UserManager.Dispose();
        UserStore.Dispose();
    }
}