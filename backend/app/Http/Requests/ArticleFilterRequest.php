<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ArticleFilterRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'keyword' => 'nullable|string',
            'category' => 'nullable|string',
            'source' => 'nullable|string',
            'date' => 'nullable|date',
            'author' => 'nullable|string',
        ];
    }
} 