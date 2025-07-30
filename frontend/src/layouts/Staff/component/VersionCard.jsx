const VersionCard = ({ children, readonly = false }) => {
  return (
    <div className="flex flex-col w-full ">
      {/* Showtimes Container */}
      {!readonly && children && <div className="p-4">{children}</div>}
    </div>
  );
};

export default VersionCard;
