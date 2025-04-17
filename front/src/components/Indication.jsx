import React from "react";

const Indication = () => {
  return (
    <div className="container flex flex-col">
      {/* Safe */}

      {/* Low Risk */}
      <div className="fixed top-16 right-4 flex items-center space-x-2 p-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full border-4 border-blue-500">
          <div className="w-6 h-12 rounded-l-full"></div>
        </div>
        <span className="text-lg font-bold text-blue-500">Low Risk</span>
      </div>

      {/* Moderate */}
      <div className="fixed top-28 right-4 flex items-center space-x-2 p-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full border-4 border-yellow-500">
          <div className="w-6 h-12  rounded-l-full"></div>
        </div>
        <span className="text-lg font-bold text-yellow-500">Moderate</span>
      </div>

      {/* High Risk */}
      <div className="fixed top-40 right-4 flex items-center space-x-2 p-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full border-4 border-red-500">
          <div className="w-6 h-12  rounded-l-full"></div>
        </div>
        <span className="text-lg font-bold text-red-500">High Risk</span>
      </div>

      {/* Safe (again) */}
      <div className="fixed top-52 right-4 flex items-center space-x-2 p-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full border-4 border-green-500">
          <div className="w-6 h-12  rounded-l-full"></div>
        </div>
        <span className="text-lg font-bold text-green-500">Safe</span>
      </div>
    </div>
  );
};

export default Indication;
