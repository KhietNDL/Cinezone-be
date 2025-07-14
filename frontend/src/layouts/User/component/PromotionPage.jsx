import { useState, useEffect } from "react";
import { getPromotion, searchPromotion } from "../../../services/API";

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

const MoviePromotions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [sortBy] = useState("startDate");

  const [showSearch, setShowSearch] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [allPromotions, setAllPromotions] = useState([]); // Store all promotions for reset
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [copiedCode, setCopiedCode] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPromotionStatus = (promo) => {
    const now = new Date();
    const start = new Date(promo.StartTime);
    const end = new Date(promo.EndTime);

    if (now < start) return "upcoming"; // Chưa bắt đầu
    if (now > end) return "expired"; // Hết hạn
    return "active"; // Đang diễn ra
  };

  // Hàm sắp xếp promotions theo trạng thái: upcoming -> active -> expired
  const sortPromotions = (promos) => {
    const statusOrder = { upcoming: 0, active: 1, expired: 2 };
    return [...promos].sort((a, b) => {
      const statusA = getPromotionStatus(a);
      const statusB = getPromotionStatus(b);
      if (statusOrder[statusA] !== statusOrder[statusB]) {
        return statusOrder[statusA] - statusOrder[statusB];
      }
      // Nếu cùng trạng thái, có thể sắp xếp thêm theo ngày bắt đầu
      return new Date(a.StartTime) - new Date(b.StartTime);
    });
  };

  // Initial load of all promotions
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const data = await getPromotion();
        console.log("Dữ liệu promotion: ", data);
        const sortedPromos = sortPromotions(data.data);
        setPromotions(sortedPromos);
        setAllPromotions(sortedPromos); // Store for reset
      } catch (error) {
        console.error("Failed to fetch promotions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  // Search functionality with debouncing
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm.trim() === "") {
        // Reset to all promotions if search is empty
        const sorted = sortPromotions(allPromotions);
        setPromotions(sorted);
        // Debug trạng thái
        console.log(
          "[RESET] Promotion status order:",
          sorted.map((p) => ({
            id: p.PromotionId,
            status: getPromotionStatus(p),
          }))
        );
        setSearching(false);
      } else {
        handleSearch(searchTerm);
      }
    }, 500); // 500ms delay for debouncing

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, allPromotions]);

  const handleSearch = async (title) => {
    try {
      setSearching(true);
      const data = await searchPromotion(title);
      console.log("Search results: ", data);
      const sorted = sortPromotions(data.promotions || []);
      setPromotions(sorted);
      // Debug trạng thái
      console.log(
        "[SEARCH] Promotion status order:",
        sorted.map((p) => ({
          id: p.PromotionId,
          status: getPromotionStatus(p),
        }))
      );
    } catch (error) {
      console.error("Failed to search promotions:", error);
      // On error, show all promotions
      const sorted = sortPromotions(allPromotions);
      setPromotions(sorted);
      // Debug trạng thái
      console.log(
        "[ERROR] Promotion status order:",
        sorted.map((p) => ({
          id: p.PromotionId,
          status: getPromotionStatus(p),
        }))
      );
    } finally {
      setSearching(false);
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const handleSearchClose = () => {
    setShowSearch(false);
    setSearchTerm("");
    const sorted = sortPromotions(allPromotions);
    setPromotions(sorted); // Reset to all promotions
    // Debug trạng thái
    console.log(
      "[CLOSE] Promotion status order:",
      sorted.map((p) => ({ id: p.PromotionId, status: getPromotionStatus(p) }))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] relative overflow-hidden">
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
                onClick={handleSearchClose}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full text-purple-200 hover:text-white transition-all duration-200 flex items-center justify-center hover:bg-opacity-40"
                style={{ backgroundColor: "rgba(105, 87, 245, 0.2)" }}
                aria-label="Close search"
              >
                <span className="text-xl">×</span>
              </button>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-violet-600/20 rounded-2xl blur-xl -z-10"></div>
            </div>
            {/* Search Status Indicator */}
            {searching && (
              <div className="absolute -bottom-8 left-0 text-purple-300 text-sm animate-pulse">
                Searching...
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative z-10 p-6 md:p-12 pt-32 md:pt-40">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Hero Section */}
          <div className="text-center mb-20">
            <div className="relative inline-block mb-8">
              <h1 className="text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r from-white via-purple-200  to-pink-200 bg-clip-text text-transparent leading-tight">
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

          {/* Search Results Status */}
          {searchTerm && !searching && (
            <div className="text-center mb-8">
              <p className="text-purple-200 text-lg">
                {promotions.length > 0
                  ? `Found ${promotions.length} promotion${
                      promotions.length === 1 ? "" : "s"
                    } for "${searchTerm}"`
                  : `No promotions found for "${searchTerm}"`}
              </p>
            </div>
          )}

          {/* Enhanced Promotions Grid */}
          {loading ? (
            <div className="text-white text-center text-2xl font-bold py-12">
              Loading promotions...
            </div>
          ) : promotions?.length === 0 ? (
            <div className="text-center py-24 bg-gradient-to-br from-black/40 to-purple-900/20 backdrop-blur-xl rounded-3xl border border-purple-500/20 shadow-2xl">
              <div className="text-3xl font-bold text-white mb-4">
                {searchTerm ? "No promotions found" : "No promotions available"}
              </div>
              <p className="text-xl text-gray-300">
                {searchTerm
                  ? "Try searching for something else"
                  : "Check back later for new deals"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    const sorted = sortPromotions(allPromotions);
                    setPromotions(sorted);
                    // Debug trạng thái
                    console.log(
                      "[SHOW ALL] Promotion status order:",
                      sorted.map((p) => ({
                        id: p.PromotionId,
                        status: getPromotionStatus(p),
                      }))
                    );
                  }}
                  className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-300"
                >
                  Show All Promotions
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {promotions?.map((promo, index) => (
                <div
                  key={promo.PromotionId}
                  className={`group relative bg-gradient-to-br from-black/60 via-purple-900/20 to-black/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-purple-500/30 hover:border-purple-400/60 transition-all duration-700 transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/30
                    ${
                      promo.featured
                        ? "ring-2 ring-purple-400/50 shadow-2xl shadow-purple-500/20"
                        : ""
                    }
                    ${
                      getPromotionStatus(promo) === "expired"
                        ? " grayscale opacity-50 pointer-events-none"
                        : ""
                    }
                  `}
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  {/* Enhanced Discount Badge */}
                  <div className="absolute top-6 left-6 z-20 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-white font-extrabold text-lg shadow-lg border-2 border-white/30 animate-pulse">
                    {promo.DiscountValue
                      ? Number(promo.DiscountValue) % 1 === 0
                        ? Number(promo.DiscountValue) + "%"
                        : Number(promo.DiscountValue)
                            .toFixed(2)
                            .replace(/\.00$/, "") + "%"
                      : ""}
                  </div>

                  {/* Enhanced Image with Overlay */}
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={promo.Image || "/default-promo.jpg"}
                      alt={promo.Title}
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
                      {/* Title */}
                      <div className="w-full mb-6 flex items-center gap-2 relative">
                        {/* Hiệu ứng lấp lánh */}
                        <span className="absolute -left-8 top-1/2 -translate-y-1/2 animate-ping">
                          <Sparkles className="w-8 h-8 text-pink-400 opacity-70" />
                        </span>
                        {promo.Detail.length > 17 ? (
                          <h2 className="text-2xl font-extrabold mb-2 leading-tight bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(236,72,153,0.7)] animate-fade-in">
                            {promo.Detail.slice(0, 17) + "..."}
                          </h2>
                        ) : (
                          <h2 className="text-2xl font-extrabold mb-2 leading-tight bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(236,72,153,0.7)] animate-fade-in">
                            {promo.Detail}
                          </h2>
                        )}

                        {/* Icon động bên phải */}
                        <span className="ml-2 animate-bounce">
                          <Gift className="w-6 h-6 text-yellow-300" />
                        </span>
                      </div>
                      <div className="mb-6">
                        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-xl p-4 backdrop-blur-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Tag className="w-5 h-5 text-purple-300" />
                              <div>
                                <p className="text-purple-200 text-xs font-medium uppercase tracking-wide">
                                  Promo Code
                                </p>
                                <p className="text-white font-mono text-lg font-bold">
                                  {promo.Title}
                                </p>
                              </div>
                            </div>
                            {getPromotionStatus(promo) === "active" ? (
                              <button
                                onClick={() => handleCopy(promo.Title)}
                                className="flex items-center justify-center w-10 h-10 bg-purple-500/20 hover:bg-purple-500/40 rounded-lg transition-all duration-300 group/copy"
                                title="Copy code"
                              >
                                {copiedCode === promo.Title ? (
                                  <span className="text-green-400 text-xs font-bold">
                                    ✓
                                  </span>
                                ) : (
                                  <Copy className="w-4 h-4 text-purple-300 group-hover/copy:text-white transition-colors duration-300" />
                                )}
                              </button>
                            ) : getPromotionStatus(promo) === "upcoming" ? (
                              <span className="text-yellow-400 text-xs font-bold">
                                Upcomming
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs font-bold">
                                Expired
                              </span>
                            )}
                          </div>
                        </div>
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
                            {formatDate(promo.StartTime)} -{" "}
                            {formatDate(promo.EndTime)}
                          </p>
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
