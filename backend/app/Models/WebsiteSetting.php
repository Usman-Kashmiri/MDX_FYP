<?php

namespace App\Models;

use App\Helpers\EncryptionHelpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebsiteSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        "site_name",
        "site_email",
        "site_logo",
        "site_favicon",
        "site_contact",
        "admin_commission_percent",
        "gpt_key",
        "stripe_pk",
        "stripe_sk",
        "encryption_key",
    ];

    // Define attributes that need encryption and decryption
    protected $encryptedAttributes = [
        'admin_commission_percent',
        'gpt_key',
        'stripe_pk',
        'stripe_sk',
    ];

    // Mutators for encrypting and decrypting attributes
    public function getAttribute($key)
    {
        $value = parent::getAttribute($key);

        if (in_array($key, $this->encryptedAttributes)) {
            return EncryptionHelpers::decrypt($value);
        }

        return $value;
    }

    public function setAttribute($key, $value)
    {
        if (in_array($key, $this->encryptedAttributes)) {
            $value = EncryptionHelpers::encrypt($value);
        }

        parent::setAttribute($key, $value);
    }
}
