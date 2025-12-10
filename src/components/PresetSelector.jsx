import presetsData from "../data/presets.json";

const PresetSelector = ({ onSelectPreset }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {presetsData.map((preset) => (
        <button
          key={preset.id}
          onClick={() => onSelectPreset(preset)}
          className="
            flex items-center gap-2 px-4 py-2 
            bg-gray-800 hover:bg-gray-700 
            border border-gray-700 hover:border-blue-500
            rounded-full transition-all duration-200
            text-sm font-medium text-gray-300 hover:text-white
          "
        >
          <span>{preset.emoji}</span>
          <span>{preset.name}</span>
        </button>
      ))}

      {/* Κουμπί Reset για να τα κλείνει όλα */}
      <button
        onClick={() => onSelectPreset(null)}
        className="px-4 py-2 text-sm text-red-400 hover:text-red-300 font-medium"
      >
        Reset All
      </button>
    </div>
  );
};

export default PresetSelector;
