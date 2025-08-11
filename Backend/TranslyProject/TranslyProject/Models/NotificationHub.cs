namespace TranslyProject.Models
{
    using Microsoft.AspNetCore.SignalR;
    using System.Threading.Tasks;
    using System;

    public class NotificationHub : Hub
    {
        public const string ClientGroup = "Client";
        public const string FournisseurGroup = "Fournisseur";

       
        public async Task JoinGroup(string groupName)
        {
            Console.WriteLine($"Connexion {Context.ConnectionId} rejoint le groupe {groupName}");
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }

        public async Task LeaveGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }

        public async Task JoinFournisseurGroup()
        {
            await JoinGroup(FournisseurGroup);
        }

        public async Task JoinClientGroup()
        {
            await JoinGroup(ClientGroup);
        }
    }
}
