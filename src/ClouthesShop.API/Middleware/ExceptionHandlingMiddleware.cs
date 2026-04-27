using ClouthesShop.Application.Common.Exceptions;
using ClouthesShop.Domain.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.Json;
using ValidationException = ClouthesShop.Application.Common.Exceptions.ValidationException;

namespace ClouthesShop.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, title, errors) = exception switch
        {
            ValidationException ve => (HttpStatusCode.BadRequest, "Validation Failed", ve.Errors),
            NotFoundException nfe => (HttpStatusCode.NotFound, "Not Found", (IDictionary<string, string[]>?)null),
            UnauthorizedException => (HttpStatusCode.Unauthorized, "Unauthorized", (IDictionary<string, string[]>?)null),
            ConflictException => (HttpStatusCode.Conflict, "Conflict", (IDictionary<string, string[]>?)null),
            DomainException => (HttpStatusCode.UnprocessableEntity, "Business Rule Violation", (IDictionary<string, string[]>?)null),
            _ => (HttpStatusCode.InternalServerError, "Internal Server Error", (IDictionary<string, string[]>?)null)
        };

        if (statusCode == HttpStatusCode.InternalServerError)
            _logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);
        else
            _logger.LogWarning(exception, "Handled exception [{Status}]: {Message}", statusCode, exception.Message);

        context.Response.ContentType = "application/problem+json";
        context.Response.StatusCode = (int)statusCode;

        var problem = new ProblemDetails
        {
            Status = (int)statusCode,
            Title = title,
            Detail = statusCode == HttpStatusCode.InternalServerError
                ? "An unexpected error occurred. Please try again later."
                : exception.Message,
            Instance = context.Request.Path
        };

        if (errors is not null)
            problem.Extensions["errors"] = errors;

        var json = JsonSerializer.Serialize(problem, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
        await context.Response.WriteAsync(json);
    }
}
