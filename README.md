# Transly 🚚

Transly est une application complète de gestion des livraisons développée avec .Net et Angular,conçue pour simplifier le processus de livraison entre le client,le fournisseur et le transporteur.  
Ce projet a été réalisé dans le cadre  de mon stage de 1 ere année cycle ingénieur **Stage d'immersion en entreprise**, mettant l'accent sur le développement web avancé.

---

## ✨ Fonctionnalités

### **Fonctionnalités principales**
- 🔐 **Authentification sécurisée** : Connexion, inscription et gestion de profil  
- 🧾 **Gestion des commandes** : Opérations CRUD complètes avec recherche et filtrage  
- 🚚 **Gestion des demandes de livraison** : Création et gestion des demandes de livraisons .
- 📨 **Gestion des Offres de livraison** : Création et gestion des offres de livraisons.
- ⏳  **Gestion de la prise en charge d’une commande** : Confirmation ou refus de la prise en charge d'une commande.
  
---
## 🛠️ Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/yourusername/translyproject.git
   cd translyproject
2. **Configurer la base de données**
   -Ouvre le fichier appsettings.json ou appsettings.Development.json
   -Modifie la chaîne de connexion pour ton SQL Server :
    ```bash
   "ConnectionStrings": {
   "DefaultConnection": "Server=localhost;Database=NomDeTaBase;User Id=ton_utilisateur;Password=ton_motdepasse;Trusted_Connection=False;MultipleActiveResultSets=true"
   }
  
4. **Appliquer les migrations**
   ```bash
    dotnet ef database update
4. **Lancer l'application**
   ```bash
   dotnet run
   
## 💻 Technologies utilisées

### Backend
![.NET](https://img.shields.io/badge/-.NET%208.0-blueviolet?logo=dotnet)
![C#](https://img.shields.io/badge/C%23-239120?logo=unity&logoColor=white&style=flat)

### Base de données
![SQL Server](https://img.shields.io/badge/Microsoft_SQL_Server-CC2927)

### Frontend
![Angular](https://img.shields.io/badge/Angular-DD0031?logo=angular&logoColor=fff&style=flat)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap)

### Outils
![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white)
