using TodoApp.Services.DTOs.Tasks;

namespace TodoApp.Services.Interfaces
{
    public interface ITaskService
    {
        Task<TaskListResponse> GetTasksAsync(int userId, string? search, int? categoryId, int pageNumber, 
            int pageSize);
        Task<TaskResponse?> GetByIdAsync(int id, int userId);
        Task<TaskResponse> CreateAsync(CreateTaskRequest request, int userId);
        Task<bool> UpdateAsync(int id, UpdateTaskRequest request, int userId);
        Task<bool> DeleteAsync(int id, int userId);
    }
}
