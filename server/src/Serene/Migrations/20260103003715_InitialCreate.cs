using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using NodaTime;
using Serene.Entities;

#nullable disable

namespace Serene.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "achievements",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    slug = table.Column<string>(type: "text", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    points = table.Column<int>(type: "integer", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_achievements", x => x.id);
                }
            );

            migrationBuilder.CreateTable(
                name: "community_qotd",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    question = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    updated_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_community_qotd", x => x.id);
                }
            );

            migrationBuilder.CreateTable(
                name: "school",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: true),
                    country_code = table.Column<string>(
                        type: "character varying(2)",
                        maxLength: 2,
                        nullable: false
                    ),
                    region_code = table.Column<string>(
                        type: "character varying(2)",
                        maxLength: 2,
                        nullable: true
                    ),
                    city = table.Column<string>(type: "text", nullable: true),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_school", x => x.id);
                }
            );

            migrationBuilder.CreateTable(
                name: "user",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: true),
                    email = table.Column<string>(type: "text", nullable: false),
                    email_verified = table.Column<bool>(type: "boolean", nullable: false),
                    image = table.Column<string>(type: "text", nullable: true),
                    age = table.Column<int>(type: "integer", nullable: false),
                    gender = table.Column<string>(type: "text", nullable: false),
                    pronouns = table.Column<string>(type: "text", nullable: false),
                    country_code = table.Column<string>(
                        type: "character varying(2)",
                        maxLength: 2,
                        nullable: true
                    ),
                    onboarding_completed = table.Column<bool>(type: "boolean", nullable: false),
                    onboarding_step = table.Column<int>(type: "integer", nullable: false),
                    onboarding_started = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    updated_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user", x => x.id);
                }
            );

            migrationBuilder.CreateTable(
                name: "verification",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    identifier = table.Column<string>(type: "text", nullable: false),
                    value = table.Column<string>(type: "text", nullable: false),
                    expires_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    created_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    updated_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_verification", x => x.id);
                }
            );

            migrationBuilder.CreateTable(
                name: "account",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    account_id = table.Column<string>(type: "text", nullable: false),
                    provider_id = table.Column<string>(type: "text", nullable: false),
                    user_id = table.Column<string>(type: "text", nullable: false),
                    access_token = table.Column<string>(type: "text", nullable: true),
                    refresh_token = table.Column<string>(type: "text", nullable: true),
                    id_token = table.Column<string>(type: "text", nullable: true),
                    access_token_expires_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: true
                    ),
                    refresh_token_expires_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: true
                    ),
                    scope = table.Column<string>(type: "text", nullable: true),
                    password = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    updated_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_account", x => x.id);
                    table.ForeignKey(
                        name: "FK_account_user_user_id",
                        column: x => x.user_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "checkins",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    user_id = table.Column<string>(type: "text", nullable: false),
                    mood_label = table.Column<string>(type: "text", nullable: false),
                    mood_severity = table.Column<int>(type: "integer", nullable: false),
                    prompt_question = table.Column<string>(type: "text", nullable: false),
                    prompt_answer = table.Column<string>(type: "text", nullable: true),
                    somatic_state = table.Column<Dictionary<string, GridPoint>>(
                        type: "jsonb",
                        nullable: true
                    ),
                    created_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    updated_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_checkins", x => x.id);
                    table.ForeignKey(
                        name: "FK_checkins_user_user_id",
                        column: x => x.user_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "post",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    answer = table.Column<string>(type: "text", nullable: false),
                    user_id = table.Column<string>(type: "text", nullable: false),
                    qotd_id = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    updated_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_post", x => x.id);
                    table.ForeignKey(
                        name: "FK_post_community_qotd_qotd_id",
                        column: x => x.qotd_id,
                        principalTable: "community_qotd",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "FK_post_user_user_id",
                        column: x => x.user_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "preferences",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    password_lock = table.Column<string>(
                        type: "character varying(50)",
                        maxLength: 50,
                        nullable: true
                    ),
                    theme = table.Column<string>(type: "text", nullable: false),
                    user_id = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    updated_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_preferences", x => x.id);
                    table.ForeignKey(
                        name: "FK_preferences_user_user_id",
                        column: x => x.user_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "profile",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    koala_name = table.Column<string>(type: "text", nullable: false),
                    koala_color = table.Column<string>(type: "text", nullable: false),
                    koala_pronouns = table.Column<string>(
                        type: "character varying(50)",
                        maxLength: 50,
                        nullable: false
                    ),
                    current_streak = table.Column<int>(type: "integer", nullable: false),
                    longest_streak = table.Column<int>(type: "integer", nullable: false),
                    school_id = table.Column<string>(type: "text", nullable: true),
                    user_id = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    updated_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_profile", x => x.id);
                    table.ForeignKey(
                        name: "FK_profile_school_school_id",
                        column: x => x.school_id,
                        principalTable: "school",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull
                    );
                    table.ForeignKey(
                        name: "FK_profile_user_user_id",
                        column: x => x.user_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "safety_plan",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    professional_resources = table.Column<string>(type: "jsonb", nullable: true),
                    safe_contacts = table.Column<string>(type: "jsonb", nullable: true),
                    coping_strategies = table.Column<List<string>>(type: "text[]", nullable: false),
                    user_id = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    updated_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_safety_plan", x => x.id);
                    table.ForeignKey(
                        name: "FK_safety_plan_user_user_id",
                        column: x => x.user_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "session",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    expires_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    token = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    updated_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    ip_address = table.Column<string>(type: "text", nullable: true),
                    user_agent = table.Column<string>(type: "text", nullable: true),
                    user_id = table.Column<string>(type: "text", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_session", x => x.id);
                    table.ForeignKey(
                        name: "FK_session_user_user_id",
                        column: x => x.user_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "user_achievements",
                columns: table => new
                {
                    user_id = table.Column<string>(type: "text", nullable: false),
                    achievement_id = table.Column<string>(type: "text", nullable: false),
                    unlocked_at = table.Column<Instant>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey(
                        "PK_user_achievements",
                        x => new { x.user_id, x.achievement_id }
                    );
                    table.ForeignKey(
                        name: "FK_user_achievements_achievements_achievement_id",
                        column: x => x.achievement_id,
                        principalTable: "achievements",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "FK_user_achievements_user_user_id",
                        column: x => x.user_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateIndex(
                name: "IX_account_user_id",
                table: "account",
                column: "user_id"
            );

            migrationBuilder.CreateIndex(
                name: "IX_achievements_slug",
                table: "achievements",
                column: "slug",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_checkins_user_id",
                table: "checkins",
                column: "user_id"
            );

            migrationBuilder.CreateIndex(name: "IX_post_qotd_id", table: "post", column: "qotd_id");

            migrationBuilder.CreateIndex(name: "IX_post_user_id", table: "post", column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_preferences_user_id",
                table: "preferences",
                column: "user_id",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_profile_school_id",
                table: "profile",
                column: "school_id"
            );

            migrationBuilder.CreateIndex(
                name: "IX_profile_user_id",
                table: "profile",
                column: "user_id",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_safety_plan_user_id",
                table: "safety_plan",
                column: "user_id",
                unique: true
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

            migrationBuilder.CreateIndex(
                name: "IX_user_email",
                table: "user",
                column: "email",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_user_name",
                table: "user",
                column: "name",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_user_achievements_achievement_id",
                table: "user_achievements",
                column: "achievement_id"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "account");

            migrationBuilder.DropTable(name: "checkins");

            migrationBuilder.DropTable(name: "post");

            migrationBuilder.DropTable(name: "preferences");

            migrationBuilder.DropTable(name: "profile");

            migrationBuilder.DropTable(name: "safety_plan");

            migrationBuilder.DropTable(name: "session");

            migrationBuilder.DropTable(name: "user_achievements");

            migrationBuilder.DropTable(name: "verification");

            migrationBuilder.DropTable(name: "community_qotd");

            migrationBuilder.DropTable(name: "school");

            migrationBuilder.DropTable(name: "achievements");

            migrationBuilder.DropTable(name: "user");
        }
    }
}
