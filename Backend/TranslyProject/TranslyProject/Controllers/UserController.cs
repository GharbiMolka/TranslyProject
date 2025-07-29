using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using TranslyProject.Data;
using TranslyProject.Models;

namespace TranslyProject.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public UserController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET: /User/Register
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Register(UserDTO userDto)
        {
            if (!ModelState.IsValid)
            {
                return View(userDto);
            }

            // Vérifier si l'email existe déjà (exemple)
            var existingUser = _context.Users.FirstOrDefault(u => u.Email == userDto.Email);
            if (existingUser != null)
            {
                ModelState.AddModelError(nameof(userDto.Email), "Cet email est déjà utilisé.");
                return View(userDto);
            }

            var user = new User
            {
                Nom = userDto.Nom,
                Prenom = userDto.Prenom,
                Email = userDto.Email,
                Mdp = userDto.Mdp,
                Adresse = userDto.Adresse,
                Gouvernorat = userDto.Gouvernorat,
                Ville = userDto.Ville,
                Role = userDto.Role,
                Tel = userDto.Tel
            };

            try
            {
                _context.Users.Add(user);
                _context.SaveChanges();
                return RedirectToAction("Login", "User");
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, "Erreur lors de l'enregistrement : " + ex.Message);
                return View(userDto);
            }
        }

        // GET: /User/Login
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login(LoginDTO loginDTO)
        {
            if (!ModelState.IsValid)
            {
                return View(loginDTO);
            }

            var user = _context.Users.FirstOrDefault(x => x.Email == loginDTO.Email);

            if (user == null)
            {
                ViewBag.Message = "Cet email n'existe pas.";
                return View(loginDTO);
            }

            if (user.Mdp != loginDTO.Mdp)
            {
                ViewBag.Message = "Mot de passe incorrect.";
                return View(loginDTO);
            }

            // Connexion réussie
            TempData["UserId"] = user.Id;
            TempData["UserRole"] = user.Role;

            // Redirection selon le rôle
            switch (user.Role)
            {
                case "Client":
                    return RedirectToAction("Dashboard", "Client");
                case "Fournisseur":
                    return RedirectToAction("Dashboard", "Fournisseur");
                case "Transporteur":
                    return RedirectToAction("Dashboard", "Transporteur");
                default:
                    ViewBag.Message = "Rôle inconnu.";
                    return View(loginDTO);
            }
        }
        public IActionResult Logout()
        {
            TempData.Clear();
            return RedirectToAction("Login");
        }



        // GET: /User/Edit/5
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            var userDto = new UserDTO
            {
                Nom = user.Nom,
                Prenom = user.Prenom,
                Email = user.Email,
                Mdp = user.Mdp,
                Adresse = user.Adresse,
                Gouvernorat = user.Gouvernorat,
                Ville = user.Ville,
                Role = user.Role,
                Tel = user.Tel
            };

            return View(userDto);
        }

        // POST: /User/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, UserDTO userDto)
        {
            if (!ModelState.IsValid)
            {
                return View(userDto);
            }

            var user = _context.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            user.Nom = userDto.Nom;
            user.Prenom = userDto.Prenom;
            user.Email = userDto.Email;
            user.Mdp = userDto.Mdp; // À sécuriser si besoin
            user.Adresse = userDto.Adresse;
            user.Gouvernorat = userDto.Gouvernorat;
            user.Ville = userDto.Ville;
            user.Role = userDto.Role;
            user.Tel = userDto.Tel;

            try
            {
                _context.SaveChanges();
                return RedirectToAction("Login"); // ou un autre redirect selon le besoin
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", "Erreur lors de la mise à jour : " + ex.Message);
                return View(userDto);
            }
        }


    }



}
