using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Serene.Migrations
{
    /// <inheritdoc />
    public partial class AddSchoolClubsAndResources : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "school_club",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    school_id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    summary = table.Column<string>(type: "text", nullable: false),
                    tags = table.Column<string>(type: "text", nullable: true),
                    links = table.Column<string>(type: "text", nullable: true),
                    user_id = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_school_club", x => x.id);
                    table.ForeignKey(
                        name: "FK_school_club_AspNetUsers_user_id",
                        column: x => x.user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "FK_school_club_school_school_id",
                        column: x => x.school_id,
                        principalTable: "school",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "school_resource",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    school_id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    url = table.Column<string>(type: "text", nullable: false),
                    type = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_school_resource", x => x.id);
                    table.ForeignKey(
                        name: "FK_school_resource_school_school_id",
                        column: x => x.school_id,
                        principalTable: "school",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateIndex(
                name: "IX_school_club_school_id",
                table: "school_club",
                column: "school_id"
            );

            migrationBuilder.CreateIndex(
                name: "IX_school_club_user_id",
                table: "school_club",
                column: "user_id"
            );

            migrationBuilder.CreateIndex(
                name: "IX_school_resource_school_id",
                table: "school_resource",
                column: "school_id"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "school_club");

            migrationBuilder.DropTable(name: "school_resource");
        }
    }
}
