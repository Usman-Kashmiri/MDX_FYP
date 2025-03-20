<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContractAccepted extends Mailable
{
    use Queueable, SerializesModels;

    public $mail;
    /**
     * Create a new message instance.
     */
    public function __construct($mail)
    {
        $this->mail = $mail;
    }

    public function build()
    {
        return $this->subject('A New Contract Has Been Signed!')
            ->view('emails.contract_accepted')
            ->with([
                'mail' => $this->mail,
            ]);
    }
}
