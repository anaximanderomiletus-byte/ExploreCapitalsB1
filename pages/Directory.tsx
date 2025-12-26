
import React, { useState, useMemo, useEffect } from 'react';
import { Search, ArrowUp, ArrowDown, ArrowUpDown, ChevronRight, Maximize2, Banknote, Languages, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_COUNTRIES, TERRITORIES } from '../constants';
import { Country, Territory } from '../types';
import SEO from '../components/SEO';
import { useLayout } from '../context/LayoutContext';

type SortKey = 'name' | 'capital' | 'region' | 'population' | 'area';
type SortDirection = 'asc' | 'desc';

interface SortHeaderProps {
  label: string;
  field: SortKey;
  align?: 'left' | 'right';
  sortConfig: { key: SortKey; direction: SortDirection } | null;
  onSort: (key: SortKey) => void;
}

const SortHeader: React.FC<SortHeaderProps> = ({ label, field, align = 'left', sortConfig, onSort }) => {
  const isActive = sortConfig?.key === field;
  const isAsc = sortConfig?.direction === 'asc';

  return (
    <th 
      className={`px-6 py-5 cursor-pointer hover:bg-gray-100 transition-colors group select-none ${align === 'right' ? 'text-right' : 'text-left'} whitespace-nowrap`}
      onClick={() => onSort(field)}
    >
      <div className={`flex items-center gap-2 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
        <span className={`font-semibold text-xs uppercase tracking-wider transition-colors ${isActive ? 'text-primary' : 'text-gray-500 group-hover:text-gray-700'}`}>
          {label}
        </span>
        <span className={`transition-opacity ${isActive ? 'opacity-100 text-primary' : 'opacity-0 group-hover:opacity-50 text-gray-400'}`}>
          {isActive ? (isAsc ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : <ArrowUpDown size={14} />}
        </span>
      </div>
    </th>
  );
};

// Helper to calculate ISO code from emoji flag
const getCountryCode = (emoji: string) => {
    return Array.from(emoji)
        .map(char => String.fromCharCode(char.codePointAt(0)! - 127397).toLowerCase())
        .join('');
};

// Helper component for Flag Icons
const FlagIcon = ({ country, size = 'small' }: { country: Country, size?: 'small' | 'large' | 'card' }) => {
  const code = getCountryCode(country.flag);
  let dims = "w-8 h-6"; 
  if (size === 'card') dims = "w-12 h-9"; 
  else if (size === 'large') dims = "w-16 h-12";

  return (
    <div className={`flex items-center justify-center select-none overflow-hidden shrink-0 ${dims}`}>
      <img 
        src={`https://flagcdn.com/w80/${code}.png`}
        alt={`${country.name} Flag`}
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
  );
};

interface MobileCountryCardProps {
  country: Country;
  onClick: () => void;
  isTerritory?: boolean;
  sovereignty?: string;
}

const MobileCountryCard: React.FC<MobileCountryCardProps> = ({ country, onClick, isTerritory, sovereignty }) => (
    <div 
      onClick={onClick}
      className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 active:scale-[0.98] transition-all hover:shadow-md cursor-pointer flex flex-col transform-gpu backface-hidden"
      style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <FlagIcon country={country} size="card" />
          </div>
          <div>
            <h3 className={`font-bold text-lg leading-tight ${isTerritory ? 'text-green-800' : 'text-text'}`}>{country.name}</h3>
            <div className="text-sm text-gray-500">{country.capital}</div>
            {isTerritory && <div className="text-[10px] uppercase font-bold text-gray-400 mt-0.5">{sovereignty}</div>}
          </div>
        </div>
        <div className="text-gray-300">
          <ChevronRight size={20} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-surface/50 p-2 rounded-lg">
           <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Population</div>
           <div className="text-sm font-semibold text-text">{country.population}</div>
        </div>
        <div className="bg-surface/50 p-2 rounded-lg">
           <div className="text-[10px] text-gray-400 uppercase font-bold mb-1 flex items-center gap-1">
              <Maximize2 size={10} /> Area (km²)
           </div>
           <div className="text-sm font-semibold text-text">{country.area}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 pt-4 border-t border-gray-100">
         {country.languages.slice(0, 3).map((lang, idx) => (
           <span key={idx} className="text-[10px] font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full flex items-center gap-1">
             <Languages size={10} className="opacity-50" /> {lang}
           </span>
         ))}
         {country.languages.length > 3 && (
           <span className="text-[10px] font-medium px-2 py-1 bg-gray-50 text-gray-400 rounded-full">+{country.languages.length - 3}</span>
         )}
      </div>
    </div>
);

const Directory: React.FC = () => {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null);
  const navigate = useNavigate();
  const { setPageLoading, setTransitionStyle } = useLayout();

  useEffect(() => {
    setPageLoading(false);

    // Restore state from session storage if available
    const savedSearch = sessionStorage.getItem('directorySearch');
    const savedSort = sessionStorage.getItem('directorySort');
    const savedScroll = sessionStorage.getItem('directoryScrollY');

    if (savedSearch) setSearch(savedSearch);
    if (savedSort) setSortConfig(JSON.parse(savedSort));

    if (savedScroll) {
      // Small timeout to allow render to complete before scrolling
      setTimeout(() => {
        window.scrollTo({
          top: parseInt(savedScroll, 10),
          behavior: 'instant'
        });
        
        // Clean up after restoring
        sessionStorage.removeItem('directoryScrollY');
        sessionStorage.removeItem('directorySearch');
        sessionStorage.removeItem('directorySort');
      }, 100);
    }
  }, [setPageLoading]);

  // Helper to parse numeric strings
  const getNumericValue = (str: string) => {
    const value = parseFloat(str.replace(/[^0-9.]/g, ''));
    if (str.includes('B')) return value * 1_000_000_000;
    if (str.includes('M')) return value * 1_000_000;
    if (str.includes('K')) return value * 1_000;
    return value;
  };

  const normalizeText = (text: string) => 
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const handleSort = (key: SortKey) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleCountryClick = (id: string) => {
    // Save current state and scroll position
    sessionStorage.setItem('directoryScrollY', window.scrollY.toString());
    sessionStorage.setItem('directorySearch', search);
    sessionStorage.setItem('directorySort', JSON.stringify(sortConfig));

    // DISCLOSURE: Premium "Cartographic Zoom" transition
    setTransitionStyle('cartographic');
    navigate(`/country/${id}`);
  };

  const processList = <T extends Country>(list: T[]) => {
      let data = [...list];
      if (search) {
        const normalizedSearch = normalizeText(search);
        data = data.filter(c => 
          normalizeText(c.name).includes(normalizedSearch) || 
          normalizeText(c.capital).includes(normalizedSearch) ||
          normalizeText(c.region).includes(normalizedSearch) ||
          normalizeText(c.currency).includes(normalizedSearch)
        );
      }
      if (sortConfig) {
        data.sort((a, b) => {
          const { key, direction } = sortConfig;
          // @ts-ignore
          let aValue: any = a[key];
          // @ts-ignore
          let bValue: any = b[key];
          if (key === 'population' || key === 'area') {
            aValue = getNumericValue(a[key]);
            bValue = getNumericValue(b[key]);
            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
          }
          if (typeof aValue === 'string' && typeof bValue === 'string') {
              return direction === 'asc' 
                  ? aValue.localeCompare(bValue, 'en', { sensitivity: 'base' })
                  : bValue.localeCompare(aValue, 'en', { sensitivity: 'base' });
          }
          return 0;
        });
      }
      return data;
  };

  const processedCountries = useMemo(() => processList(MOCK_COUNTRIES), [search, sortConfig]);
  const processedTerritories = useMemo(() => processList(TERRITORIES), [search, sortConfig]);

  return (
    <div className="pt-28 pb-20 px-4 md:px-6 bg-surface min-h-screen">
      <SEO 
        title="Country Directory"
        description="Search and sort data for over 190 nations. View flags, capitals, populations, currencies, and languages."
      />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-text mb-2">Country Directory</h1>
            <p className="text-gray-500">Search and sort detailed statistics for over 190 nations.</p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by country, capital, region..."
              className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm text-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* --- Sovereign Countries Section --- */}
        
        {/* DESKTOP TABLE (Hidden on small screens) */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-premium overflow-hidden border border-gray-100 mb-16">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <SortHeader label="Country" field="name" sortConfig={sortConfig} onSort={handleSort} />
                  <SortHeader label="Capital" field="capital" sortConfig={sortConfig} onSort={handleSort} />
                  <SortHeader label="Region" field="region" sortConfig={sortConfig} onSort={handleSort} />
                  <SortHeader label="Pop." field="population" sortConfig={sortConfig} onSort={handleSort} align="right" />
                  <SortHeader label="Area (km²)" field="area" sortConfig={sortConfig} onSort={handleSort} align="right" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {processedCountries.map((country) => (
                  <tr 
                    key={country.id} 
                    onClick={() => handleCountryClick(country.id)}
                    className="group hover:bg-blue-50/50 transition-colors duration-200 cursor-pointer"
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-4 shrink-0 w-12 text-center">
                            <FlagIcon country={country} size="small" />
                        </div>
                        <span className="font-medium text-text group-hover:text-primary transition-colors">{country.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-600">{country.capital}</td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-dark/60 text-text/80 border border-secondary/40 whitespace-nowrap">
                        {country.region}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-gray-600 tabular-nums text-right">{country.population}</td>
                    <td className="px-6 py-5 text-gray-600 tabular-nums text-right">{country.area}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MOBILE GRID (Visible ONLY on small screens) */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {processedCountries.map((country) => (
             <MobileCountryCard key={country.id} country={country} onClick={() => handleCountryClick(country.id)} />
          ))}
        </div>

        {/* --- Officially Recognized Territories Section --- */}
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg text-green-700">
                    <Globe size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-display font-bold text-text">Officially Recognized Territories</h2>
                    <p className="text-sm text-gray-500">Major non-sovereign dependencies and autonomous regions.</p>
                </div>
            </div>
            
            {/* DESKTOP TABLE (Hidden on small screens) */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-premium overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-green-50/50 border-b border-gray-100">
                      <SortHeader label="Territory" field="name" sortConfig={sortConfig} onSort={handleSort} />
                      <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Sovereignty</th>
                      <SortHeader label="Capital" field="capital" sortConfig={sortConfig} onSort={handleSort} />
                      <SortHeader label="Region" field="region" sortConfig={sortConfig} onSort={handleSort} />
                      <SortHeader label="Pop." field="population" sortConfig={sortConfig} onSort={handleSort} align="right" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {processedTerritories.map((territory) => (
                      <tr 
                        key={territory.id} 
                        onClick={() => handleCountryClick(territory.id)}
                        className="group hover:bg-green-50/30 transition-colors duration-200 cursor-pointer"
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="mr-4 shrink-0 w-12 text-center">
                                <FlagIcon country={territory} size="small" />
                            </div>
                            <span className="font-medium text-text group-hover:text-green-700 transition-colors">{territory.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-gray-500 font-medium text-xs uppercase tracking-wide">
                            {territory.sovereignty}
                        </td>
                        <td className="px-6 py-5 text-gray-600">{territory.capital}</td>
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-dark/60 text-text/80 border border-secondary/40 whitespace-nowrap">
                            {territory.region}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-gray-600 tabular-nums text-right">{territory.population}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE GRID (Visible ONLY on small screens) */}
            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
              {processedTerritories.map((territory) => (
                 <MobileCountryCard key={territory.id} country={territory} onClick={() => handleCountryClick(territory.id)} isTerritory sovereignty={territory.sovereignty} />
              ))}
           </div>
        </div>

        {processedCountries.length === 0 && processedTerritories.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center text-gray-500 border border-gray-100 mt-4 shadow-sm">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-text mb-1">No matches found</h3>
            <p>We couldn't find any countries or territories matching "{search}".</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Directory;
