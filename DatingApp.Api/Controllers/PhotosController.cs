using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.Api.Data;
using DatingApp.Api.Dtos;
using DatingApp.Api.Helpers;
using DatingApp.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.Api.Controllers
{

    [Authorize]
    [Route("api/users/{userId}/photos")]
    [ApiController]
    public class PhotosController : Controller
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinarySettings;
        private Cloudinary _cloudinary;

        public PhotosController(IDatingRepository repo, IMapper mapper, IOptions<CloudinarySettings> cloudinarySettings)
        {
            _cloudinarySettings = cloudinarySettings;
            _mapper = mapper;
            _repo = repo;

            //Setup Cloudinary
            Account cloudinaryAccount = new Account(_cloudinarySettings.Value.CloudName,_cloudinarySettings.Value.ApiKey,
            _cloudinarySettings.Value.ApiSecret);

            _cloudinary = new Cloudinary(cloudinaryAccount);
        }

        [HttpGet("{id}",Name="GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id) {

            var photoFromRepo = await _repo.GetPhoto(id);

            var photoToReturn = _mapper.Map<PhotoToReturnDto>(photoFromRepo);

            return Ok(photoToReturn);
        }


        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, [FromForm]PhotoForCreationDto photoForCreationDto)
        {
              //Check if the claim for NameIdentifier/(The users db Id) parsed to an int matches the Id
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                return Unauthorized();
            }

            //getting change tracked user from the db
            var userFromRepo = await _repo.GetUser(userId);

            //get the file
            var file  = photoForCreationDto.File;

            //get the cloudinary action result
            var result = new ImageUploadResult();

            if(file.Length > 0){

                using(var stream = file.OpenReadStream()){

                    var uploadParams = new ImageUploadParams();
                    uploadParams.File = new FileDescription(file.Name, stream);
                    //uploadParams.Transformation = new Transformation().Width("500").Height("500").Crop("Fill").Gravity("Face");
                    result = _cloudinary.Upload(uploadParams);
                }
            }

            photoForCreationDto.Url = result.Uri.ToString();
            photoForCreationDto.PublicId = result.PublicId.ToString();

            var photo = _mapper.Map<Photo>(photoForCreationDto);

            if(!userFromRepo.Photos.Any(x=> x.IsMain)){
                photo.IsMain = true;
            }

            userFromRepo.Photos.Add(photo);

           

            if(await _repo.SaveAll()){
                
                var photoToReturn = _mapper.Map<PhotoToReturnDto>(photo);
                return CreatedAtRoute("GetPhoto",new{Id = photoToReturn.Id}, photoToReturn);
            }

            return BadRequest("Could not add photo!");


        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId, int id){

               //Check if the claim for NameIdentifier/(The users db Id) parsed to an int matches the Id
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                return Unauthorized();
            }

            //getting change tracked user from the db
            var userFromRepo = await _repo.GetUser(userId);

            if(!userFromRepo.Photos.Any(p => p.Id == id))
               return Unauthorized();

            var photoFromRepo = await _repo.GetPhoto(id);

            if(photoFromRepo.IsMain)
               return BadRequest("This is already your main photo");

            var currentMainPhoto = await _repo.GetMainPhotoForUser(userId);

            if(currentMainPhoto != null){
                currentMainPhoto.IsMain = false;
            }

            if(photoFromRepo != null){
                photoFromRepo.IsMain =true;
            }

            if(await _repo.SaveAll()){
                return NoContent();
            }

            return BadRequest("There was an issue with changing the photo please try again");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id){

                     //Check if the claim for NameIdentifier/(The users db Id) parsed to an int matches the Id
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                return Unauthorized();
            }

            //getting change tracked user from the db
            var userFromRepo = await _repo.GetUser(userId);

            if(!userFromRepo.Photos.Any(p => p.Id == id))
               return Unauthorized();

            var photoFromRepo = await _repo.GetPhoto(id);

            if(photoFromRepo.IsMain)
               return BadRequest("This is your main photo you cannot delete this");

            if(photoFromRepo.PublicId != null){

            var deletionParams = new DeletionParams(photoFromRepo.PublicId);
            var result = _cloudinary.Destroy(deletionParams);

            if(result.Result == "ok"){
                _repo.Delete(photoFromRepo);
            }

            }

            if(photoFromRepo.PublicId == null){
                _repo.Delete(photoFromRepo);
            }

            if(await _repo.SaveAll()){
                return Ok();
            }

            return BadRequest("There was an issue deleting the photo please try again!");
        }
    }
}