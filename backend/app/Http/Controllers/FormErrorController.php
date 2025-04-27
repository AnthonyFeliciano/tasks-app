<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class FormErrorController extends Controller
{
    public static function validation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 422)
        );
    }
}
