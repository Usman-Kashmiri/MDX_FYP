<?php

namespace App\Models;

use App\Helpers\EncryptionHelpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    use HasFactory;
    protected $table = "chat";

    protected $fillable = [
        "appointment_id",
        "sender_id",
        "recevier_id",
        "message",
        "attach_type",
        "message_type",
        "attach",
        "case_id",
        "seen",
        'chat_timestampn',
        'attach_display_name',
        'meeting_id'
    ];

    public function appointment()
    {
        return $this->belongsTo(Appointment::class, "appointment_id", "id");
    }

    public function sender_detail()
    {
        return $this->belongsTo(User::class, "sender_id", "id");
    }

    public function recevier_detail()
    {
        return $this->belongsTo(User::class, "recevier_id", "id");
    }

    public function meeting_details()
    {
        return $this->belongsTo(Meeting::class, "meeting_id", "meeting_id");
    }

    public function getMessageAttribute($value)
    {
        if ($value != '') {

            return EncryptionHelpers::decrypt($value);
        } else {

            return $value;
        }
    }

    // Mutator to encrypt message when setting
    public function setMessageAttribute($value)
    {
        $this->attributes['message'] = EncryptionHelpers::encrypt($value);
    }
}
