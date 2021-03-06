using System;
using System.Collections.Generic;
using DatingApp.API.Models;

namespace DatingApp.Api.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string KnownAs { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public string Introduction { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }

        // Collection - Navigations
        public ICollection<Photo> Photos { get; set; }

        // Likers = People who have liked you
        public ICollection<Like> Likers {get;set;}

        // Likees = People you have liked
        public ICollection<Like> Likees { get; set; } 

        public ICollection<Message> MessagesSent {get;set;}
        public ICollection<Message> MessagesRecieved { get; set; }
    }
}