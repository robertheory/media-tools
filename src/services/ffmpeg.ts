import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

export const ffmpegClient = new FFmpeg();

export const loadFfmpeg = async () => {
  await ffmpegClient.load({
    coreURL: await toBlobURL(`/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`/ffmpeg-core.wasm`, 'application/wasm'),
    workerURL: await toBlobURL(`/ffmpeg-core.worker.js`, 'text/javascript'),
  });
};
