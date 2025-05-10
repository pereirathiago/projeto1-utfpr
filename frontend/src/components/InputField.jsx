import React from 'react';

export default function InputField({ label, type = 'text', name, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor={name}>
        {label}
      </label>
      <input
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
