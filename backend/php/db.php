<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__ . '/../../vendor/autoload.php';

$host = "127.0.0.1";   
$dbname = "interndb001";   
$user = "root";        
$pass = "";           

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("MySQL Connection failed: " . $e->getMessage());
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
