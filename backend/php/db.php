<?php
// db.php
require_once __DIR__ . '/config.php';

try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "DB connection error: " . $e->getMessage()
    ]);
    exit;
}


try {
    $redis = new Predis\Client([
        'scheme' => 'tls', 
        'host'   => 'redis-18280.c330.asia-south1-1.gce.redns.redis-cloud.com',
        'port'   => 18280,
        'password' => 'ArebSlkP9YcTbUI4BfF0665xdTp96o1Y'
    ]);
} catch (Exception $e) {
    die("Redis Connection failed: " . $e->getMessage());
}
