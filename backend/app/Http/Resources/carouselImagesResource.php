<?php

namespace App\Http\Resources;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class carouselImagesResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $imagePath = $this->image ? asset('carousel/' . $this->image) : null;

        return [
            "id" => $this->id,
            "image" => $imagePath,
            "alt_text" => $this->alt_text,
            "order" => $this->order,
            "created_at" => $this->created_at,
            "updated_at" => $this->upated_at,
        ];
    }
}
