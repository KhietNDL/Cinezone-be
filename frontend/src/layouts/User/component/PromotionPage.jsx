import { useState } from "react";

const Copy = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const Search = ({ className, size }) => (
  <svg
    className={className}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const Calendar = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const Tag = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
    />
  </svg>
);

const ArrowRight = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 8l4 4m0 0l-4 4m4-4H3"
    />
  </svg>
);

const Sparkles = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const Gift = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
    />
  </svg>
);

const promotions = [
  {
    id: 1,
    name: "Summer Sale",
    code: "SUMMER25",
    type: "discount",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    description: "25% off on all summer shows",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c",
    discount: "25%",
    featured: true,
  },
  {
    id: 2,
    name: "Buy 1 Get 1",
    code: "FRIBOGO",
    type: "special",
    startDate: "2024-01-05",
    endDate: "2024-12-31",
    description: "Special family package including snacks",
    image: "https://images.unsplash.com/photo-1585647347483-22b66260dfff",
    discount: "50%",
    featured: false,
  },
  {
    id: 3,
    name: "Student Discount",
    code: "STUDENT20",
    type: "discount",
    startDate: "2024-02-01",
    endDate: "2024-05-31",
    description: "20% off for students with valid ID",
    image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0",
    discount: "20%",
    featured: true,
  },
  {
    id: 4,
    name: "Weekend Special",
    code: "WEEKEND30",
    type: "special",
    startDate: "2024-03-01",
    endDate: "2024-07-31",
    description: "30% off for weekend movie sessions",
    image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0",
    discount: "30%",
    featured: true,
  },
  {
    id: 5,
    name: "VIP Experience",
    code: "VIP2024",
    type: "special",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    description: "Premium seats + complimentary drinks",
    image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0",
    discount: "40%",
    featured: false,
  },
  {
    id: 6,
    name: "Family Pack",
    code: "FAMILY15",
    type: "discount",
    startDate: "2024-04-01",
    endDate: "2024-09-30",
    description: "15% off for groups of 4 or more",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1",
    discount: "15%",
    featured: false,
  },
];

