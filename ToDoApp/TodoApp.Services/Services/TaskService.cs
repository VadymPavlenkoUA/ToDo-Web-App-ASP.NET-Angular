using TodoApp.DataAccess.Entities;
using TodoApp.DataAccess.Interfaces;
using TodoApp.Services.DTOs.Tasks;
using TodoApp.Services.Interfaces;

namespace TodoApp.Services.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _taskRepository;
        private readonly ICategoryRepository _categoryRepository;

        public TaskService(ITaskRepository taskRepository, ICategoryRepository categoryRepository)
        {
            _taskRepository = taskRepository;
            _categoryRepository = categoryRepository;
        }

        public async Task<TaskListResponse> GetTasksAsync(int userId, string? search, int? categoryId,
            int pageNumber, int pageSize)
        {
            if (pageNumber < 1)
            {
                pageNumber = 1;
            }

            if (pageSize < 1)
            {
                pageSize = 10;
            }

            var result = await _taskRepository.GetPagedAsync(userId, search, categoryId, pageNumber, pageSize);
            var items = result.Items.Select(task => new TaskResponse
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                IsCompleted = task.IsCompleted,
                CreatedAt = task.CreatedAt,
                DueDate = task.DueDate,
                CategoryId = task.CategoryId,
                CategoryName = task.Category?.Name
            });

            return new TaskListResponse
            {
                Items = items,
                TotalCount = result.TotalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<TaskResponse?> GetByIdAsync(int id, int userId)
        {
            var task = await _taskRepository.GetByIdAsync(id, userId);

            if (task is null)
            {
                return null;
            }

            return new TaskResponse
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                IsCompleted = task.IsCompleted,
                CreatedAt = task.CreatedAt,
                DueDate = task.DueDate,
                CategoryId = task.CategoryId,
                CategoryName = task.Category?.Name
            };
        }

        public async Task<TaskResponse> CreateAsync(CreateTaskRequest request, int userId)
        {
            if (request.CategoryId.HasValue)
            {
                var category = await _categoryRepository.GetByIdAsync(request.CategoryId.Value, userId);

                if (category is null)
                {
                    throw new InvalidOperationException("Category not found.");
                }
            }

            var task = new TaskItem
            {
                Title = request.Title,
                Description = request.Description,
                IsCompleted = false,
                CreatedAt = DateTime.UtcNow,
                DueDate = request.DueDate,
                UserId = userId,
                CategoryId = request.CategoryId
            };

            await _taskRepository.CreateAsync(task);

            return new TaskResponse
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                IsCompleted = task.IsCompleted,
                CreatedAt = task.CreatedAt,
                DueDate = task.DueDate,
                CategoryId = task.CategoryId,
                CategoryName = request.CategoryId.HasValue
                    ? (await _categoryRepository.GetByIdAsync(request.CategoryId.Value, userId))
                    ?.Name : null
            };
        }

        public async Task<bool> UpdateAsync(int id, UpdateTaskRequest request, int userId)
        {
            var task = await _taskRepository.GetByIdAsync(id, userId);

            if (task is null)
            {
                return false;
            }

            if (request.CategoryId.HasValue)
            {
                var category = await _categoryRepository.GetByIdAsync(request.CategoryId.Value, userId);

                if (category is null)
                {
                    throw new InvalidOperationException("Category not found.");
                }
            }

            task.Title = request.Title;
            task.Description = request.Description;
            task.IsCompleted = request.IsCompleted;
            task.DueDate = request.DueDate;
            task.CategoryId = request.CategoryId;

            await _taskRepository.UpdateAsync(task);

            return true;
        }

        public async Task<bool> DeleteAsync(int id, int userId)
        {
            var task = await _taskRepository.GetByIdAsync(id, userId);

            if (task is null)
            {
                return false;
            }

            await _taskRepository.DeleteAsync(task);

            return true;
        }
    }
}
