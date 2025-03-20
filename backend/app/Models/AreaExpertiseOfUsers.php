<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AreaExpertiseOfUsers extends Model
{
    use HasFactory;
    protected $table = "area_expertises_of_users";
    protected $fillable = [
        "user_id",
        "area_expertise_id"
    ];

    public function area_expertise()
    {
        return $this->belongsTo(AreaExpertise::class, 'area_expertise_id', 'id');
    }

    public static function createMany(array $data)
    {
        foreach ($data as $record) {
            self::create($record);
        }
    }
}
