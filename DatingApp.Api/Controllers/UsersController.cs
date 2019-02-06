using System;
using System.Collections;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Api.Data;
using DatingApp.Api.Dtos;
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
        public async Task<IActionResult> GetUsers(){

            var users = await _repo.GetUsers();

            if(users == null){
                return NotFound();
            }

            var mappedUsers = _mapper.Map<IEnumerable<UserForListDto>>(users);

            return Ok(mappedUsers);
        }

        [HttpGet("{id}")]
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
    }
}