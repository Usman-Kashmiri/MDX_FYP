<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LawyersJurisdiction extends Model
{
    use HasFactory;

    protected $table = "lawyers_jurisdictions";

    protected $fillable = [
        "lawyer_id",
        "jurisdiction_id"
    ];

    public function jurisdiction()
    {
        return $this->belongsTo(Jurisdiction::class, 'jurisdiction_id', "id");
    }

    public function lawyer()
    {
        return $this->belongsTo(User::class, 'lawyer_id');
    }

    public static function createMany(array $data)
    {
        foreach ($data as $record) {
            self::create($record);
        }
    }
}
