using ClouthesShop.Application.Features.Auth.Commands;
using ClouthesShop.Application.Features.Auth.Queries;
using ClouthesShop.Application.Common.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace ClouthesShop.API.Controllers.v1;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ICurrentUserService _currentUser;

    public AuthController(IMediator mediator, ICurrentUserService currentUser)
    {
        _mediator = mediator;
        _currentUser = currentUser;
    }

    /// <summary>Register a new customer account</summary>
    [HttpPost("register")]
    [EnableRateLimiting("auth")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Register([FromBody] Application.DTOs.Auth.RegisterRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new RegisterCommand(
            request.FirstName, request.LastName, request.Email,
            request.Password, request.ConfirmPassword, request.PhoneNumber), ct);
        return CreatedAtAction(nameof(Me), result);
    }

    /// <summary>Login with email and password</summary>
    [HttpPost("login")]
    [EnableRateLimiting("auth")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] Application.DTOs.Auth.LoginRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new LoginCommand(request.Email, request.Password), ct);
        return Ok(result);
    }

    /// <summary>Refresh access token using a valid refresh token</summary>
    [HttpPost("refresh-token")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RefreshToken([FromBody] Application.DTOs.Auth.RefreshTokenRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new RefreshTokenCommand(request.RefreshToken), ct);
        return Ok(result);
    }

    /// <summary>Logout and revoke refresh token</summary>
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Logout(CancellationToken ct)
    {
        await _mediator.Send(new RevokeTokenCommand(_currentUser.UserId!.Value), ct);
        return NoContent();
    }

    /// <summary>Get the current authenticated user's profile</summary>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Me(CancellationToken ct)
    {
        var result = await _mediator.Send(new GetCurrentUserQuery(_currentUser.UserId!.Value), ct);
        return Ok(result);
    }
}
