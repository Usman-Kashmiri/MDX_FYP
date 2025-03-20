<?php

namespace App\Models;

use App\Helpers\EncryptionHelpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MessagesResponse extends Model
{
    use HasFactory;

    protected $table = "messages_response";

    protected $fillable = [
        "contact_id",
        "subject",
        "message",
    ];

    public function message()
    {
        return $this->belongsTo(ContactUs::class, 'contact_id');
    }

    // Define attributes that need encryption and decryption
    protected $encryptedAttributes = [
        'subject',
        'message',
    ];

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
