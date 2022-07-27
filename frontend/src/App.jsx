import SpotifyWebApi from "spotify-web-api-node";
import Dash from "./Dash";
import { useState } from "react";
import { clientId } from "./credentials";

let scopes = ['user-read-private', 'user-read-email', 'user-read-playback-state', 'user-read-currently-playing']
let redirectUri = 'http://localhost:3000'

var spotifyApi = new SpotifyWebApi({
  redirectUri: redirectUri,
  clientId: clientId
});

var authorizeURL = spotifyApi.createAuthorizeURL(scopes);

let params = (new URL(document.location)).searchParams;
let code = params.get('code'); 

function App() {
    const [aCode, setACode] = useState(code);
  return (
    <>
        <div className="">
            { aCode ?
                <Dash code={code} />
                :
                <div className="container -flex">
                    <a className="btn btn-success btn-lg" href={authorizeURL}>login</a>
                </div>
            }
        </div>
    </>
    );
}

export default App;
