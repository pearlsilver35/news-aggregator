<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OptionalAuthenticate
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->bearerToken()) {
            Auth::shouldUse('sanctum');
        }
        
        return $next($request);
    }
} 