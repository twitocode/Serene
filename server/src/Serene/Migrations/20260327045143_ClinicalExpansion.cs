using Microsoft.EntityFrameworkCore.Migrations;
using NodaTime;

#nullable disable

namespace Serene.Migrations
{
    /// <inheritdoc />
    public partial class ClinicalExpansion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "description",
                table: "achievements",
                type: "character varying(300)",
                maxLength: 300,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "peer_matches",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    user_id = table.Column<string>(type: "text", nullable: false),
                    matched_user_id = table.Column<string>(type: "text", nullable: false),
                    shared_interest = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    match_date = table.Column<LocalDate>(type: "date", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<Instant>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_peer_matches", x => x.id);
                    table.ForeignKey(
                        name: "FK_peer_matches_AspNetUsers_matched_user_id",
                        column: x => x.matched_user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_peer_matches_AspNetUsers_user_id",
                        column: x => x.user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "scheduled_activities",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    user_id = table.Column<string>(type: "text", nullable: false),
                    title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    scheduled_date = table.Column<LocalDate>(type: "date", nullable: false),
                    completed = table.Column<bool>(type: "boolean", nullable: false),
                    completed_at = table.Column<Instant>(type: "timestamp with time zone", nullable: true),
                    mood_before = table.Column<int>(type: "integer", nullable: true),
                    mood_after = table.Column<int>(type: "integer", nullable: true),
                    created_at = table.Column<Instant>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_scheduled_activities", x => x.id);
                    table.ForeignKey(
                        name: "FK_scheduled_activities_AspNetUsers_user_id",
                        column: x => x.user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "user_interests",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    user_id = table.Column<string>(type: "text", nullable: false),
                    interest = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    created_at = table.Column<Instant>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_interests", x => x.id);
                    table.ForeignKey(
                        name: "FK_user_interests_AspNetUsers_user_id",
                        column: x => x.user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_peer_matches_matched_user_id",
                table: "peer_matches",
                column: "matched_user_id");

            migrationBuilder.CreateIndex(
                name: "IX_peer_matches_user_id",
                table: "peer_matches",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_scheduled_activities_user_id",
                table: "scheduled_activities",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_user_interests_user_id",
                table: "user_interests",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "peer_matches");

            migrationBuilder.DropTable(
                name: "scheduled_activities");

            migrationBuilder.DropTable(
                name: "user_interests");

            migrationBuilder.DropColumn(
                name: "description",
                table: "achievements");
        }
    }
}
