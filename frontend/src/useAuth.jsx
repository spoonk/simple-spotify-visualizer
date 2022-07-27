import { useState, useEffect } from 'react'
import axios from "axios"
export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState()
    
    useEffect(() => {
        axios.post(`http://localhost:3001/login`, {
                code,
            })
            .then(res => {
                // weird thing where react is sending request twice
                if (!res.data.accessToken) return;
                setAccessToken(res.data.accessToken)
                setRefreshToken(res.data.refreshToken)
                setExpiresIn(res.data.expiresIn)
                window.history.pushState({}, null, "/")
            }).catch(err => {
                window.location = "/"
            })
    }, [code])

    useEffect(() => {
        // fetch new accesstoken from server
        if (!refreshToken || !expiresIn) return;
        const refreshInterval = setInterval(() => {
            axios.post("http://localhost:3001/refresh", {refreshToken})
            .then(res => {
                console.log(res)
                setAccessToken(res.data.accessToken)
                setExpiresIn(res.data.expiresIn)
            })
        }, (expiresIn - 60) * 1000);
        
        return () => { clearInterval(refreshInterval)};
    }, [refreshToken, expiresIn]);

    return accessToken
}
