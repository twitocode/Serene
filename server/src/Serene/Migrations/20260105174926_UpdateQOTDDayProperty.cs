using Microsoft.EntityFrameworkCore.Migrations;
using NodaTime;

#nullable disable

namespace Serene.Migrations
{
    /// <inheritdoc />
    public partial class UpdateQOTDDayProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<LocalDate>(
                name: "day",
                table: "community_qotd",
                type: "date",
                nullable: false,
                defaultValue: new NodaTime.LocalDate(1, 1, 1)
            );

            // Update existing records to set Day based on CreatedAt
            migrationBuilder.Sql(
                @"
                UPDATE community_qotd 
                SET day = DATE(created_at)
                WHERE created_at IS NOT NULL
            "
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "day", table: "community_qotd");
        }
    }
}
