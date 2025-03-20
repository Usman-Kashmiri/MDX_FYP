<?php

namespace App\Models;

use App\Helpers\EncryptionHelpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WithdrawRequest extends Model
{
    use HasFactory;
    protected $table = "withdraw_requests";
    protected $fillable = [
        "user_id",
        "amount",
        "status",
        "iban",
    ];
    
    // Define attributes that need encryption and decryption
    protected $encryptedAttributes = [
        'amount',
        'iban',
    ];


    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }
    
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
