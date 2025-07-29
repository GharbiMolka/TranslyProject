using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TranslyProject.Data;

namespace TranslyProject.Controllers
{
    // [Authorize(Roles = "Transporteur")]
    public class TransporteurController : Controller
    {
        private readonly ApplicationDbContext _context;

        public TransporteurController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Dashboard()
        {
            return View();
        }
    }
}