<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CarouselText extends Model
{
    use HasFactory;

    protected $table = "carousel_text";

    protected $fillable = [
        "text",
        "punchline",
    ];
}
