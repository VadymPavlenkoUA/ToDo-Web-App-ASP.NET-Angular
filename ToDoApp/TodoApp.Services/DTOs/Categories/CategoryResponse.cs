using System;
using System.Collections.Generic;
using System.Text;

namespace TodoApp.Services.DTOs.Categories
{
    public class CategoryResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
