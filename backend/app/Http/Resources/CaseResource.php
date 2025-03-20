<?php

namespace App\Http\Resources;

use App\Http\Controllers\Controller;
use App\Models\AreaExpertise;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CaseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            "id" => $this->id,
            "case" => $this->case,
            "status_text" => $this->case ? $this->getStatusText() : 'no case',
            "client" => [
                "id" => $this->client->id,
                "first_name" => $this->client->first_name,
                "last_name" => $this->client->last_name,
                'profile' => $this->client->image,
            ],
            "lawyer" => [
                "id" => $this->lawyer->id,
                "first_name" => $this->lawyer->first_name,
                "last_name" => $this->lawyer->last_name,
                'profile' => $this->lawyer->image,
                "phone_number" => $this?->lawyer?->phone_number,
                "country" => $this?->lawyer?->country?->name,
                "state" => $this?->lawyer?->state?->name,
                "address" => $this?->lawyer?->address,
                "zip_code" => $this?->lawyer?->zip_code,
                "area_of_expertise" => $this?->lawyer?->lawyer_expertise->map(function ($area_expertise) {
                    $expertise = AreaExpertise::find($area_expertise->area_expertise_id);
                    return [
                        "id" => $expertise->id,
                        "name" => $expertise->name,
                    ];
                }),
                "ratings" => $this?->lawyer?->lawyer_ratings->avg('rating'),
                "reviews" => $this?->lawyer?->lawyer_ratings,
            ],
            "created_at" => $this->created_at,
        ];
    }

    /**
     * Get status text based on status code.
     *
     * @return string
     */
    private function getStatusText(): string
    {
        switch ($this->case->status) {
            case 0:
                return "pending";
            case 1:
                return "approved";
            case 2:
                return "rejected";
            case 3:
                return "completed";
            default:
                return "cancelled";
        }
    }
}
