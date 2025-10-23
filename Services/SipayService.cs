using System.Net.Http;
using System.Net.WebSockets;
using System.Runtime.CompilerServices;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Newtonsoft.Json;
using sipaydemo.Models;

namespace sipaydemo.Services
{
    public class SipayService
    {
        private readonly HttpClient _httpClient;

        public SipayService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://sipayintegration.free.beeceptor.com");
        }
        public async Task<string> PaySmart3DAsync(PaymentRequest request)
        {
            var json = JsonConvert.SerializeObject(new[] { request });
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("https://sipayintegration.free.beeceptor.com", content);
            return await response.Content.ReadAsStringAsync();
        }
    }
}
