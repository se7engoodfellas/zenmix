import { useEffect, useState } from "react";
import SoundCard from "./components/SoundCard";
import PresetSelector from "./components/PresetSelector";
import { useSounds } from "./hooks/useSounds";
import { useActiveSounds } from "./hooks/useActiveSounds";
import { useTheme } from "./context/ThemeContext";
import { X, Play, Sun, Moon, HelpCircle, CircleHelp, Check, Share, Sparkles } from "lucide-react";
import { Volume2, VolumeX } from "lucide-react";
import HelpModal from "./components/HelpModal";

function App() {
  const { sounds } = useSounds();
  const { theme, toggleTheme } = useTheme();
  
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const [showPlayBanner, setShowPlayBanner] = useState(false);
  const [showSharedToast, setShowSharedToast] = useState(false);
  const [hasResponded, setHasResponded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // STATE: holds play status and volume for each sound
  const [soundStates, setSoundStates] = useState(() => {

    // Checks url for a mix to start
    const params = new URLSearchParams(window.location.search)
    const mixParam = params.get('mix');
    if(mixParam){
      let object = {}
      try{
        const requests = mixParam.split(',')
        for (let i in requests){
          object[requests[i].slice(0, requests[i].indexOf(':'))] = {isPlaying : false, volume : Number(requests[i].slice(requests[i].indexOf(':') + 1))}
          const soundState = object[requests[i].slice(0, requests[i].indexOf(':'))]
          if(soundState.volume > 1 || !sounds.find(sound => sound.id == requests[i].slice(0, requests[i].indexOf(':')))){
            object = {}
            break
          }
        }
      }
      catch{
        console.warn("A search was requested but it failed")
        return
      }
     if(JSON.stringify(object) != "{}"){
       return object
      }
     else{
       console.log('The URL request was invalid')
     }
    }

    const saved = localStorage.getItem("zenmix-state");

    //modifies the saved object from localStorage
    function modifyLastSave() {
      const savedData = JSON.parse(saved);
      const keys = Object.keys(savedData);
      for (let i in keys) {
        if (savedData[keys[i]].isPlaying) {
          savedData[keys[i]].isPlaying = false;
        } else {
          delete savedData[keys[i]];
        }
      }
      return savedData;
    }

    return saved ? modifyLastSave() : {};
  });

  useEffect(() => {
    localStorage.setItem("zenmix-state", JSON.stringify(soundStates));
  }, [soundStates]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const mixParam = params.get('mix');
    if(mixParam){
        setShowPlayBanner(true)
        return
    }
 
    if (soundStates && Object.keys(soundStates).length > 0) {
      setShowResumeBanner(true);
    }
  }, []);

  const {
    activeSounds,
    setActiveSounds,
    toggleActiveSound,
    toggleActiveSoundAll,
  } = useActiveSounds(setSoundStates);

  // STATE: holds value in the search Bar
  const [search, setSearch] = useState("");

  // Helper to get a sound's state (or defaults if missing)
  const getSoundState = (id) =>
    soundStates[id] || { isPlaying: false, volume: 0.5 };

  // 1. Toggle Play/Pause
  const toggleSound = (id) => {
    setSoundStates((prev) => {
      const current = prev[id] || { isPlaying: false, volume: 0.5 };
      toggleActiveSound(id, !current.isPlaying);
      return {
        ...prev,
        [id]: { ...current, isPlaying: !current.isPlaying },
      };
    });
  };

  // 2. Change Volume
  const changeVolume = (id, newVolume) => {
    setSoundStates((prev) => {
      const current = prev[id] || { isPlaying: false, volume: 0.5 };
      return {
        ...prev,
        [id]: { ...current, volume: newVolume },
      };
    });
  };

  // 3. Load Preset Logic
  const handleSelectPreset = (preset) => {
    if (!preset) {
      setSoundStates({});
      return;
    }

    const newStates = {};
    let activePreset = [];

    sounds.forEach((sound) => {
      newStates[sound.id] = { isPlaying: false, volume: 0.5 };
    });

    setActiveSounds([]);

    Object.keys(preset.mix).forEach((soundId) => {
      if (newStates[soundId]) {
        newStates[soundId] = {
          isPlaying: true,
          volume: preset.mix[soundId],
        };
        activePreset.push(soundId);
        toggleActiveSound(soundId, true);
      }
    });

    setActiveSounds(activePreset);
    setSoundStates(newStates);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const MuteIcon = isMuted ? VolumeX : Volume2;

  // Event listener for toggling all active sounds
  useEffect(() => {
    const handleToggleActive = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (activeSounds.length > 0) {
          toggleActiveSoundAll();
        }
      }
    };

    window.addEventListener("keydown", handleToggleActive);
    return () => window.removeEventListener("keydown", handleToggleActive);
  }, [activeSounds, toggleActiveSoundAll]);

  function handleResume() {
    setHasResponded(true);
    setSoundStates((prevStates) => {
      const updatedStates = { ...prevStates };
      Object.keys(updatedStates).forEach((key) => {
        updatedStates[key].isPlaying = true;
      });
      localStorage.setItem("zenmix-state", JSON.stringify(updatedStates));
      return updatedStates;
    });
  }

