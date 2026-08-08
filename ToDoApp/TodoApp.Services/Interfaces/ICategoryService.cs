using System;
using System.Collections.Generic;
using System.Text;
using TodoApp.Services.DTOs.Categories;

namespace TodoApp.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryResponse>> GetAllAsync(int userId);

        Task<CategoryResponse?> GetByIdAsync(int id, int userId);

        Task<CategoryResponse> CreateAsync(CreateCategoryRequest request, int userId);

        Task<bool> UpdateAsync(int id, UpdateCategoryRequest request, int userId);

        Task<bool> DeleteAsync(int id, int userId);
    }
}
