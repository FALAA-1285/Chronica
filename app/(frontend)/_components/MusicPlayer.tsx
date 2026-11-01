"use client";

import React, { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, ListMusic, X, ChevronUp, ChevronDown } from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl?: string;
  duration?: number;
}

export function MusicPlayer() {
  const pathname = usePathname();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch tracks from API
  useEffect(() => {
    if (pathname?.startsWith("/custom-admin")) return;
    async function fetchTracks() {
      try {
        const res = await fetch("/api/music");
        if (res.ok) {
          const data = await res.json();
          setTracks(data);
        }
      } catch (err) {
        console.error("Failed to load tracks:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTracks();
  }, [pathname]);

  // Update volume and source changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle play status
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.warn("Autoplay blocked or playback interrupted:", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const activeTrack = tracks[currentTrackIndex];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    handleNext();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (vol > 0) setIsMuted(false);
  };

  const handleNext = () => {
    if (tracks.length === 0) return;
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setCurrentTime(0);
    // Auto play on transition
    setTimeout(() => setIsPlaying(true), 50);
  };

  const handlePrev = () => {
    if (tracks.length === 0) return;
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setCurrentTime(0);
    // Auto play on transition
    setTimeout(() => setIsPlaying(true), 50);
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    setTimeout(() => setIsPlaying(true), 50);
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (pathname?.startsWith("/custom-admin")) return null;

  if (isLoading || tracks.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none font-sans">
      {/* HTML Audio element */}
      <audio
        ref={audioRef}
        src={activeTrack?.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
      />

      {/* Expanded Main Player */}
      {isExpanded ? (
        <div className="border-3 border-black bg-cream-dark p-4 rounded-xl shadow-[8px_8px_0px_#0A0A0A] dark:border-cream dark:bg-dark-surface dark:shadow-[8px_8px_0px_#FFFBF0] flex flex-col gap-3 w-80 sm:w-96 transition-all duration-300 relative">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-dashed border-black/25 dark:border-cream/25 pb-2.5">
            <div className="flex items-center gap-1.5 font-mono text-xs font-black uppercase text-black/60 dark:text-cream/60">
              <Music className="h-3.5 w-3.5" />
              <span>CHRONICA MUSIC PLAYER</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              {/* Toggle Playlist Button */}
              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className={`p-1 border border-black rounded transition-all cursor-pointer ${
                  showPlaylist ? "bg-neon-green" : "bg-white hover:bg-yellow text-black"
                } dark:border-cream dark:text-black`}
                title="Playlist"
              >
                <ListMusic className="h-4 w-4" />
              </button>
              {/* Minimize Player Button */}
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 border border-black bg-white hover:bg-coral rounded text-black transition-all cursor-pointer dark:border-cream"
                title="Minimize"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Active Track Info Container */}
          <div className="flex items-center gap-4 py-2">
            {/* Spinning Vinyl Record Visual */}
            <div className="relative h-16 w-16 border-2 border-black dark:border-cream rounded-full overflow-hidden bg-yellow shrink-0 shadow-[2px_2px_0px_#000] flex items-center justify-center">
              {activeTrack?.coverUrl ? (
                <img
                  src={activeTrack.coverUrl}
                  alt={activeTrack.title}
                  className="h-full w-full object-cover rounded-full"
                  style={{
                    animation: isPlaying ? "spin 15s linear infinite" : "none",
                    animationPlayState: isPlaying ? "running" : "paused",
                  }}
                />
              ) : (
                <Music className="h-6 w-6 text-black" />
              )}
              {/* Spindle hole in center */}
              <div className="absolute h-3 w-3 bg-cream-dark dark:bg-dark-surface border border-black dark:border-cream rounded-full z-10"></div>
            </div>

            {/* Song details */}
            <div className="flex-1 min-w-0">
              <h4 className="font-black text-base text-black dark:text-cream leading-tight truncate">
                {activeTrack?.title}
              </h4>
              <p className="font-mono text-xs font-bold text-electric-blue uppercase mt-1 truncate">
                {activeTrack?.artist}
              </p>
              
              {/* Dynamic waveform visualizer bar that bounces when audio is playing */}
              <div className="flex items-end gap-0.5 mt-2 h-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => {
                  const randomDelay = Math.random() * 0.8;
                  const randomDuration = 0.5 + Math.random() * 0.7;
                  return (
                    <div
                      key={bar}
                      className="w-1 bg-black dark:bg-cream rounded-t"
                      style={{
                        height: isPlaying ? "100%" : "20%",
                        animation: isPlaying
                          ? `bounceWave ${randomDuration}s ease-in-out ${randomDelay}s infinite alternate`
                          : "none",
                        transformOrigin: "bottom",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Scrubbing timeline range bar */}
          <div className="flex flex-col gap-1 mt-1">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full accent-electric-blue bg-black/15 dark:bg-cream/15 rounded-lg h-1.5 cursor-pointer border border-black dark:border-cream transition-all"
            />
            <div className="flex justify-between font-mono text-[10px] text-black/60 dark:text-cream/60">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playback Controls & Volume Row */}
          <div className="flex items-center justify-between gap-4 mt-1 border-t border-dashed border-black/25 dark:border-cream/25 pt-3">
            {/* Playback Nav controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2 border-2 border-black bg-white hover:bg-yellow rounded-full shadow-[1.5px_1.5px_0px_#000] text-black transition-all cursor-pointer dark:border-cream dark:shadow-[1.5px_1.5px_0px_#FFF]"
                title="Previous Track"
              >
                <SkipBack className="h-3.5 w-3.5 fill-black" />
              </button>
              <button
                onClick={handlePlayPause}
                className="p-3 border-2 border-black bg-yellow hover:bg-neon-green rounded-full shadow-[2px_2px_0px_#000] text-black transition-all cursor-pointer dark:border-cream dark:shadow-[2px_2px_0px_#FFF]"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="h-4.5 w-4.5 fill-black" />
                ) : (
                  <Play className="h-4.5 w-4.5 fill-black ml-0.5" />
                )}
              </button>
              <button
                onClick={handleNext}
                className="p-2 border-2 border-black bg-white hover:bg-yellow rounded-full shadow-[1.5px_1.5px_0px_#000] text-black transition-all cursor-pointer dark:border-cream dark:shadow-[1.5px_1.5px_0px_#FFF]"
                title="Next Track"
              >
                <SkipForward className="h-3.5 w-3.5 fill-black" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-1.5 max-w-[120px] sm:max-w-[140px] flex-1">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-black/85 dark:text-cream/85 hover:text-coral transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full accent-black dark:accent-cream bg-black/15 dark:bg-cream/15 rounded-lg h-1 cursor-pointer"
              />
            </div>
          </div>

          {/* Collapsible Playlist drawer */}
          {showPlaylist && (
            <div className="border-2 border-black bg-cream p-3 rounded-lg mt-2 flex flex-col gap-1.5 max-h-48 overflow-y-auto shadow-[4px_4px_0px_#000] dark:border-cream dark:bg-dark-bg scrollbar-thin">
              <div className="font-mono text-[10px] font-black uppercase text-black/50 dark:text-cream/50 mb-1 border-b border-black/15 dark:border-cream/15 pb-1">
                DAFTAR PUTAR (PLAYLIST)
              </div>
              {tracks.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => handleTrackSelect(index)}
                  className={`flex items-center gap-2 w-full text-left p-1.5 rounded transition-colors text-xs font-semibold cursor-pointer border ${
                    index === currentTrackIndex
                      ? "bg-electric-blue text-white border-black"
                      : "bg-white hover:bg-yellow border-black/15 dark:bg-dark-surface dark:border-cream/15 dark:text-cream dark:hover:text-black"
                  }`}
                >
                  <Music className="h-3 w-3 shrink-0" />
                  <div className="flex-1 truncate">
                    <span className="font-bold">{track.title}</span>
                    <span className="opacity-80 block text-[10px] uppercase font-mono mt-0.5">{track.artist}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

        </div>
      ) : (
        /* Collapsed Floating Trigger Icon Button */
        <button
          onClick={() => setIsExpanded(true)}
          className="flex h-14 w-14 items-center justify-center border-3 border-black bg-yellow hover:bg-neon-green rounded-full shadow-[4px_4px_0px_#000] text-black transition-all hover:scale-105 hover:rotate-3 duration-200 cursor-pointer dark:border-cream dark:shadow-[4px_4px_0px_#FFF]"
          title="Buka Pemutar Musik"
        >
          {isPlaying ? (
            /* CD rotation visualization */
            <div className="relative flex items-center justify-center">
              <Music
                className="h-6 w-6"
                style={{
                  animation: "spin 5s linear infinite",
                }}
              />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-coral"></span>
              </span>
            </div>
          ) : (
            <Music className="h-6 w-6" />
          )}
        </button>
      )}

      {/* Styled audio keyframe animation */}
      <style>{`
        @keyframes bounceWave {
          0% { transform: scaleY(0.2); }
          100% { transform: scaleY(1.0); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
export default MusicPlayer;
