import React from 'react';

export function PrimaryButton({ children, onClick, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
    >
      {children}
    </button>
  );
}

export function CreateAccountButton({ children, onClick }) {
  return (
    <div className="text-center mt-6">
      <span
        onClick={onClick}
        className="text-blue-600 hover:underline cursor-pointer text-lg"
      >
        {children}
      </span>
    </div>
  );
}
