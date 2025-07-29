using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using TranslyProject.Data;
using TranslyProject.Models;
using TranslyProject.Services;

namespace TranslyProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;


        public AuthController(ApplicationDbContext context, IConfiguration configuration , IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }

        [HttpPost("login")]
        public IActionResult LoginApi([FromBody] LoginDTO loginDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = _context.Users.FirstOrDefault(u => u.Email == loginDTO.Email);

            if (user == null || user.Mdp != loginDTO.Mdp)
                return Unauthorized(new { message = "Email ou mot de passe incorrect." });

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("FullName", $"{user.Prenom} {user.Nom}")
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(double.Parse(_configuration["Jwt:ExpireMinutes"])),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new
            {
                token = tokenString,
                user = new { user.Id, user.Email, user.Role, user.Nom, user.Prenom }
            });
        }

        // Dashboards sécurisés par rôle
        [Authorize(Roles = "Client")]
        [HttpGet("client")]
        public IActionResult DashboardClient()
        {
            return Ok(new { message = "Bienvenue sur le tableau de bord du CLIENT !" });
        }

        [Authorize(Roles = "Fournisseur")]
        [HttpGet("fournisseur")]
        public IActionResult DashboardFournisseur()
        {
            return Ok(new { message = "Bienvenue sur le tableau de bord du FOURNISSEUR !" });
        }

        [Authorize(Roles = "Transporteur")]
        [HttpGet("transporteur")]
        public IActionResult DashboardTransporteur()
        {
            return Ok(new { message = "Bienvenue sur le tableau de bord du TRANSPORTEUR !" });
        }
        [HttpPost("register")]
        public IActionResult RegisterApi([FromBody] UserDTO userDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Vérifier si l'utilisateur existe déjà
            var existingUser = _context.Users.FirstOrDefault(u => u.Email == userDto.Email);
            if (existingUser != null)
            {
                return Conflict(new { message = "Cet email est déjà utilisé." });
            }

            var user = new User
            {
                Nom = userDto.Nom,
                Prenom = userDto.Prenom,
                Email = userDto.Email,
                Mdp = userDto.Mdp, // Attention : à hasher en production !
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

                return Ok(new
                {
                    message = "Utilisateur enregistré avec succès.",
                    user = new { user.Id, user.Nom, user.Prenom, user.Email, user.Role }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de l'enregistrement.", error = ex.Message });
            }
        }
        [HttpPut("update/{id}")]
        public IActionResult UpdateUser(int id, [FromBody] UserDTO userDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = _context.Users.FirstOrDefault(u => u.Id == id);
            if (user == null)
                return NotFound(new { message = "Utilisateur introuvable." });

            user.Nom = userDto.Nom;
            user.Prenom = userDto.Prenom;
            user.Email = userDto.Email;
            user.Mdp = userDto.Mdp; // À sécuriser
            user.Adresse = userDto.Adresse;
            user.Gouvernorat = userDto.Gouvernorat;
            user.Ville = userDto.Ville;
            user.Role = userDto.Role;
            user.Tel = userDto.Tel;

            try
            {
                _context.SaveChanges();
                return Ok(new { message = "Utilisateur mis à jour avec succès." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la mise à jour.", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetUserById(int id)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == id);
            if (user == null)
                return NotFound(new { message = "Utilisateur introuvable." });

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

            return Ok(userDto);
        }

        [HttpPost("request-password-reset")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] PasswordResetRequestDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
                return NotFound("Utilisateur introuvable.");

            var token = Guid.NewGuid().ToString();
            var expiration = DateTime.UtcNow.AddHours(1);

            var resetToken = new PasswordResetToken
            {
                Token = token,
                Expiration = expiration,
                UserId = user.Id
            };

            _context.PasswordResetTokens.Add(resetToken);
            await _context.SaveChangesAsync();

            //Lien de réinitialisation (frontend)
            var resetLink = $"http://localhost:4200/reinisialiermdp?token={token}";

            // Envoi réel de l'e-mail
            await _emailService.SendAsync(
     user.Email,
     "Réinitialisation de mot de passe",
     $@"
    <div style='font-family: Arial, sans-serif; font-size: 16px; color: #333;'>
        <p>Bonjour {user.Prenom},</p>
        <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour poursuivre :</p>
        <p style='text-align: center;'>
            <a href='{resetLink}' style='display: inline-block; padding: 12px 20px; background-color: #e53935; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;'>
                Réinitialiser le mot de passe
            </a>
        </p>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer cet e-mail.</p>
        <p>Cordialement,<br>L’équipe Transly</p>
    </div>"
 );


            return Ok("Lien de réinitialisation envoyé.");
        }


        public class ResetPasswordDto
        {
            public string Token { get; set; }
            public string NouveauMdp { get; set; }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var tokenEntry = await _context.PasswordResetTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Token == dto.Token && t.Expiration > DateTime.UtcNow);

            if (tokenEntry == null)
                return BadRequest("Token invalide ou expiré.");

            tokenEntry.User.Mdp = dto.NouveauMdp; 
            _context.PasswordResetTokens.Remove(tokenEntry);

            await _context.SaveChangesAsync();
            return Ok("Mot de passe mis à jour.");
        }




    }
}
