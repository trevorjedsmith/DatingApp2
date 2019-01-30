using System.ComponentModel.DataAnnotations;

namespace DatingApp.Api.Dtos
{
   
    public class UserForLoginDto
    {
        public string Username { get; set; }

        [MinLength(3)]
        public string Password { get; set; }
    }
}