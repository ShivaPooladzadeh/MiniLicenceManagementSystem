using System.ComponentModel.DataAnnotations;
using MiniLicenseManagementSystem.Models;
namespace MiniLicenseManagementSystem.DTOs;

public class UpdateLicenseDto
{
    [Required]
    public string LicenseKey { get; set; } = string.Empty;

    [Required]
    public string CustomerName { get; set; } = string.Empty;

    public string ProductName { get; set; } = string.Empty;

    [FutureDate]
    public DateTime ExpirationDate { get; set; }

    public bool IsActive { get; set; }
}