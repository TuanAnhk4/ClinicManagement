import React from 'react';

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Logo/Tên App</h2>
      <nav>
        <ul>
          <li className="mb-2"><a href="#" className="block p-2 rounded hover:bg-gray-700">Dashboard</a></li>
          <li className="mb-2"><a href="#" className="block p-2 rounded hover:bg-gray-700">Appointments</a></li>
          <li className="mb-2"><a href="#" className="block p-2 rounded hover:bg-gray-700">Settings</a></li>
        </ul>
      </nav>
    </aside>
  );
};