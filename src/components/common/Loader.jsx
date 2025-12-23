const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 border-4 border-slate-600/30 rounded-full"></div>
        <div className="absolute inset-0 border-t-4 border-slate-600 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;
