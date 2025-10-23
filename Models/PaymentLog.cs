using Microsoft.AspNetCore.Mvc;
using System;

namespace sipaydemo.Models
{
    public class PaymentLog
    {
        public int Id { get; set; }
        public string CardHolderName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public long InvoiceId { get; set; }
        public string InvoiceDescription { get; set; } = string.Empty;
        public string CurrencyCode { get; set; } = string.Empty;
        public string ItemJson { get; set; } = string.Empty;
        public List<ItemLog> Items { get; set; } = new();

    }
}
