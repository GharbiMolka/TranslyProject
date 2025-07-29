using Microsoft.EntityFrameworkCore;

using TranslyProject.Models;
namespace TranslyProject.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options){}
        public DbSet<User> Users { get; set; }
        public DbSet<Demande> Demandes { get; set; }
        public DbSet<Commande> Commandes { get; set; }
        public DbSet<Offre> Offres { get; set; }

        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // 📦 Commande → User
            modelBuilder.Entity<Commande>()
                .HasOne(c => c.User)
                .WithMany(u => u.Commandes)
                .HasForeignKey(c => c.Id_User)
                .OnDelete(DeleteBehavior.Restrict);

            // 📥 Demande → User
            modelBuilder.Entity<Demande>()
                .HasOne(d => d.User)
                .WithMany(u => u.Demandes)
                .HasForeignKey(d => d.Id_User)
                .OnDelete(DeleteBehavior.Restrict);

            // 📥 Demande → Commande
            modelBuilder.Entity<Demande>()
                .HasOne(d => d.Commande)
                .WithMany(c => c.Demandes)
                .HasForeignKey(d => d.Id_Commande)
                .OnDelete(DeleteBehavior.Restrict);

            // 📝 Offre → User
            modelBuilder.Entity<Offre>()
                .HasOne(o => o.User)
                .WithMany(u => u.Offres)
                .HasForeignKey(o => o.Id_User)
                .OnDelete(DeleteBehavior.Restrict);

            // 📝 Offre → Demande
            modelBuilder.Entity<Offre>()
                .HasOne(o => o.Demande)
                .WithMany(d => d.Offres)
                .HasForeignKey(o => o.Id_Demande)
                .OnDelete(DeleteBehavior.Restrict);

            base.OnModelCreating(modelBuilder);
        }

    }



}
