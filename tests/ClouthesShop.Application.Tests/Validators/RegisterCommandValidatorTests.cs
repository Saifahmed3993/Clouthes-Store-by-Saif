using ClouthesShop.Application.Features.Auth.Commands;
using ClouthesShop.Application.Features.Auth.Validators;
using FluentValidation.TestHelper;

namespace ClouthesShop.Application.Tests.Validators;

public class RegisterCommandValidatorTests
{
    private readonly RegisterCommandValidator _validator = new();

    [Fact]
    public void ValidCommand_ShouldPassValidation()
    {
        var command = new RegisterCommand(
            "John", "Doe", "john@example.com",
            "SecureP@ss1!", "SecureP@ss1!");

        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData("", "Doe", "john@example.com", "SecureP@ss1!", "SecureP@ss1!")]
    [InlineData("John", "", "john@example.com", "SecureP@ss1!", "SecureP@ss1!")]
    public void MissingRequiredFields_ShouldFailValidation(
        string first, string last, string email, string password, string confirm)
    {
        var command = new RegisterCommand(first, last, email, password, confirm);
        var result = _validator.TestValidate(command);
        result.ShouldHaveAnyValidationError();
    }

    [Fact]
    public void WeakPassword_ShouldFailValidation()
    {
        var command = new RegisterCommand("John", "Doe", "john@example.com", "weak", "weak");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Fact]
    public void PasswordMismatch_ShouldFailValidation()
    {
        var command = new RegisterCommand("John", "Doe", "john@example.com", "SecureP@ss1!", "Different@1!");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.ConfirmPassword);
    }

    [Fact]
    public void InvalidEmail_ShouldFailValidation()
    {
        var command = new RegisterCommand("John", "Doe", "not-an-email", "SecureP@ss1!", "SecureP@ss1!");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }
}
