using System;
using System.Collections.Generic;
using System.Text;

namespace TodoApp.DataAccess.Entities
{
    public class User
    {
        public int Id { get; set; }

        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();

        public ICollection<Category> Categories { get; set; } = new List<Category>();
    }
}
