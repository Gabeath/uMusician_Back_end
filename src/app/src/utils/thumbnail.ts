import ffmpeg, {ffprobe} from 'fluent-ffmpeg';
import {path as ffmpegPath} from '@ffmpeg-installer/ffmpeg';
import path from 'path';

ffmpeg.setFfmpegPath(ffmpegPath);

function generateThumbnail(videoPath: string): void{
  const destinationFolder = path.resolve(__dirname, '..', '..', '..', '..', 'temp');
  //const timeScreenShot = getVideoDuration(videoPath) / 2;
  const timeScreenShot = '2';
  ffmpeg(videoPath)
    .takeScreenshots({
      count: 1,
      timemarks: [ timeScreenShot ],
      filename: 'thumbnail.jpeg'
    }, destinationFolder);
}

// function getVideoDuration(videoPath: string): number{
//   let duration = '';
//   ffprobe(videoPath, function(err, data){
//     duration = data.streams[0].duration;
//   });
//   return Number.parseFloat(duration);
// }

export default generateThumbnail;
