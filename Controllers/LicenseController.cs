using Microsoft.AspNetCore.Mvc;
using MiniLicenseManagementSystem.Data;
using MiniLicenseManagementSystem.DTOs;
using MiniLicenseManagementSystem.Models;

namespace MiniLicenseManagementSystem.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LicenseController : ControllerBase
{
    private readonly AppDbContext _context;

    public LicenseController(AppDbContext context)
    {
        _context = context;
    }
    [HttpGet]
    public IActionResult Get()
    {
        var licenses = _context.Licenses.ToList();

        return Ok(licenses);
    }
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var license = _context.Licenses.Find(id);

        if (license == null)
        {
            return NotFound();
        }

        return Ok(license);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, UpdateLicenseDto license)
    {
        var existingLicense = _context.Licenses.Find(id);

        if (existingLicense == null)
        {
            return NotFound();
        }

        existingLicense.LicenseKey = license.LicenseKey;
        existingLicense.CustomerName = license.CustomerName;
        existingLicense.ProductName = license.ProductName;
        existingLicense.ExpirationDate = license.ExpirationDate;
        existingLicense.IsActive = license.IsActive;

        _context.SaveChanges();

        return Ok(existingLicense);
    }
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var license = _context.Licenses.Find(id);

        if (license == null)
        {
            return NotFound();
        }

        _context.Licenses.Remove(license);
        _context.SaveChanges();

        return Ok(license);
    }

    [HttpPost]
    public IActionResult Create(CreateLicenseDto license)
    {
        var newLicense = new License
        {
            LicenseKey = license.LicenseKey,
            CustomerName = license.CustomerName,
            ProductName = license.ProductName,
            ExpirationDate = license.ExpirationDate,
            IsActive = license.IsActive
        };
        _context.Licenses.Add(newLicense);
        _context.SaveChanges();


        return Ok(newLicense);
    }
}