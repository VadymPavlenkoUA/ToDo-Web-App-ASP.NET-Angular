using System;
using System.Collections.Generic;
using System.Text;
using TodoApp.DataAccess.Entities;

namespace TodoApp.DataAccess.Interfaces
{
    public interface ITaskRepository
    {
        Task<(IEnumerable<TaskItem> Items, int TotalCount)> GetPagedAsync(
            int userId,
            string? search,
            int? categoryId,
            int pageNumber,
            int pageSize);

        Task<TaskItem?> GetByIdAsync(int id, int userId);

        Task<TaskItem> CreateAsync(TaskItem task);

        Task UpdateAsync(TaskItem task);

        Task DeleteAsync(TaskItem task);
    }
}
