<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContractDocument extends Model
{
    use HasFactory;

    protected $table = "contract_documents";

    protected $fillable = [
        "contract_id",
        "file_name",
        "src",
        "mime_type",
        "extension",
    ];

    public function contract()
    {
        return $this->belongsTo(Contract::class, "contract_id", "id");
    }
}
