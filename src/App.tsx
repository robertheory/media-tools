import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { useRef, useState } from 'react';

function App() {
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  const load = async () => {
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on('log', ({ message }) => {
      if (messageRef.current) messageRef.current.innerHTML = message;
    });

    await ffmpeg.load({
      coreURL: await toBlobURL(`/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`/ffmpeg-core.wasm`, 'application/wasm'),
      workerURL: await toBlobURL(`/ffmpeg-core.worker.js`, 'text/javascript'),
    });
    setLoaded(true);
  };

  const transcode = async () => {
    const videoURL = 'http://localhost:5173/sample-video.avi';

    const ffmpeg = ffmpegRef.current;

    await ffmpeg.writeFile('input.avi', await fetchFile(videoURL));

    await ffmpeg.exec(['-i', 'input.avi', 'output.mp4']);

    const fileData = await ffmpeg.readFile('output.mp4');

    const data = new Uint8Array(fileData as ArrayBuffer);

    if (videoRef.current) {
      videoRef.current.src = URL.createObjectURL(
        new Blob([data.buffer], { type: 'video/mp4' })
      );
    }
  };

  return loaded ? (
    <>
      <video ref={videoRef} controls width='800px'></video>
      <br />
      <button onClick={transcode}>Transcode avi to mp4</button>
      <p ref={messageRef}></p>
    </>
  ) : (
    <button onClick={load}>Load ffmpeg-core</button>
  );
}

export default App;
