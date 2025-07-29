using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TranslyProject.Data;
using TranslyProject.Models;

namespace Transly.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class OffreApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OffreApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ GET: Toutes les offres (pour les administrateurs ou transporteurs)
        [HttpGet]
        [Authorize(Roles = "Fournisseur")]
        public async Task<ActionResult<IEnumerable<Offre>>> GetAll()
        {
            var offres = await _context.Offres
                .Include(o => o.Demande)
                .Include(o => o.User)
                .ToListAsync();

            return Ok(offres);
        }

        // ✅ GET: Une offre par ID
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Offre>> GetById(int id)
        {
            var offre = await _context.Offres
                .Include(o => o.Demande)
                .Include(o => o.User)
                .FirstOrDefaultAsync(o => o.IdOffre == id);

            if (offre == null)
                return NotFound();

            return Ok(offre);
        }

        // ✅ GET: Offres de l'utilisateur connecté
        [HttpGet("Transporteur")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Offre>>> GetByConnectedUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim.Value);

            var offres = await _context.Offres
                .Include(o => o.Demande)
                .Where(o => o.Id_User == userId)
                .ToListAsync();

            return Ok(offres);
        }

        // ✅ POST: Créer une offre (utilisateur connecté)
        [HttpPost]
        [Authorize]
        public async Task<ActionResult> Create([FromBody] OffreDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim.Value);

            var offre = new Offre
            {
                PrixPropose = dto.PrixPropose,
                DelaiLivraison = dto.DelaiLivraison,
                Statut = string.IsNullOrWhiteSpace(dto.Statut) ? "En attente" : dto.Statut,
                DateOffre = DateTime.Now,
                Id_Demande = dto.Id_Demande,
                Id_User = userId
            };

            _context.Offres.Add(offre);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = offre.IdOffre }, offre);
        }


        // ✅ PUT: Modifier une offre (par son propriétaire uniquement)
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] Offre updated)
        {
            if (id != updated.IdOffre)
                return BadRequest("L'ID ne correspond pas.");

            var existing = await _context.Offres.FindAsync(id);
            if (existing == null)
                return NotFound();

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim.Value);
            if (existing.Id_User != userId)
                return Forbid("Vous ne pouvez modifier que vos propres offres.");

            existing.PrixPropose = updated.PrixPropose;
            existing.DelaiLivraison = updated.DelaiLivraison;
            existing.Statut = updated.Statut;

            _context.Entry(existing).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ✅ DELETE: Supprimer une offre (propriétaire uniquement)
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var offre = await _context.Offres.FindAsync(id);
            if (offre == null)
                return NotFound();

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim.Value);
            if (offre.Id_User != userId)
                return Forbid("Vous ne pouvez supprimer que vos propres offres.");

            _context.Offres.Remove(offre);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Offre supprimée avec succès." });
        }


        [HttpPatch("{id}/statut")]
        public async Task<IActionResult> UpdateStatut(int id, [FromBody] string nouveauStatut)
        {
            var offre = await _context.Offres.FindAsync(id);
            if (offre == null)
                return NotFound();

            offre.Statut = nouveauStatut;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
