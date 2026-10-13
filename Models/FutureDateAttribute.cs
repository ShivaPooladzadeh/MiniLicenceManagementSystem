using System.ComponentModel.DataAnnotations;

namespace MiniLicenseManagementSystem.Models;

public class FutureDateAttribute : ValidationAttribute
{
    public FutureDateAttribute()
    {
        ErrorMessage = "Expiration date must be today or in the future.";
    }

    public override bool IsValid(object? value)
    {
        if (value is DateTime date)
        {
            return date >= DateTime.Today;
        }

        return false;
    }
}