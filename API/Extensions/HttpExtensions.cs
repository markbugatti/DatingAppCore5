using System.Text.Json;
using API.Helpers;
using Microsoft.AspNetCore.Http;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        private static string _pagination = "Pagination";
        private static string _accessControlExposeHeaders = "Access-Control-Expose-Headers";
        private static JsonSerializerOptions _options;

        static HttpExtensions()
        {
            _options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
        }

        public static void AddPaginationHeader(this HttpResponse response, int currentPage, int itemsPerPage,
            int totalItems, int totalPages)
        {
            var paginationHeader = new PaginationHeader
            {
                CurrentPage = currentPage,
                ItemsPerPage = itemsPerPage,
                TotalItems = totalItems,
                TotalPages = totalPages
            };
            response.Headers.Add(_pagination, JsonSerializer.Serialize(paginationHeader, _options));
            response.Headers.Add(_accessControlExposeHeaders, _pagination);
        }
    }
}