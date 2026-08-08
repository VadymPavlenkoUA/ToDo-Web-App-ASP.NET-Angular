using System;
using System.Collections.Generic;
using System.Text;
using TodoApp.DataAccess.Entities;

namespace TodoApp.DataAccess.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(int id);

        Task<User?> GetByEmailAsync(string email);

        Task<User> CreateAsync(User user);
    }
}
