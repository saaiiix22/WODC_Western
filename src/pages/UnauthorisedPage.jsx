import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineShieldCheck, HiOutlineArrowLeft } from 'react-icons/hi';

const UnauthorisedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[120px]" />

      <div className="relative max-w-2xl w-full text-center">
        {/* Icon Animation Container */}
        <div className="relative mb-8 inline-block">
          <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full" />
          <div className="relative bg-slate-900 border border-white/10 p-6 rounded-3xl shadow-2xl">
            <HiOutlineShieldCheck className="text-red-500 text-7xl animate-pulse" />
          </div>
          
          {/* Small floating elements */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-bounce" />
          <div className="absolute -bottom-4 -left-6 w-3 h-3 bg-slate-700 rounded-full" />
        </div>

        {/* Text Content */}
        <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">
          403
        </h1>
        <h2 className="text-2xl font-bold text-slate-200 mb-4 uppercase tracking-widest">
          Access Denied
        </h2>
        
        <p className="text-slate-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          It looks like you don't have the necessary permissions to view this sector. 
          Please contact your administrator if you believe this is a mistake.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all duration-300 group"
          >
            <HiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-900/20 transition-all duration-300 transform hover:scale-105 font-semibold"
          >
            Return Home
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <p className="text-slate-600 text-xs uppercase tracking-[0.3em]">
            WODC Portal Security Protocols
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnauthorisedPage;