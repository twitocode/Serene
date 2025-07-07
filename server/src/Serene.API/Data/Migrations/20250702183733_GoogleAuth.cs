using Microsoft.EntityFrameworkCore.Migrations;
using Serene.API.Data.Entities;

#nullable disable

namespace Serene.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class GoogleAuth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:Enum:gender", "female,male,non_binary,none,transgender")
                .Annotation("Npgsql:Enum:mood", "happy,sad")
                .Annotation("Npgsql:Enum:resource_type", "article,video")
                .OldAnnotation("Npgsql:Enum:mood", "happy,sad")
                .OldAnnotation("Npgsql:Enum:resource_type", "article,video");

            migrationBuilder.AddColumn<Gender>(
                name: "gender",
                table: "AspNetUsers",
                type: "gender",
                nullable: false,
                defaultValue: Gender.Male);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "gender",
                table: "AspNetUsers");

            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:Enum:mood", "happy,sad")
                .Annotation("Npgsql:Enum:resource_type", "article,video")
                .OldAnnotation("Npgsql:Enum:gender", "female,male,non_binary,none,transgender")
                .OldAnnotation("Npgsql:Enum:mood", "happy,sad")
                .OldAnnotation("Npgsql:Enum:resource_type", "article,video");
        }
    }
}
