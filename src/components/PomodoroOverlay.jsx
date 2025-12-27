import { formatSecondsToMinutes } from '../utils/time'
import { Clock, Coffee, Pause, Play, RotateCcw } from 'lucide-react'
import { MODES } from '../hooks/usePomodoro'

const PomodoroOverlay = ({ setIsPomodoroOpen, timeLeft, mode, start, pause, interval, playing, reset, dingRef, setPlayDing }) => {

  // Play/pause pomodoro (activate ding sound on initial play)
  const handlePomodoro = () => {
    if (!playing) {
      dingRef.current.play().then(() => {
        dingRef.current.pause()
        dingRef.current.currentTime = 0;
        setPlayDing(true)
      }).catch(() => {})

      start()
    } else {
      pause()
    }
  }

  // Check mode for progress bar
  const totalTime =
    mode === "longBreak"
      ? MODES.longBreak
      : mode === "shortBreak"
      ? MODES.shortBreak
      : MODES.work;
  
  // Pomodoro timer progress bar
  const timerBar = Math.min((timeLeft / totalTime) * 100, 100);

  return (
    <div
      onClick={() => setIsPomodoroOpen(false)}
      className="absolute inset-0 z-40 flex items-center justify-center bg-gray-900/90"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-50 min-w-md flex flex-col items-center gap-12 p-10
          rounded-2xl border-3 border-gray-800
          bg-linear-to-br from-gray-900 via-gray-800 to-gray-900
          shadow-lg"
      >
        {/* Current active mode work/break */}
        <div className="flex w-full rounded-full overflow-hidden bg-gray-700">
          <div
            className={`w-full flex items-center justify-center gap-3 rounded-full font-semibold py-2 transition-all ${
              mode === "work"
                ? "bg-orange-600 shadow-md"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            <span>Focus</span>
            <Clock size={25} />
          </div>
          <div
            className={`w-full flex items-center justify-center gap-3 rounded-full font-semibold py-2 transition-all ${
              mode !== "work"
                ? "bg-orange-600 shadow-md"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            <span>Break</span>
            <Coffee size={25} />
          </div>
        </div>

        {/* Timer progress bar */}
        <div className="w-2/3 h-2 rounded-full bg-gray-700 overflow-hidden">
          <div
            style={{ width: `${timerBar}%` }}
            className="h-full rounded-full bg-linear-to-r from-orange-500 to-orange-600 shadow-sm transition-all"
          ></div>
        </div>

        {/* Timer */}
        <h3 className="text-7xl font-bold tracking-tight text-white">
          {formatSecondsToMinutes(timeLeft)}
        </h3>

        {/* Current interval */}
        <div className="flex items-center gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className={`w-9 h-9 flex items-center justify-center rounded-full font-bold transition-all ${
                interval >= i + 1
                  ? "bg-orange-600 text-white shadow-sm"
                  : "bg-gray-700 text-gray-400"
              }`}
            >
              {i + 1}
            </span>
          ))}
        </div>

        {/* Pomodoro controls */}
        <div className="flex items-center gap-4">
          {/* Play/pause pomodoro */}
          <button
            onClick={handlePomodoro}
            className="min-w-44 flex items-center justify-center gap-2 rounded-full
              bg-linear-to-r from-orange-500 to-orange-600
              py-3 text-lg font-semibold text-white cursor-pointer
              shadow-sm active:scale-[0.98] transition duration-100"
          >
            {!playing ? (
              <>
                Start
                <Play strokeWidth={2.3} size={24} />
              </>
            ) : (
              <>
                Pause
                <Pause strokeWidth={2} size={24} />
              </>
            )}
          </button>
          {/* Reset pomodoro to initial state */}
          <button
            onClick={reset}
            className="min-w-44 flex items-center justify-center gap-2 rounded-full
            bg-gray-700 hover:bg-gray-600 cursor-pointer
              py-3 text-lg font-semibold text-white
              shadow-sm active:scale-[0.98] transition duration-100"
          >
            Restart
            <RotateCcw size={24} />
          </button>
        </div>
      </div>
    </div>

  )
}

export default PomodoroOverlay
