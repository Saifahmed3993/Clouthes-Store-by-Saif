using ClouthesShop.Application.DTOs.Products;
using ClouthesShop.Application.Features.Products.Commands;
using ClouthesShop.Application.Features.Products.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClouthesShop.API.Controllers.v1;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[Produces("application/json")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator) => _mediator = mediator;

    /// <summary>Get products with filtering, sorting, and pagination</summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetProducts([FromQuery] ProductFilterRequest filter, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetProductsQuery(
            filter.Search, filter.CategoryId, filter.MinPrice, filter.MaxPrice,
            filter.SortBy, filter.Descending, filter.Page, filter.PageSize), ct);
        return Ok(result);
    }

    /// <summary>Get a single product by ID</summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetProduct(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetProductByIdQuery(id), ct);
        return Ok(result);
    }

    /// <summary>Get a product by slug</summary>
    [HttpGet("slug/{slug}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetProductBySlug(string slug, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetProductBySlugQuery(slug), ct);
        return Ok(result);
    }

    /// <summary>Create a new product (Admin only)</summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new CreateProductCommand(
            request.Name, request.Description, request.BasePrice, request.CategoryId,
            request.StockQuantity, request.Variants, request.ImageUrls), ct);
        return CreatedAtAction(nameof(GetProduct), new { id = result.Id }, result);
    }

    /// <summary>Update a product (Admin only)</summary>
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] UpdateProductRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new UpdateProductCommand(
            id, request.Name, request.Description, request.BasePrice, request.CategoryId, request.StockQuantity), ct);
        return Ok(result);
    }

    /// <summary>Soft-delete (deactivate) a product (Admin only)</summary>
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteProduct(Guid id, CancellationToken ct)
    {
        await _mediator.Send(new DeleteProductCommand(id), ct);
        return NoContent();
    }
}
