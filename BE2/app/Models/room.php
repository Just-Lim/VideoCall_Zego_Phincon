<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class room extends Model
{
    use HasFactory;

    protected $fillable = [
        "roomid",
        "hold",
    ];

    protected $guarded = [
        "id",
        "created_at",
        "updated_at",
    ];
}
