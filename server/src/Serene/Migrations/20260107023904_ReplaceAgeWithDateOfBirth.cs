using Microsoft.EntityFrameworkCore.Migrations;
using NodaTime;

#nullable disable

namespace Serene.Migrations
{
    /// <inheritdoc />
    public partial class ReplaceAgeWithDateOfBirth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "age", table: "AspNetUsers");

            migrationBuilder.AddColumn<LocalDate>(
                name: "date_of_birth",
                table: "AspNetUsers",
                type: "date",
                nullable: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "date_of_birth", table: "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                name: "age",
                table: "AspNetUsers",
                type: "integer",
                nullable: false,
                defaultValue: 0
            );
        }
    }
}
