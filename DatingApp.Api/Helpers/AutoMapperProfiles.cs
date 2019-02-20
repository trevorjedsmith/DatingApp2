using System.Linq;
using AutoMapper;
using DatingApp.Api.Dtos;
using DatingApp.Api.Models;

namespace DatingApp.Api.Helpers
{
    public class AutoMapperProfiles: Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDto>()
                .ForMember(dest=> dest.PhotoUrl, opt=>{
                    opt.MapFrom(src=> src.Photos.FirstOrDefault(x=> x.IsMain).Url);
                })
                .ForMember(destinationMember=> destinationMember.Age, opt=>{
                    opt.MapFrom(src=> src.DateOfBirth.CalculateAge());
                });
                            CreateMap<User,UserForDetailedDto>()
                              .ForMember(dest=> dest.PhotoUrl, opt=>{
                    opt.MapFrom(src=> src.Photos.FirstOrDefault(x=> x.IsMain).Url);
                })  
                .ForMember(destinationMember=> destinationMember.Age, opt=>{
                    opt.MapFrom(src=> src.DateOfBirth.CalculateAge());
                });
            CreateMap<Photo,PhotosForDetailedDto>();
            CreateMap<UserForUpdateDto,User>();
            CreateMap<Photo,PhotoToReturnDto>();
            CreateMap<PhotoForCreationDto,Photo>();
            CreateMap<UserForRegisterDto,User>();
        }
    }
}