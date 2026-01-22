import React from "react";
import { Link, useNavigate } from "react-router-dom";

const ErrorPage = ({
  code = "404",
  title = "Page Not Found",
  message = "Sorry, the page you are looking for does not exist or has been moved.",
}) => {
    const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#141414] text-white rounded-sm px-6">
      <div className="max-w-lg w-full text-center">
        {/* Error Code */}
        <h1 className="text-7xl md:text-8xl font-extrabold text-red-500 mb-4">
          {code}
        </h1>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-semibold mb-3">
          {title}
        </h2>

        {/* Message */}
        <p className="text-gray-300 mb-8">
          {message}
        </p>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium"
          >
            Go Home
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-lg border border-gray-500 hover:bg-gray-700 transition font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
