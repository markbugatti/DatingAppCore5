using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    /// <summary>
    /// This controller is used for registering or login into system
    /// </summary>
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        public AccountController(DataContext context, ITokenService tokenService)
        {
            _tokenService = tokenService;
            _context = context;
        }

        /// <summary>
        /// Register a new user
        /// </summary>
        /// <param name="registerDto">User data</param>
        /// <returns>Returns registered user<see cref="UserDto"/> or BadRequest if username isn't unique</returns>
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username))
            {
                return BadRequest("Username is taken");
            }

            using var hmac = new HMACSHA512();

            var user = new AppUser
            {
                UserName = registerDto.Username.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key,
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
            };
        }

        /// <summary>
        /// Logs in an existing user into system
        /// </summary>
        /// <param name="loginDto">User data</param>
        /// <returns>Returns logged in user<see cref="UserDto"/>. 
        /// Returns Unauthorized if user doesn't exist 
        /// or login credentials weren't correct</returns>
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users
                .SingleOrDefaultAsync(x => x.UserName == loginDto.UserName.ToLower());

            if (user == null) return Unauthorized("Invalid username");

            using var hmac = new HMACSHA512(user.PasswordSalt);

            var loginHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            if (!user.PasswordHash.SequenceEqual(loginHash)) return Unauthorized("Invalid password");

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
            };
        }

        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
        }

    }
}