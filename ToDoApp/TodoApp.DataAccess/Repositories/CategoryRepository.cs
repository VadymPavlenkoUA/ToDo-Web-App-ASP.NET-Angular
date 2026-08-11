using Microsoft.EntityFrameworkCore;
using TodoApp.DataAccess.Context;
using TodoApp.DataAccess.Entities;
using TodoApp.DataAccess.Interfaces;

namespace TodoApp.DataAccess.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly TodoDbContext _context;

        public CategoryRepository(TodoDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Category>> GetAllAsync(int userId)
        {
            return await _context.Categories.AsNoTracking().Where(x => x.UserId == userId)
                .OrderBy(x => x.Name).ToListAsync();
        }

        public async Task<Category?> GetByIdAsync(int id, int userId)
        {
            return await _context.Categories.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
        }

        public async Task<Category> CreateAsync(Category category)
        {
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();

            return category;
        }

        public async Task UpdateAsync(Category category)
        {
            _context.Categories.Update(category);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Category category)
        {
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
        }
    }
}
