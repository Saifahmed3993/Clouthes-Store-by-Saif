using ClouthesShop.Application.Features.Products.Commands;
using FluentValidation;

namespace ClouthesShop.Application.Features.Products.Validators;

public class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.BasePrice).GreaterThanOrEqualTo(0).WithMessage("Price cannot be negative.");
        RuleFor(x => x.CategoryId).NotEmpty();
        RuleFor(x => x.StockQuantity).GreaterThanOrEqualTo(0);
        RuleForEach(x => x.Variants).ChildRules(v =>
        {
            v.RuleFor(x => x.Size).NotEmpty().MaximumLength(10);
            v.RuleFor(x => x.Color).NotEmpty().MaximumLength(30);
            v.RuleFor(x => x.StockQuantity).GreaterThanOrEqualTo(0);
        });
        RuleForEach(x => x.ImageUrls).NotEmpty().Must(url => Uri.TryCreate(url, UriKind.Absolute, out _))
            .WithMessage("Image URL must be a valid URL.");
    }
}

public class UpdateProductCommandValidator : AbstractValidator<UpdateProductCommand>
{
    public UpdateProductCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.BasePrice).GreaterThanOrEqualTo(0);
        RuleFor(x => x.CategoryId).NotEmpty();
        RuleFor(x => x.StockQuantity).GreaterThanOrEqualTo(0);
    }
}
