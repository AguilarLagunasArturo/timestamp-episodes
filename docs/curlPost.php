<?php
function fetchAnimeList() {
    // API URL
    // $url = 'https://api.myanimelist.net/v2/anime?q=one&limit=4';
    $url = 'https://api.myanimelist.net/v2/anime/ranking?ranking_type=all&limit=1';

    // Initialize cURL session
    $ch = curl_init($url);

    // Set cURL options
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'X-MAL-CLIENT-ID: a9d3e4b4f561a639b6195b4df71dbfcc'
    ));

    // Execute cURL session and get the response
    $response = curl_exec($ch);

    // Close cURL session
    curl_close($ch);

    // Set content type header to display response as JSON
    header('Content-Type: application/json');

    // Print the response
    echo $response;
    $data = json_decode($response, true);

    $animeTitles = array();
    foreach ($data['data'] as $anime) {
        $animeTitles[] = $anime['node'];
    }

    return $animeTitles;
}

$animeList = fetchAnimeList();
// var_dump($animeList);

?>
