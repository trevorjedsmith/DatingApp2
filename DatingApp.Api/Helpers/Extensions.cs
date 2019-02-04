using System;
using Microsoft.AspNetCore.Http;

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

        public static int CalculateAge(this DateTime theDateTime)
        {
            var date = DateTime.Today.Year - theDateTime.Year;

            if(DateTime.Today.AddYears(date) > DateTime.Today)
            date--;

            return date;
        }
    }
}