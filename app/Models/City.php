<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use DoubleThreeDigital\Runway\Traits\HasRunwayResource;

class City extends Model
{
	use HasFactory;
	use HasRunwayResource;

	
	protected $fillable = [
        'name',
    ];

	public function venue(): HasMany
    {
        return $this->hasMany(Venue::class);
    }
}
