<?php

return [

	/*
    |--------------------------------------------------------------------------
    | Resources
    |--------------------------------------------------------------------------
    |
    | Configure the resources (models) you'd like to be available in Runway.
    |
    */

	'resources' => [
		// \App\Models\Order::class => [
		//     'name' => 'Orders',

		//     'blueprint' => [
		//         'tabs' => [
		//             'main' => [
		//                 'fields' => [
		//                     [
		//                         'handle' => 'price',
		//                         'field' => [
		//                             'type' => 'number',
		//                             'validate' => 'required',
		//                         ],
		//                     ],
		//                 ],
		//             ],
		//         ],
		//     ],
		// ],
		\App\Models\City::class => [
			'name' => 'Cities',

			'blueprint' => [
				'tabs' => [
					'main' => [
						'fields' => [
							[
								'handle' => 'name',
								'field' => [
									'type' => 'text',
									'validate' => 'required',
								],

								[
									'handle' => 'venue',
									'field' => [
										'display'=> 'Venues',
										'type' => 'has_many',
										'table_mode' => true,
									],
								],

							],
						],
					],
				],
			],
		],

		\App\Models\Venue::class => [
			'name' => 'Venues',

			'blueprint' => [
				'tabs' => [
					'main' => [
						'fields' => [
							[
								'handle' => 'city_id',
								'field' => [
									'display'=> 'City',
									'max_items'=> 1,
									'type' => 'belongs_to',
									'resource' => 'city',
										
								],
							],

							[
								'handle' => 'name',
								'field' => [
									'type' => 'text',
									'validate' => 'required',
								],
							],
						],
					],
				],
			],
		],



	],

	/*
    |--------------------------------------------------------------------------
    | Disable Migrations?
    |--------------------------------------------------------------------------
    |
    | Should Runway's migrations be disabled?
    | (eg. not automatically run when you next vendor:publish)
    |
    */

	'disable_migrations' => false,

];
