import { useEffect, useRef } from "react";
import * as Icons from "lucide-react";

// Πλέον το SoundCard δεν έχει δικό του state.
// Παίρνει εντολές (props) από το App.jsx.
const SoundCard = ({
  sound,
  isPlaying,
  volume,
  onToggle,
  onVolumeChange,
  isGloballyMuted,
}) => {
  const audioRef = useRef(null);
  const IconComponent = Icons[sound.icon] || Icons.HelpCircle;
  const volumePercent = Math.round(volume * 100);

  // --- AUDIO LOGIC ---

  // 1. Init Audio
  useEffect(() => {
    const audio = new Audio(sound.src);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sound.src]);

  // 2. Handle Volume Updates
  useEffect(() => {
    if (audioRef.current && !isGloballyMuted) {
      audioRef.current.volume = volume;
    }
  }, [volume, isGloballyMuted]);

  // 3. Handle Play/Pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((e) => console.error("Play error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // This effect ensures the actual audio element reflects the global mute status
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      // Only affect currently playing sounds
      if (isGloballyMuted) {
        // Mute the volume immediately (set to 0)
        audioRef.current.volume = 0;
      } else {
        // Restore volume to user's setting (volume prop)
        audioRef.current.volume = volume;
      }
    }
  }, [isGloballyMuted, isPlaying, volume]);

  return (
    <div
      title={`Volume ${volumePercent}`}
      className={`p-6 rounded-2xl duration-300 border border-transparent hover:-translate-y-2 flex flex-col justify-center items-center gap-5 ${
        isPlaying
          ? `${sound.color} shadow-lg scale-105`
          : "bg-gray-800 hover:bg-gray-700"
      }`}
    >
      <button
        onClick={() => onToggle(sound.id)} // Καλούμε τη συνάρτηση του App
        className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <IconComponent
          size={48}
          className={isPlaying ? "text-white" : "text-gray-400"}
        />
      </button>

      <h3 className="text-white font-medium text-center md:text-lg">
        {sound.label}
      </h3>

      {isPlaying && (
        <div className="w-full">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) =>
              onVolumeChange(sound.id, parseFloat(e.target.value))
            }
            disabled={isGloballyMuted}
            className={`
            w-full h-1 
                bg-gray-600 rounded-lg 
                appearance-none cursor-pointer 
                accent-white
                
                /* Custom thumb styling using arbitrary variants for cross-browser support */
                [&::-webkit-slider-thumb]:w-4 
                [&::-webkit-slider-thumb]:h-4 
                [&::-webkit-slider-thumb]:bg-white 
                [&::-webkit-slider-thumb]:rounded-full 
                [&::-webkit-slider-thumb]:appearance-none 
                [&::-webkit-slider-thumb]:mt-[-0.15rem] /* Adjust vertical position */
                [&::-webkit-slider-thumb]:shadow-lg
        ${isGloballyMuted ? "opacity-50 accent-gray-400" : "accent-white"}`}
          />
        </div>
      )}
    </div>
  );
};

export default SoundCard;
