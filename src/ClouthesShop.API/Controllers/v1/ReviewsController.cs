using ClouthesShop.Application.Common.Interfaces;
using ClouthesShop.Application.DTOs.Reviews;
using ClouthesShop.Application.Features.Reviews.Commands;
using ClouthesShop.Application.Features.Reviews.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClouthesShop.API.Controllers.v1;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[Produces("application/json")]
public class ReviewsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ICurrentUserService _currentUser;

    public ReviewsController(IMediator mediator, ICurrentUserService currentUser)
    {
        _mediator = mediator;
        _currentUser = currentUser;
    }

    /// <summary>Get reviews for a product</summary>
    [HttpGet("product/{productId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetProductReviews(
        Guid productId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken ct = default)
    {
        var result = await _mediator.Send(new GetProductReviewsQuery(productId, page, pageSize), ct);
        return Ok(result);
    }

    /// <summary>Post a review for a product</summary>
    [HttpPost]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> CreateReview([FromBody] CreateReviewRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(
            new CreateReviewCommand(_currentUser.UserId!.Value, request.ProductId, request.Rating, request.Comment), ct);
        return CreatedAtAction(nameof(GetProductReviews), new { productId = result.ProductId }, result);
    }

    /// <summary>Update a review</summary>
    [HttpPut("{id:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateReview(Guid id, [FromBody] UpdateReviewRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(
            new UpdateReviewCommand(id, _currentUser.UserId!.Value, request.Rating, request.Comment), ct);
        return Ok(result);
    }

    /// <summary>Delete a review (own or Admin)</summary>
    [HttpDelete("{id:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteReview(Guid id, CancellationToken ct)
    {
        await _mediator.Send(new DeleteReviewCommand(id, _currentUser.UserId!.Value, _currentUser.IsAdmin), ct);
        return NoContent();
    }
}
