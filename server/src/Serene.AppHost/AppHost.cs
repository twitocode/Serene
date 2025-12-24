var builder = DistributedApplication.CreateBuilder(args);


// Add the database
var database = builder.AddPostgres("postgres")
    .WithPgAdmin()
    .WithDataVolume(isReadOnly: false)
    .AddDatabase("serene-db");

var cache = builder.AddRedis("cache")
    .WithDataVolume(isReadOnly: false)
    .WithPersistence(
        interval: TimeSpan.FromMinutes(5),
        keysChangedThreshold: 100);

// Add the API project
var api = builder.AddProject<Projects.Serene_API>("api")
    .WithEnvironment("ASPNETCORE_ENVIRONMENT", "Development")
    .WithEnvironment("Authentication__Google__ClientSecret", builder.Configuration["Authentication:Google:ClientSecret"])
    .WithEnvironment("Authentication__Google__ClientId", builder.Configuration["Authentication:Google:ClientId"])
    .WithEnvironment("JwtOptions__Secret", builder.Configuration["JwtOptions:Secret"])
    .WithEnvironment("JwtOptions__ExpirationTimeInMinutes", builder.Configuration["JwtOptions:ExpirationTimeInMinutes"])

    .WithReference(database)
    .WithReference(cache)
    .WaitFor(database)
    .WaitFor(cache);
builder.Build().Run();