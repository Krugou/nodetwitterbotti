<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept, Authorization');

$yelpApiKey = 'SmnwB0JMGLWfiMP7jcpFY4NNRtxVztjNKMb2AjR9sZB2LnaPtr8-GQd6enDpL-Z2s4h0ml_GSQ0uACBH_L6Ii9rvNVfSkaKO5c2L9EKG6FzFGl7t20xG3Khl6ClJZHYx';
$yelpApiUrl = 'https://api.yelp.com';

if (isset($_SERVER['REQUEST_URI'])) {
    $path = str_replace('/yelp', '', $_SERVER['REQUEST_URI']);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $yelpApiUrl . $path);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Authorization: Bearer ' . $yelpApiKey,
    ));

    // Handle POST requests
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
    }

    // Send the request to the target server
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // Forward the response from the target server to the client
    http_response_code($http_code);
    echo $response;

    curl_close($ch);
} else {
    echo json_encode(array('error' => 'Invalid request'));
}
