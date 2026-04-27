using ClouthesShop.Application.DTOs.Categories;
using ClouthesShop.Application.Features.Categories.Commands;
using ClouthesShop.Application.Features.Categories.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClouthesShop.API.Controllers.v1;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[Produces("application/json")]
public class CategoriesController : ControllerBase
{
    private readonly IMediator _mediator;

    public CategoriesController(IMediator mediator) => _mediator = mediator;

    /// <summary>Get all active categories</summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCategories(CancellationToken ct) =>
        Ok(await _mediator.Send(new GetCategoriesQuery(), ct));

    /// <summary>Get a category by ID</summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCategory(Guid id, CancellationToken ct) =>
        Ok(await _mediator.Send(new GetCategoryByIdQuery(id), ct));

    /// <summary>Create a category (Admin only)</summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new CreateCategoryCommand(request.Name, request.Description, request.ImageUrl), ct);
        return CreatedAtAction(nameof(GetCategory), new { id = result.Id }, result);
    }

    /// <summary>Update a category (Admin only)</summary>
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] UpdateCategoryRequest request, CancellationToken ct) =>
        Ok(await _mediator.Send(new UpdateCategoryCommand(id, request.Name, request.Description, request.ImageUrl), ct));

    /// <summary>Delete a category (Admin only)</summary>
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteCategory(Guid id, CancellationToken ct)
    {
        await _mediator.Send(new DeleteCategoryCommand(id), ct);
        return NoContent();
    }
}
