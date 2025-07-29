import { Routes ,RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { Login } from './pages/login/login';
import { NgModule } from '@angular/core';
import { Dashboardfournisseur } from './fournisseur/dashboardfournisseur/dashboardfournisseur';
import { Dashboardclient } from './client/dashboardclient/dashboardclient';
import { Dashboardtransporteur } from './transporteur/dashboardtransporteur/dashboardtransporteur';


import { ListeCommandes } from './commande/liste-commandes/liste-commandes';

import { AddCommande } from './commande/add-commande/add-commande';
import { RegisterComponent } from './pages/register/register';
import { EditUser } from './user/edit-user/edit-user';
import { DetailUser } from './user/detail-user/detail-user';
import { ListeCommandesFournisseur } from './commande/liste-commandes-fournisseur/liste-commandes-fournisseur';
import { AddDemande } from './demande/add-demande/add-demande';
import { ListeDemande } from './demande/list-demande/list-demande';
import { DetailsDemande } from './demande/details-demande/details-demande';
import { EditDemande } from './demande/edit-demande/edit-demande';
import { DeleteDemande } from './demande/delete-demande/delete-demande';
import { ListDemandeTransporteur } from './demande/list-demande-transporteur/list-demande-transporteur';
import { AddOffre } from './offre/add-offre/add-offre';
import { ListOffre } from './offre/list-offre/list-offre';
import { Oubliermdp } from './pages/mdp/oubliermdp/oubliermdp';
import { Reinisialisermdp } from './pages/mdp/reinisialisermdp/reinisialisermdp';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: Login },
  { path: 'dashboardfournisseur', component: Dashboardfournisseur },
  { path: 'dashboardclient', component: Dashboardclient },
  { path: 'register', component: RegisterComponent },
  { path: 'oubliermdp', component: Oubliermdp},
  { path: 'reinisialiermdp', component: Reinisialisermdp },


  
  {
    path: 'dashboardfournisseur',
    component: Dashboardfournisseur,
    children: [
    
       { path: 'edit-user/:id', component: EditUser },
       {path: 'detail-user/:id',component: DetailUser},
       {path: 'list-commande-fournisseur',component: ListeCommandesFournisseur},
       {path: 'add-demande/:id',component:AddDemande},
       {path: 'list-demande',component:ListeDemande},
       {path: 'detail-demande/:id',component:DetailsDemande},
       {path: 'edit-demande/:id',component:EditDemande},
       {path: 'delete-demande/:id',component:DeleteDemande},
  
  
  
    ]
  },

  {
    path: 'dashboardclient',
    component: Dashboardclient,
    children: [
        { path: 'add-commande', component: AddCommande },
        { path: 'liste-commandes', component: ListeCommandes },
        { path: 'edit-user/:id', component: EditUser },
        {path: 'detail-user/:id',component: DetailUser}
    ]
  },


   {
    path: 'dashboardtransporteur',
    component: Dashboardtransporteur,
    children: [
        { path: 'edit-user/:id', component: EditUser },
        {path: 'detail-user/:id',component: DetailUser},
        {path: 'liste-demande',component:ListDemandeTransporteur},
        {path: 'add-offre/:id',component:AddOffre},
        {path: 'liste-offre',component:ListOffre},
    ]
  },

  

   




];






@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }