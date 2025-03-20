<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AreaExpertise extends Model
{
    use HasFactory;
    protected $table = "area_expertises";
    protected $fillable = [
        "name",
        "status"
    ];
}
