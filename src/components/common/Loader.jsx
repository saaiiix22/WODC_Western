const Loader = () => {
  return (
    <div className="flex justify-center items-center h-40">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 border-4 border-slate-600/30 rounded-full"></div>
        <div className="absolute inset-0 border-t-4 border-slate-600 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;
