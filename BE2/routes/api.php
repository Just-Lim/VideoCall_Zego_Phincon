<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\http\Controllers\RoomController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('room', RoomController::class);

Route::post('room', [RoomController::class, 'store'])->name('room.show');
Route::get('room/{roomid}', [RoomController::class, 'store'])->name('room.store');
Route::put('room/{roomid}', [RoomController::class, 'update'])->name('room.update');
Route::delete('room/{roomid}', [RoomController::class, 'store'])->name('room.destroy');
