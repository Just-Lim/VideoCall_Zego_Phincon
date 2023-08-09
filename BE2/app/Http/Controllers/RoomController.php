<?php

namespace App\Http\Controllers;

use App\Models\room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoomController extends Controller
{
   /**
     * Show the form for creating a new resource.
     */
    public function store(Request $request)
    {
        $room = room::select('roomid')
        ->where('roomid', '=', $request->input('roomid'))
        ->first();
        
        if(empty($room)){
            $room = room::create([
                'roomid' => $request->input('roomid'),
                'hold' => false,
            ]);
        }
        
        return response()->json([
            'data' => $room,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($roomid)
    {
        $room = room::where('roomid', '=', $roomid)
        ->select('roomid', 'hold')
        ->first();
        // ->get()[0];

        return response()->json([
            'data' => $room,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $roomid)
    {
        $update = room::where('roomid', '=', $roomid)
        ->update(['hold'=>$request->input('hold')]);

        return response()->json([
            'data' => $update,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($roomid)
    {
        $destroy = room::where('roomid', '=', $roomid)
        ->delete();

        return response()->json([
            'data' => $destroy,
        ]);
    }
}
