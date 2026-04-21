using Microsoft.EntityFrameworkCore;
using Serene.Data;
using Serene.Entities;

namespace Serene.Tests;

public class TestApplicationDbContext : ApplicationDbContext
{
    public TestApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Ignore Postgres-specific features and unsupported types for InMemory database
        modelBuilder.Entity<ExploreContent>().Ignore(e => e.Embedding);
        modelBuilder.Entity<Checkin>().Ignore(c => c.SomaticState);
        modelBuilder.Entity<Profile>().Ignore(p => p.Struggles);
    }
}
