using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TranslyProject.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required(ErrorMessage = "Le nom est obligatoire.")]
        [StringLength(50)]
        public string Nom { get; set; }

        [Required(ErrorMessage = "Le prénom est obligatoire.")]
        [StringLength(50)]
        public string Prenom { get; set; }

        [Required(ErrorMessage = "L'email est obligatoire.")]
        [EmailAddress]
        public string Email { get; set; }

        [Required(ErrorMessage = "Le mot de passe est obligatoire.")]
        [DataType(DataType.Password)]
        public string Mdp { get; set; }

        [Required(ErrorMessage = "L'adresse est obligatoire.")]
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

        [JsonIgnore]

        public ICollection<Commande> Commandes { get; set; }
        public ICollection<Demande> Demandes { get; set; }
        public ICollection<Offre> Offres { get; set; }
    }
}
