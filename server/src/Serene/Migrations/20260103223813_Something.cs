using Microsoft.EntityFrameworkCore.Migrations;
using NodaTime;

#nullable disable

namespace Serene.Migrations
{
    /// <inheritdoc />
    public partial class Something : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "session");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "session",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    user_id = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    expires_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    ip_address = table.Column<string>(type: "text", nullable: true),
                    token = table.Column<string>(type: "text", nullable: false),
                    updated_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    user_agent = table.Column<string>(type: "text", nullable: true),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_session", x => x.id);
                    table.ForeignKey(
                        name: "FK_session_AspNetUsers_user_id",
                        column: x => x.user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateIndex(
                name: "IX_session_token",
                table: "session",
                column: "token",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_session_user_id",
                table: "session",
                column: "user_id"
            );
        }
    }
}
