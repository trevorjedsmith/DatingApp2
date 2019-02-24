using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace DatingApp.Api.Helpers
{
    public static class Extensions
    {
        public static void AppApplicationError(this HttpResponse response, string message)
        {
            response.Headers.Add("Application-Error",message);
            response.Headers.Add("Access-Control-Expose-Headers","Application-Error");
            response.Headers.Add("Access-Control-Expose-Origin","*");
        }

        public static void AddPagination(this HttpResponse response, int currentPage, 
        int totalItems, int totalPages, int itemsPerPage ){

            var pagination = new PaginationHeader(currentPage,itemsPerPage,totalPages,totalItems);

            var camelCaseFormatter = new JsonSerializerSettings();
            camelCaseFormatter.ContractResolver = new CamelCasePropertyNamesContractResolver();

            response.Headers.Add("Pagination", JsonConvert.SerializeObject(pagination,camelCaseFormatter));
            response.Headers.Add("Access-Control-Expose-Headers","Pagination");
        }

        public static int CalculateAge(this DateTime theDateTime)
        {
            var date = DateTime.Today.Year - theDateTime.Year;

            if(DateTime.Today.AddYears(date) > DateTime.Today)
            date--;

            return date;
        }
    }
}