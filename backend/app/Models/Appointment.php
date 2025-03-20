<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;
    protected $table = "appointment";

    protected $fillable = [
        "user_id",
        "lawyer_id",
        "title",
        "description",
        "appointment_date",
        "appointment_start_time",
        "appointment_end_time",
        "status",
        "original_case_summary",
        "summerized_case_summary"
    ];

    public function lawyer()
    {
        return $this->belongsTo(User::class, 'lawyer_id');
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
