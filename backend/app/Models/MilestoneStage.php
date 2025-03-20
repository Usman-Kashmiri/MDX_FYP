<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MilestoneStage extends Model
{
    use HasFactory;

    protected $fillable = [
        "contract_id",
        "name",
        "description",
        "status",
    ];

    public function steps()
    {
        return $this->hasMany(MilestoneStep::class, 'stage_id');
    }

    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }
}
