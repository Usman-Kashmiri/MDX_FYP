<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlockWord extends Model
{
    use HasFactory;
    protected $table = "block_word";
    protected $fillable = [
        "word"
    ];
}
