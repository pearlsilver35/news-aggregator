<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserPreferencesController;
use App\Http\Controllers\ArticleController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth.optional')->group(function () {
    Route::get('/articles', [ArticleController::class, 'index']);
    Route::get('/categories', [ArticleController::class, 'getCategories']);
    Route::get('/sources', [ArticleController::class, 'getSources']);
    Route::get('/authors', [ArticleController::class, 'getAuthors']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/preferences', [UserPreferencesController::class, 'store']);
    Route::get('/preferences', [UserPreferencesController::class, 'show']);
});
