<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LawyersCase extends Model
{
    use HasFactory;

    protected $table = "lawyers_cases";

    protected $fillable = [
        "case_id",
        "client_id",
        "lawyer_id",
    ];

    public function case()
    {
        return $this->belongsTo(Cases::class, "case_id");
    }

    public function lawyer()
    {
        return $this->belongsTo(User::class, "lawyer_id");
    }

    public function client()
    {
        return $this->belongsTo(User::class, "client_id");
    }
}
