import { useEffect, useRef } from "react";
import * as Icons from "lucide-react";

// Πλέον το SoundCard δεν έχει δικό του state.
// Παίρνει εντολές (props) από το App.jsx.
const SoundCard = ({ sound, isPlaying, volume, onToggle, onVolumeChange }) => {
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
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

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

  return (
    <div 
      title={`Volume ${volumePercent}%`} 
      // LIGHT DEFAULT: bg-white, hover:bg-gray-100
      // DARK OVERRIDE: dark:bg-gray-800, dark:hover:bg-gray-700
      className={`
        p-6 rounded-2xl duration-300 border border-transparent hover:-translate-y-2 flex flex-col justify-center items-center gap-5 transition-all
        ${isPlaying 
          ? `${sound.color} shadow-lg scale-105` 
          : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
        }
      `}
    >
      <button
        onClick={() => onToggle(sound.id)} // Καλούμε τη συνάρτηση του App
        // LIGHT DEFAULT: bg-gray-300
        // DARK OVERRIDE: dark:bg-white/10
        className="p-4 rounded-full bg-gray-300 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
      >
        <IconComponent
          size={48}
          // LIGHT DEFAULT: text-gray-600
          // DARK OVERRIDE: dark:text-gray-400
          className={isPlaying ? "text-white" : "text-gray-600 dark:text-gray-400"}
        />
      </button>

      {/* LIGHT DEFAULT: text-gray-800. DARK OVERRIDE: dark:text-white */}
      <h3 className={`font-medium text-center md:text-lg ${isPlaying ? 'text-white' : 'text-gray-800 dark:text-white'}`}>
        {sound.label}
      </h3>

      {isPlaying && 
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
            // LIGHT DEFAULT: bg-gray-400, accent-gray-700
            // DARK OVERRIDE: dark:bg-gray-600, dark:accent-white
            className="
              w-full h-1 
              bg-gray-400 dark:bg-gray-600 rounded-lg 
              appearance-none cursor-pointer 
              accent-gray-700 dark:accent-white
              
              /* Custom thumb styling using arbitrary variants for cross-browser support */
              [&::-webkit-slider-thumb]:w-4 
              [&::-webkit-slider-thumb]:h-4 
              [&::-webkit-slider-thumb]:bg-white 
              [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:appearance-none 
              [&::-webkit-slider-thumb]:mt-[-0.15rem] /* Adjust vertical position */
              [&::-webkit-slider-thumb]:shadow-lg"
          />
        </div>
      }
    </div>
  );
};

export default SoundCard;