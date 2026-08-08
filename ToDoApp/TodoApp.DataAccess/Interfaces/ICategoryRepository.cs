using System;
using System.Collections.Generic;
using System.Text;
using TodoApp.DataAccess.Entities;

namespace TodoApp.DataAccess.Interfaces
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> GetAllAsync(int userId);

        Task<Category?> GetByIdAsync(int id, int userId);

        Task<Category> CreateAsync(Category category);

        Task UpdateAsync(Category category);

        Task DeleteAsync(Category category);
    }
}
