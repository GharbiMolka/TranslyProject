using System.ComponentModel.DataAnnotations;

namespace TranslyProject.Models
{
    public class LoginDTO
    {
        [Required(ErrorMessage = "\n L'email est obligatoire .")]
        [EmailAddress(ErrorMessage = "Format d'email invalide.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Le mot de passe est obligatoire.")]
        public string Mdp { get; set; }


    }
}
