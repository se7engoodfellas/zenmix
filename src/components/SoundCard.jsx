import { useState, useEffect, useRef } from "react";
import * as Icons from "lucide-react";

const SoundCard = ({ sound }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  // --- NEW: Calculate the volume percentage for the tooltip ---
  const volumePercent = Math.round(volume * 100);

  const IconComponent = Icons[sound.icon] || Icons.HelpCircle;

  // EFFECT 1: Handle Audio Creation and Destruction
  // This only runs when the component mounts or the sound source changes.
  useEffect(() => {
    const audio = new Audio(sound.src);
    audio.loop = true;
    audio.volume = volume; // Set initial volume
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
    // We ignore 'volume' here intentionally because we handle updates in the second effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sound.src]);

  // EFFECT 2: Handle Volume Updates
  // This runs whenever 'volume' changes. It updates the existing audio object without restarting it.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // EFFECT 3: Handle Play/Pause State
  // This keeps the audio play state in sync with the React state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((e) => console.log("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div
      // --- MODIFIED: Added title attribute to the root element ---
      title={`Volume: ${volumePercent}%`} 
      className={`
        relative p-6 rounded-2xl transition-all duration-300 border border-transparent
        ${
          isPlaying
            ? `${sound.color} shadow-lg scale-105`
            : "bg-gray-800 hover:bg-gray-700"
        }
      `}
    >
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={togglePlay}
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
            onChange={handleVolumeChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>
      </div>
    </div>
  );
};

export default SoundCard;