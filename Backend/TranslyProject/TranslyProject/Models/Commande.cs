using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TranslyProject.Models
{
    public class Commande
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id_Com { get; set; }

        [Required(ErrorMessage = "La date de commande est obligatoire.")]
        [DataType(DataType.Date)]
        public DateTime DateCommande { get; set; }

        [Required(ErrorMessage = "L'adresse est obligatoire.")]
        [StringLength(100)]
        public string Adresse { get; set; }

        [Required(ErrorMessage = "Le gouvernorat est obligatoire.")]
        public string Gouvernorat { get; set; }

        [Required(ErrorMessage = "La ville est obligatoire.")]
        public string Ville { get; set; }

        public string? Statut { get; set; }

        [StringLength(500, ErrorMessage = "La description ne peut pas dépasser 500 caractères.")]
        public string Description { get; set; }


        [ForeignKey("User")]
        public int Id_User { get; set; }

        public User User { get; set; }

        public ICollection<Demande> Demandes { get; set; }
    }
}
