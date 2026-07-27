import React from 'react';

const SectionHeader = ({ title, description }) => {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-gray-900 tracking-tight">{title}</h2>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </div>
  );
};

export default SectionHeader;
