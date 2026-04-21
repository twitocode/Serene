using Bogus;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Logging;
using NSubstitute;
using Serene.Services;
using Shouldly;
using Xunit;

namespace Serene.Tests.Services;

public class EncryptionServiceTests
{
    private static readonly Faker Faker = new Faker();
    private readonly IDataProtectionProvider _dataProtectionProvider;
    private readonly ILogger<EncryptionService> _logger;
    private readonly EncryptionService _sut;

    public EncryptionServiceTests()
    {
        // Use a real but ephemeral provider for testing to avoid mocking extension methods
        _dataProtectionProvider = new EphemeralDataProtectionProvider();
        _logger = Substitute.For<ILogger<EncryptionService>>();
        _sut = new EncryptionService(_dataProtectionProvider, _logger);
    }

    [Fact]
    public void Encrypt_WhenPlaintextIsNotNull_ReturnsCiphertext()
    {
        // Arrange
        var plaintext = Faker.Lorem.Sentence();

        // Act
        var result = _sut.Encrypt(plaintext);

        // Assert
        result.ShouldNotBeNull();
        result.ShouldNotBe(plaintext);
    }

    [Fact]
    public void Decrypt_WhenCiphertextIsNotNull_ReturnsPlaintext()
    {
        // Arrange
        var plaintext = Faker.Lorem.Sentence();
        var ciphertext = _sut.Encrypt(plaintext);

        // Act
        var result = _sut.Decrypt(ciphertext);

        // Assert
        result.ShouldBe(plaintext);
    }

    [Fact]
    public void Decrypt_WhenUnprotectFails_ReturnsOriginalValue()
    {
        // Arrange
        var ciphertext = "invalid-ciphertext-not-base64";

        // Act
        var result = _sut.Decrypt(ciphertext);

        // Assert
        result.ShouldBe(ciphertext);
    }

    [Fact]
    public void EncryptJson_ReturnsEncryptedJson()
    {
        // Arrange
        var testObj = new TestObject { Name = "Test", Value = 123 };

        // Act
        var result = _sut.EncryptJson(testObj);

        // Assert
        result.ShouldNotBeNull();
        var decrypted = _sut.DecryptJson<TestObject>(result);
        decrypted.ShouldNotBeNull();
        decrypted.Name.ShouldBe(testObj.Name);
    }

    [Fact]
    public void DecryptJson_ReturnsDeserializedObject()
    {
        // Arrange
        var testObj = new TestObject { Name = "Test", Value = 123 };
        var ciphertext = _sut.EncryptJson(testObj);

        // Act
        var result = _sut.DecryptJson<TestObject>(ciphertext);

        // Assert
        result.ShouldNotBeNull();
        result.Name.ShouldBe(testObj.Name);
        result.Value.ShouldBe(testObj.Value);
    }

    private class TestObject
    {
        public string Name { get; set; } = string.Empty;
        public int Value { get; set; }
    }
}
