import React from 'react';

interface FilterBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const FilterButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors duration-200 ${
        isActive
            ? 'bg-teal-600 text-white shadow'
            : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
    >
        {label}
    </button>
);


const FilterBar: React.FC<FilterBarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = ['For You', 'Nearby', 'Trending', 'Doundaa-ing Now', 'Following'];

  return (
    <div className="sticky top-16 bg-gray-50/90 backdrop-blur-sm z-40">
      <div className="p-4">
        <div className="overflow-x-auto">
          <div className="flex items-center space-x-3">
            {tabs.map(tab => (
              <FilterButton 
                key={tab}
                label={tab}
                isActive={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;