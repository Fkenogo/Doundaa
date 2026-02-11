
import React from 'react';

interface FilterBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const FilterButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-5 py-2.5 text-xs font-black uppercase tracking-widest rounded-2xl whitespace-nowrap transition-all duration-300 active:scale-95 ${
        isActive
            ? 'bg-teal-600 text-white shadow-xl shadow-teal-600/20'
            : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
        }`}
    >
        {label}
    </button>
);


const FilterBar: React.FC<FilterBarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = ['For You', 'Nearby', 'Trending', 'Doundaa-ing Now', 'Following'];

  return (
    <div className="sticky top-0 bg-slate-950/90 backdrop-blur-md z-40 border-b border-white/5">
      <div className="py-4 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-3 px-5">
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
