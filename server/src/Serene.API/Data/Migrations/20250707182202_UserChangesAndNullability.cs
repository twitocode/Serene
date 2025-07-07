using Microsoft.EntityFrameworkCore.Migrations;
using NodaTime;
using Serene.API.Data.Entities;

#nullable disable

namespace Serene.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class UserChangesAndNullability : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "country_code",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<int>(
                name: "theme",
                table: "user_preferences",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<ResourceType>(
                name: "resource_type",
                table: "resources",
                type: "resource_type",
                nullable: false,
                defaultValue: ResourceType.Article,
                oldClrType: typeof(ResourceType),
                oldType: "resource_type");

            migrationBuilder.AlterColumn<string>(
                name: "pronouns",
                table: "AspNetUsers",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "last_name",
                table: "AspNetUsers",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<Gender>(
                name: "gender",
                table: "AspNetUsers",
                type: "gender",
                nullable: false,
                defaultValue: Gender.None,
                oldClrType: typeof(Gender),
                oldType: "gender");

            migrationBuilder.AlterColumn<string>(
                name: "first_name",
                table: "AspNetUsers",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "avatar_url",
                table: "AspNetUsers",
                type: "text",
                nullable: true,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "country",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<Instant>(
                name: "date_of_birth",
                table: "AspNetUsers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: NodaTime.Instant.FromUnixTimeTicks(0L));

            migrationBuilder.AddColumn<bool>(
                name: "is_setup_completed",
                table: "AspNetUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "country",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "date_of_birth",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "is_setup_completed",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<int>(
                name: "theme",
                table: "user_preferences",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldDefaultValue: 0);

            migrationBuilder.AlterColumn<ResourceType>(
                name: "resource_type",
                table: "resources",
                type: "resource_type",
                nullable: false,
                oldClrType: typeof(ResourceType),
                oldType: "resource_type",
                oldDefaultValue: ResourceType.Article);

            migrationBuilder.AlterColumn<string>(
                name: "pronouns",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "last_name",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<Gender>(
                name: "gender",
                table: "AspNetUsers",
                type: "gender",
                nullable: false,
                oldClrType: typeof(Gender),
                oldType: "gender",
                oldDefaultValue: Gender.None);

            migrationBuilder.AlterColumn<string>(
                name: "first_name",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "avatar_url",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true,
                oldDefaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "country_code",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
