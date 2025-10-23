using sipaydemo.Models;
using Microsoft.EntityFrameworkCore;
namespace sipaydemo.Models

  
{
    public class PaymentRequest
    {
        public class Item
        {
            public string name { get; set; } = string.Empty;
            public decimal price { get; set; } 
        }
        public string cc_holder_name { get; set; } = string.Empty;
        public string cc_no { get; set; } = string.Empty;
        public int expiry_month { get; set; } 
        public int expiry_year { get; set; }
        public int cvv { get; set; }
        public string currency_code { get; set; } = string.Empty;
        public int installments_number { get; set; }
        public long invoice_id { get; set; }
        public string invoice_description { get; set; } = string.Empty;         
        public string name { get; set; } = string.Empty;
        public string surname { get; set; } = string.Empty;
        public decimal total { get; set; } 
        public string merchant_key { get; set; } = string.Empty;
        public List<Item> items { get; set; } = null!;
        public string cancel_url { get; set; } = string.Empty;
        public string return_url { get; set; } = string.Empty;
    }
}
