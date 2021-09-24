import ffmpeg from 'fluent-ffmpeg';
import {path as ffmpegPath} from '@ffmpeg-installer/ffmpeg';
import {path as ffprobePath} from '@ffprobe-installer/ffprobe';
import path from 'path';

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

async function generateThumbnail(videoPath: string): Promise<void>{
  const timeScreenShot = await getVideoDuration(videoPath) / 2;

  return new Promise((resolve, reject) => {
    const destinationFolder = path.resolve(__dirname, '..', '..', '..', '..', 'temp');
    const video = ffmpeg(videoPath)
      .takeScreenshots({
        count: 1,
        timemarks: [ timeScreenShot.toString() ],
        filename: 'thumbnail.jpeg'
      }, destinationFolder);
    video.on('end', () => {
      resolve();
    });
    video.on('error', ()=>{
      reject();
    });
  });
}

function getVideoDuration(videoPath: string): Promise<number>{
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, function(err, metadata) {
      if(err)
        reject(err);
      
      resolve(metadata.format.duration);
    });
  });
}

export default generateThumbnail;
