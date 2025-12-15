import { useEffect, useState } from "react";

export function useActiveSounds(setSoundStates) {

  // STATE: holds all active sounds ids
  // Format: ["ocean", "rain", "thunder" ...]
  const [activeSounds, setActiveSounds] = useState([]);

  // STATE: global play/pause state for all active sounds
  // Format: true, false
  const [playActiveSounds, setPlayActiveSounds] = useState(true);

  //  Handle soundStates for active sounds
  useEffect(() => {
      setSoundStates(prevStates => {
        const soundStates = { ...prevStates };

        activeSounds.forEach(id => {
          const current = soundStates[id] || { isPlaying: false, volume: 0.5 };
          soundStates[id] = { ...current, isPlaying: playActiveSounds };
        });

        return soundStates;
      });
  }, [activeSounds, playActiveSounds, setSoundStates]);

  // Toggle single active sound
  // If active sounds are paused, adding new active sound will play all active sounds 
  const toggleActiveSound = (id, isPlaying) => {
    setActiveSounds(prev =>
      isPlaying
        ? prev.includes(id) ? prev : [...prev, id]
        : prev.filter(soundId => soundId !== id)
    );

    if (isPlaying) {
      setPlayActiveSounds(isPlaying)
    }
  };

  // Toggle all active sounds
  const toggleActiveSoundAll = () => {
    setPlayActiveSounds(prev => {
      const next = !prev;

      setSoundStates(prevStates => {
        const updated = { ...prevStates };
        activeSounds.forEach(id => {
          updated[id] = {
            ...updated[id], 
            isPlaying: !next,
          };
        });
        return updated;
      });

      return next;
    });
  };

  return {
    activeSounds,
    playActiveSounds,
    setActiveSounds,
    setPlayActiveSounds,
    toggleActiveSound,
    toggleActiveSoundAll,
  };
}
