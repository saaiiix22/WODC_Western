import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";

const Magnifier = ({ src }) => {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);

  const close = () => {
    setOpen(false);
    setScale(1);
  };

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const handleWheel = (e) => {
    e.preventDefault();
    setScale((s) => Math.min(Math.max(1, s - e.deltaY * 0.001), 4));
  };

  if (!open) {
    return (
      <img
        src={src}
        className="w-fit h-32 p-2 cursor-pointer rounded-sm border border-orange-300"
        onClick={() => setOpen(true)}
      />
    );
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center"
      onClick={close}
    >
      <button
        className="absolute top-4 right-6 text-white text-3xl font-bold"
        onClick={close}
      >
        <IoMdClose />
      </button>

      <img
        src={src}
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        className="max-w-full max-h-full select-none cursor-zoom-in"
        style={{ transform: `scale(${scale})` }}
      />
    </div>,
    document.body
  );
};

export default Magnifier;
