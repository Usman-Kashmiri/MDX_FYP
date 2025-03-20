<?php

namespace App\Http\Resources;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = auth()->user();
        $alignmentClass = ($this->sender_id == $user->id) ? 'right' : 'left';

        $controllerInstance = new Controller();

        return [
            "id" => $this->id,
            "alignment" => $alignmentClass,
            "appointment_id" => $this->appointment_id,
            "sender_id" => $this->sender_id,
            "recevier_id" => $this->recevier_id,
            "message" => $this->message,
            "message_type" => $this->message_type,
            "attach_type" => $this->attach_type,
            "attach" => $this->attach ? $controllerInstance->getPrivateS3File($this->attach) : null,
            "attach_display_name" => $this->attach_display_name ? $this->attach_display_name : null,
            'status' => $this->seen,
            "time_stamp" => intval($this->chat_timestampn),
            "appointment_detail" => (($this->appointment_id != 0) ? $this->appointment : null),
            'meeting_id' => $this->meeting_id,
            'meeting_details' => $this->whenLoaded('meeting_details'),
            "created_at" => $this->created_at
        ];
    }
}
