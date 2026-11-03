"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ListMusic, Music, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import type { Track } from "@/lib/types";
import { SafeImage } from "./SafeImage";

// Fixed per-bar timings so the visualizer doesn't re-randomize on every render.
const BARS = [0.62, 0.95, 0.71, 1.1, 0.58, 0.88, 0.77, 1.02].map((duration, i) => ({ duration, delay: (i * 0.11) % 0.8 }));

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MusicPlayer({ tracks }: { tracks: Track[] }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn("Playback blocked or interrupted:", err);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  if (tracks.length === 0) return null;
  const activeTrack = tracks[currentTrackIndex] ?? tracks[0];

  const playTrack = (index: number) => {
    setCurrentTrackIndex((index + tracks.length) % tracks.length);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) audioRef.current.currentTime = time;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    if (vol > 0) setIsMuted(false);
  };

  const iconButton =
    "p-2 border-2 border-black bg-white hover:bg-yellow rounded-full shadow-[1.5px_1.5px_0px_#000] text-black transition-all cursor-pointer";

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans">
      <audio
        ref={audioRef}
        src={activeTrack.audioUrl}
        preload="none"
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={() => playTrack(currentTrackIndex + 1)}
      />

      {isExpanded ? (
        <section
          aria-label="Pemutar musik"
          className="border-3 border-black bg-cream-dark p-4 rounded-xl shadow-[8px_8px_0px_#0A0A0A] flex flex-col gap-3 w-[calc(100vw-3rem)] max-w-96"
        >
          <div className="flex items-center justify-between border-b border-dashed border-black/25 pb-2.5">
            <div className="flex items-center gap-1.5 font-mono text-xs font-black uppercase text-black/60">
              <Music className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Pemutar Musik Chronica</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowPlaylist((v) => !v)}
                className={`p-1 border border-black rounded transition-all cursor-pointer text-black ${showPlaylist ? "bg-neon-green" : "bg-white hover:bg-yellow"}`}
                aria-label="Daftar putar"
                aria-expanded={showPlaylist}
              >
                <ListMusic className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="p-1 border border-black bg-white hover:bg-coral rounded text-black transition-all cursor-pointer"
                aria-label="Kecilkan pemutar"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 py-2">
            <div className="relative h-16 w-16 border-2 border-black rounded-full overflow-hidden bg-yellow shrink-0 shadow-[2px_2px_0px_#000] flex items-center justify-center">
              {activeTrack.coverUrl ? (
                <SafeImage
                  src={activeTrack.coverUrl}
                  alt=""
                  fill
                  sizes="64px"
                  className={`object-cover rounded-full animate-spin-vinyl ${isPlaying ? "" : "[animation-play-state:paused]"}`}
                />
              ) : (
                <Music className="h-6 w-6 text-black" aria-hidden="true" />
              )}
              <div className="absolute h-3 w-3 bg-cream-dark border border-black rounded-full z-10" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-black text-base text-black leading-tight truncate">{activeTrack.title}</h4>
              <p className="font-mono text-xs font-bold text-electric-blue uppercase mt-1 truncate">{activeTrack.artist}</p>
              <div className="flex items-end gap-0.5 mt-2 h-4" aria-hidden="true">
                {BARS.map((bar, i) => (
                  <div
                    key={i}
                    className="w-1 bg-black rounded-t origin-bottom"
                    style={{
                      height: isPlaying ? "100%" : "20%",
                      animation: isPlaying ? `bounceWave ${bar.duration}s ease-in-out ${bar.delay}s infinite alternate` : "none",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 mt-1">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              aria-label="Posisi lagu"
              className="w-full accent-electric-blue h-1.5 cursor-pointer"
            />
            <div className="flex justify-between font-mono text-[10px] text-black/60">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 mt-1 border-t border-dashed border-black/25 pt-3">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => playTrack(currentTrackIndex - 1)} className={iconButton} aria-label="Lagu sebelumnya">
                <SkipBack className="h-3.5 w-3.5 fill-black" />
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying((v) => !v)}
                className="p-3 border-2 border-black bg-yellow hover:bg-neon-green rounded-full shadow-[2px_2px_0px_#000] text-black transition-all cursor-pointer"
                aria-label={isPlaying ? "Jeda" : "Putar"}
              >
                {isPlaying ? <Pause className="h-4.5 w-4.5 fill-black" /> : <Play className="h-4.5 w-4.5 fill-black ml-0.5" />}
              </button>
              <button type="button" onClick={() => playTrack(currentTrackIndex + 1)} className={iconButton} aria-label="Lagu berikutnya">
                <SkipForward className="h-3.5 w-3.5 fill-black" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 max-w-[140px] flex-1">
              <button
                type="button"
                onClick={() => setIsMuted((v) => !v)}
                className="text-black/85 hover:text-coral transition-colors"
                aria-label={isMuted ? "Bunyikan" : "Bisukan"}
              >
                {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Volume"
                className="w-full accent-black h-1 cursor-pointer"
              />
            </div>
          </div>

          {showPlaylist && (
            <div className="border-2 border-black bg-cream p-3 rounded-lg mt-2 flex flex-col gap-1.5 max-h-48 overflow-y-auto shadow-[4px_4px_0px_#000]">
              <div className="font-mono text-[10px] font-black uppercase text-black/50 mb-1 border-b border-black/15 pb-1">Daftar Putar</div>
              {tracks.map((track, index) => (
                <button
                  type="button"
                  key={track.id}
                  onClick={() => playTrack(index)}
                  aria-current={index === currentTrackIndex ? "true" : undefined}
                  className={`flex items-center gap-2 w-full text-left p-1.5 rounded transition-colors text-xs font-semibold cursor-pointer border ${
                    index === currentTrackIndex ? "bg-electric-blue text-white border-black" : "bg-white hover:bg-yellow border-black/15"
                  }`}
                >
                  <Music className="h-3 w-3 shrink-0" aria-hidden="true" />
                  <div className="flex-1 truncate">
                    <span className="font-bold">{track.title}</span>
                    <span className="opacity-80 block text-[10px] uppercase font-mono mt-0.5">{track.artist}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center border-3 border-black bg-yellow hover:bg-neon-green rounded-full shadow-[4px_4px_0px_#000] text-black transition-all hover:scale-105 hover:rotate-3 duration-200 cursor-pointer"
          aria-label="Buka pemutar musik"
        >
          <Music className={`h-6 w-6 ${isPlaying ? "animate-spin-vinyl" : ""}`} aria-hidden="true" />
          {isPlaying && (
            <span className="absolute top-2 right-2 flex h-2.5 w-2.5" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-coral" />
            </span>
          )}
        </button>
      )}
    </div>
  );
}
