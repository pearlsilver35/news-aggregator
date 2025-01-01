<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Auth\AuthenticationException;
use Throwable;
use Illuminate\Support\Facades\Log;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }
    protected function unauthenticated($request, AuthenticationException $exception)
    {
        return response()->json([
            'message' => 'Unauthenticated.'
        ], 401);
    }
    public function report(Throwable $e) 
    {
        try {
            parent::report($e);
        } catch (Throwable $loggingException) {
            // Fallback to writing to system temp directory
            Log::channel('failsafe')->error($e);
            Log::channel('failsafe')->error("Logging failed: " . $loggingException->getMessage());
        }
    }
}
