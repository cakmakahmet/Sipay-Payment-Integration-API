using Microsoft.AspNetCore.Mvc;

namespace sipaydemo.Controllers.Controllers
{
    public class SipayCallbackControllers
    {
        [Route("")]
        public class SipayCallbackController : Controller
        {
            [HttpGet("return")]
            public IActionResult PaymentSuccess()
            {
                return Content("Ödeme başarılı! Sipay tarafından yönlendirildiniz.");

            }
            [HttpGet("cancel")]
            public IActionResult PaymentCancelled()
            {
                return Content("Ödeme iptal edildi.Sipay tarafından yönlendirildiniz");
            }
        }
    }
}
