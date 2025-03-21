<?php

namespace App\Http\Middleware;

use App\Models\User;
use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class OnlineUserMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->user()) {
            $expiresAt = Carbon::now()->addMinutes(2);
            Cache::put('is_Online' . Auth::user()->id, true, $expiresAt);
            User::where('id', Auth::user()->id)->update(['last_seen' => now()]);
        }

        return $next($request);
    }
}
