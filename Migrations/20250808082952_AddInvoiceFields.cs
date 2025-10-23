using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace sipaydemo.Migrations
{
    /// <inheritdoc />
    public partial class AddInvoiceFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CurrencyCode",
                table: "PaymentLogs",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "InvoiceDescription",
                table: "PaymentLogs",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<long>(
                name: "InvoiceId",
                table: "PaymentLogs",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<string>(
                name: "ItemJson",
                table: "PaymentLogs",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrencyCode",
                table: "PaymentLogs");

            migrationBuilder.DropColumn(
                name: "InvoiceDescription",
                table: "PaymentLogs");

            migrationBuilder.DropColumn(
                name: "InvoiceId",
                table: "PaymentLogs");

            migrationBuilder.DropColumn(
                name: "ItemJson",
                table: "PaymentLogs");
        }
    }
}
