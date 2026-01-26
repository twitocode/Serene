using Microsoft.AspNetCore.DataProtection;

namespace Serene.Services;

public interface IEncryptionService
{
    string? Encrypt(string? plaintext);
    string? Decrypt(string? ciphertext);
    string? EncryptJson<T>(T? obj);
    T? DecryptJson<T>(string? ciphertext);
}

public class EncryptionService : IEncryptionService
{
    private readonly IDataProtector _protector;
    private readonly ILogger<EncryptionService> _logger;

    public EncryptionService(
        IDataProtectionProvider dataProtectionProvider,
        ILogger<EncryptionService> logger
    )
    {
        // Purpose string acts as a namespace for encryption keys
        _protector = dataProtectionProvider.CreateProtector("Serene.Checkin.SensitiveData.v1");
        _logger = logger;
    }

    public string? Encrypt(string? plaintext)
    {
        if (string.IsNullOrEmpty(plaintext))
            return plaintext;

        try
        {
            return _protector.Protect(plaintext);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to encrypt data");
            throw;
        }
    }

    public string? Decrypt(string? ciphertext)
    {
        if (string.IsNullOrEmpty(ciphertext))
            return ciphertext;

        try
        {
            return _protector.Unprotect(ciphertext);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to decrypt data - may be unencrypted legacy data");
            // Return original value if decryption fails (handles legacy unencrypted data)
            return ciphertext;
        }
    }

    public string? EncryptJson<T>(T? obj)
    {
        if (obj == null)
            return null;

        var json = System.Text.Json.JsonSerializer.Serialize(obj);
        return Encrypt(json);
    }

    public T? DecryptJson<T>(string? ciphertext)
    {
        if (string.IsNullOrEmpty(ciphertext))
            return default;

        var json = Decrypt(ciphertext);
        if (string.IsNullOrEmpty(json))
            return default;

        try
        {
            return System.Text.Json.JsonSerializer.Deserialize<T>(json);
        }
        catch (System.Text.Json.JsonException)
        {
            // If JSON parsing fails, it might be legacy non-JSON data
            _logger.LogWarning("Failed to deserialize decrypted data as JSON");
            return default;
        }
    }
}
