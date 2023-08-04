<?php
// Code adapted from work done by Kay Rogage

require_once '/var/www/html/vendor/autoload.php';
require_once '../functions/echoOAuthPage.php';

session_start();

$client = new Google\Client(); //create new instance of client
$client->setAuthConfig('client_secret.json'); //pass client_secret for app authorisation 
$client->addScope("https://www.googleapis.com/auth/userinfo.email");

if (isset($_SESSION['access_token']) && $_SESSION['access_token']) {

    $client->setAccessToken($_SESSION['access_token']);

    echoOAuthPage(); //call function to create page about oAuth
    
} else {

    $redirect_uri = 'http://' . $_SERVER['HTTP_HOST'] . '/oauth/oauth2callback.php'; //if access_token not set, redirect back to login page instead of oauth page
    header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));

}

if ($_SERVER['REQUEST_METHOD'] == "POST" and isset($_POST['signOut'])) {
    //check if current method is POST and key is signOut
    $client->revokeToken($_SESSION['access_token']); //client removes access token from $_SESSION global variable 
    session_destroy(); //destroys session, revoking token removes the user's access and destroying session logs them out.

    $redirect = 'http://' . $_SERVER['HTTP_HOST'] . '/index.html'; //redirects back to the home page after remvoing token and destroying session
    header('Location: ' . filter_var($redirect, FILTER_SANITIZE_URL));
}


