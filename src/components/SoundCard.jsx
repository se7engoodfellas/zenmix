import { useEffect, useRef } from "react";
import * as Icons from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// Zen color map with light/dark mode variants
const zenColorMap = {
  "bg-blue-600": {
    // Light mode variants
    lightActiveBg: "bg-blue-100",
    lightActiveBorder: "border-blue-400",
    lightActiveText: "text-blue-700",
    lightButtonBg: "bg-blue-700/20",
    lightButtonBgHover: "hover:bg-blue-700/30",
    lightAccent: "accent-blue-600",
    lightInactiveButtonBg: "bg-blue-700/10",
    lightInactiveButtonBgHover: "hover:bg-blue-700/20",
    // Dark mode variants
    darkActiveBg: "bg-blue-900/40",
    darkActiveBorder: "border-blue-700/60",
    darkActiveText: "text-blue-200",
    darkButtonBg: "bg-blue-800/40",
    darkButtonBgHover: "hover:bg-blue-700/50",
    darkAccent: "accent-blue-500"
  },
  "bg-green-600": {
    lightActiveBg: "bg-green-100",
    lightActiveBorder: "border-green-400",
    lightActiveText: "text-green-700",
    lightButtonBg: "bg-green-700/20",
    lightButtonBgHover: "hover:bg-green-700/30",
    lightAccent: "accent-green-600",
    lightInactiveButtonBg: "bg-green-700/10",
    lightInactiveButtonBgHover: "hover:bg-green-700/20",
    darkActiveBg: "bg-green-900/40",
    darkActiveBorder: "border-green-700/60",
    darkActiveText: "text-green-200",
    darkButtonBg: "bg-green-800/40",
    darkButtonBgHover: "hover:bg-green-700/50",
    darkAccent: "accent-green-500"
  },
  "bg-teal-500": {
    lightActiveBg: "bg-teal-100",
    lightActiveBorder: "border-teal-400",
    lightActiveText: "text-teal-700",
    lightButtonBg: "bg-teal-700/20",
    lightButtonBgHover: "hover:bg-teal-700/30",
    lightAccent: "accent-teal-600",
    lightInactiveButtonBg: "bg-teal-700/10",
    lightInactiveButtonBgHover: "hover:bg-teal-700/20",
    darkActiveBg: "bg-teal-900/40",
    darkActiveBorder: "border-teal-700/60",
    darkActiveText: "text-teal-200",
    darkButtonBg: "bg-teal-800/40",
    darkButtonBgHover: "hover:bg-teal-700/50",
    darkAccent: "accent-teal-500"
  },
  "bg-purple-400": {
    lightActiveBg: "bg-purple-100",
    lightActiveBorder: "border-purple-400",
    lightActiveText: "text-purple-700",
    lightButtonBg: "bg-purple-700/20",
    lightButtonBgHover: "hover:bg-purple-700/30",
    lightAccent: "accent-purple-600",
    lightInactiveButtonBg: "bg-purple-700/10",
    lightInactiveButtonBgHover: "hover:bg-purple-700/20",
    darkActiveBg: "bg-purple-900/40",
    darkActiveBorder: "border-purple-700/60",
    darkActiveText: "text-purple-200",
    darkButtonBg: "bg-purple-800/40",
    darkButtonBgHover: "hover:bg-purple-700/50",
    darkAccent: "accent-purple-500"
  },
  "bg-orange-600": {
    lightActiveBg: "bg-orange-100",
    lightActiveBorder: "border-orange-400",
    lightActiveText: "text-orange-700",
    lightButtonBg: "bg-orange-700/20",
    lightButtonBgHover: "hover:bg-orange-700/30",
    lightAccent: "accent-orange-600",
    lightInactiveButtonBg: "bg-orange-700/10",
    lightInactiveButtonBgHover: "hover:bg-orange-700/20",
    darkActiveBg: "bg-orange-900/40",
    darkActiveBorder: "border-orange-800/60",
    darkActiveText: "text-orange-200",
    darkButtonBg: "bg-orange-900/40",
    darkButtonBgHover: "hover:bg-orange-800/50",
    darkAccent: "accent-orange-500"
  },
  "bg-gray-700": {
    lightActiveBg: "bg-stone-100",
    lightActiveBorder: "border-stone-400",
    lightActiveText: "text-stone-700",
    lightButtonBg: "bg-stone-700/20",
    lightButtonBgHover: "hover:bg-stone-700/30",
    lightAccent: "accent-stone-600",
    lightInactiveButtonBg: "bg-stone-700/10",
    lightInactiveButtonBgHover: "hover:bg-stone-700/20",
    darkActiveBg: "bg-stone-800/60",
    darkActiveBorder: "border-stone-700",
    darkActiveText: "text-stone-200",
    darkButtonBg: "bg-stone-800/50",
    darkButtonBgHover: "hover:bg-stone-700/60",
    darkAccent: "accent-stone-400"
  },
  "bg-brown-500": {
    lightActiveBg: "bg-amber-100",
    lightActiveBorder: "border-amber-700",
    lightActiveText: "text-amber-800",
    lightButtonBg: "bg-amber-700/20",
    lightButtonBgHover: "hover:bg-amber-700/30",
    lightAccent: "accent-amber-700",
    lightInactiveButtonBg: "bg-amber-700/10",
    lightInactiveButtonBgHover: "hover:bg-amber-700/20",
    darkActiveBg: "bg-amber-900/40",
    darkActiveBorder: "border-amber-700/60",
    darkActiveText: "text-amber-200",
    darkButtonBg: "bg-amber-800/40",
    darkButtonBgHover: "hover:bg-amber-700/50",
    darkAccent: "accent-amber-500",
  },
};

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
  const { theme } = useTheme();
  
  // Get Zen colors for this sound
  const zenColors = zenColorMap[sound.color] || zenColorMap["bg-blue-600"];

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
      if (isGloballyMuted) {
        audioRef.current.volume = 0;
      } else {
        audioRef.current.volume = volume;
      }
    }
  }, [isGloballyMuted, isPlaying, volume]);

  return (
    <div
      title={`Volume ${volumePercent}%`}
      className={`
        p-6 rounded-2xl duration-300 hover:-translate-y-2 
        flex flex-col justify-center items-center gap-5 transition-all border
        ${isPlaying 
          ? theme === 'dark'
            ? // DARK MODE ACTIVE: Dark translucent with colored border
              `shadow-lg scale-105 border-2 ${zenColors.darkActiveBg} ${zenColors.darkActiveBorder}`
            : // LIGHT MODE ACTIVE: Pastel with colored border
              `shadow-lg scale-105 border-2 ${zenColors.lightActiveBg} ${zenColors.lightActiveBorder}`
          : theme === 'dark'
            ? // DARK MODE INACTIVE: Gray card
              'bg-gray-800 hover:bg-gray-700 border-gray-700 hover:border-gray-600 shadow-sm hover:shadow-md'
            : // LIGHT MODE INACTIVE: Paper theme card
              'bg-white/80 shadow-sm border-stone-200 hover:border-stone-300 hover:shadow-md'
        }
      `}
    >
      <button
        onClick={() => onToggle(sound.id)}
        className={`
          p-4 rounded-full transition-colors
          ${isPlaying 
            ? theme === 'dark'
              ? `${zenColors.darkButtonBg} hover:${zenColors.darkButtonBgHover.split('hover:')[1]}`
              : `${zenColors.lightButtonBg} ${zenColors.lightButtonBgHover}`
            : theme === 'dark'
              ? 'bg-white/10 hover:bg-white/20'
              : `${zenColors.lightInactiveButtonBg} ${zenColors.lightInactiveButtonBgHover}`
          }
        `}
      >
        <IconComponent
          size={48}
          className={`
            ${isPlaying 
              ? theme === 'dark'
                ? zenColors.darkActiveText
                : zenColors.lightActiveText
              : theme === 'dark'
                ? 'text-gray-400'
                : `${zenColors.lightActiveText}/80`
            }
          `}
        />
      </button>

      <h3 className={`
        font-medium text-center md:text-lg
        ${isPlaying 
          ? theme === 'dark'
            ? zenColors.darkActiveText
            : zenColors.lightActiveText
          : theme === 'dark'
            ? 'text-white'
            : 'text-stone-800'
        }
      `}>
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
            disabled={isGloballyMuted}
            className={`
              w-full h-1 rounded-lg 
              appearance-none cursor-pointer 
              ${theme === 'dark' ? 'bg-gray-600' : 'bg-stone-300'}
              ${theme === 'dark' ? zenColors.darkAccent : zenColors.lightAccent}
              
              [&::-webkit-slider-thumb]:w-4 
              [&::-webkit-slider-thumb]:h-4 
              [&::-webkit-slider-thumb]:bg-white 
              [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:appearance-none 
              [&::-webkit-slider-thumb]:mt-[-0.15rem]
              [&::-webkit-slider-thumb]:shadow-lg
              ${isGloballyMuted ? 'opacity-50' : ''}
            `}
          />
        </div>
      }
    </div>
  );
};

export default SoundCard;