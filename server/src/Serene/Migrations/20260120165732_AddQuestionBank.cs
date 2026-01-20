using Microsoft.EntityFrameworkCore.Migrations;
using NodaTime;

#nullable disable

namespace Serene.Migrations
{
    /// <inheritdoc />
    public partial class AddQuestionBank : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "backup_question_id",
                table: "community_qotd",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<int>(
                name: "generation_status",
                table: "community_qotd",
                type: "integer",
                nullable: false,
                defaultValue: 0
            );

            migrationBuilder.AddColumn<string>(
                name: "source_id",
                table: "community_qotd",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<int>(
                name: "source_type",
                table: "community_qotd",
                type: "integer",
                nullable: false,
                defaultValue: 0
            );

            migrationBuilder.CreateTable(
                name: "question_bank",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    question = table.Column<string>(type: "text", nullable: false),
                    category = table.Column<string>(type: "text", nullable: true),
                    is_ai_generated = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    used_count = table.Column<int>(type: "integer", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_question_bank", x => x.id);
                }
            );

            migrationBuilder.CreateTable(
                name: "question_generation_schedule",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    target_date = table.Column<LocalDate>(type: "date", nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false),
                    attempts = table.Column<int>(type: "integer", nullable: false),
                    last_attempt_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: true
                    ),
                    error_details = table.Column<string>(type: "text", nullable: true),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_question_generation_schedule", x => x.id);
                }
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "question_bank");

            migrationBuilder.DropTable(name: "question_generation_schedule");

            migrationBuilder.DropColumn(name: "backup_question_id", table: "community_qotd");

            migrationBuilder.DropColumn(name: "generation_status", table: "community_qotd");

            migrationBuilder.DropColumn(name: "source_id", table: "community_qotd");

            migrationBuilder.DropColumn(name: "source_type", table: "community_qotd");
        }
    }
}
