using Microsoft.AspNetCore.Mvc;

namespace crokinole.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Play()
        {
            return View();
        }
    }
}