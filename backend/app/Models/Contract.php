<?php

namespace App\Models;

use App\Helpers\EncryptionHelpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    use HasFactory;

    protected $table = "contracts";

    protected $fillable = [
        "type",
        "title",
        "client_id",
        "lawyer_id",
        "start_date",
        "end_date",
        "fees_amount",
        "currency",
        // "document",
        'clauses',
        'additional_note',
        'payment_details',
        'status',
        'lawyer_complete_request'
    ];

    public function client()
    {
        return $this->belongsTo(User::class, "client_id");
    }

    public function lawyer()
    {
        return $this->belongsTo(User::class, "lawyer_id");
    }

    public function documents()
    {
        return $this->hasMany(ContractDocument::class, "contract_id", "id");
    }

    public function getFeesAmountAttribute($value)
    {
        return EncryptionHelpers::decrypt($value);
    }

    // Mutator to encrypt fees_amount when setting
    public function setFeesAmountAttribute($value)
    {
        $this->attributes['fees_amount'] = EncryptionHelpers::encrypt($value);
    }
}
