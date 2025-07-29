using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TranslyProject.Data;
using TranslyProject.Models;

namespace TranslyProject.Controllers
{
    //[Authorize(Roles = "Client")]
    public class ClientController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ClientController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Dashboard()

        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            var userRole = User.FindFirstValue(ClaimTypes.Role);


            //var user = _context.Users.Find(int.Parse(userId));

            //ViewBag.Nom = user.Prenom + " " + user.Nom;
            return View();
        }



        public IActionResult EditUser()
        {
            if (TempData["UserId"] == null)
                return RedirectToAction("Login", "User");

            int userId = Convert.ToInt32(TempData["UserId"]);
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);

            if (user == null)
                return NotFound();

            TempData.Keep("UserId");
            return View(user);

        }

        [HttpPost]
        public IActionResult EditUser(User updatedUser)
        {
            int userId = Convert.ToInt32(TempData["UserId"]);
            var existingUser = _context.Users.FirstOrDefault(u => u.Id == userId);

            if (existingUser == null)
                return NotFound();


            existingUser.Nom = updatedUser.Nom;
            existingUser.Prenom = updatedUser.Prenom;
            existingUser.Email = updatedUser.Email;
            existingUser.Mdp = updatedUser.Mdp;
            existingUser.Adresse = updatedUser.Adresse;
            existingUser.Gouvernorat = updatedUser.Gouvernorat;
            existingUser.Ville = updatedUser.Ville;
            existingUser.Tel = updatedUser.Tel;
            _context.SaveChanges();

            ViewBag.Message = "Profil mis à jour !";
            TempData.Keep("UserId");
            return View(existingUser);




        }
    }
}
