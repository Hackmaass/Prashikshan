
import React, { useState } from 'react';
import { Search, MapPin, Clock, Banknote, Filter, Building2 } from 'lucide-react';
import { MOCK_INTERNSHIPS } from '../constants';
import { Internship } from '../types';

const InternshipsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  const handleApply = (id: string) => {
    const newApplied = new Set(appliedIds);
    newApplied.add(id);
    setAppliedIds(newApplied);
    // In a real app, this would make an API call
  };

  const filteredInternships = MOCK_INTERNSHIPS.filter(internship => {
    const matchesSearch = 
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = 
      filterType === 'All' || 
      (filterType === 'Remote' && internship.location.includes('Remote')) ||
      (filterType === 'On-site' && !internship.location.includes('Remote'));

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold dark:text-white">Find Internships</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Discover opportunities curated for your skill set.</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by role, company, or skills..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none dark:text-white transition-all"
          />
        </div>
        <div className="flex gap-3">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none dark:text-white font-medium cursor-pointer"
          >
            <option value="All">All Locations</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
          </select>
          <button className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Internship List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInternships.map(internship => {
          const isApplied = appliedIds.has(internship.id);
          return (
            <div key={internship.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-700">
                  <Building2 className="w-7 h-7 text-slate-400 dark:text-slate-500" />
                </div>
                {internship.matchScore && (
                  <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full">
                    {internship.matchScore}% Match
                  </span>
                )}
              </div>
              
              <div className="mb-4">
                <h3 className="text-xl font-bold dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{internship.title}</h3>
                <p className="text-slate-500 font-medium">{internship.company}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin className="w-4 h-4" /> {internship.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Banknote className="w-4 h-4" /> {internship.stipend}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Clock className="w-4 h-4" /> {internship.duration}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {internship.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-md">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto">
                <button 
                  onClick={() => !isApplied && handleApply(internship.id)}
                  disabled={isApplied}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                    isApplied 
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 cursor-default'
                      : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-slate-200 shadow-lg shadow-slate-200 dark:shadow-none'
                  }`}
                >
                  {isApplied ? 'Application Sent' : 'Apply Now'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredInternships.length === 0 && (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 font-medium">No internships found matching your criteria.</p>
          <button 
            onClick={() => {setSearchTerm(''); setFilterType('All');}}
            className="mt-4 text-indigo-600 font-bold hover:underline"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default InternshipsPage;
