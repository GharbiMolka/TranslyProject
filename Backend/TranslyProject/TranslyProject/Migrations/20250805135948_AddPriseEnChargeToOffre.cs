using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TranslyProject.Migrations
{
    /// <inheritdoc />
    public partial class AddPriseEnChargeToOffre : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PriseEnCharge",
                table: "Offres",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PriseEnCharge",
                table: "Offres");
        }
    }
}
