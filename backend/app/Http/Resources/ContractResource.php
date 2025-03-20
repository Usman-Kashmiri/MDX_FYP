<?php

namespace App\Http\Resources;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContractResource extends JsonResource
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
            "type" => $this->type,
            "title" => $this->title,
            "status" => $this->status,
            "fees_amount" => $this->fees_amount,
            "start_date" => $this->start_date,
            "end_date" => $this->end_date,
            "currency" => $this->currency,
            "documents" => $this->documents ? ContractDocumentResource::collection($this->documents) : null,
            "clauses" => $this->clauses,
            "additional_note" => $this->additional_note,
            "payment_details" => $this->payment_details,
            "lawyer_complete_request" => $this->lawyer_complete_request,
            "lawyer_request_timestamp" => $this->lawyer_request_timestamp,
            "client" => [
                "id" => $this?->client?->id,
                "first_name" => $this?->client?->first_name,
                "last_name" => $this?->client?->last_name,
                'email' => $this->client->email,
                'phone_number' => $this->client->phone_number,
                'profile' => $this->client->image,
            ],
            "lawyer" => [
                "id" => $this?->lawyer?->id,
                "first_name" => $this?->lawyer?->first_name,
                "last_name" => $this?->lawyer?->last_name,
                'email' => $this->lawyer->email,
                'phone_number' => $this->lawyer->phone_number,
                'profile' => $this->lawyer->image,
            ],
            "created_at" => $this->created_at,
        ];
    }
}
