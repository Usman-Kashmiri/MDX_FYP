<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MilestoneStep extends Model
{
    use HasFactory;

    protected $fillable = [
        "stage_id",
        "name",
        "description",
        "status",
    ];

    public function stage()
    {
        return $this->belongsTo(MilestoneStage::class, 'stage_id');
    }
}
