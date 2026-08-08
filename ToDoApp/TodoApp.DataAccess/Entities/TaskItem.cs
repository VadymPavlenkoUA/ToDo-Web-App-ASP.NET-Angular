using System;
using System.Collections.Generic;
using System.Text;

namespace TodoApp.DataAccess.Entities
{
    public class TaskItem
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public bool IsCompleted { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? DueDate { get; set; }

        public int UserId { get; set; }

        public User User { get; set; } = null!;

        public int? CategoryId { get; set; }

        public Category? Category { get; set; }
    }
}
