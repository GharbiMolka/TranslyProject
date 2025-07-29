using System.Net;
using System.Net.Mail;

using System.Threading.Tasks;
namespace TranslyProject.Services
{
    public class EmailService : IEmailService
    {
        public async Task SendAsync(string to, string subject, string body)
        {
            var fromAddress = new MailAddress("gharbimolka4@gmail.com", "Transly");
            var toAddress = new MailAddress(to);
            const string fromPassword = "eyyc pzmx pflc dngz"; 

            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            };

            using (var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            })
            {
                await smtp.SendMailAsync(message);
            }
        }
    }
}
