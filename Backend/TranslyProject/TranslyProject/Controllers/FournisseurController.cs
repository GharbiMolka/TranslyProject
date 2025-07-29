using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TranslyProject.Data;

namespace TranslyProject.Controllers
{
    // [Authorize(Roles = "Fournisseur")]
    public class FournisseurController : Controller
    {
        private readonly ApplicationDbContext _context;

        public FournisseurController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Dashboard()
        {
            return View();
        }


    }
}
