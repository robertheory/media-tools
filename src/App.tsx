import { Progress } from '@/components/ui/progress'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Input } from './components/ui/input'
import { ffmpegClient, handleTranscode } from './services/ffmpeg'

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const logsRef = useRef<HTMLDivElement | null>(null)
  const [progress, setProgress] = useState(0)

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0]

    if (!file) return

    const url = URL.createObjectURL(file)

    const data = await handleTranscode({
      videoURL: url,
      from: 'WEBM',
      to: 'MP4',
    })

    if (videoRef.current) {
      videoRef.current.style.display = 'block'

      videoRef.current.src = URL.createObjectURL(
        new Blob([data.buffer], { type: 'video/mp4' })
      )
    }
  }

  useEffect(() => {
    ffmpegClient.on('log', ({ message }) => {
      if (logsRef.current) {
        logsRef.current.innerText = message
      }
    })

    ffmpegClient.on('progress', ({ progress }) => {
      setProgress(Math.round(progress * 100))
    })
  }, [])

  return (
    <div
      className="
      w-screen h-screen flex flex-col justify-start items-center
      bg-
    "
    >
      <div
        className="
        w-full max-w-[900px] h-full bg-slate-300
        flex flex-col justify-start items-center
        p-8 gap-4
      "
      >
        <h1 className="text-2xl font-bold">Convert Tools</h1>

        <video
          ref={videoRef}
          controls
          width="800px"
          style={{
            display: 'none',
          }}
        ></video>

        <Input
          type="file"
          placeholder="Arquivo"
          accept=".webm"
          className="max-w-[400px]"
          onChange={handleFile}
        />

        <Progress value={progress} className="w-[60%]" />

        <div
          className="
          w-full flex flex-col justify-start items-start
        bg-slate-500 rounded-md p-4 text-white
          gap-2
        "
        >
          <h2 className="text-xl">Logs</h2>

          <p ref={logsRef} className="font-light text-justify">
            Log stdout
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
