import { fetchFile } from '@ffmpeg/util'
import { useEffect, useRef, useState } from 'react'
import { Button } from './components/ui/button'
import { ffmpegClient, loadFfmpeg } from './services/ffmpeg'

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [log, setLog] = useState('')

  const transcode = async () => {
    await loadFfmpeg()

    const videoURL = 'http://localhost:5173/bunny.webm'

    const ffmpeg = ffmpegClient

    await ffmpeg.writeFile('input.webm', await fetchFile(videoURL))

    await ffmpeg.exec(['-i', 'input.webm', 'output.mp4'])

    const fileData = await ffmpeg.readFile('output.mp4')

    const data = new Uint8Array(fileData as ArrayBuffer)

    if (videoRef.current) {
      videoRef.current.style.display = 'block'

      videoRef.current.src = URL.createObjectURL(
        new Blob([data.buffer], { type: 'video/mp4' })
      )
    }
  }

  useEffect(() => {
    ffmpegClient.on('log', ({ message }) => {
      setLog(message)
    })

    // ffmpegClient.on('progress', ({ progress, time }) => {
    //   console.log('progress, time', progress, time);
    // });
  }, [])

  return (
    <div className=" w-screen h-screen flex flex-col justify-center items-center">
      <video
        ref={videoRef}
        controls
        width="800px"
        style={{
          display: 'none',
        }}
      ></video>

      <br />
      <Button onClick={transcode}>Transcode</Button>
      <p>{log}</p>
    </div>
  )
}

export default App
