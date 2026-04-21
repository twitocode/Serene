using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Serene.Migrations
{
    /// <inheritdoc />
    public partial class AddSomaticStateEncrypted : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "somatic_state_encrypted",
                table: "checkins",
                type: "text",
                nullable: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "somatic_state_encrypted", table: "checkins");
        }
    }
}
