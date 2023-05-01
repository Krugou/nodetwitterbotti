


<?php

define('API_BASE', 'https://api.yelp.com');
$yelpApiKey = 'SmnwB0JMGLWfiMP7jcpFY4NNRtxVztjNKMb2AjR9sZB2LnaPtr8-GQd6enDpL-Z2s4h0ml_GSQ0uACBH_L6Ii9rvNVfSkaKO5c2L9EKG6FzFGl7t20xG3Khl6ClJZHYx';
session_start();

$endpoint = @$_REQUEST['_ep'];
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Authorization');
header("Access-Control-Allow-Origin: *");

// respond to preflights
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // return only the headers and not the content
    // only allow CORS if we're doing a GET - i.e. no saving for now.
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']) && $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] == 'GET') {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Headers: Authorization');
    }
    exit;
}

if (!empty($endpoint)) {
    $headers      = apache_request_headers();
    $bearer_token = $headers['Authorization'];
    if (empty($bearer_token) || strlen($bearer_token) < 8) {
        error('No API key provided');
    }
    echo request($bearer_token, API_BASE . '/v3', $endpoint, $_REQUEST);
} else {
    error('No endpoint requested');
}

function error($message)
{
    http_response_code(400);
    echo json_encode(array('error' => $message));
    die;
}

/**
 * Yelp Fusion API code sample.
 *
 * This program demonstrates the capability of the Yelp Fusion API
 * by using the Business Search API to query for businesses by a
 * search term and location, and the Business API to query additional
 * information about the top result from the search query.
 *
 * Please refer to http://www.yelp.com/developers/v3/documentation
 * for the API documentation.
 *
 * Sample usage of the program:
 * `php sample.php --term="dinner" --location="San Francisco, CA"`
 */

/**
 * Makes a request to the Yelp API and returns the response
 *
 * @param    $bearer_token   API bearer token from obtain_bearer_token
 * @param    $host    The domain host of the API
 * @param    $path    The path of the API after the domain.
 * @param    $url_params    Array of query-string parameters.
 *
 * @return   The JSON response from the request
 */
function request($bearer_token, $host, $path, $url_params = array())
{
    // Send Yelp API Call
    try {
        $curl = curl_init();
        if (false === $curl) {
            throw new Exception('Failed to initialize');
        }

        $url = $host . $path . "?" . http_build_query($url_params);
        curl_setopt_array($curl, array(
            CURLOPT_URL            => $url,
            CURLOPT_RETURNTRANSFER => true,  // Capture response.
            CURLOPT_ENCODING       => "",  // Accept gzip/deflate/whatever.
            CURLOPT_MAXREDIRS      => 10,
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST  => "GET",
            CURLOPT_HTTPHEADER     => array(
                "authorization:" . $bearer_token,
                "cache-control: no-cache",
            ),
        ));

        $response = curl_exec($curl);

        if (false === $response) {
            throw new Exception(curl_error($curl), curl_errno($curl));
        }
        $http_status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        if (200 != $http_status) {
            throw new Exception($response, $http_status);
        }

        curl_close($curl);
    } catch (Exception $e) {
        trigger_error(sprintf(
            'Curl failed with error #%d: %s',
            $e->getCode(), $e->getMessage()),
            E_USER_ERROR);
    }

    return $response;
}
