using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sipaydemo.Data;
using sipaydemo.Models;
using sipaydemo.Services;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace sipaydemo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly AppDbContext _context;

        private readonly SipayService _sipayService;
        public PaymentController(SipayService sipayService, AppDbContext context)
        {
            _sipayService = sipayService;
            _context = context;
        }

        [HttpPost]

        public async Task<IActionResult> Pay([FromBody] PaymentRequest request)
        {
            try
            {
                var result = await _sipayService.PaySmart3DAsync(request);

                string status = "Unknown";
                try
                {
                    var json = JObject.Parse(result);
                    status = json["status"]?.ToString() ?? "Unkown";
                }
                catch 
                {
                    status = "Failed";
                }

                var paymentLog = new PaymentLog
                {
                    CardHolderName = request.cc_holder_name,
                    Amount = request.total,
                    Status = "Success",
                    Timestamp = DateTime.Now,
                    InvoiceId = request.invoice_id,
                    InvoiceDescription = request.invoice_description,
                    CurrencyCode = request.currency_code,
                    ItemJson = JsonConvert.SerializeObject(request.items)
                };

                _context.PaymentLogs.Add(paymentLog);
                await _context.SaveChangesAsync();

                foreach (var item in request.items)
                {
                    var itemLog = new ItemLog
                    {
                        Name = item.name,
                        Price = item.price,
                        PaymentLogId = paymentLog.Id
                    };
                    _context.ItemLogs.Add(itemLog);
                }
                await _context.SaveChangesAsync();


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Sunucu hatası: {ex.Message}");
            }
            
        }
        [HttpGet("logs")]
     
        public async Task<IActionResult> GetLogs()
        {
            var logs = await _context.PaymentLogs
                .Include(p => p.Items) // ilişkili item'ları da çekmemize olanak tanır
                .ToListAsync();

            return Ok(logs);
        }

        [HttpGet("last")]
        public async Task<IActionResult> GetLastPayment()
        {
            var last = await _context.PaymentLogs
                .OrderByDescending(p => p.Timestamp)
                .FirstOrDefaultAsync();

            if (last == null)
                return NotFound("Henüz hiç ödeme kaydı yok.");

            return Ok(last);
        }
        [HttpGet("logs/by-date")]//
        public async Task<IActionResult> GetLogsByDate([FromQuery] DateTime start, [FromQuery] DateTime end)
        {
            var logs = await _context.PaymentLogs
                .Include(p => p.Items)
                .Where(p => p.Timestamp >= start && p.Timestamp <= end)
                .ToListAsync();

            return Ok(logs);
        }
        [HttpGet("logs/by-status")]//
        public async Task<IActionResult> GetLogsByStatus([FromQuery] string status)
        {
            var logs = await _context.PaymentLogs
                .Include(p => p.Items)
                .Where(p => p.Status == status)
                .ToListAsync();

            return Ok(logs);
        }
        [HttpGet("logs/recent")]
        public async Task<IActionResult> GetRecentLogs()
        {
            var logs = await _context.PaymentLogs
                .Include(p => p.Items)
                .OrderByDescending(p => p.Timestamp)
                .Take(5)
                .ToListAsync();

            return Ok(logs);
        }
        [HttpGet("total-success-amount")]
        public async Task<IActionResult> GetTotalSuccessAmount()
        {
            var total = await _context.PaymentLogs
                .Where(p => p.Status == "Success")
                .SumAsync(p => p.Amount);

            return Ok(new { totalAmount = total });
        }
        [HttpGet("most-sold-item")]//
        public async Task<IActionResult> GetMostSoldItem()
        {
            var result = await _context.ItemLogs
                .GroupBy(i => i.Name)
                .Select(group => new
                {
                    ItemName = group.Key,
                    Count = group.Count()
                })
                .OrderByDescending(g => g.Count)
                .FirstOrDefaultAsync();

            if (result == null)
                return NotFound("Hiç ürün satışı yapılmamış.");

            return Ok(result);
        }








    }
}
