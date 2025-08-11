import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private hubConnection!: signalR.HubConnection;

  private clientNotifications = new BehaviorSubject<string[]>([]);
  private fournisseurNotifications = new BehaviorSubject<string[]>([]);

  public clientNotifications$ = this.clientNotifications.asObservable();
  public fournisseurNotifications$ = this.fournisseurNotifications.asObservable();

  constructor() {}

  public startConnection(userId?: number, role?: string): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7267/notificationHub', {
        withCredentials: true, // ok si tu utilises cookie-based auth ou CORS + credentials
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connecté avec succès');
        console.log(`Rôle: ${role}, UserID: ${userId}`);

        if (role?.toLowerCase() === 'client' && userId) {
          const groupName = `client-${userId}`;
          console.log(`📡 Envoi de la demande de rejoindre le groupe ${groupName}`);
          this.hubConnection.invoke('JoinGroup', groupName)
            .then(() => console.log(`Rejoint le groupe ${groupName}`))
            .catch(err => console.error('Erreur JoinGroup (Client) :', err));
        } else if (role?.toLowerCase() === 'fournisseur') {
          console.log(`📡 Rejoint le groupe Fournisseur`);
          this.hubConnection.invoke('JoinGroup', 'Fournisseur')
            .then(() => console.log(` Rejoint le groupe Fournisseur`))
            .catch(err => console.error('Erreur JoinGroup (Fournisseur) :', err));
        } else {
          console.warn('⚠️ Rôle inconnu ou manquant. Aucun groupe rejoint.');
        }
      })
      .catch(err => console.error('Erreur SignalR :', err));

    this.hubConnection.on('ReceiveClientNotification', (message: string) => {
      console.log(' Notification client reçue :', message);
      const current = this.clientNotifications.value;
      this.clientNotifications.next([message, ...current]);
    });

    this.hubConnection.on('ReceiveNotification', (message: string) => {
      console.log('Notification fournisseur reçue :', message);
      const current = this.fournisseurNotifications.value;
      this.fournisseurNotifications.next([message, ...current]);
    });
  }
}
