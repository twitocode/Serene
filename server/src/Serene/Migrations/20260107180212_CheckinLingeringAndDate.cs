using Microsoft.EntityFrameworkCore.Migrations;
using NodaTime;

#nullable disable

namespace Serene.Migrations
{
    /// <inheritdoc />
    public partial class CheckinLingeringAndDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<LocalDate>(
                name: "date_completed",
                table: "checkins",
                type: "date",
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "lingering_thoughts",
                table: "checkins",
                type: "text",
                nullable: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "date_completed", table: "checkins");

            migrationBuilder.DropColumn(name: "lingering_thoughts", table: "checkins");
        }
    }
}
