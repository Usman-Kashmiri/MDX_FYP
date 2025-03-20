<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jurisdiction extends Model
{
    use HasFactory;
    protected $table = "jurisdictions";
    protected $fillable = [
        "name",
        "country_id",
        "status"
    ];

    public function country()
    {
        return $this->belongsTo(Countries::class, "country_id");
    }
}
