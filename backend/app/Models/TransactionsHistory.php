<?php

namespace App\Models;

use App\Helpers\EncryptionHelpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionsHistory extends Model
{
    use HasFactory;
    protected $table = "transactions_history";
    protected $fillable = [
        "user_id",
        "amount",
        "reason",
        "type",
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getAmountAttribute($value)
    {
        return EncryptionHelpers::decrypt($value);
    }

    // Mutator to encrypt amount when setting
    public function setAmountAttribute($value)
    {
        $this->attributes['amount'] = EncryptionHelpers::encrypt($value);
    }
}
