<?php

function echoOAuthPage()
{
    echo
    '<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Map</title>
        <link rel="stylesheet" href="../cs/style.css">
    </head>
        <body>
            <div class="top-container">
                <a href="../index.html" id="home-button">
                    <h1 id="title">Living Planet</h1>
                </a>
                <form class="logout" action="login.php" method="post">
                    <input type="submit" name="signOut" value="Sign Out"/> 
                </form>
            </div>
            <div class="middle-container">
                <div id="headings">
                    <h1>Google OAuth<h1>
                    <h2>What is Google OAuth?</h2>
                </div>
                <div id="content">
                    <p>
                        Google OAuth is a delegation protocol that allows users to authorise and access web applications without having to create a new account for said application Richer and Sanso (2017). 
                        <br>
                        <br>
                        Google OAuth works by first having the web application owner authorising the app by registering the URLs with Google, when a user goes to authorise with OAuth firstly, 
                        users have to authorise their Google credentials by logging in with their username and password (and any pending 2FA), after authentication, an access token is generated and 
                        shared with the web application, the token allows the authenticated user to access information or webpages that have been defined by the developer (Hashesh and Moore, no date).
                        <br>
                        <br>
                        The user can then logout/deauthorise by sending another request which upon authorisation will destroy the access token, meaning that a new one will need to be generated the next time they wish to access.
                    </p>
                </div>
            </div>
            <div class="bottom-container">
                <p class="copyright-name">© Martyn Clow.</p>
            </div>
        </body>
    </html>';
}

// '<!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <title>oAuth</title>
//         <link rel="stylesheet" href="../cs/style.css">
//     </head>
//     <body>
//         <div class="grid-container">
//             <h1>Living Planet</h1>
//                 <div class="logout">
//                     <form action="login.php" method="post">
//                         <input type="submit" name="signOut" value="Sign Out"/> 
//                     </form>
//                 </div>
//             <div id="oAuth-content">
//                 <h2>Google OAuth</h2>
//                     <h3> The oAuth Procces </h3>
//                         <p>
                            
//                         <p>
//             /div>    
//         </div>
//     </body>
//     </html>';