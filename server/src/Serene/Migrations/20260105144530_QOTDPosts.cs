using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Serene.Migrations
{
    /// <inheritdoc />
    public partial class QOTDPosts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "QuestionOfTheDayId",
                table: "post",
                type: "text",
                nullable: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_post_QuestionOfTheDayId",
                table: "post",
                column: "QuestionOfTheDayId"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_post_community_qotd_QuestionOfTheDayId",
                table: "post",
                column: "QuestionOfTheDayId",
                principalTable: "community_qotd",
                principalColumn: "id"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_post_community_qotd_QuestionOfTheDayId",
                table: "post"
            );

            migrationBuilder.DropIndex(name: "IX_post_QuestionOfTheDayId", table: "post");

            migrationBuilder.DropColumn(name: "QuestionOfTheDayId", table: "post");
        }
    }
}
