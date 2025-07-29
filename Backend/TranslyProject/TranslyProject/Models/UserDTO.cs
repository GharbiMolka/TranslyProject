using System.ComponentModel.DataAnnotations;

namespace TranslyProject.Models
{
    public class UserDTO
    {
        [Required(ErrorMessage = "Le nom est obligatoire.")]
        [StringLength(50, ErrorMessage = "Le nom ne doit pas dépasser 50 caractères.")]
        public string Nom { get; set; }

        [Required(ErrorMessage = "Le prénom est obligatoire.")]
        [StringLength(50, ErrorMessage = "Le prénom ne doit pas dépasser 50 caractères.")]
        public string Prenom { get; set; }

        [Required(ErrorMessage = "L'email est obligatoire.")]
        [EmailAddress(ErrorMessage = "Adresse email invalide.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Le mot de passe est obligatoire.")]
        [DataType(DataType.Password)]
        public string Mdp { get; set; }

        [Required(ErrorMessage = "L'adresse est obligatoire.")]
        [StringLength(100, ErrorMessage = "L'adresse ne doit pas dépasser 100 caractères.")]
        public string Adresse { get; set; }

        [Required(ErrorMessage = "Il faut choisir un gouvernorat.")]
        public string Gouvernorat { get; set; }

        [Required(ErrorMessage = "Il faut choisir une ville.")]
        public string Ville { get; set; }

        [Required(ErrorMessage = "Il faut choisir votre rôle.")]
        [RegularExpression("Client|Fournisseur|Transporteur", ErrorMessage = "Le rôle doit être 'Client', 'Fournisseur' ou 'Transporteur'.")]
        public string Role { get; set; }

        [Required(ErrorMessage = "Le numéro de téléphone est obligatoire.")]
        [Phone(ErrorMessage = "Le numéro de téléphone n'est pas valide.")]
        public string Tel { get; set; }
    }
}
