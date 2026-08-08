using System;
using System.Collections.Generic;
using System.Text;

namespace TodoApp.Services.DTOs.Tasks
{
    public class TaskListResponse
    {
        public IEnumerable<TaskResponse> Items { get; set; } = [];
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}
