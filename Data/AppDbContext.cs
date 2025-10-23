using Microsoft.EntityFrameworkCore;
using sipaydemo.Models;
namespace sipaydemo.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions <AppDbContext> options) 
            : base(options) 
        { 
        }
        public DbSet<PaymentLog> PaymentLogs { get; set; }
        public DbSet<ItemLog> ItemLogs { get; set; }
    }
}