const shareMix = () => {
  const activeIds = Object.keys(soundStates).filter(id => soundStates[id].isPlaying);
  if (activeIds.length === 0) return;

  const mixString = activeIds
    .map(id => `${id}:${soundStates[id].volume}`)
    .join(',');
    
  const url = `${window.location.origin}/?mix=${mixString}`;
  
  navigator.clipboard.writeText(url).then(() => {
    console.log('Copied to clipboard');
    setShowSharedToast(true)
    console.log('test')
    setTimeout(() => {setShowSharedToast(false)}, 2000)
  });
};

  return (
    <>
      {/* Banner For Resuming Mix From Local Storage */}
      {showResumeBanner && !hasResponded && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div
            className={`flex items-center gap-4 pl-6 pr-4 py-3 
              backdrop-blur-md border rounded-full shadow-lg ring-1
              ${
                theme === "dark"
                  ? "bg-gray-800/95 border-blue-500/30 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] ring-white/10"
                  : "bg-white/95 border-blue-400 shadow-[0_0_20px_-5px_rgba(59,130,246,0.2)] ring-black/10"
              }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full 
                ${
                  theme === "dark"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-blue-400/20 text-blue-600"
                }`}
              >
                <Play size={12} fill="currentColor" />
              </div>
              <span
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-100" : "text-gray-800"
                }`}
              >
                Resume session?
              </span>
            </div>

            <div
              className={`h-4 w-px ${
                theme === "dark" ? "bg-white/10" : "bg-gray-300"
              }`}
            />

            <button
              onClick={handleResume}
              className={`text-sm font-bold transition-colors ${
                theme === "dark"
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-700"
              }`}
            >
              Resume
            </button>

            <button
              onClick={() => setHasResponded(true)}
              className={`p-1 ml-1 rounded-full transition-all ${
                theme === "dark"
                  ? "text-gray-500 hover:text-white hover:bg-white/10"
                  : "text-gray-400 hover:text-gray-700 hover:bg-gray-200"
              }`}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      { /* Banner For Playing A Mix From URL */ }
      {showPlayBanner && !hasResponded && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div
            className={`flex items-center gap-4 pl-6 pr-4 py-3 
              backdrop-blur-md border rounded-full shadow-lg ring-1
              ${theme === 'dark' 
                ? 'bg-gray-800/95 border-purple-500/30 ring-white/10 text-gray-100' 
                : 'bg-white/95 border-purple-400/30 ring-black/5 text-stone-800'}
              }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full 
                ${
                  theme === "dark"
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-purple-400/20 text-purple-600"
                }`}
              >
                <Sparkles size={12} fill="currentColor" />
              </div>
              <span
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-100" : "text-gray-800"
                }`}
              >
                Shared mix loaded
              </span>
            </div>

            <div
              className={`h-4 w-px ${
                theme === "dark" ? "bg-white/10" : "bg-gray-300"
              }`}
            />

            <button
              onClick={handleResume}
              className={`text-sm font-bold transition-colors ${
                theme === "dark"
                  ? "text-purple-400 hover:text-purple-300"
                  : "text-purple-600 hover:text-purple-700"
              }`}
            >
              Play
            </button>

            <button
              onClick={() => setHasResponded(true)}
              className={`p-1 ml-1 rounded-full transition-all ${
                theme === "dark"
                  ? "text-gray-500 hover:text-white hover:bg-white/10"
                  : "text-gray-400 hover:text-gray-700 hover:bg-gray-200"
              }`}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* TOAST FOR SAVING SHARING MIX */}
      {showSharedToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`
            flex items-center gap-3 px-5 py-2.5 rounded-full shadow-xl ring-1 backdrop-blur-md border
            ${theme === 'dark' 
              ? 'bg-gray-800/95 border-green-500/30 ring-white/10 text-gray-100' 
              : 'bg-white/95 border-green-500/30 ring-black/5 text-stone-800'}
          `}>
            <div className={`
              flex items-center justify-center w-5 h-5 rounded-full
              ${theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'}
            `}>
              <Check size={12} strokeWidth={3} />
            </div>
            <span className="text-sm font-medium">Link copied to clipboard</span>
          </div>
        </div>
      )}

      {/* PAPER/LATTE BACKGROUND for light mode, dark gray for dark mode */}
      <div
        className={`min-h-screen transition-colors duration-300 p-3 sm:p-5 md:p-10 font-sans
        ${
          theme === "dark"
            ? "bg-gray-900 text-white"
            : "bg-orange-50 text-stone-800"
        }`}
      >
        <header className="mb-10 text-center relative">
          <h1
            className={`text-2xl md:text-4xl font-bold mb-2 tracking-tight ${
              theme === "dark" ? "text-blue-100" : "text-stone-800"
            }`}
          >
            ZenMix
          </h1>
          <p className={theme === "dark" ? "text-gray-400" : "text-stone-600"}>
            Mix your perfect soundscape.
          </p>

          {/* Toggle Buttons Container */}
          <div className="absolute right-0 top-0 flex items-center gap-2">
            {/* Mute Button */}
            <button
              onClick={toggleMute}
              className={`p-2.5 rounded-full transition-colors duration-300 ${
                isMuted
                  ? theme === "dark"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-red-500 hover:bg-red-600"
                  : theme === "dark"
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-stone-700/10 hover:bg-stone-700/20"
              }`}
              aria-label={isMuted ? "Unmute all sounds" : "Mute all sounds"}
              title={isMuted ? "Unmute all sounds" : "Mute all sounds"}
            >
              <MuteIcon
                size={20}
                className={theme === "dark" ? "text-white" : "text-stone-800"}
              />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-full transition-colors ${
                theme === "dark"
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-stone-700/10 hover:bg-stone-700/20"
              }`}
              aria-label="Toggle Theme"
              title={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? (
                <Sun size={20} className="text-orange-400" />
              ) : (
                <Moon size={20} className="text-stone-700" />
              )}
            </button>

            {/* Help Modal Toggle Button */}
            <button
              onClick={() => setIsHelpOpen(true)}
              className={`p-2.5 rounded-full transition-colors ${
                theme === "dark"
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-stone-700/10 hover:bg-stone-700/20"
              }`}
              title="Help & Shortcuts"
            >
              <CircleHelp size={20} />
            </button>
            <HelpModal
              isOpen={isHelpOpen}
              onClose={() => setIsHelpOpen(false)}
            />
            {/* Share Button */}
            <button onClick={shareMix} className={`p-2.5 rounded-full transition-colors duration-300 ${
              theme === "dark"
                ? "bg-white/10 hover:bg-white/20"
                : "bg-stone-700/10 hover:bg-stone-700/20"
              }`}>
              <Share/>
            </button>
          </div>
        </header>

        {/* Search Bar */}
        <div className="flex justify-center">
          <input
            placeholder="🔍 Search for sounds"
            className={`rounded-2xl text-center w-2/5 h-10 mb-10 transition-colors placeholder:text-stone-600 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 px-4
              ${
                theme === "dark"
                  ? "bg-white/10 hover:bg-white/20 text-white border-none focus:ring-blue-400"
                  : "bg-white text-stone-800 border border-stone-300 hover:bg-stone-50 hover:border-stone-400 focus:ring-blue-400"
              }`}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>

        {/* Preset Selector */}
        <PresetSelector
          setActiveSounds={setActiveSounds}
          onSelectPreset={handleSelectPreset}
        />

        {/* Grid */}
        <main className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {sounds.map((sound) => {
            const state = getSoundState(sound.id);
            if (sound.label.toLowerCase().includes(search.toLowerCase())) {
              return (
                <SoundCard
                  key={sound.id}
                  sound={sound}
                  isPlaying={state.isPlaying}
                  volume={state.volume}
                  onToggle={toggleSound}
                  onVolumeChange={changeVolume}
                  isGloballyMuted={isMuted}
                />
              );
            }
          })}
        </main>
      </div>
    </>
  );
}

export default App;
