using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TranslyProject.Models
{
    public class Offre
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdOffre { get; set; }

        [Required(ErrorMessage = "Le prix proposé est obligatoire.")]
        public int PrixPropose { get; set; }

        [Required(ErrorMessage = "Le délai de livraison est obligatoire.")]
        public int DelaiLivraison { get; set; }

        [Required(ErrorMessage = "Le statut est obligatoire.")]
        [StringLength(20)]
        public string Statut { get; set; } 

        [Required(ErrorMessage = "La date de l'offre est obligatoire.")]
        public DateTime DateOffre { get; set; }

        // Relation avec Demande
        [ForeignKey("Demande")]
        public int Id_Demande { get; set; }
        [JsonIgnore]
        public Demande Demande { get; set; }

        // Relation avec User
        [ForeignKey("User")]
        public int Id_User { get; set; }
        [JsonIgnore]
        public User User { get; set; }
    }
}
