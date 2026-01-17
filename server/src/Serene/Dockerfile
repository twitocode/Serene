# server/Dockerfile

# Use the SDK image to build the app
FROM mcr.microsoft.com/dotnet/nightly/sdk:10.0-preview AS build
# Note: Since .NET 10 isn't officially public on Docker Hub yet, 
# you might need 'nightly' tags or revert to 8.0/9.0 if 10 was a typo.
# If you actually have a .NET 10 preview image, replace the tag above.

WORKDIR /src

# Copy csproj and restore dependencies
COPY ["Serene.csproj", "./"]
RUN dotnet restore "Serene.csproj"

# Copy the rest of the source code
COPY . .

# Build and Publish
RUN dotnet publish "Serene.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage/image
FROM mcr.microsoft.com/dotnet/nightly/sdk:10.0-preview AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Serene.dll"]