const MoviePromotions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy] = useState("startDate");
  const [copiedCode, setCopiedCode] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredPromotions = promotions
    .filter(
      (promo) =>
        promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promo.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "startDate") {
        return new Date(a.startDate) - new Date(b.startDate);
      }
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Enhanced Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-radial from-purple-600/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gradient-radial from-cyan-500/20 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-0 left-1/3 w-[700px] h-[700px] bg-gradient-radial from-pink-500/25 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-radial from-violet-400/10 to-transparent rounded-full blur-2xl animate-spin"
          style={{ animationDuration: "30s" }}
        ></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Search Toggle - Fixed at Top Right */}
      <div className="absolute top-[100px] right-8 z-20">
        {!showSearch ? (
          <button
            onClick={() => setShowSearch(true)}
            className="group relative flex items-center justify-center w-16 h-16 rounded-2xl hover:scale-110 hover:rotate-12 transition-all duration-500 transform shadow-2xl border border-purple-400/30"
            style={{
              backgroundColor: "#6957f5ea",
            }}
            aria-label="Open search"
          >
            <Search className="w-7 h-7 text-white group-hover:scale-125 transition-all duration-300" />
            <div
              className="absolute inset-0 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"
              style={{ backgroundColor: "rgba(105, 87, 245, 0.5)" }}
            ></div>
          </button>
        ) : (
          <div className="relative w-96 animate-in slide-in-from-right-5 duration-500">
            <div className="relative">
              <Search
                className="absolute left-5 top-1/2 transform -translate-y-1/2 text-purple-300 z-10"
                size={22}
              />
              <input
                type="text"
                placeholder="Search magical deals..."
                className="w-full pl-14 pr-14 py-5 rounded-2xl border-2 border-purple-500/30 bg-black/60 backdrop-blur-xl text-white placeholder-purple-200/60 focus:outline-none focus:ring-4 focus:ring-purple-400/30 focus:border-purple-400 transition-all duration-300 shadow-2xl text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearchTerm("");
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full text-purple-200 hover:text-white transition-all duration-200 flex items-center justify-center hover:bg-opacity-40"
                style={{ backgroundColor: "rgba(105, 87, 245, 0.2)" }}
                aria-label="Close search"
              >
                <span className="text-xl">×</span>
              </button>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-violet-600/20 rounded-2xl blur-xl -z-10"></div>
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 p-6 md:p-12 pt-32 md:pt-40">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Hero Section */}
          <div className="text-center mb-20">
            <div className="relative inline-block mb-8">
              <h1 className="text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r from-white via-purple-200 via-cyan-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                Movie Promotions
              </h1>
              <div className="absolute -top-4 -right-4 text-yellow-400 animate-bounce">
                <Sparkles className="w-12 h-12" />
              </div>
              <div className="absolute -bottom-2 -left-6 text-pink-400 animate-pulse">
                <Gift className="w-10 h-10" />
              </div>
            </div>
            <p className="text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-light">
              Discover{" "}
              <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-semibold">
                exclusive deals
              </span>{" "}
              and
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text font-semibold">
                {" "}
                special offers
              </span>{" "}
              for your next cinematic adventure
            </p>
          </div>

          {/* Enhanced Promotions Grid */}
          {filteredPromotions.length === 0 ? (
            <div className="text-center py-24 bg-gradient-to-br from-black/40 to-purple-900/20 backdrop-blur-xl rounded-3xl border border-purple-500/20 shadow-2xl">
              <div className="relative w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full p-8 shadow-2xl">
                <Search className="w-16 h-16 text-white" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/50 to-pink-600/50 rounded-full blur-xl animate-pulse"></div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                No promotions found
              </h3>
              <p className="text-xl text-gray-300">
                Try searching for something else
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredPromotions.map((promo, index) => (
                <div
                  key={promo.id}
                  className={`group relative bg-gradient-to-br from-black/60 via-purple-900/20 to-black/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-purple-500/30 hover:border-purple-400/60 transition-all duration-700 transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/30 ${
                    promo.featured
                      ? "ring-2 ring-purple-400/50 shadow-2xl shadow-purple-500/20"
                      : ""
                  }`}
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  {/* Enhanced Featured Badge */}
                  {promo.featured && (
                    <div className="absolute top-6 right-6 z-20 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-black px-4 py-2 rounded-full text-sm font-black shadow-lg animate-pulse">
                      ⭐ FEATURED
                    </div>
                  )}

                  {/* Enhanced Discount Badge */}
                  <div className="absolute top-6 left-6 z-20 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 text-white px-6 py-3 rounded-2xl font-black text-xl shadow-2xl border border-purple-400/50">
                    {promo.discount} OFF
                  </div>

                  {/* Enhanced Image with Overlay */}
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={promo.image}
                      alt={promo.name}
                      className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-125 group-hover:rotate-2"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Enhanced Content */}
                  <div className="relative max-w-md mx-auto bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden shadow-2xl border border-purple-500/20">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/5 to-blue-600/10"></div>
                    <div className="absolute top-0 left-0 w-40 h-40 bg-purple-500/20 -translate-x-20 -translate-y-20 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-500/20 translate-x-16 translate-y-16 blur-2xl"></div>

                    <div className="relative p-8 z-10">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 rounded-lg h-10 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                            <Tag className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-lg">
                              {promo.type === "discount"
                                ? "Discount"
                                : "Special"}
                            </h4>
                            <p className="text-purple-300 text-sm">
                              Limited Time
                            </p>
                          </div>
                        </div>
                        <div
                          className={`px-4 py-2 text-xs font-bold rounded-lg ${
                            promo.type === "discount"
                              ? "bg-green-500/20 text-green-300 border border-green-500/30"
                              : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          }`}
                        >
                          {promo.type === "discount" ? "SAVE NOW" : "EXCLUSIVE"}
                        </div>
                      </div>

                      {/* Title */}
                      <div className="mb-6">
                        <h2 className="text-2xl font-black text-white mb-2 leading-tight">
                          {promo.name}
                        </h2>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {promo.description}
                        </p>
                      </div>

                      {/* Date Range */}
                      <div className="flex items-center rounded-lg gap-3 mb-8 p-4 bg-white/5 border border-white/10 backdrop-blur-sm">
                        <div className="w-8 h-8 bg-purple-500/20 flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-purple-300" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold">
                            Valid Until
                          </p>
                          <p className="text-purple-300 text-xs">
                            {formatDate(promo.startDate)} -{" "}
                            {formatDate(promo.endDate)}
                          </p>
                        </div>
                      </div>

                      {/* Promo Code Section */}
                      <div className="relative">
                        <div className="absolute inset-0  bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl"></div>
                        <div className="relative rounded-lg bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-6">
                          <div className="text-center mb-4">
                            <p className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-2">
                              Promo Code
                            </p>
                            <div className="relative inline-block">
                              <code className="text-white font-mono text-2xl rounded-lg font-black px-4 py-2 bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-400/40">
                                {promo.code}
                              </code>
                            </div>
                          </div>

                          <button
                            onClick={() => handleCopy(promo.code)}
                            className="w-full group relative rounded-lg text-white font-bold py-4 px-6 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/25"
                            style={{
                              backgroundColor: "#6957f5ea",
                            }}
                          >
                            <div className="flex items-center justify-center gap-3">
                              <Copy className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                              <span className="text-lg">
                                {copiedCode === promo.code
                                  ? "✅ Copied!"
                                  : "Copy Code"}
                              </span>
                            </div>

                            {/* Success overlay */}
                            {copiedCode === promo.code && (
                              <div className="absolute inset-0 bg-green-500/20 animate-ping"></div>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Bottom decorative line */}
                      <div className="mt-6 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                    </div>
                  </div>
                  {/* Card Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoviePromotions;
