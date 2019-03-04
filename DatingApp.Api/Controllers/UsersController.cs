using System;
using System.Collections;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Api.Data;
using DatingApp.Api.Dtos;
using DatingApp.Api.Helpers;
using DatingApp.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController: Controller
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;

        public UsersController(IDatingRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers(int pageNumber, int pageSize, string gender,bool likers, bool likees, int maxAge = 99, int minAge = 18){

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var currentUser = await _repo.GetUser(currentUserId);

            var userParams = new UserParams{
            PageNumber= pageNumber,
            PageSize= pageSize,
            Gender = gender,
            MaxAge = maxAge,
            MinAge = minAge,
            Likees = likees,
            Likers = likers
            };

            userParams.UserId = currentUserId;

            if(string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = (currentUser.Gender == "male") ? "female" : "male";
            }

            var users = await _repo.GetUsers(userParams);

            if(users == null){
                return NotFound();
            }

            var mappedUsers = _mapper.Map<IEnumerable<UserForListDto>>(users);

            Response.AddPagination(users.CurrentPage, users.TotalCount, users.TotalPages, users.PageSize);

            return Ok(mappedUsers);
        }

        [HttpGet("{id}",Name="GetUser")]
        public async Task<IActionResult> GetUser(int id){

            var user = await _repo.GetUser(id);

            var mappedUser = _mapper.Map<UserForDetailedDto>(user);

            return Ok(mappedUser);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto){

            //Check if the claim for NameIdentifier/(The users db Id) parsed to an int matches the Id
            if(id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                return Unauthorized();
            }

            //getting change tracked user from the db
            var userFromRepo = await _repo.GetUser(id);

            //automapper map dto into userFromrepo
            _mapper.Map(userForUpdateDto,userFromRepo);

            try{
                await _repo.SaveAll();
                return NoContent();
            }catch(Exception e){
                throw new System.Exception($"There was a problem updating member with id: {id}, System Message {e.Message}");
            }
        }

        [HttpPost("{id}/like/{recipientId}")]
        public async Task<IActionResult> LikeUser(int id, int recipientId)
        {
            //Check if the claim for NameIdentifier/(The users db Id) parsed to an int matches the Id
            if(id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                return Unauthorized();
            }

            var like = await _repo.GetLike(id, recipientId);

            if(like != null)
                return BadRequest("You already liked this user");

            if(await _repo.GetUser(recipientId) == null){
                return NotFound($"User with id {recipientId} does not exist");
            }

            var l = new Like{
                LikerId = id,
                LikeeId = recipientId
            };

            _repo.Add<Like>(l);
            if(await _repo.SaveAll()){
                return Ok();
            }

            return BadRequest("There was a problem saving this like");
        }
    }
}