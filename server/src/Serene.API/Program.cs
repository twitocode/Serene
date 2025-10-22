using Serene.API;

var builder = WebApplication.CreateBuilder(args);
builder.AddServices();

var app = builder.Build();

// Configure the HTTP request pipeline.
await app.Configure();

app.Run();