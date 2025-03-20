<?php

namespace App\Http\Resources;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContractDocumentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $controllerInstance = new Controller();

        return [
            "id" => $this->id,
            "contract_id" => $this->contract_id,
            "file_name" => $this->file_name,
            "src" => $this->src ? $controllerInstance->getPrivateS3File($this->src) : null,
            "mime_type" => $this->mime_type,
            "extension" => $this->extension,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
        ];
    }
}
