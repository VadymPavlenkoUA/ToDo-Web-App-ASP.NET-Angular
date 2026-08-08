using Microsoft.EntityFrameworkCore;
using TodoApp.DataAccess.Context;
using TodoApp.DataAccess.Entities;
using TodoApp.DataAccess.Interfaces;

namespace TodoApp.DataAccess.Repositories
{
    public class TaskRepository: ITaskRepository
    {
        private readonly TodoDbContext _context;

        public TaskRepository(TodoDbContext context)
        {
            _context = context;
        }

        public async Task<(IEnumerable<TaskItem> Items, int TotalCount)> GetPagedAsync(
            int userId,
            string? search,
            int? categoryId,
            int pageNumber,
            int pageSize)
        {
            var query = _context.Tasks.AsNoTracking().Where(x => x.UserId == userId);

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(x => x.Title.Contains(search) ||
                    (x.Description != null && x.Description.Contains(search)));
            }

            if (categoryId.HasValue)
            {
                query = query.Where(x => x.CategoryId == categoryId.Value);
            }

            var totalCount = await query.CountAsync();

            var items = await query.Include(x => x.Category).OrderByDescending(x => x.CreatedAt)
                .Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

            return (items, totalCount);
        }

        public async Task<TaskItem?> GetByIdAsync(int id, int userId)
        {
            return await _context.Tasks.Include(x => x.Category)
                .FirstOrDefaultAsync(x =>
                    x.Id == id &&
                    x.UserId == userId);
        }

        public async Task<TaskItem> CreateAsync(TaskItem task)
        {
            await _context.Tasks.AddAsync(task);
            await _context.SaveChangesAsync();

            return task;
        }

        public async Task UpdateAsync(TaskItem task)
        {
            _context.Tasks.Update(task);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(TaskItem task)
        {
            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
        }
    }
}
