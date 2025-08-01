function CareerTalkCardSkeleton() {
  return (
    <div
      className="rounded-xl p-[10px] shadow-sm w-full max-w-[340px] animate-pulse"
      style={{
        backgroundColor: "#f3f3f3",
        border: "1px solid #ccc",
        color: "transparent",
      }}
    >
      <div className="h-[18px] w-[80px] bg-gray-300 rounded mb-[10px]" />
      <div className="h-[16px] w-[100%] bg-gray-300 rounded mb-[5px]" />
      <div className="h-[16px] w-[85%] bg-gray-300 rounded mb-[5px]" />
      <div className="h-[16px] w-[60%] bg-gray-300 rounded" />
    </div>
  );
}

export default CareerTalkCardSkeleton;
