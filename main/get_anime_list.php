<?php

require_once 'config.php';

function fetchAnimeList($CID) {
    // API URL
    $url = 'https://api.myanimelist.net/v2/anime/ranking?ranking_type=all&limit=100';

    // Create a custom stream context
    $context = stream_context_create(array(
        'http' => array(
            'method' => 'GET',
            'header' => "X-MAL-CLIENT-ID: $CID"
        )
    ));

    // Send a GET request using file_get_contents and the custom stream context
    $response = file_get_contents($url, false, $context);

    // Set content type header to display response as JSON
    header('Content-Type: application/json');

    // Print the response
    echo $response;

    // $data = json_decode($response, true);

    // $animeTitles = array();
    // foreach ($data['data'] as $anime) {
    //     $animeTitles[] = $anime['node'];
    // }

    return $response;
}

fetchAnimeList($ID)

?>

