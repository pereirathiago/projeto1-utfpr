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

export function CreateAccountButton({ texto1, texto2, onClick }) {
  return (
    <div className="text-center">
      <p className='text-lg text-center mt-8'>
        {texto1}
      </p>
      <span
        onClick={onClick}
        className="text-blue-600 hover:underline cursor-pointer text-lg"
      >
        {texto2}
      </span>
    </div>
  );
}
