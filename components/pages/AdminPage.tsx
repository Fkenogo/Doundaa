
import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { DETAILED_INTERESTS, ALL_INTERESTS_MAP, MAIN_CATEGORIES } from '../../interests';
// Fix: changed allMockUsers to mockUsers
import { mockUsers } from '../../constants';
import { User } from '../../types';
import { ArchiveIcon, GitMergeIcon, MegaphoneIcon, EditIcon, PlusCircleIcon, TagIcon, TrendingUpIcon, SparklesIcon, CheckCircleIcon, ChevronLeftIcon } from '../icons';

// ===================================
// DATA PROCESSING UTILS
// ===================================

const calculateTagStats = (users: User[]) => {
    const statsMap = new Map<string, number>();
    users.forEach(user => {
        (user.interestIds || []).forEach(id => {
            statsMap.set(id, (statsMap.get(id) || 0) + 1);
        });
    });
    return statsMap;
};

// ===================================
// ADMIN PAGE COMPONENT
// ===================================

const AdminPage = () => {
    const [view, setView] = useState<'analytics' | 'management'>('analytics');
    const [filter, setFilter] = useState<'all' | 'unused' | 'active' | 'archived'>('all');
    
    // Tag and Campaign State
    const [tags, setTags] = useState(() => 
        DETAILED_INTERESTS.map(t => ({...t, status: 'active' as 'active' | 'archived'}))
    );
    
    const [campaigns, setCampaigns] = useState([
        { id: 'c1', name: 'Mount Kigali Expedition', interests: ['adv_hiking', 'adv_sunrise_hikes'], status: 'Active', reach: 1200 },
        { id: 'c2', name: 'Nyamirambo Food Quest', interests: ['food_street_tours', 'food_local_cuisine'], status: 'Upcoming', reach: 0 },
    ]);

    // UI Feedback State
    const [toast, setToast] = useState<string | null>(null);
    const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
    const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
    const [mergeSelection, setMergeSelection] = useState<{primary?: string, secondary?: string}>({});
    const [newCampaign, setNewCampaign] = useState({ name: '', interests: [] as string[] });

    // Memoized Analytics Data
    // Fix: changed allMockUsers to mockUsers
    const usageStats = useMemo(() => calculateTagStats(mockUsers), []);
    
    const tagPopularityData = useMemo(() => {
        return tags
            .filter(t => t.status === 'active')
            .map(t => ({
                name: t.name,
                users: usageStats.get(t.id) || 0
            }))
            .sort((a, b) => b.users - a.users)
            .slice(0, 10);
    }, [tags, usageStats]);

    const seasonalTrendsData = [
        { month: 'Jan', Hiking: 450, Kayaking: 200, Museums: 150, Cooking: 120 },
        { month: 'Mar', Hiking: 120, Kayaking: 50, Museums: 480, Cooking: 450 },
        { month: 'Jun', Hiking: 480, Kayaking: 220, Museums: 180, Cooking: 150 },
        { month: 'Sep', Hiking: 350, Kayaking: 160, Museums: 200, Cooking: 180 },
        { month: 'Dec', Hiking: 150, Kayaking: 60, Museums: 460, Cooking: 430 },
    ];

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    // ===================================
    // ACTIONS
    // ===================================

    const handleArchiveTag = (tagId: string) => {
        const tagName = ALL_INTERESTS_MAP.get(tagId)?.name;
        if (window.confirm(`Are you sure you want to archive "${tagName}"? It will no longer be visible to users.`)) {
            setTags(prev => prev.map(t => t.id === tagId ? {...t, status: 'archived'} : t));
            showToast(`Tag "${tagName}" archived successfully.`);
        }
    };

    const handleCreateCampaign = () => {
        if (!newCampaign.name || newCampaign.interests.length === 0) return;
        setCampaigns([{ 
            id: `c${Date.now()}`, 
            name: newCampaign.name, 
            interests: newCampaign.interests, 
            status: 'Active', 
            reach: 0 
        }, ...campaigns]);
        setIsCampaignModalOpen(false);
        setNewCampaign({ name: '', interests: [] });
        showToast(`Campaign "${newCampaign.name}" launched!`);
    };

    const handleMergeSubmit = () => {
        if (!mergeSelection.primary || !mergeSelection.secondary) return;
        const primaryName = ALL_INTERESTS_MAP.get(mergeSelection.primary)?.name;
        const secondaryName = ALL_INTERESTS_MAP.get(mergeSelection.secondary)?.name;
        
        setTags(prev => prev.map(t => t.id === mergeSelection.secondary ? { ...t, status: 'archived' } : t));
        setIsMergeModalOpen(false);
        setMergeSelection({});
        showToast(`Merged ${secondaryName} into ${primaryName}.`);
    };

    // ===================================
    // RENDER HELPERS
    // ===================================

    const filteredTags = useMemo(() => {
        return tags.filter(t => {
            const count = usageStats.get(t.id) || 0;
            if (filter === 'unused') return count === 0 && t.status === 'active';
            if (filter === 'active') return count > 0 && t.status === 'active';
            if (filter === 'archived') return t.status === 'archived';
            return true;
        });
    }, [tags, filter, usageStats]);

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-10 bg-gray-50 min-h-screen pb-32 relative">
            {/* Header & Toggle */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Tag Control</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage and monitor Rwanda's interest ecosystem.</p>
                </div>
                <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex self-start">
                    <button 
                        onClick={() => setView('analytics')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${view === 'analytics' ? 'bg-teal-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Analytics
                    </button>
                    <button 
                        onClick={() => setView('management')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${view === 'management' ? 'bg-teal-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Management
                    </button>
                </div>
            </div>

            {view === 'analytics' ? (
                <div className="space-y-8 animate-fade-in-up">
                    {/* Stats Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-7 rounded-[32px] shadow-sm border border-gray-100 group transition-all hover:shadow-xl">
                            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <TagIcon className="w-6 h-6" />
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Live Tags</p>
                            <p className="text-4xl font-black text-gray-900">{tags.filter(t => t.status === 'active').length}</p>
                        </div>
                        <div className="bg-white p-7 rounded-[32px] shadow-sm border border-gray-100 group transition-all hover:shadow-xl">
                            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <GitMergeIcon className="w-6 h-6" />
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Unused Tags</p>
                            <p className="text-4xl font-black text-gray-900">{tags.filter(t => (usageStats.get(t.id) || 0) === 0 && t.status === 'active').length}</p>
                        </div>
                        <div className="bg-white p-7 rounded-[32px] shadow-sm border border-gray-100 group transition-all hover:shadow-xl">
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <SparklesIcon className="w-6 h-6" />
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Boosts</p>
                            <p className="text-4xl font-black text-gray-900">{campaigns.length}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <section className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                            <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center">
                                <TrendingUpIcon className="w-5 h-5 mr-3 text-teal-600" />
                                Top Interest Reach
                            </h2>
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <BarChart data={tagPopularityData} layout="vertical" margin={{ left: 20 }}>
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} />
                                        <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                        <Bar dataKey="users" fill="#0d9488" radius={[0, 10, 10, 0]} barSize={24} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </section>

                        <section className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                             <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center">
                                <SparklesIcon className="w-5 h-5 mr-3 text-purple-600" />
                                Seasonal Projections
                            </h2>
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <LineChart data={seasonalTrendsData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                                        <YAxis hide />
                                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                        <Line type="monotone" dataKey="Hiking" stroke="#0d9488" strokeWidth={4} dot={false} />
                                        <Line type="monotone" dataKey="Museums" stroke="#8b5cf6" strokeWidth={4} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </section>
                    </div>
                </div>
            ) : (
                <div className="space-y-8 animate-fade-in-up">
                    {/* Management Action Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
                            {(['all', 'active', 'unused', 'archived'] as const).map(f => (
                                <button 
                                    key={f} 
                                    onClick={() => setFilter(f)}
                                    className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        <div className="flex space-x-3">
                             <button 
                                onClick={() => setIsMergeModalOpen(true)}
                                className="flex items-center space-x-2 bg-white border-2 border-gray-100 text-gray-700 px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-gray-50 active:scale-95 transition-all"
                            >
                                <GitMergeIcon className="w-5 h-5" />
                                <span>Merge Tags</span>
                            </button>
                            <button 
                                onClick={() => setIsCampaignModalOpen(true)}
                                className="flex items-center space-x-2 bg-gray-900 text-white px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-black active:scale-95 transition-all shadow-lg"
                            >
                                <PlusCircleIcon className="w-5 h-5" />
                                <span>New Boost</span>
                            </button>
                        </div>
                    </div>

                    {/* Tag Grid */}
                    <section className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-4 no-scrollbar">
                            {filteredTags.length > 0 ? filteredTags.map(tag => {
                                const count = usageStats.get(tag.id) || 0;
                                const isArchived = tag.status === 'archived';
                                return (
                                    <div key={tag.id} className={`group p-5 rounded-3xl border transition-all flex items-center justify-between ${isArchived ? 'bg-gray-50 border-gray-100 opacity-60 grayscale' : 'bg-white border-gray-100 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5'}`}>
                                        <div className="flex items-center space-x-4">
                                            <span className="text-3xl bg-gray-50 p-2.5 rounded-2xl">{tag.emoji}</span>
                                            <div>
                                                <h4 className="font-black text-gray-900 text-sm leading-tight">{tag.name}</h4>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                                                        isArchived ? 'bg-red-50 text-red-500' : count === 0 ? 'bg-amber-50 text-amber-600' : 'bg-teal-50 text-teal-600'
                                                    }`}>
                                                        {isArchived ? 'Archived' : count === 0 ? 'Unused' : 'Active'}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-gray-400">Reach: {count}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {!isArchived && (
                                            <button 
                                                onClick={() => handleArchiveTag(tag.id)}
                                                className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                                                title="Archive Tag"
                                            >
                                                <ArchiveIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                );
                            }) : (
                                <div className="col-span-full py-20 text-center text-gray-400">
                                    <TagIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p className="font-bold">No tags match your current filter.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            )}

            {/* Merge Modal */}
            {isMergeModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-fade-in-up">
                    <div className="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -z-10 opacity-50"></div>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Merge Duplicates</h3>
                        <p className="text-gray-500 font-medium mb-8">Choose a secondary tag to merge into a primary one. Users will be migrated automatically.</p>
                        
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secondary Tag (Archived)</label>
                                <select 
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-teal-500/10"
                                    value={mergeSelection.secondary || ''}
                                    onChange={(e) => setMergeSelection({...mergeSelection, secondary: e.target.value})}
                                >
                                    <option value="">Select tag to merge...</option>
                                    {tags.filter(t => t.status === 'active' && t.id !== mergeSelection.primary).map(t => <option key={t.id} value={t.id}>{t.emoji} {t.name} (Reach: {usageStats.get(t.id) || 0})</option>)}
                                </select>
                            </div>
                            <div className="flex justify-center py-2">
                                <div className="bg-teal-50 p-2 rounded-full text-teal-600 animate-bounce">
                                    <TrendingUpIcon className="w-6 h-6 rotate-90" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Primary Tag (Kept)</label>
                                <select 
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-teal-500/10"
                                    value={mergeSelection.primary || ''}
                                    onChange={(e) => setMergeSelection({...mergeSelection, primary: e.target.value})}
                                >
                                    <option value="">Select target tag...</option>
                                    {tags.filter(t => t.status === 'active' && t.id !== mergeSelection.secondary).map(t => <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-10">
                            <button onClick={() => setIsMergeModalOpen(false)} className="flex-1 py-4 bg-gray-50 text-gray-500 font-black rounded-2xl text-sm active:scale-95 transition-transform uppercase tracking-widest">Cancel</button>
                            <button 
                                onClick={handleMergeSubmit}
                                disabled={!mergeSelection.primary || !mergeSelection.secondary}
                                className="flex-1 py-4 bg-teal-600 text-white font-black rounded-2xl text-sm shadow-xl shadow-teal-600/20 active:scale-95 transition-transform uppercase tracking-widest disabled:opacity-50"
                            >
                                Confirm Merge
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Campaign Modal */}
            {isCampaignModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-fade-in-up">
                    <div className="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl relative overflow-hidden flex flex-col h-5/6">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-purple-50 rounded-br-full -z-10 opacity-50"></div>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Interest Boost</h3>
                        <p className="text-gray-500 font-medium mb-8">Feature specific interests to increase their visibility during discovery.</p>
                        
                        <div className="flex-1 overflow-y-auto pr-2 no-scrollbar space-y-8">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Campaign Name</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Summer Hiking Series" 
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-teal-500/10"
                                    value={newCampaign.name}
                                    onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Interests ({newCampaign.interests.length})</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {tags.filter(t => t.status === 'active').map(t => (
                                        <button 
                                            key={t.id} 
                                            onClick={() => {
                                                const exists = newCampaign.interests.includes(t.id);
                                                setNewCampaign({
                                                    ...newCampaign,
                                                    interests: exists 
                                                        ? newCampaign.interests.filter(id => id !== t.id)
                                                        : [...newCampaign.interests, t.id]
                                                });
                                            }}
                                            className={`p-3 rounded-2xl text-left border-2 transition-all flex items-center space-x-2 ${newCampaign.interests.includes(t.id) ? 'border-teal-600 bg-teal-50 shadow-md' : 'border-gray-50 bg-gray-50'}`}
                                        >
                                            <span className="text-xl">{t.emoji}</span>
                                            <span className="text-xs font-bold text-gray-800 truncate">{t.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8 pt-4 border-t border-gray-100">
                            <button onClick={() => setIsCampaignModalOpen(false)} className="flex-1 py-4 bg-gray-50 text-gray-500 font-black rounded-2xl text-sm active:scale-95 transition-transform uppercase tracking-widest">Cancel</button>
                            <button 
                                onClick={handleCreateCampaign}
                                disabled={!newCampaign.name || newCampaign.interests.length === 0}
                                className="flex-1 py-4 bg-gray-900 text-white font-black rounded-2xl text-sm shadow-xl active:scale-95 transition-transform uppercase tracking-widest disabled:opacity-50"
                            >
                                Launch Boost
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast System */}
            {toast && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-8 py-4 rounded-[24px] shadow-2xl z-[200] animate-fade-in-up flex items-center space-x-3 border border-white/10 backdrop-blur-lg">
                    <CheckCircleIcon className="w-5 h-5 text-teal-400" />
                    <span className="font-black text-sm uppercase tracking-widest">{toast}</span>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
