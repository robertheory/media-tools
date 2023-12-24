import { VIDEO_FORMATS } from '@/data/formats'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

export const ffmpegClient = new FFmpeg()

export const loadFfmpeg = async () => {
  await ffmpegClient.load({
    coreURL: await toBlobURL(`/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`/ffmpeg-core.wasm`, 'application/wasm'),
    workerURL: await toBlobURL(`/ffmpeg-core.worker.js`, 'text/javascript'),
  })
}

type TranscodeProps = {
  videoURL: string
  from: keyof typeof VIDEO_FORMATS
  to: keyof typeof VIDEO_FORMATS
}

export const handleTranscode = async ({
  videoURL,
  from,
  to,
}: TranscodeProps) => {
  await loadFfmpeg()

  const ffmpeg = ffmpegClient

  const inputFileName = `input${VIDEO_FORMATS[from]}`

  const outputFilename = `output${VIDEO_FORMATS[to]}`

  await ffmpeg.writeFile(inputFileName, await fetchFile(videoURL))

  await ffmpeg.exec(['-i', inputFileName, outputFilename])

  const fileData = await ffmpeg.readFile(outputFilename)

  const data = new Uint8Array(fileData as ArrayBuffer)

  return data
}
