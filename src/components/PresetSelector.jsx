import presetsData from "../data/presets.json";

const PresetSelector = ({ setActiveSounds, onSelectPreset }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {presetsData.map((preset) => (
        <button
          key={preset.id}
          onClick={() => onSelectPreset(preset)}
          className="
            flex items-center gap-2 px-4 py-2 
            border rounded-full transition-all duration-200 text-sm font-medium
            
            /* LIGHT DEFAULT Styles */
            bg-white text-gray-700 border-gray-300 hover:border-blue-500
            
            /* DARK OVERRIDE Styles */
            dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:text-white
          "
        >
          <span>{preset.emoji}</span>
          <span>{preset.name}</span>
        </button>
      ))}

      {/* Κουμπί Reset για να τα κλείνει όλα */}
      <button
        onClick={() => {
          onSelectPreset(null)
          setActiveSounds([])
        }}
        // LIGHT DEFAULT: text-red-500. DARK OVERRIDE: dark:text-red-400
        className="px-4 py-2 text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium"
      >
        Reset All
      </button>
    </div>
  );
};

export default PresetSelector;