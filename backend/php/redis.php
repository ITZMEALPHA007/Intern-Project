<?php
require_once __DIR__ . '/../../vendor/autoload.php';

use Predis\Client;

try {
    $redis = new Client([
        'scheme'   => 'tcp',
        'host'     => 'redis-18280.c330.asia-south1-1.gce.redns.redis-cloud.com',
        'port'     => 18280,
        'password' => 'ArebSlkP9YcTbUI4BfF0665xdTp96o1Y',
    ]);

    $redis->ping();

} catch (Exception $e) {
    die(json_encode([
        "success" => false,
        "message" => "Redis connection failed: " . $e->getMessage()
    ]));
}
