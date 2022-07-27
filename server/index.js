const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const querystring = require('node:querystring');
const app = express()

const {clientId, clientSecret} = require('./credentials')

app.use(cors())
app.use(bodyParser.json())

const redirectUri = 'http://localhost:3000'

app.get("/", (req, res) => {
    res.send("ok!")
})

app.post("/login", (req, res) => {
    const code = req.body.code   

    fetch('https://accounts.spotify.com/api/token', {
        method:"POST",
        headers: {
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
            'Content-Type' : 'application/x-www-form-urlencoded' ,
        },
        body: querystring.stringify({
            code: code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
        })
    }).then(data => {
        data.json().then(dat => {
            console.log(dat)
            res.json({
                accessToken: dat['access_token'],
                expiresIn: dat['expires_in'],
                refreshToken: dat['refresh_token']
            })
        })
    }).catch(err => {
        res.redirect("/")
    })
})

app.post("/refresh", (req, res) => {
    const refresh = req.body.refreshToken;
    fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
            'Content-Type' : 'application/x-www-form-urlencoded' ,
        },
        body: querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token: refresh,
            client_id: clientId
        })
    }).then(data => {
        data.json().then(dat => {
            console.log(dat)
            res.json({
                accessToken: dat["access_token"], 
                expiresIn: dat["expires_in"]
            })
        })
    })

})

app.listen(3001, () => {
    console.log("server started on port 3001")
})