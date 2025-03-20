<?php

namespace App\Listeners;

use App\Events\UserLoggedIn;
use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UpdateUserOnlineStatus
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    protected $user;

    /**
     * Create a new event instance.
     *
     * @param User $user
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Handle the event.
     *
     * @param UserLoggedIn $event
     * @return void
     */
    public function handle(UserLoggedIn $event)
    {
        $this->user->update(['is_online' => 1]);
    }
}
