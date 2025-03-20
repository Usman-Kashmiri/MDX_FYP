<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Pusher\Pusher;

class PusherServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register()
    {
        try {
            $this->app->singleton('pusher', function ($app) {
                $options = [
                    'cluster' => config('app.PUSHER_APP_CLUSTER'),
                    'useTLS' => true
                ];
                return new Pusher(
                    config('app.PUSHER_APP_KEY'),
                    config('app.PUSHER_APP_SECRET'),
                    config('app.PUSHER_APP_ID'),
                    $options
                );
            });
        } catch (\Throwable $th) {
            return $th->getMessage();
        }
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
