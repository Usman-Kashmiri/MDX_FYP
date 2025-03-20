<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LawyerRating extends Model
{
    use HasFactory;
    protected $table = "lawyer_ratings";
    protected $fillable = [
        "rating",
        "lawyer_id",
        "client_id",
        "feedback",
    ];

    public function lawyer()
    {
        return $this->belongsTo(User::class,"lawyer_id","id");
    }

    public function client()
    {
        return $this->belongsTo(User::class,"client_id","id");
    }
}
