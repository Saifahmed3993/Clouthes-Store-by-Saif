using ClouthesShop.Domain.Entities;
using ClouthesShop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ClouthesShop.Infrastructure.Persistence.Repositories;

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context) { }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default) =>
        await _dbSet.FirstOrDefaultAsync(u => u.Email == email.ToLowerInvariant(), cancellationToken);

    public async Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default) =>
        await _dbSet.AnyAsync(u => u.Email == email.ToLowerInvariant(), cancellationToken);

    public async Task<User?> GetByRefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default) =>
        await _dbSet.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken, cancellationToken);
}
