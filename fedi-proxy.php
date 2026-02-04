<?php
/*
 * Name: FediLive Comments (Proxy)
 * Licence: AGPL
 * Author: Jools <jools@friendica.de>
 * Version: 1.0
 * Description: A privacy-first API proxy to fetch live Fediverse comments for static sites without data retention.
 * Date: 19.12.2025
 *
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// --- KONFIGURATION ---
$host = "domain.de"; // <--- HIER DEINE ECHTE FRIENDICA-DOMAIN EINTRAGEN
// ---------------------

$fediId = $_GET['id'] ?? '';
if (!preg_match('/^[0-9]+$/', $fediId)) {
    die(json_encode(["error" => "Ungültige ID"]));
}

function fetch_data($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Publii-Proxy/1.0');
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_WHATEVER);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ($httpCode === 200) ? $response : false;
}

// 1. Hauptbeitrag abrufen
$mainUrl = "https://{$host}/api/v1/statuses/{$fediId}";
$mainResponse = fetch_data($mainUrl);

// 2. Kommentare abrufen
$contextUrl = "https://{$host}/api/v1/statuses/{$fediId}/context";
$contextResponse = fetch_data($contextUrl);

if ($mainResponse === false || $contextResponse === false) {
    http_response_code(404);
    echo json_encode(["error" => "Inhalt bei Friendica nicht gefunden oder Timeout"]);
} else {
    echo json_encode([
        "post" => json_decode($mainResponse),
        "details" => json_decode($contextResponse)
    ]);
}
