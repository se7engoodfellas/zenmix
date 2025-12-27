import React from 'react'
import { formatSecondsToMinutes } from '../utils/time'
import { Clock, Coffee, Pause, Play } from 'lucide-react'
import { MODES } from '../hooks/usePomodoro'

const PomodoroButton = ({ setIsPomodoroOpen, playing, interval, mode, timeLeft, pause, start }) => {
  // Check if pomodoro is active
  const isStopped = !playing && timeLeft === MODES[mode] && interval == 1;
  const shouldDisplay = !isStopped;

  return (
    <div className="flex items-center justify-end gap-4">
      {/* If pomodoro is active display status and play/pause button */}
      {shouldDisplay && (
        <div className="flex gap-4">
          <div className="flex items-center justify-center w-16 h-10 rounded-full bg-gray-700">
            <div className="flex items-center justify-center w-6 h-6">
              {mode === "work" ? (
                <Clock className="text-gray-300 w-full h-full" />
              ) : (
                <Coffee className="text-gray-300 w-full h-full" />
              )}
            </div>
          </div>
          <button className="cursor-pointer flex items-center justify-center w-16 h-10 rounded-full bg-gray-700">
              {playing ? (
                <Pause onClick={pause} className="w-full " />
              ) : (
                <Play onClick={start} className="w-full " />
              )}
          </button>
        </div>
      )}
      <button
        onClick={() => setIsPomodoroOpen(true)}
        className="cursor-pointer min-w-36 py-2 rounded-full font-semibold
                  bg-linear-to-r from-orange-500 to-orange-600
                  text-white shadow-sm active:scale-[0.98] transition duration-200 border-transparent"
      >
        {!shouldDisplay ? "Pomodoro" : formatSecondsToMinutes(timeLeft)}
      </button>
    </div>
  )
}

export default PomodoroButton
