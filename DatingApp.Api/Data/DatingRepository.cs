using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.Api.Helpers;
using DatingApp.Api.Models;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Api.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;

        public DatingRepository(DataContext context)
        {
            _context = context;
        }

        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes
            .FirstOrDefaultAsync(u=> u.LikerId == userId && u.LikeeId == recipientId);
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
           var user =  await _context.Users.Where(p => p.Id == userId).FirstOrDefaultAsync();

           if(user != null)
              return user.Photos.FirstOrDefault(x=> x.IsMain);

           return null;
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(x=> x.Id == id);

            return photo;
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(x=> x.Photos).FirstOrDefaultAsync(x=> x.Id == id);

            return user;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users = _context.Users.Include(p => p.Photos)
                .OrderByDescending(u => u.LastActive).AsQueryable();

            users = users.Where(u => u.Id != userParams.UserId);

            users = users.Where(u => u.Gender == userParams.Gender);

            if (userParams.Likers)
            {
                var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikers.Contains(u.Id));
            }

            if (userParams.Likees)
            {
                var userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikees.Contains(u.Id));
            }

            if (userParams.MinAge != 18 || userParams.MaxAge != 99)
            {
                var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var maxDob = DateTime.Today.AddYears(-userParams.MinAge);

                users = users.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
            }

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        private async Task<IEnumerable<int>> GetUserLikes(int id, bool liker)
        {

            //Likers - people who have like you
            //Likees - people you have liked

            var user = await _context.Users
                                     .Include(x=> x.Likers)
                                     .Include(x=> x.Likees)
                                     .FirstOrDefaultAsync(x=> x.Id == id);

            if(liker)
            {
                return user.Likers.Where(x=> x.LikeeId == id).Select(x=> x.LikerId);
            }
            else
            {
                return user.Likees.Where(x=> x.LikerId == id).Select(x=> x.LikeeId);
            }

        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Message> GetMessage(int id)
        {
           return await _context.Messages.FirstOrDefaultAsync(x=> x.Id == id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var messages = _context.Messages.Include(u=> u.Sender).ThenInclude(u=> u.Photos)
                           .Include(u=> u.Recipient).ThenInclude(u=> u.Photos).AsQueryable();

            switch(messageParams.MessageContainer){
                case "Inbox":
                messages = messages.Where(x=> x.RecipientId == messageParams.UserId);
                break;
                case "Outbox":
                messages = messages.Where(x=> x.SenderId == messageParams.UserId);
                break;
                default:
                messages = messages.Where(x=> x.RecipientId == messageParams.UserId && x.IsRead == false);
                break;
            }

            messages = messages.OrderByDescending(d=> d.MessageSent);
            return await PagedList<Message>.CreateAsync(messages,messageParams.PageNumber,messageParams.PageSize);
        }

         public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
             var messages = await _context.Messages.Include(u=> u.Sender).ThenInclude(u=> u.Photos)
                           .Include(u=> u.Recipient).ThenInclude(u=> u.Photos)
                           .Where(x=> x.RecipientId == userId && x.SenderId == recipientId ||
                           x.RecipientId == recipientId && x.SenderId == userId)
                           .OrderByDescending(m=> m.MessageSent)
                           .ToListAsync();

                           return messages;


        }
    }
}