<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContractCompleteRequestEmail extends Mailable
{
    use Queueable, SerializesModels;
    public $contract;
    public $requestUrl;
    /**
     * Create a new message instance.
     */
    public function __construct($contract, $requestUrl)
    {
        $this->contract = $contract;
        $this->requestUrl = $requestUrl;
    }

    public function build()
    {
        return $this->subject('Contract Complete Request')
            ->view('emails.contract_complete_request')
            ->with([
                'contract' => $this->contract,
                'url' => $this->requestUrl,
            ]);
    }
}
