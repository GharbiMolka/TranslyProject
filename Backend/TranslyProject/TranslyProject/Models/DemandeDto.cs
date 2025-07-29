namespace TranslyProject.Models
{
    public class DemandeDto
    {
        public string AdresseEnlevement { get; set; }
        public string AdresseLivraison { get; set; }
        public DateTime DateSouhaitee { get; set; }
        public string Statut { get; set; }
        public int Id_Commande { get; set; }
    }
}
