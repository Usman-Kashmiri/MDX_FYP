<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cases extends Model
{
    use HasFactory;

    protected $table = "cases";

    protected $fillable = [
        "client_id",
        "status",
        "case",
        "case_summary"
    ];

    public function client()
    {
        return $this->belongsTo(User::class, "client_id");
    }

    public function lawyer()
    {
        return $this->hasOne(LawyersCase::class, "client_id", "client_id");
    }
}
