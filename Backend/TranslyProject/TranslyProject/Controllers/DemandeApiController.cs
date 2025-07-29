using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

using TranslyProject.Models;
using TranslyProject.Data;

namespace Transly.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class DemandeApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DemandeApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ GET: Toutes les demandes 
        [HttpGet]
        [Authorize(Roles = "Transporteur")]
        public async Task<ActionResult<IEnumerable<Demande>>> GetAll()
        {
            var demandes = await _context.Demandes
                .Include(d => d.Commande)
                .Include(d => d.User)
                .ToListAsync();

            return Ok(demandes);
        }

        // ✅ GET: Une demande par ID (autorisé pour tous les connectés)
        [HttpGet("{id}")]
        public async Task<ActionResult<Demande>> GetById(int id)
        {
            var demande = await _context.Demandes
                .Include(d => d.Commande)
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (demande == null)
                return NotFound();

            return Ok(demande);
        }

        // ✅ GET: Demandes de l'utilisateur connecté
        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<Demande>>> GetByConnectedUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim.Value);

            var demandes = await _context.Demandes
                .Include(d => d.Commande)
                .Include(d => d.User)
                .Where(d => d.Id_User == userId)
                .ToListAsync();

            return Ok(demandes);
        }

        // ✅ POST: Créer une demande (utilisateur connecté)
        [HttpPost]
        [Authorize]
        public async Task<ActionResult> Create([FromBody] DemandeDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim.Value);

            var demande = new Demande
            {
                AdresseEnlevement = dto.AdresseEnlevement,
                AdresseLivraison = dto.AdresseLivraison,
                DateSouhaitee = dto.DateSouhaitee,
                Statut = string.IsNullOrWhiteSpace(dto.Statut) ? "En attente" : dto.Statut,
                Id_Commande = dto.Id_Commande,
                Id_User = userId,
                DateDemande = DateTime.Now
            };

            _context.Demandes.Add(demande);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = demande.Id }, demande);
        }


        // ✅ PUT: Modifier une demande (propriétaire uniquement)
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Demande updated)
        {
            if (id != updated.Id)
                return BadRequest("L'ID ne correspond pas.");

            var existing = await _context.Demandes.FindAsync(id);
            if (existing == null)
                return NotFound();

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim.Value);
            if (existing.Id_User != userId)
                return Forbid("Vous ne pouvez modifier que vos propres demandes.");

            existing.AdresseEnlevement = updated.AdresseEnlevement;
            existing.AdresseLivraison = updated.AdresseLivraison;
            existing.DateSouhaitee = updated.DateSouhaitee;
            existing.Statut = updated.Statut;

            _context.Entry(existing).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ✅ DELETE: Supprimer une demande (propriétaire uniquement)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var demande = await _context.Demandes.FindAsync(id);
            if (demande == null)
                return NotFound();

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim.Value);
            if (demande.Id_User != userId)
                return Forbid("Vous ne pouvez supprimer que vos propres demandes.");

            _context.Demandes.Remove(demande);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Demande supprimée avec succès." });
        }
        // ✅ GET: Offres pour une demande spécifique
        [HttpGet("{id}/offres")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Offre>>> GetOffresPourDemande(int id)
        {
            var offres = await _context.Offres
                .Where(o => o.Id_Demande == id)
                .ToListAsync();

            return Ok(offres);
        }


      



    }
}
