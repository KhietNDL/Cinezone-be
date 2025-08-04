const UserInfoCard = ({ user }) => {
  return (
    <div className="relative bg-white/5 backdrop-blur-md rounded-3xl p-4 md:p-6 border border-white/10 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 rounded-3xl"></div>

      <div className="relative z-10">
        <h2 className="text-xl md:text-2xl font-bold mb-6 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
          Customer Information
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-2xl">
            <span className="text-gray-300 font-medium text-sm">Full Name</span>
            <span className="text-white font-semibold text-sm">{user?.fullName || 'N/A'}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl">
            <span className="text-gray-300 font-medium text-sm">Email</span>
            <span className="text-white font-semibold text-sm truncate max-w-xs">{user?.email || 'N/A'}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl">
            <span className="text-gray-300 font-medium text-sm">Phone</span>
            <span className="text-white font-semibold text-sm">{user?.phoneNumber || 'N/A'}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl">
            <span className="text-gray-300 font-medium text-sm">Identity Card</span>
            <span className="text-white font-semibold text-sm">{user?.cccd}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl">
            <span className="text-gray-300 font-medium text-sm">Available Points</span>
            <span className="text-yellow-400 font-bold text-sm">{user?.scoreBalance || 0} points</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserInfoCard;