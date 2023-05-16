<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use DoubleThreeDigital\Runway\Traits\HasRunwayResource;

class Venue extends Model
{
	use HasFactory;

	use HasRunwayResource;
	

	protected $fillable = [
		'city_id',
		'name',
		
	];



	public function city() : BelongsTo
	{


		return $this->belongsTo(City::class);
	}
}
