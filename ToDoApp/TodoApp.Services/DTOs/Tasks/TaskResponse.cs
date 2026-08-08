using System;
using System.Collections.Generic;
using System.Text;

namespace TodoApp.Services.DTOs.Tasks
{
    public class TaskResponse
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? DueDate { get; set; }
        public int? CategoryId { get; set; }
        public string? CategoryName { get; set; }
    }
}
