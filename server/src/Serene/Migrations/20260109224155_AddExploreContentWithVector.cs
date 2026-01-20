using Microsoft.EntityFrameworkCore.Migrations;
using NodaTime;
using Pgvector;

#nullable disable

namespace Serene.Migrations
{
    /// <inheritdoc />
    public partial class AddExploreContentWithVector : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase().Annotation("Npgsql:PostgresExtension:vector", ",,");

            migrationBuilder.CreateTable(
                name: "explore_content",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    url = table.Column<string>(type: "text", nullable: false),
                    type = table.Column<int>(type: "integer", nullable: false),
                    embedding = table.Column<Vector>(type: "vector", nullable: true),
                    created_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_explore_content", x => x.id);
                }
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "explore_content");

            migrationBuilder.AlterDatabase().OldAnnotation("Npgsql:PostgresExtension:vector", ",,");
        }
    }
}
