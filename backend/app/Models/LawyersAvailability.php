<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LawyersAvailability extends Model
{
    use HasFactory;

    protected $table = 'lawyers_availability';

    protected $fillable = [
        'user_id',
        'day',
        'start_time',
        'end_time',
    ];

    public function lawyer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'user_id', 'lawyer_id');
    }
}
