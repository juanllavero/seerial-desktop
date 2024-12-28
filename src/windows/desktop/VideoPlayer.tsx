import { useRef, useEffect } from 'react';
import "./VideoPlayer.scss";

interface VideoPlayerProps {
  source: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ source }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement && source) {
      // Verificamos si el navegador soporta HDR
      const hdrSupport =
        videoElement.canPlayType('video/mp4; codecs="hev1.2.6.L150.90"') || 
        videoElement.canPlayType('video/mp4; codecs="vp9.2"');

      if (!hdrSupport) {
        console.log("El navegador no soporta HDR.");
      }

      // Asignamos la fuente al elemento video
      videoElement.src = source;
      videoElement.play().catch(err => {
        console.error('Error al reproducir el vídeo:', err);
      });
    }
  }, [source]);

  return (
    <div className="player">
      <video
        ref={videoRef}
        controls
        className="video-player"
        style={{ width: '100%' }}
        playsInline
      >
        <source src={source} type="video/mp4" />
        Tu navegador no soporta la reproducción de vídeos HDR.
      </video>
    </div>
  );
};

export default VideoPlayer;
