using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Serene.Migrations
{
    /// <inheritdoc />
    public partial class AddStrugglesToProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<List<string>>(
                name: "struggles",
                table: "profile",
                type: "text[]",
                nullable: false,
                defaultValueSql: "'{}'"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "struggles", table: "profile");
        }
    }
}
