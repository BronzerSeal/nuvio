const ColorCodes = () => {
  return (
    <div className="flex gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        <span>Meeting</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
        <span>Workshop</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
        <span>Break</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
        <span>Review</span>
      </div>
    </div>
  );
};

export default ColorCodes;
