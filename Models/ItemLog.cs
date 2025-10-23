using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace sipaydemo.Models
{
    public class ItemLog
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int PaymentLogId { get; set; }
       
        [ForeignKey("PaymentLogId")]
        public PaymentLog? PaymentLog { get; set; }
    }
}
