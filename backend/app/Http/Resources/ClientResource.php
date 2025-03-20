<?php

namespace App\Http\Resources;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "first_name" => $this->first_name,
            "last_name" => $this->last_name,
            "email" => $this->email,
            "role" => $this?->role?->name,
            "image" => $this->image,
            "phone_number" => $this->phone_number,
            "address" => $this->address,
            "country" => [
                "id" => $this?->country?->id,
                "name" => $this?->country?->name,
            ],
            "state" => [
                "id" => $this?->state?->id,
                "name" => $this?->state?->name,
            ],
            "city" => $this->city,
            "zip_code" => $this->zip_code,
            "terms_of_service" => $this->terms_of_service,
            "email_verification_status" => $this->email_verified_at ? "verified" : "not verified",
            "email_verified_at" => $this->email_verified_at,
            "status" => $this->status,
            "provider" => $this->provider,
            "is_online" => $this->is_online,
            "email_notifications" => $this->email_notifications,
            "dob" => $this->dob,
            "balance" => $this->balance,
            "iban" => $this->iban,
            "created_at" => $this->created_at,
        ];
    }
}
