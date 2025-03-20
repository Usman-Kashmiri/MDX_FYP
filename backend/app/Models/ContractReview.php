<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContractReview extends Model
{
    use HasFactory;
    protected $table = "contract_reviews";

    protected $fillable = [
        "contract_id",
        "sender_id",
        "reciever_id",
        "rating",
        "review",
        "reciever_role",
    ];

    public function sender_details()
    {
        return $this->belongsTo(User::class, "sender_id");
    }
   
    public function reciever_details()
    {
        return $this->belongsTo(User::class, "reciever_id");
    }

}
