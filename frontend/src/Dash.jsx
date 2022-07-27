import React from 'react'
import useAuth from './useAuth'
import { useEffect, useState } from "react"
import SongDisplay from './SongDisplay';

export default function Dash({code, setLoggedIn}) {
    const [song, setSong] = useState(undefined);
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
        return () => {clearInterval(songInterval)};
    }, [song]);

    const getSong = async() => {
        const res = await fetch("https://api.spotify.com/v1/me/player?type=episode,track", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken,
                "Accept": "application/json"
            }
        })
        const data = await res.json();
        setSong(data.item);
    }

  return (
    <div className='dash-container d-flex align-items-center justify-content-center flex-column'>
        {song && <SongDisplay item={song} />}
    </div>
  )
}
