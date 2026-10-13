using System.ComponentModel.DataAnnotations;

namespace MiniLicenseManagementSystem.Models;
public class License
{
    public int Id { get; set; }
    [Required]  
    public string LicenseKey { get; set; } = string.Empty;
    
    [Required] 
    public string CustomerName { get; set; } = string.Empty;

    public string ProductName { get; set; } = string.Empty;
    [FutureDate]
    public DateTime ExpirationDate { get; set; }
    
    public bool IsActive { get; set; }
}