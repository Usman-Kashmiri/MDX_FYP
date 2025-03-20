<?php

namespace App\Http\Resources;

use App\Http\Controllers\Controller;
use Illuminate\Http\Resources\Json\JsonResource;

class LawyerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function __construct($resource, $includeReviews = false, $includeWithdrawRequests = false, $includeCases = false, $includeContracts = false, $includeTransactionsHistory = false, $includeAppointments = false)
    {
        $this->includeReviews = $includeReviews;
        $this->includeWithdrawRequests = $includeWithdrawRequests;
        $this->includeCases = $includeCases;
        $this->includeContracts = $includeContracts;
        $this->includeTransactionsHistory = $includeTransactionsHistory;
        $this->includeAppointments = $includeAppointments;
        parent::__construct($resource);
    }

    public function toArray($request): array
    {

        $attributes = [
            "id" => $this->id,
            "first_name" => $this->first_name,
            "last_name" => $this->last_name,
            "email" => $this->email,
            "image" => $this->image,
            "phone_number" => $this->phone_number,
            "address" => $this->address,
            // "short_bio" => base64_decode($this->short_bio),
            "role" => $this->role->name,
            "bar_membership_number" => $this->bar_membership_numer,
            "area_expertise" => $this->getExpertise($this->lawyer_expertise),
            "jurisdictions" => $this->getJurisdictions($this?->jurisdictions),
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
            "balance" => $this->balance ? $this->balance : '',
            "iban" => $this->iban ? $this->iban : '',
            "ratings" => $this?->lawyer_ratings?->avg('rating'),
            "created_at" => $this->created_at,
        ];

        if ($this->includeReviews) {
            $attributes["reviews"] = ReviewResource::collection($this?->lawyer_ratings)->sortByDesc('created_at')->toArray();
        }

        if ($this->includeWithdrawRequests) {
            $attributes["withdraw_requests"] = WithdrawRequestResource::collection($this?->withdraw_requests);
        }

        if ($this->includeTransactionsHistory) {
            $attributes["transactions_history"] = TransactionHistoryResource::collection($this?->transactions_history);
        }

        if ($this->includeCases) {
            $attributes["cases"] = CaseResource::collection($this?->lawyers_cases);
        }

        if ($this->includeCases) {
            $attributes["contracts"] = ContractResource::collection($this?->contracts);
        }

        if ($this->includeAppointments) {
            $attributes["appointments"] = AppointmentResource::collection($this?->lawyer_appointments);
        }

        return $attributes;
    }

    static public function getExpertise($expertise)
    {
        $array = collect($expertise)->map(function ($item) {
            return (object) [
                'id' => $item?->area_expertise['id'],
                'name' => $item?->area_expertise['name'],
            ];
        })->toArray();

        return $array;
    }

    static public function getJurisdictions($jury)
    {
        $array = collect($jury)->map(function ($item) {
            return (object) 
                [
                    "id" => $item?->jurisdiction['id'],
                    "name" => $item?->jurisdiction['name'],
                    "status" => $item?->jurisdiction['status'],
                    "country" => [
                        "id" => $item?->jurisdiction['country']?->id,
                        "name" => $item?->jurisdiction['country']?->name,
                    ],
                    "created_at" => $item?->jurisdiction['created_at'],
                    "updated_at" => $item?->jurisdiction['updated_at'],
                ];
        })->toArray();

        return $array;
    }
}
