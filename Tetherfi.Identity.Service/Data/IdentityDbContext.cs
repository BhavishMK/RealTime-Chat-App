using Microsoft.EntityFrameworkCore;
using Tetherfi.Identity.Service.Models;

namespace Tetherfi.Identity.Service.Data
{
        public class IdentityDbContext : DbContext
        {
            public IdentityDbContext(DbContextOptions<IdentityDbContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
    }
}
