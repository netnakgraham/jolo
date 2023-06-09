<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVenuesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('venues', function (Blueprint $table) {
            $table->increments('id');
            $table->bigInteger('city_id')->nullable();
            $table->text('name');
            $table->timestamps();
        });
    }

     /**
      * Reverse the migrations.
      */
     public function down()
     {
         Schema::dropIfExists('venues');
     }
}
