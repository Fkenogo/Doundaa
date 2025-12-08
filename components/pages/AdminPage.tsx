import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { DETAILED_INTERESTS, ALL_INTERESTS_MAP, Interest } from '../../interests';
import { allMockUsers } from '../../constants';
import { User } from '../../types';
import { ArchiveIcon, GitMergeIcon, MegaphoneIcon, EditIcon, PlusCircleIcon } from '../icons';

// ===================================
// DATA MOCKING & PROCESSING
// ===================================

const tagPopularityData = DETAILED_INTERESTS.slice(0, 10).map((interest) => ({
    name: `${interest.emoji} ${interest.name}`,
    users: Math.floor(Math.random() * 500) + 50,
    activities: Math.floor(Math.random() * 100) + 10,
}));

const seasonalTrendsData = [
    { season: 'Dry (Jun-Sep)', Hiking: 450, Kayaking: 200, Museums: 150, Cooking: 120 },
    { season: 'Rainy (Mar-May)', Hiking: 120, Kayaking: 50, Museums: 480, Cooking: 450 },
    { season: 'Dry (Dec-Feb)', Hiking: 480, Kayaking: 220, Museums: 180, Cooking: 150 },
    { season: 'Rainy (Oct-Nov)', Hiking: 150, Kayaking: 60, Museums: 460, Cooking: 430 },
];

const getTopInterestPairs = (users: User[]) => {
    const pairCounts = new Map<string, number>();
    users.forEach(user => {
        const interests = [...new Set(user.interestIds || [])]; // Dedupe interests per user
        for (let i = 0; i < interests.length; i++) {
            for (let j = i + 1; j < interests.length; j++) {
                const pair = [interests[i], interests[j]].sort().join('--');
                pairCounts.set(pair, (pairCounts.get(pair) || 0) + 1);
            }
        }
    });
    
    return Array.from(pairCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([pair, count]) => {
            const [id1, id2] = pair.split('--');
            const interest1 = ALL_INTERESTS_MAP.get(id1);
            const interest2 = ALL_INTERESTS_MAP.get(id2);
            if (!interest1 || !interest2) return null;
            return {
                pair: `${interest1.emoji} ${interest1.name} + ${interest2.emoji} ${interest2.name}`,
                count
            };
        }).filter(Boolean);
};


// ===================================
// ADMIN PAGE COMPONENT
// ===================================

const AdminPage = () => {
    const [tags, setTags] = useState(DETAILED_INTERESTS.slice(0, 50).map(t => ({...t, status: 'active'})));
    const [campaigns, setCampaigns] = useState([
        { id: 'c1', name: 'Rwanda Hiking Challenge', interests: ['adv_hiking', 'adv_sunrise_hikes'], status: 'Active' },
        { id: 'c2', name: 'Taste of Kigali Food Week', interests: ['food_street_tours', 'food_local_cuisine'], status: 'Upcoming' },
    ]);

    const topInterestPairs = useMemo(() => getTopInterestPairs(allMockUsers), []);
    
    const handleArchiveTag = (tagId: string) => {
        if (window.confirm("Are you sure you want to archive this tag?")) {
            setTags(tags.map(t => t.id === tagId ? {...t, status: 'archived'} : t));
        }
    };
    
    return (
        <div className="max-w-md mx-auto p-4 space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

            {/* Campaigns Section */}
            <section className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Featured Campaigns</h2>
                    <button className="flex items-center space-x-2 text-sm bg-teal-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-teal-700 transition-colors">
                        <PlusCircleIcon className="w-5 h-5" />
                        <span>New Campaign</span>
                    </button>
                </div>
                <div className="space-y-3">
                    {campaigns.map(c => (
                        <div key={c.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold text-gray-800">{c.name}</p>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{c.status}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {c.interests.map(id => {
                                    const interest = ALL_INTERESTS_MAP.get(id);
                                    return <span key={id} className="text-xs bg-white border rounded-full px-2 py-0.5">{interest?.emoji} {interest?.name}</span>
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Analytics Section */}
            <section className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Tag Analytics</h2>
                
                <h3 className="font-semibold text-gray-700 mb-2">Most Popular Interests</h3>
                 <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={tagPopularityData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} interval={0} />
                            <Tooltip wrapperStyle={{ fontSize: '12px' }} />
                            <Legend wrapperStyle={{ fontSize: '12px' }}/>
                            <Bar dataKey="users" fill="#14B8A6" radius={[0, 4, 4, 0]} />
                            <Bar dataKey="activities" fill="#F97316" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <h3 className="font-semibold text-gray-700 mt-6 mb-2">Top Interest Combinations</h3>
                <div className="space-y-2">
                    {topInterestPairs.map((item, idx) => item && (
                        <div key={idx} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">{item.pair}</span>
                            <span className="font-bold text-teal-600">{item.count} users</span>
                        </div>
                    ))}
                </div>

                <h3 className="font-semibold text-gray-700 mt-6 mb-2">Seasonal Trends</h3>
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <LineChart data={seasonalTrendsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="season" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }}/>
                            <Tooltip wrapperStyle={{ fontSize: '12px' }} />
                            <Legend wrapperStyle={{ fontSize: '12px' }}/>
                            <Line type="monotone" dataKey="Hiking" stroke="#1D6F3E" strokeWidth={2} />
                            <Line type="monotone" dataKey="Kayaking" stroke="#06B6D4" strokeWidth={2} />
                            <Line type="monotone" dataKey="Museums" stroke="#6B3FC6" strokeWidth={2} />
                            <Line type="monotone" dataKey="Cooking" stroke="#CC5F2F" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* Tag Management Section */}
            <section className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Tag Management</h2>
                <div className="h-80 overflow-y-auto border rounded-lg p-2 space-y-2">
                    {tags.map(tag => (
                         <div key={tag.id} className={`flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded-lg ${tag.status === 'archived' ? 'opacity-50 bg-gray-100' : ''}`}>
                            <span className={`${tag.status === 'archived' ? 'line-through' : ''}`}>{tag.emoji} {tag.name}</span>
                            <div className="flex items-center space-x-3">
                                <button title="Edit" className="text-gray-400 hover:text-blue-600"><EditIcon className="w-4 h-4" /></button>
                                <button title="Merge" className="text-gray-400 hover:text-purple-600"><GitMergeIcon className="w-4 h-4" /></button>
                                <button title="Archive" onClick={() => handleArchiveTag(tag.id)} disabled={tag.status === 'archived'} className="text-gray-400 hover:text-red-600 disabled:text-gray-300"><ArchiveIcon className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AdminPage;