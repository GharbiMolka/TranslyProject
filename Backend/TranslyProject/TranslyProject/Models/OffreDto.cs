namespace TranslyProject.Models
{
    public class OffreDto
    {
        public int PrixPropose { get; set; }
        public int DelaiLivraison { get; set; }
        public string Statut { get; set; } 
        public int Id_Demande { get; set; }

        public string? PriseEnCharge { get; set; }
    }
}
