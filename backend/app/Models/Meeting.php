<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    use HasFactory;

    protected $table = "meetings";

    protected $fillable = [
        "sender_id",
        "recevier_id",
        "meeting_status",
        "meeting_type",
        'meeting_id',
        "room_name",
    ];

    public function sender_detail()
    {
        return $this->belongsTo(User::class, "sender_id", "id");
    }

    public function recevier_detail()
    {
        return $this->belongsTo(User::class, "recevier_id", "id");
    }
}
