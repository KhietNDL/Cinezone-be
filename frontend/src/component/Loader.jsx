export const DNALoader = () => (
  <div className="relative w-12 h-12 mx-auto">
    <div
      className="absolute inset-0 animate-spin"
      style={{ animation: "spin 2s linear infinite" }}
    >
      <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full absolute left-1 top-0 animate-pulse"></div>
      <div
        className="w-1 h-6 bg-gradient-to-b from-pink-400 to-purple-600 rounded-full absolute right-1 bottom-0 animate-pulse"
        style={{ animationDelay: "0.5s" }}
      ></div>
    </div>
    <div
      className="absolute inset-0 animate-spin"
      style={{ animation: "spin 2s linear infinite reverse" }}
    >
      <div
        className="w-1 h-4 bg-gradient-to-b from-green-400 to-emerald-600 rounded-full absolute left-2 top-1 animate-pulse"
        style={{ animationDelay: "0.25s" }}
      ></div>
      <div
        className="w-1 h-4 bg-gradient-to-b from-yellow-400 to-orange-600 rounded-full absolute right-2 bottom-1 animate-pulse"
        style={{ animationDelay: "0.75s" }}
      ></div>
    </div>
  </div>
);