import { useEffect, useReducer } from "react";

// Time values for each pomodoro mode in seconds
export const MODES = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 20 * 60,
};

// Initial reducer state
const initialState = {
  mode: "work",
  timeLeft: MODES.work,
  interval: 1,
  playing: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "TICK":
      if (!state.playing) return state;

      // Decrement timer if theres time left
      if (state.timeLeft > 0) {
        return { ...state, timeLeft: state.timeLeft - 1 };
      }

      // When working mode ends, select break depending on the interval
      if (state.mode === "work") {
        const nextMode =
          state.interval % 4 === 0 ? "longBreak" : "shortBreak";

        return {
          ...state,
          mode: nextMode,
          timeLeft: MODES[nextMode],
        };
      }

      // After any break ends, switch back to work mode
      return {
        ...state,
        mode: "work",
        interval: state.interval + 1,
        timeLeft: MODES.work,
      };
      
    // Pomodoro controlls
    case "START":
      return { ...state, playing: true };

    case "PAUSE":
      return { ...state, playing: false };

    case "RESET":
      return initialState;

    case "RESET_INTERVAL":
      return {
        ...state,
        interval: initialState.interval,
      };

    default:
      return state;
  }
}

export function usePomodoro() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!state.playing) return;

    // Run dispatch every second to check for next mode
    const id = setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);

    // Reset interval every 4 pomodoros
    if (state.interval > 4) {
      dispatch({ type: "RESET_INTERVAL" })
    }

    return () => clearInterval(id);
  }, [state.playing, state.interval]);

  return {
    ...state,
    start: () => dispatch({ type: "START" }),
    pause: () => dispatch({ type: "PAUSE" }),
    reset: () => dispatch({ type: "RESET" }),
  };
}
