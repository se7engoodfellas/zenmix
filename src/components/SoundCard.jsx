import { useEffect, useRef } from "react";
import * as Icons from "lucide-react";

// Πλέον το SoundCard δεν έχει δικό του state.
// Παίρνει εντολές (props) από το App.jsx.
const SoundCard = ({ sound, isPlaying, volume, onToggle, onVolumeChange,isGloballyMuted }) => {
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
    if (audioRef.current && isPlaying) { // Only affect currently playing sounds
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
      title={`Volume: ${volumePercent}%`}
      className={`
        relative p-6 rounded-2xl transition-all duration-300 border border-transparent hover:-translate-y-2
        ${
          isPlaying
            ? `${sound.color} shadow-lg scale-105`
            : "bg-gray-800 hover:bg-gray-700"
        }
      `}
    >
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => onToggle(sound.id)} // Καλούμε τη συνάρτηση του App
          className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <IconComponent
            size={48}
            className={isPlaying ? "text-white" : "text-gray-400"}
          />
        </button>

        <h3 className="text-white font-medium text-lg">{sound.label}</h3>

        <div
          className={`
          w-full transition-opacity duration-300 
          ${isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        >
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
            className={`w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer
        ${isGloballyMuted ? "opacity-50 accent-gray-400" : "accent-white"}`}
          />
        </div>
      </div>
    </div>
  );
};

export default SoundCard;
