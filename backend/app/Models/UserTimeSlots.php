<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserTimeSlots extends Model
{
    use HasFactory;
    protected $table = "user_time_slots";
    protected $fillable = [
        "status",
        "slot_date",
        "start_time",
        "end_time",
        "user_id"
    ];
}
