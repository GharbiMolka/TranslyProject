using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TranslyProject.Models
{
    public class Demande
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required(ErrorMessage = "La date de demande est obligatoire.")]
        [DataType(DataType.Date)]
        public DateTime DateDemande { get; set; }

        [Required(ErrorMessage = "L'adresse d'enlèvement est obligatoire.")]
        public string AdresseEnlevement { get; set; }

        [Required(ErrorMessage = "L'adresse de livraison est obligatoire.")]
        public string AdresseLivraison { get; set; }

        [Required(ErrorMessage = "La date souhaitée est obligatoire.")]
        [DataType(DataType.Date)]
        public DateTime DateSouhaitee { get; set; }

       
        public string? Statut { get; set; }


        [ForeignKey("Commande")]
        public int Id_Commande { get; set; }
        [JsonIgnore]
        public Commande Commande { get; set; }

    
        [ForeignKey("User")]
        public int Id_User { get; set; }
        [JsonIgnore]
        public User User { get; set; }

        [JsonIgnore]
        public  ICollection<Offre> Offres { get; set; }
    }
}
