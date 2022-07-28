import React from 'react'
import { useEffect, useState } from 'react'
import analyze from 'rgbaster'


export default function SongDisplay({item, progress, playing}) {
    const [primaryColor, setPrimaryColor] = useState('rgb(123,123,123)');
    const [textStyle, setTextStyle] = useState("dark");
    const [songProgress, setSongProgress] = useState(progress)

    useEffect(() => {
        // console.log(item)
        const getColors = async() => {
            const src = item.images ? item.images[0].url : item.album.images[0].url
            const result = await analyze(src, {scale:0.1})
            var val = result[0].color
            val =  val.split("(")[1].split(")")[0].split(",")
            var ind = 0;
            while (ind < result.length && (((parseInt(val[0]) + parseInt(val[1]) + parseInt(val[2])) / 3) < 50 || ((parseInt(val[0]) + parseInt(val[1]) + parseInt(val[2])) / 3) >200 )){
                ind++;
                val = result[ind].color;
                val =  val.split("(")[1].split(")")[0].split(",")
            }
            setTextStyle(((parseInt(val[0]) + parseInt(val[1]) + parseInt(val[2])) / 3) < 100 ? "light-text" : "dark-text")
            setPrimaryColor(result[ind].color)
        }
        getColors();
    }, [item])

    useEffect(() => {
        setSongProgress(progress);
        let reps = 1;
        if(playing){
            const progression = setInterval(() => {
                setSongProgress(progress + 100 * reps);
                reps++;
            }, 100)
            return () => {clearInterval(progression)} 
        }
    }, [progress])


  return (
    <div className='song-display' style={{backgroundColor: primaryColor}}>
        <img className='cover-image' 
            src={item.images ? item.images[0].url : item.album.images[0].url} 
            alt="" 
        />
        <div className={`song-info ${textStyle}`}>
            <div className="song-progress">
                <div className="pbarouter">
                    <div 
                        className="pbarinner" 
                        style={{width: (songProgress / item.duration_ms) * 100 + "%"}}
                        ></div>
                </div>
            </div>
            <h1>{item.name}</h1>
            <h2>
                {
                    item.artists?
                     item.artists.map((artist, index) => {
                        return index === 0 ? artist.name : ", " + artist.name;
                    })
                     :
                     item.show.name
                }
            </h2>
        </div>
    </div>
  )
}
