using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Serene.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class JournalAndMoodAreSeperated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_mood_entries_journals_journal_id",
                table: "mood_entries");

            migrationBuilder.DropIndex(
                name: "ix_mood_entries_journal_id",
                table: "mood_entries");

            migrationBuilder.DropColumn(
                name: "journal_id",
                table: "mood_entries");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "journal_id",
                table: "mood_entries",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_mood_entries_journal_id",
                table: "mood_entries",
                column: "journal_id",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "fk_mood_entries_journals_journal_id",
                table: "mood_entries",
                column: "journal_id",
                principalTable: "journals",
                principalColumn: "id");
        }
    }
}
