
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Filter, Compass, Map as MapIcon, Search, X, Plus, Minus, Globe, AlertTriangle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MOCK_COUNTRIES, TERRITORIES, DE_FACTO_COUNTRIES } from '../constants';
import Button from '../components/Button';
import { Country } from '../types';
import SEO from '../components/SEO';
import { useLayout } from '../context/LayoutContext';

// Define regions for filtering
const REGIONS = ['All', 'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'];

// Helper to get ISO code for flags
const getCountryCode = (emoji: string) => {
    return Array.from(emoji)
        .map(char => String.fromCharCode(char.codePointAt(0)! - 127397).toLowerCase())
        .join('');
};

interface StoredMarker {
  id: string;
  region: string;
  type: 'sovereign' | 'territory' | 'defacto';
  marker: any; // Leaflet Marker
}

const MapPage: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  
  // Store marker instances to manipulate them without re-creating (Object Pooling)
  const allMarkersRef = useRef<StoredMarker[]>([]);
  
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [showTerritories, setShowTerritories] = useState(true);
  const [showDeFacto, setShowDeFacto] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setPageLoading, setHideFooter } = useLayout();
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [activeCountryId, setActiveCountryId] = useState<string | null>(null);
  
  const desktopResultsRef = useRef<HTMLDivElement>(null);
  const mobileResultsRef = useRef<HTMLDivElement>(null);

  // Memoize Popup Content Creator
  const createPopupContent = useCallback((country: Country, type: 'sovereign' | 'territory' | 'defacto') => {
    const flagCode = getCountryCode(country.flag);
    const flagUrl = `https://flagcdn.com/w80/${flagCode}.png`;
    
    let subheader = '';
    let linkClass = 'text-primary';
    
    if (type === 'territory') {
      subheader = `<div class="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-2">Territory of ${(country as any).sovereignty}</div>`;
      linkClass = 'text-green-600';
    } else if (type === 'defacto') {
      subheader = `<div class="text-[10px] font-bold text-yellow-600 uppercase tracking-widest mb-2">${(country as any).sovereignty}</div>`;
      linkClass = 'text-yellow-600';
    }
    
    return `
      <div class="flex flex-col min-w-[240px] font-sans p-5 bg-white">
        <div class="flex items-center gap-3 mb-2">
           <div class="w-10 h-7 shrink-0 overflow-hidden">
             <img src="${flagUrl}" alt="${country.name} Flag" class="w-full h-full object-contain" />
           </div>
           <h3 class="font-display font-bold text-lg text-gray-800 leading-tight m-0">${country.name}</h3>
        </div>
        
        ${subheader}

        <p class="text-xs text-gray-500 mb-3 mt-1 leading-relaxed line-clamp-3 pt-0">
          ${country.description}
        </p>

        <div class="flex justify-between items-center text-xs text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
           <div class="flex flex-col">
             <span class="text-[10px] font-bold text-gray-400 uppercase">Capital</span>
             <span class="font-semibold text-gray-900">${country.capital}</span>
           </div>
           <div class="flex flex-col text-right">
             <span class="text-[10px] font-bold text-gray-400 uppercase">Population</span>
             <span class="font-semibold text-gray-900">${country.population}</span>
           </div>
        </div>

        <div class="text-left">
          <button 
            data-country-id="${country.id}" 
            class="learn-more-btn ${linkClass} text-xs font-bold uppercase tracking-wider hover:underline text-left outline-none"
          >
            Learn More
          </button>
        </div>
      </div>
    `;
  }, []);

  // Smart centering function to handle UI obstructions
  const centerMapOnMarker = useCallback((marker: any) => {
      const map = mapInstanceRef.current;
      const L = (window as any).L;
      if (!map || !L) return;

      const isMobile = window.innerWidth < 768;
      
      // Define UI Obstruction Dimensions
      const topNavHeight = 100; // Navigation bar + search
      const sidebarWidth = isMobile ? 0 : 360; // Desktop left sidebar
      const bottomSheetHeight = isMobile ? 380 : 0; // Mobile bottom panel (approx max height)
      
      const mapSize = map.getSize();
      
      // Calculate "Safe Zone" center relative to the map container
      // For desktop: Center is shifted right
      // For mobile: Center is shifted up
      const targetX = sidebarWidth + ((mapSize.x - sidebarWidth) / 2);
      const targetY = topNavHeight + ((mapSize.y - topNavHeight - bottomSheetHeight) / 2);

      // We want the marker to be at (targetX, targetY + offset)
      // The offset pushes the marker down so the POPUP (above marker) is centered
      const popupOffset = 120; // Pixel shift down to accommodate popup height
      const desiredMarkerScreenY = targetY + popupOffset;

      // Current global pixel position of marker
      const markerGlobal = map.project(marker.getLatLng(), map.getZoom());
      
      // Calculate the screen offset from the true center of the map container
      const screenOffsetX = targetX - (mapSize.x / 2);
      const screenOffsetY = desiredMarkerScreenY - (mapSize.y / 2);
      
      // Calculate new center in global pixels
      const newCenterGlobal = markerGlobal.subtract(L.point(screenOffsetX, screenOffsetY));
      const newCenterLatLng = map.unproject(newCenterGlobal, map.getZoom());
      
      map.flyTo(newCenterLatLng, map.getZoom(), {
          duration: 0.5, // Faster duration for snappy feel
          easeLinearity: 0.5
      });
  }, []);

  // Initialize Map
  useEffect(() => {
    const L = (window as any).L;
    
    setHideFooter(true);

    if (mapRef.current && !mapInstanceRef.current && L) {
      const map = L.map(mapRef.current, {
        center: [20, 0],
        zoom: 3,
        zoomControl: false,
        attributionControl: false,
        minZoom: 2,
        worldCopyJump: true,
        preferCanvas: true,
        wheelDebounceTime: 40,
        wheelPxPerZoomLevel: 60,
        updateWhenIdle: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 20,
        zIndex: 10
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
      
      if (allMarkersRef.current.length === 0) {
          const createMarkers = (list: Country[], type: 'sovereign' | 'territory' | 'defacto') => {
              list.forEach(country => {
                  let markerClass = '';
                  let pinClass = '';
                  let zIndex = 0;

                  if (type === 'territory') {
                    markerClass = 'territory-marker';
                    pinClass = 'territory';
                    zIndex = -100;
                  } else if (type === 'defacto') {
                    markerClass = 'defacto-marker';
                    pinClass = 'defacto';
                    zIndex = -50;
                  }

                  const icon = L.divIcon({
                      className: `custom-map-marker ${markerClass}`,
                      html: `<div class="marker-pin ${pinClass}"></div>`,
                      iconSize: [20, 20],
                      iconAnchor: [10, 10]
                  });

                  const marker = L.marker([country.lat, country.lng], { 
                      icon: icon,
                      zIndexOffset: zIndex
                  }).bindPopup(createPopupContent(country, type), {
                      closeButton: false,
                      className: 'custom-popup',
                      autoPan: false // We handle panning manually for better UX
                  });

                  marker.on('click', () => {
                      setActiveCountryId(country.id);
                      centerMapOnMarker(marker);
                  });

                  allMarkersRef.current.push({
                      id: country.id,
                      region: country.region,
                      type: type,
                      marker: marker
                  });
              });
          };

          createMarkers(MOCK_COUNTRIES, 'sovereign');
          createMarkers(TERRITORIES, 'territory');
          createMarkers(DE_FACTO_COUNTRIES, 'defacto');
      }

      setMapReady(true);
      setPageLoading(false);

      map.on('click', () => setActiveCountryId(null));
    }

    const handlePopupClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.classList.contains('learn-more-btn')) {
        const countryId = target.getAttribute('data-country-id');
        if (countryId) {
          navigate(`/country/${countryId}`);
        }
      }
    };

    document.addEventListener('click', handlePopupClick);

    return () => {
      document.removeEventListener('click', handlePopupClick);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      setHideFooter(false);
    };
  }, [navigate, setPageLoading, setHideFooter, createPopupContent, centerMapOnMarker]);

  // Effect: Efficiently filter and update map without recreating markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    requestAnimationFrame(() => {
        markersLayerRef.current.clearLayers();
        const markersToAdd: any[] = [];
        
        allMarkersRef.current.forEach(item => {
            const regionMatch = selectedRegion === 'All' || item.region === selectedRegion;
            let typeMatch = true;
            if (item.type === 'territory' && !showTerritories) typeMatch = false;
            if (item.type === 'defacto' && !showDeFacto) typeMatch = false;

            if (regionMatch && typeMatch) {
                markersToAdd.push(item.marker);
            }
        });

        markersToAdd.forEach(m => m.addTo(markersLayerRef.current));

        // Adjust bounds/view
        if (selectedRegion === 'Oceania') {
             // Special case for Oceania to handle dateline crossing comfortably
             // Zoom 3 centers well on the Pacific
             mapInstanceRef.current.setView([-10, 170], 3); 
        } else if (selectedRegion !== 'All' && markersToAdd.length > 0) {
             const L = (window as any).L;
             const group = L.featureGroup(markersToAdd);
             mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
        } else if (selectedRegion === 'All') {
             mapInstanceRef.current.setView([20, 0], 2);
        }
    });

  }, [selectedRegion, showTerritories, showDeFacto, mapReady]);

  // Effect: Update marker active styles
  useEffect(() => {
    if (mapReady) {
        allMarkersRef.current.forEach((item) => {
          const el = item.marker.getElement();
          if (el) {
            if (item.id === activeCountryId) {
              el.classList.add('marker-active');
            } else {
              el.classList.remove('marker-active');
            }
          }
        });
    }
  }, [activeCountryId, mapReady]);

  // Handle URL Parameter Navigation
  useEffect(() => {
    const countryId = searchParams.get('country');
    if (countryId && mapReady && mapInstanceRef.current) {
      const storedItem = allMarkersRef.current.find(m => m.id === countryId);
      
      if (storedItem) {
        if (storedItem.type === 'territory' && !showTerritories) setShowTerritories(true);
        if (storedItem.type === 'defacto' && !showDeFacto) setShowDeFacto(true);
        if (selectedRegion !== 'All' && storedItem.region !== selectedRegion) setSelectedRegion('All'); 

        setActiveCountryId(countryId);
        
        // Fast transition
        setTimeout(() => {
             centerMapOnMarker(storedItem.marker);
             setTimeout(() => {
                storedItem.marker.openPopup();
             }, 550);
        }, 100);
      }
    }
  }, [searchParams, mapReady, centerMapOnMarker, showTerritories, showDeFacto, selectedRegion]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const flyToRandom = () => {
    const visibleMarkers = allMarkersRef.current.filter(item => {
        const regionMatch = selectedRegion === 'All' || item.region === selectedRegion;
        let typeMatch = true;
        if (item.type === 'territory' && !showTerritories) typeMatch = false;
        if (item.type === 'defacto' && !showDeFacto) typeMatch = false;
        return regionMatch && typeMatch;
    });
      
    if (visibleMarkers.length === 0) return;
    const randomMarker = visibleMarkers[Math.floor(Math.random() * visibleMarkers.length)];
    
    if (mapInstanceRef.current && randomMarker) {
      setActiveCountryId(randomMarker.id);
      centerMapOnMarker(randomMarker.marker);
      setTimeout(() => {
        randomMarker.marker.openPopup();
      }, 550);
    }
  };

  const normalizeText = (text: string) => 
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filteredSearchResults = useMemo(() => {
      if (searchQuery.length === 0) return [];
      const query = normalizeText(searchQuery);
      return [...MOCK_COUNTRIES, ...TERRITORIES, ...DE_FACTO_COUNTRIES].filter(c => 
        normalizeText(c.name).includes(query) || 
        normalizeText(c.capital).includes(query)
      ).slice(0, 20);
  }, [searchQuery]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);

  const handleResultClick = (country: Country) => {
      setSearchQuery('');
      setSelectedIndex(-1);
      setActiveCountryId(country.id);
      
      const stored = allMarkersRef.current.find(m => m.id === country.id);
      if (stored) {
        if (stored.type === 'territory' && !showTerritories) setShowTerritories(true);
        if (stored.type === 'defacto' && !showDeFacto) setShowDeFacto(true);
      }

      if (selectedRegion !== 'All') setSelectedRegion('All');
      
      setTimeout(() => {
          if (mapInstanceRef.current && stored) {
              centerMapOnMarker(stored.marker);
              setTimeout(() => {
                  stored.marker.openPopup();
              }, 550);
          }
      }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredSearchResults.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredSearchResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const indexToUse = selectedIndex >= 0 ? selectedIndex : 0;
      if (filteredSearchResults[indexToUse]) {
        handleResultClick(filteredSearchResults[indexToUse]);
      }
    } else if (e.key === 'Escape') {
      setSearchQuery('');
      setSelectedIndex(-1);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-surface">
      <SEO 
        title="Interactive World Map"
        description="Explore the world with our high-fidelity interactive map. Click on countries to discover capitals, flags, and key demographics."
      />
      
      <div 
        id="map" 
        ref={mapRef} 
        className="w-full h-full outline-none focus:outline-none"
        style={{ background: '#F8F9FA' }} 
      ></div>

      {/* --- DESKTOP UI --- */}
      <div className="hidden md:flex absolute top-24 left-6 w-80 flex-col gap-3 z-[1000] pointer-events-none">
          {/* Search Bar */}
          <div className="pointer-events-auto relative animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-premium border border-white/50 flex items-center px-4 py-3 focus-within:ring-2 focus-within:ring-primary/50 group">
                  <button 
                    onClick={() => filteredSearchResults.length > 0 && handleResultClick(filteredSearchResults[0])} 
                    className="mr-3 text-gray-400 hover:text-primary transition-colors focus:outline-none"
                  >
                    <Search size={18} />
                  </button>
                  <input 
                      type="text" 
                      placeholder="Find a country or capital..." 
                      className="bg-transparent border-none outline-none text-sm text-text w-full placeholder-gray-400 font-medium"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                  />
                  {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                          <X size={16} />
                      </button>
                  )}
              </div>
              
              {searchQuery && (
                  <div 
                    ref={desktopResultsRef}
                    className="absolute left-0 w-full bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/50 overflow-y-auto custom-scrollbar animate-in fade-in z-50 overflow-hidden max-h-[50vh] top-full mt-2 slide-in-from-top-2"
                  >
                      {filteredSearchResults.length > 0 ? (
                          <ul className="py-0">
                              {filteredSearchResults.map((country, index) => {
                                  const flagCode = getCountryCode(country.flag);
                                  const isTerritory = TERRITORIES.some(t => t.id === country.id);
                                  const isDeFacto = DE_FACTO_COUNTRIES.some(d => d.id === country.id);
                                  let nameClass = 'text-text';
                                  if (isTerritory) nameClass = 'text-green-700';
                                  if (isDeFacto) nameClass = 'text-yellow-700';

                                  return (
                                    <li key={country.id}>
                                        <button 
                                            onClick={() => handleResultClick(country)}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                            className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors border-b border-gray-100 last:border-none ${index === selectedIndex ? 'bg-blue-50' : 'hover:bg-blue-50/50'}`}
                                        >
                                            <div className="w-8 h-6 shrink-0 overflow-hidden">
                                              <img src={`https://flagcdn.com/w40/${flagCode}.png`} alt="" className="w-full h-full object-contain" />
                                            </div>
                                            <div>
                                                <p className={`text-sm font-bold ${nameClass}`}>{country.name}</p>
                                                <p className="text-xs text-gray-500">{country.region}</p>
                                            </div>
                                        </button>
                                    </li>
                                  );
                              })}
                          </ul>
                      ) : (
                          <div className="p-4 text-center text-xs text-gray-500 font-medium">
                              No countries found matching "{searchQuery}"
                          </div>
                      )}
                  </div>
              )}
          </div>

          {/* Region Card */}
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-premium border border-white/50 pointer-events-auto animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <MapIcon size={20} />
              </div>
              <div>
                <h2 className="font-display font-bold text-text leading-tight text-base">World Explorer</h2>
                <p className="text-xs text-gray-500 font-medium">{MOCK_COUNTRIES.length + TERRITORIES.length + DE_FACTO_COUNTRIES.length} Locations</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  <Filter size={12} />
                  <span>Region Filter</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.map(region => (
                    <button
                      key={region}
                      onClick={() => setSelectedRegion(region)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                        selectedRegion === region 
                          ? 'bg-primary text-white shadow-md shadow-primary/30' 
                          : 'bg-surface text-gray-600 hover:bg-surface-dark'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
                 <button 
                   onClick={() => setShowTerritories(!showTerritories)}
                   className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-xs font-bold ${showTerritories ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-surface text-gray-500 border border-transparent hover:bg-gray-100'}`}
                 >
                   <span className="flex items-center gap-2">
                     <Globe size={14} /> Show Territories
                   </span>
                   <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${showTerritories ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${showTerritories ? 'translate-x-4' : 'translate-x-0'}`}></div>
                   </div>
                 </button>

                 <button 
                   onClick={() => setShowDeFacto(!showDeFacto)}
                   className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-xs font-bold ${showDeFacto ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 'bg-surface text-gray-500 border border-transparent hover:bg-gray-100'}`}
                 >
                   <span className="flex items-center gap-2">
                     <AlertTriangle size={14} /> Show De Facto States
                   </span>
                   <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${showDeFacto ? 'bg-yellow-500' : 'bg-gray-300'}`}>
                      <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${showDeFacto ? 'translate-x-4' : 'translate-x-0'}`}></div>
                   </div>
                 </button>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-premium border border-white/50 pointer-events-auto animate-in fade-in slide-in-from-left-4 delay-100 duration-500">
            <div className="flex flex-col gap-2 text-xs text-gray-600">
               <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-primary border border-white shadow-sm"></div>
                   <span>Country</span>
               </div>
               <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-green-500 border border-white shadow-sm"></div>
                   <span>Territory</span>
               </div>
               <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 border border-white shadow-sm"></div>
                   <span>De Facto State</span>
               </div>
            </div>
          </div>
      </div>

      {/* Desktop FAB */}
      <div className="hidden md:block absolute z-[1001] pointer-events-auto w-max bottom-10 left-1/2 -translate-x-1/2">
        <Button 
          onClick={flyToRandom}
          variant="primary" 
          className="flex items-center gap-3 px-6 py-4"
        >
          <Compass size={20} className="animate-spin-slow" />
          <span>Discover Random Place</span>
        </Button>
      </div>

      {/* Desktop Zoom Controls */}
      <div className="hidden lg:flex flex-col gap-2 absolute bottom-10 right-6 z-[1000]">
        <Button variant="secondary" onClick={handleZoomIn} className="w-10 h-10 p-0 rounded-xl" size="sm">
          <Plus size={20} />
        </Button>
        <Button variant="secondary" onClick={handleZoomOut} className="w-10 h-10 p-0 rounded-xl" size="sm">
          <Minus size={20} />
        </Button>
      </div>

      {/* --- MOBILE UI --- */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-[1000] flex flex-col items-center pointer-events-none pb-6 px-4 gap-3 [@media(max-height:620px)]:hidden">
          <button 
              onClick={flyToRandom}
              className="pointer-events-auto shadow-premium-hover bg-white text-primary border border-white/40 backdrop-blur-md px-5 py-2.5 rounded-full flex items-center gap-2 transition-all active:scale-95 ring-1 ring-black/5"
          >
              <Compass size={18} className="animate-spin-slow" />
              <span className="font-display font-bold text-sm tracking-wide">Discover Random</span>
          </button>

          <div className="w-full pointer-events-auto bg-white/95 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl p-4 flex flex-col gap-4 animate-in slide-in-from-bottom-20 duration-500">
              <div className="relative z-20">
                   <div className="relative group bg-gray-100/50 rounded-2xl border border-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all duration-300 shadow-inner">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Search size={18} className="text-gray-400 group-focus-within:text-primary transition-colors" />
                      </div>
                      <input 
                          type="text" 
                          placeholder="Search country or capital..." 
                          className="block w-full pl-10 pr-10 py-3.5 bg-transparent text-gray-900 text-sm font-medium placeholder-gray-400 outline-none rounded-2xl"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={handleKeyDown}
                      />
                      {searchQuery && (
                          <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                              <div className="bg-gray-200 rounded-full p-0.5 text-white">
                                 <X size={14} strokeWidth={3} />
                              </div>
                          </button>
                      )}
                   </div>

                   {searchQuery && (
                      <div 
                        ref={mobileResultsRef}
                        className="absolute bottom-full left-0 w-full mb-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-h-[40vh] overflow-y-auto custom-scrollbar animate-in slide-in-from-bottom-2 fade-in"
                      >
                          {filteredSearchResults.length > 0 ? (
                              <ul className="py-0">
                                  {filteredSearchResults.map((country) => {
                                      const flagCode = getCountryCode(country.flag);
                                      return (
                                        <li key={country.id}>
                                            <button 
                                                onClick={() => handleResultClick(country)}
                                                className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors border-b border-gray-100 last:border-none active:bg-blue-50"
                                            >
                                                <div className="w-8 h-6 shrink-0 overflow-hidden">
                                                  <img src={`https://flagcdn.com/w40/${flagCode}.png`} alt="" className="w-full h-full object-contain" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-text">{country.name}</p>
                                                    <p className="text-xs text-gray-500">{country.region}</p>
                                                </div>
                                            </button>
                                        </li>
                                      );
                                  })}
                              </ul>
                          ) : (
                              <div className="p-6 text-center text-sm text-gray-500 font-medium">
                                  No results found for "{searchQuery}"
                              </div>
                          )}
                      </div>
                   )}
              </div>

              {/* Added more right padding (pr-20) to ensure last item (Oceania) isn't cut off */}
              <div className="w-full overflow-x-auto no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                 <div className="flex gap-2.5 px-4 pr-20 pb-1 items-center min-w-max">
                   <button 
                      onClick={() => setShowTerritories(!showTerritories)}
                      className={`
                        whitespace-nowrap flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border select-none active:scale-95 flex items-center gap-2
                        ${showTerritories 
                           ? 'bg-green-50 text-green-700 border-green-200 shadow-sm' 
                           : 'bg-white text-gray-400 border-gray-200'
                         }
                      `}
                   >
                      <Globe size={12} /> Territories
                   </button>
                   <button 
                      onClick={() => setShowDeFacto(!showDeFacto)}
                      className={`
                        whitespace-nowrap flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border select-none active:scale-95 flex items-center gap-2
                        ${showDeFacto 
                           ? 'bg-yellow-50 text-yellow-700 border-yellow-200 shadow-sm' 
                           : 'bg-white text-gray-400 border-gray-200'
                         }
                      `}
                   >
                      <AlertTriangle size={12} /> De Facto
                   </button>
                   <div className="w-px h-6 bg-gray-200 flex-shrink-0 mx-1"></div>
                   {REGIONS.map(region => (
                     <button
                       key={region}
                       onClick={() => setSelectedRegion(region)}
                       className={`
                         whitespace-nowrap flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border select-none active:scale-95
                         ${selectedRegion === region 
                           ? 'bg-primary text-white border-primary shadow-md shadow-primary/25' // Removed scale-105
                           : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-700'
                         }
                       `}
                     >
                       {region}
                     </button>
                   ))}
                 </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default MapPage;
