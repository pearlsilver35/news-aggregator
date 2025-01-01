<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserPreferences;

class UserPreferencesController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'preferences' => 'required|json',
        ]);

        $preferences = UserPreferences::updateOrCreate(
            ['user_id' => auth()->id()],
            ['preferences' => $request->preferences]
        );

        return response()->json($preferences);
    }

    public function show()
    {
        $preferences = UserPreferences::where('user_id', auth()->id())->first();
        return response()->json($preferences ?? ['preferences' => null]);
    }
} 