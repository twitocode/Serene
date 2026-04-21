using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Serene.Migrations
{
    /// <inheritdoc />
    public partial class RenameKoalaToMochi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "koala_color", table: "profile");

            migrationBuilder.RenameColumn(
                name: "koala_pronouns",
                table: "profile",
                newName: "mochi_pronouns"
            );

            migrationBuilder.RenameColumn(
                name: "koala_name",
                table: "profile",
                newName: "mochi_name"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "mochi_pronouns",
                table: "profile",
                newName: "koala_pronouns"
            );

            migrationBuilder.RenameColumn(
                name: "mochi_name",
                table: "profile",
                newName: "koala_name"
            );

            migrationBuilder.AddColumn<string>(
                name: "koala_color",
                table: "profile",
                type: "text",
                nullable: false,
                defaultValue: ""
            );
        }
    }
}
