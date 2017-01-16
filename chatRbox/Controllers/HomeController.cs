using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace chatRbox.Controllers
{
    //[Route("{action = index}")]
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index(string boxId)
        {            
            if (string.IsNullOrEmpty(boxId)) //TO DO if page is refreshed generate new
            {
                //Create new room
                var newBoxId = CreateRandomBoxId();

                return RedirectToAction("Index", new { boxId = newBoxId });
            }
            return View();
        }

        private string CreateRandomBoxId() {
            //string id = string.Empty;

            //http://stackoverflow.com/questions/1344221/how-can-i-generate-random-alphanumeric-strings-in-c
            var random = new Random();
            var length = 5;
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());

            //return id;

        }
    }
}