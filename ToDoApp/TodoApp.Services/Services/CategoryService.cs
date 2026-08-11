using TodoApp.DataAccess.Entities;
using TodoApp.DataAccess.Interfaces;
using TodoApp.Services.DTOs.Categories;
using TodoApp.Services.Interfaces;

namespace TodoApp.Services.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<IEnumerable<CategoryResponse>> GetAllAsync(int userId)
        {
            var categories = await _categoryRepository.GetAllAsync(userId);

            return categories.Select(category => new CategoryResponse
            {
                Id = category.Id,
                Name = category.Name
            });
        }

        public async Task<CategoryResponse?> GetByIdAsync(int id, int userId)
        {
            var category = await _categoryRepository.GetByIdAsync(id, userId);

            if (category is null)
            {
                return null;
            }

            return new CategoryResponse
            {
                Id = category.Id,
                Name = category.Name
            };
        }

        public async Task<CategoryResponse> CreateAsync(CreateCategoryRequest request, int userId)
        {
            var category = new Category
            {
                Name = request.Name,
                UserId = userId
            };

            await _categoryRepository.CreateAsync(category);

            return new CategoryResponse
            {
                Id = category.Id,
                Name = category.Name
            };
        }

        public async Task<bool> UpdateAsync(int id, UpdateCategoryRequest request, int userId)
        {
            var category = await _categoryRepository.GetByIdAsync(id, userId);

            if (category is null)
            {
                return false;
            }

            category.Name = request.Name;
            await _categoryRepository.UpdateAsync(category);

            return true;
        }

        public async Task<bool> DeleteAsync(int id, int userId)
        {
            var category = await _categoryRepository.GetByIdAsync(id, userId);

            if (category is null)
            {
                return false;
            }

            await _categoryRepository.DeleteAsync(category);

            return true;
        }
    }
}
