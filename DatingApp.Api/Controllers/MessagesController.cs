using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Api.Data;
using DatingApp.Api.Dtos;
using DatingApp.Api.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Api.Controllers
{
    [Authorize]
     [Route("api/users/{userId}/messages")]
    [ApiController]
    public class MessagesController :  Controller
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;

        public MessagesController(IDatingRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser(int userId, [FromQuery]MessageParams messageParams){
 //Check if the claim for NameIdentifier/(The users db Id) parsed to an int matches the Id
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                return Unauthorized();
            }

            messageParams.UserId = userId;

            var messagesFromRepo = await _repo.GetMessagesForUser(messageParams);

            var messages = _mapper.Map<IEnumerable<MessageToReturnDto>>(messagesFromRepo);

             Response.AddPagination(messagesFromRepo.CurrentPage, messagesFromRepo.TotalCount, messagesFromRepo.TotalPages, messagesFromRepo.PageSize);

             return Ok(messages);

        }

        [HttpGet("thread/{recipientId}")]
        public async Task<IActionResult> GetMessageThread(int userId, int recipientId){
              //Check if the claim for NameIdentifier/(The users db Id) parsed to an int matches the Id
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                return Unauthorized();
            }

            var messageFromRepo = await _repo.GetMessageThread(userId, recipientId);

            var messagesToReturn = _mapper.Map<IEnumerable<MessageToReturnDto>>(messageFromRepo);

            return Ok(messagesToReturn);
        }

        [HttpGet("{id}",Name="GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id)
        {
             //Check if the claim for NameIdentifier/(The users db Id) parsed to an int matches the Id
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                return Unauthorized();
            }

            //get message from repo using primary key
            var messageFromRepo = await _repo.GetMessage(id);

            //return 404 if message not found
            if(messageFromRepo == null){
                return NotFound();
            }

            //return  200 with message
            return Ok(messageFromRepo);

        }

        [HttpPost()]
        public async Task<IActionResult> CreateMessage(int userId, MessageForCreationDto messageForCreationDto)
        {

            //Check if the claim for NameIdentifier/(The users db Id) parsed to an int matches the Id
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                return Unauthorized();
            }

            messageForCreationDto.SenderId = userId;

            var recipient = await _repo.GetUser(messageForCreationDto.RecipientId);

            if(recipient == null){
                return BadRequest("Could not find user");
            }
            
            var message = _mapper.Map<Message>(messageForCreationDto);

            _repo.Add(message);

            var messageToToReturn = _mapper.Map<MessageForCreationDto>(message);

            if(await _repo.SaveAll()){
                return CreatedAtRoute("GetMessage",new{id=message.Id},messageToToReturn);
            }

            throw new Exception($"There has been an error saving this message");
        }
    }
}