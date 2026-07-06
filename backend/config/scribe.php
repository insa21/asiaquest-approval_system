<?php

use Knuckles\Scribe\Config\AuthIn;
use Knuckles\Scribe\Config\Defaults;
use Knuckles\Scribe\Extracting\Strategies;

use function Knuckles\Scribe\Config\configureStrategy;

return [
    'title' => config('app.name') . ' API Documentation',

    'description' => 'API documentation for Approval System technical test.',

    'intro_text' => <<<'INTRO'
This documentation provides all information needed to work with the Approval System API.

The system supports three roles:

- User: create and submit insurance claims.
- Verifier: review submitted claims.
- Approver: approve or reject reviewed claims.

Workflow:

draft → submitted → reviewed → approved / rejected
INTRO,

    'base_url' => env('SCRIBE_BASE_URL', config('app.url')),

    'routes' => [
        [
            'match' => [
                'prefixes' => ['api/*'],
                'domains' => ['*'],
            ],

            'include' => [
                //
            ],

            'exclude' => [
                //
            ],
        ],
    ],

    'type' => 'laravel',

    'theme' => 'default',

    'static' => [
        'output_path' => 'public/docs',
    ],

    'laravel' => [
        'add_routes' => true,
        'docs_url' => '/docs',
        'assets_directory' => null,
        'middleware' => [],
    ],

    'external' => [
        'html_attributes' => [],
    ],

    'try_it_out' => [
        'enabled' => true,

        'base_url' => env('SCRIBE_TRY_IT_OUT_BASE_URL', config('app.url')),

        'use_csrf' => false,

        'csrf_url' => '/sanctum/csrf-cookie',
    ],

    'auth' => [
        'enabled' => true,

        'default' => true,

        'in' => AuthIn::BEARER->value,

        'name' => 'Authorization',

        'use_value' => env('SCRIBE_AUTH_KEY'),

        'placeholder' => '1|YOUR_TOKEN_HERE',

        'extra_info' => 'Login first using POST /api/login, then copy the token from the response. Paste only the token value, without the word Bearer.',
    ],

    'example_languages' => [
        'bash',
        'javascript',
    ],

    'postman' => [
        'enabled' => true,

        'overrides' => [
            //
        ],
    ],

    'openapi' => [
        'enabled' => true,

        'version' => '3.0.3',

        'overrides' => [
            //
        ],

        'generators' => [],
    ],

   'groups' => [
        'default' => 'Endpoints',

        'order' => [
            'Authentication',
            'Claims',
            'Claim Workflow',
        ],
    ],

    'logo' => false,

    'last_updated' => 'Last updated: {date:F j, Y}',

    'examples' => [
        'faker_seed' => 1234,

        'models_source' => [
            'factoryCreate',
            'factoryMake',
            'databaseFirst',
        ],
    ],

    'strategies' => [
        'metadata' => [
            ...Defaults::METADATA_STRATEGIES,
        ],

        'headers' => [
            ...Defaults::HEADERS_STRATEGIES,

            Strategies\StaticData::withSettings(data: [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ]),
        ],

        'urlParameters' => [
            ...Defaults::URL_PARAMETERS_STRATEGIES,
        ],

        'queryParameters' => [
            ...Defaults::QUERY_PARAMETERS_STRATEGIES,
        ],

        'bodyParameters' => [
            ...Defaults::BODY_PARAMETERS_STRATEGIES,
        ],

        'responses' => configureStrategy(
            Defaults::RESPONSES_STRATEGIES,
            Strategies\Responses\ResponseCalls::withSettings(
                only: ['GET *'],
                config: [
                    'app.debug' => false,
                ],
            ),
        ),

        'responseFields' => [
            ...Defaults::RESPONSE_FIELDS_STRATEGIES,
        ],
    ],

    'database_connections_to_transact' => [
        config('database.default'),
    ],

    'fractal' => [
        'serializer' => null,
    ],
];