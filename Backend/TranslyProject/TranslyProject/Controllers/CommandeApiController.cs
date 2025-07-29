using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;
using TranslyProject.Data;
using TranslyProject.Models;

namespace TranslyProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommandeApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CommandeApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Commande
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AjouterCommande([FromBody] CommandeDTO commandeDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("Utilisateur non authentifié.");

            int userId = int.Parse(userIdClaim.Value);

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound("Utilisateur introuvable.");

            var commande = new Commande
            {
                DateCommande = DateTime.Now,
                Adresse = commandeDTO.Adresse,
                Gouvernorat = commandeDTO.Gouvernorat,
                Ville = commandeDTO.Ville,
                Statut = string.IsNullOrWhiteSpace(commandeDTO.Statut) ? "En attente" : commandeDTO.Statut,
                Description = commandeDTO.Description, 
                Id_User = userId
            };

            _context.Commandes.Add(commande);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Commande ajoutée avec succès", commandeId = commande.Id_Com });
        }
        // GET: api/CommandeApi
        [HttpGet("client/commandes")]
        [Authorize(Roles = "Client")] // Optionnel : restreint l'accès aux clients uniquement
        public async Task<ActionResult<IEnumerable<Commande>>> GetCommandesPourClient()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("Utilisateur non authentifié.");

            int userId = int.Parse(userIdClaim.Value);

            var commandes = await _context.Commandes
                .Where(c => c.Id_User == userId)
                .ToListAsync();

            return Ok(commandes);
        }


        // GET: api/CommandeApi/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetCommande(int id)
        {
            var commande = await _context.Commandes.FindAsync(id);

            if (commande == null)
                return NotFound("Commande non trouvée.");

            return Ok(commande);
        }

        // PUT: api/CommandeApi/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> ModifierCommande(int id, [FromBody] CommandeDTO commandeDTO)
        {
            var commande = await _context.Commandes.FindAsync(id);
            if (commande == null)
                return NotFound("Commande non trouvée.");

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim.Value);
            if (commande.Id_User != userId)
                return Forbid("Vous ne pouvez modifier que vos propres commandes.");

            commande.Adresse = commandeDTO.Adresse;
            commande.Gouvernorat = commandeDTO.Gouvernorat;
            commande.Ville = commandeDTO.Ville;
            commande.Statut = commandeDTO.Statut ?? commande.Statut;
            commande.Description = commandeDTO.Description;

            _context.Commandes.Update(commande);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Commande mise à jour avec succès." });
        }

        // DELETE: api/CommandeApi/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> SupprimerCommande(int id)
        {
            var commande = await _context.Commandes.FindAsync(id);
            if (commande == null)
                return NotFound("Commande non trouvée.");

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim.Value);
            if (commande.Id_User != userId)
                return Forbid("Vous ne pouvez supprimer que vos propres commandes.");

            _context.Commandes.Remove(commande);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Commande supprimée avec succès." });
        }


        // GET: api/CommandeApi/all
        [HttpGet("all")]
        [Authorize(Roles = "Fournisseur")] 
        public async Task<ActionResult<IEnumerable<Commande>>> GetAllCommandes()
        {
            var commandes = await _context.Commandes
                .Include(c => c.User) 
                .ToListAsync();

            return Ok(commandes);
        }


        // PATCH: api/CommandeApi/{id}/changer-statut
        [HttpPatch("{id}/changer-statut")]
        [Authorize(Roles = "Fournisseur")]
        public async Task<IActionResult> ChangerStatutCommande(int id, [FromQuery] string nouveauStatut)
        {
            var commande = await _context.Commandes.FindAsync(id);
            if (commande == null)
                return NotFound("Commande non trouvée.");

            if (commande.Statut != "En attente")
                return BadRequest("La commande a déjà été traitée.");

            if (nouveauStatut != "Acceptée" && nouveauStatut != "Refusée")
                return BadRequest("Statut invalide.");

            commande.Statut = nouveauStatut;
            _context.Commandes.Update(commande);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Commande {nouveauStatut.ToLower()} avec succès." });
        }

    }

}

