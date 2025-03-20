<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContractSignedMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
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
        return $this->subject('Contract Signed')
            ->view('emails.contract-signed')
            ->with([
                'contract' => $this->contract,
                'url' => $this->requestUrl,
            ]);
    }
}
