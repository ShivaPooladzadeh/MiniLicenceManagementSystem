using Microsoft.EntityFrameworkCore;
using MiniLicenseManagementSystem.Models;

namespace MiniLicenseManagementSystem.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<License> Licenses { get; set; }
}