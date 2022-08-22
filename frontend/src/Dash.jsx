import React from 'react'
import useAuth from './useAuth'
import { useEffect, useState } from "react"
import SongDisplay from './SongDisplay';

export default function Dash({ code, setLoggedIn }) {
    const [context, setContext] = useState(undefined);
    const accessToken = useAuth(code)

    useEffect(() => {
        if (!accessToken) return
        getSong()
    }, [accessToken])

    useEffect(() => {
        const songInterval = setInterval(() => {
            if (!accessToken) return
            console.log("refreshing song")
            getSong()
        }, 10000);
        console.log(songInterval)
        return () => { clearInterval(songInterval) };
    }, [context]);

    const getSong = async () => {
        const res = await fetch("https://api.spotify.com/v1/me/player?additional_types=track,episode", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken,
                "Accept": "application/json"
            }
        })
        const data = await res.json();
        console.log(data)
        setContext(data)
    }

    return (
        <div className='dash-container d-flex align-items-center justify-content-center flex-column'>
            {context && <SongDisplay item={context.item} progress={context.progress_ms} playing={context.is_playing} />}
        </div>
    )
}
