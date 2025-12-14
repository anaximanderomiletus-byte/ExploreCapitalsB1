
import React, { useEffect, useRef, useState } from 'react';
import { Filter, Compass, Map as MapIcon, Search, X, Plus, Minus, ChevronRight } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MOCK_COUNTRIES } from '../constants';
import Button from '../components/Button';
import { Country } from '../types';
import SEO from '../components/SEO';

// Define regions for filtering
const REGIONS = ['All', 'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'];

const MapPage: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [mapReady, setMapReady] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  // Create refs for both desktop and mobile result containers to handle scrolling if needed
  const desktopResultsRef = useRef<HTMLDivElement>(null);
  const mobileResultsRef = useRef<HTMLDivElement>(null);

  // Function to create custom HTML content for popups
  const createPopupContent = (country: Country) => {
    return `
      <div class="flex flex-col min-w-[240px] font-sans p-5 bg-white">
        <div class="flex items-center gap-3">
           <div class="text-4xl leading-none select-none">
             ${country.flag}
           </div>
           <h3 class="font-display font-bold text-lg text-gray-800 leading-tight m-0">${country.name}</h3>
        </div>
        
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
            class="learn-more-btn text-primary text-xs font-bold uppercase tracking-wider hover:underline text-left outline-none"
          >
            Learn More
          </button>
        </div>
      </div>
    `;
  };

  // Initialize Map
  useEffect(() => {
    const L = (window as any).L;

    if (mapRef.current && !mapInstanceRef.current && L) {
      const map = L.map(mapRef.current, {
        center: [20, 0],
        zoom: 3,
        zoomControl: false, // Custom zoom controls
        attributionControl: false,
        minZoom: 2,
        worldCopyJump: true
      });

      // CartoDB Voyager Tiles - Clean and Minimal
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);
      
      // Add Labels layer on top for better visibility
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 20,
        zIndex: 10
      }).addTo(map);

      // Create a layer group for markers
      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
      setMapReady(true);
    }

    // Global click listener for the popup buttons (delegation)
    const handlePopupClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.classList.contains('learn-more-btn')) {
        const countryId = target.getAttribute('data-country-id');
        if (countryId) {
          navigate(`/directory?country=${countryId}`);
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
    };
  }, [navigate]);

  // Update Markers when Region changes
  useEffect(() => {
    const L = (window as any).L;
    if (!mapInstanceRef.current || !markersLayerRef.current || !L) return;

    // Clear existing markers
    markersLayerRef.current.clearLayers();

    const filteredCountries = selectedRegion === 'All' 
      ? MOCK_COUNTRIES 
      : MOCK_COUNTRIES.filter(c => c.region === selectedRegion);

    const markers: any[] = [];

    filteredCountries.forEach(country => {
      // Fix for Oceania splitting across dateline
      let displayLng = country.lng;
      if (selectedRegion === 'Oceania' && country.lng < 0) {
        displayLng += 360;
      }

      // Create Custom Icon
      const icon = L.divIcon({
        className: 'bg-transparent',
        html: `<div class="w-4 h-4 bg-primary border-2 border-white rounded-full shadow-lg hover:bg-accent hover:scale-125 transition-all duration-300 cursor-pointer marker-pulse"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -10]
      });

      const marker = L.marker([country.lat, displayLng], { icon })
        .bindPopup(createPopupContent(country), {
          closeButton: false,
          className: 'custom-popup'
        });

      // Add ID to marker for easy lookup later
      (marker as any).countryId = country.id;

      markers.push(marker);
      markersLayerRef.current.addLayer(marker);
    });

    // Fit bounds to markers if region is selected (and it's not 'All' initially to keep world view)
    if (selectedRegion !== 'All' && markers.length > 0) {
      const group = L.featureGroup(markers);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    } else if (selectedRegion === 'All' && mapReady && !searchParams.get('country')) {
       // Only reset view if we aren't trying to deep link to a country
       mapInstanceRef.current.flyTo([20, 0], 2.5);
    }

  }, [selectedRegion, mapReady]);

  // Handle URL Parameter Navigation
  useEffect(() => {
    const countryId = searchParams.get('country');
    if (countryId && mapReady && mapInstanceRef.current && markersLayerRef.current) {
      const country = MOCK_COUNTRIES.find(c => c.id === countryId);
      
      if (country) {
        // Switch region if needed to ensure marker is visible
        if (selectedRegion !== 'All' && country.region !== selectedRegion) {
          setSelectedRegion('All'); 
        }

        // Fly to location
        mapInstanceRef.current.flyTo([country.lat, country.lng], 6, { duration: 1.5 });
        
        // Open popup after animation starts
        setTimeout(() => {
          markersLayerRef.current.eachLayer((layer: any) => {
            if (layer.countryId === countryId) {
              layer.openPopup();
            } else {
              // Also check lat/lng match as fallback if custom property fails
              const latLng = layer.getLatLng();
              if (Math.abs(latLng.lat - country.lat) < 0.001 && Math.abs(latLng.lng - country.lng) < 0.001) {
                layer.openPopup();
              }
            }
          });
        }, 1600);
      }
    }
  }, [searchParams, mapReady]);

  // Map Controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const flyToRandom = () => {
    const visibleCountries = selectedRegion === 'All' 
      ? MOCK_COUNTRIES 
      : MOCK_COUNTRIES.filter(c => c.region === selectedRegion);
      
    if (visibleCountries.length === 0) return;

    const randomCountry = visibleCountries[Math.floor(Math.random() * visibleCountries.length)];
    
    if (mapInstanceRef.current && randomCountry) {
      let targetLng = randomCountry.lng;
      if (selectedRegion === 'Oceania' && randomCountry.lng < 0) {
        targetLng += 360;
      }

      mapInstanceRef.current.flyTo([randomCountry.lat, targetLng], 6, {
        duration: 2
      });
      
      setTimeout(() => {
        markersLayerRef.current.eachLayer((layer: any) => {
          const latLng = layer.getLatLng();
          if (Math.abs(latLng.lat - randomCountry.lat) < 0.001 && Math.abs(latLng.lng - targetLng) < 0.001) {
            layer.openPopup();
          }
        });
      }, 2200);
    }
  };

  // Helper to normalize strings for search (removes accents/diacritics)
  const normalizeText = (text: string) => 
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // --- Search Logic ---
  const filteredSearchResults = searchQuery.length > 0 
    ? MOCK_COUNTRIES.filter(c => 
        normalizeText(c.name).includes(normalizeText(searchQuery)) || 
        normalizeText(c.capital).includes(normalizeText(searchQuery))
      )
    : [];

  // Reset selection index when search changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);

  const handleResultClick = (country: Country) => {
      setSearchQuery('');
      setSelectedIndex(-1);
      if (selectedRegion !== 'All') {
          setSelectedRegion('All');
      }
      setTimeout(() => {
          if (mapInstanceRef.current) {
              mapInstanceRef.current.flyTo([country.lat, country.lng], 6, { duration: 2 });
              setTimeout(() => {
                  markersLayerRef.current.eachLayer((layer: any) => {
                      const latLng = layer.getLatLng();
                      if (Math.abs(latLng.lat - country.lat) < 0.1 && Math.abs(latLng.lng - country.lng) < 0.1) {
                          layer.openPopup();
                      }
                  });
              }, 2200);
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
    // Fixed inset-0 ensures the map page takes the full viewport and does not scroll
    // z-40 places it above standard content but below the z-50 Navbar
    <div className="fixed inset-0 z-40 bg-surface">
      <SEO 
        title="Interactive World Map"
        description="Explore the world with our high-fidelity interactive map. Click on countries to discover capitals, flags, and key demographics."
      />
      
      {/* Styles for Rotated Mobile (Landscape) View - UPDATED */}
      <style>{`
        @media (max-height: 620px) {
          /* CSS-based resizing instead of transform:scale to keep triangle attached */
          .leaflet-popup-content {
             width: auto !important;
             margin: 0 !important;
          }
          
          /* Override Tailwind classes inside the popup HTML string */
          .leaflet-popup-content > div {
             min-width: 200px !important;
             padding: 10px !important;
          }
          
          /* Flag Emoji */
          .leaflet-popup-content .text-4xl {
             font-size: 1.5rem !important; /* 24px */
             line-height: 1 !important;
          }
          
          /* Country Name */
          .leaflet-popup-content h3 {
             font-size: 0.9rem !important; /* ~14px */
          }
          
          /* Description Text */
          .leaflet-popup-content p {
             font-size: 0.65rem !important; /* ~10px */
             line-height: 1.3 !important;
             margin-bottom: 0.5rem !important;
             -webkit-line-clamp: 2 !important; /* Reduce lines */
          }
          
          /* Stats Container */
          .leaflet-popup-content .bg-gray-50 {
             padding: 6px !important;
             margin-bottom: 8px !important;
          }
          
          /* Stats Labels */
          .leaflet-popup-content .text-\[10px\] {
             font-size: 0.5rem !important; /* 8px */
          }
          
          /* Stats Values */
          .leaflet-popup-content .font-semibold {
             font-size: 0.7rem !important; /* 11px */
          }
          
          /* Button */
          .leaflet-popup-content button {
             font-size: 0.65rem !important;
          }
        }
      `}</style>
      
      {/* Map Container */}
      <div 
        id="map" 
        ref={mapRef} 
        className="w-full h-full outline-none focus:outline-none"
        style={{ background: '#F8F9FA' }} 
      ></div>

      {/* --- DESKTOP UI (Hidden on Mobile) --- */}
      <div className="hidden md:flex absolute top-24 left-6 w-80 flex-col gap-3 z-[1000] pointer-events-none">
          {/* Search Bar */}
          <div className="pointer-events-auto relative animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-premium border border-white/50 flex items-center px-4 py-3 transition-all focus-within:ring-2 focus-within:ring-primary/50 group">
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
              
              {/* Desktop Search Results (Pop Down) */}
              {searchQuery && (
                  <div 
                    ref={desktopResultsRef}
                    className="absolute left-0 w-full bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/50 overflow-y-auto custom-scrollbar animate-in fade-in z-50 overflow-hidden max-h-[50vh] top-full mt-2 slide-in-from-top-2"
                  >
                      {filteredSearchResults.length > 0 ? (
                          <ul className="py-0">
                              {filteredSearchResults.map((country, index) => (
                                  <li key={country.id} id={`search-result-desktop-${index}`}>
                                      <button 
                                          onClick={() => handleResultClick(country)}
                                          onMouseEnter={() => setSelectedIndex(index)}
                                          className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors border-b border-gray-100 last:border-none ${index === selectedIndex ? 'bg-blue-50' : 'hover:bg-blue-50/50'}`}
                                      >
                                          <span className="text-xl shadow-sm rounded-sm overflow-hidden">{country.flag}</span>
                                          <div>
                                              <p className="text-sm font-bold text-text">{country.name}</p>
                                              <p className="text-xs text-gray-500">{country.region}</p>
                                          </div>
                                      </button>
                                  </li>
                              ))}
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
                <p className="text-xs text-gray-500 font-medium">{MOCK_COUNTRIES.length} Capitals Mapped</p>
              </div>
            </div>

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
          </div>

          {/* Legend */}
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-premium border border-white/50 pointer-events-auto animate-in fade-in slide-in-from-left-4 delay-100 duration-500">
            <div className="flex items-center gap-3 text-sm text-gray-600">
               <div className="w-3 h-3 rounded-full bg-primary border-2 border-white shadow-sm"></div>
               <span>Capital City</span>
            </div>
            <div className="mt-2 text-xs text-gray-400 leading-relaxed">
              Click on any marker to reveal country details, flag, and key statistics.
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

      {/* Desktop Zoom Controls (Hidden on tablets/mobile via lg:flex) */}
      <div className="hidden lg:flex flex-col gap-2 absolute bottom-10 right-6 z-[1000]">
        <Button variant="secondary" onClick={handleZoomIn} className="w-10 h-10 p-0 rounded-xl" size="sm">
          <Plus size={20} />
        </Button>
        <Button variant="secondary" onClick={handleZoomOut} className="w-10 h-10 p-0 rounded-xl" size="sm">
          <Minus size={20} />
        </Button>
      </div>

      {/* --- MOBILE UI (Shown on Mobile) --- */}
      {/* Hide in Landscape Mode using media query: [@media(max-height:620px)]:hidden */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-[1000] flex flex-col items-center pointer-events-none pb-6 px-4 gap-3 [@media(max-height:620px)]:hidden">
          
          {/* 1. Discover Button (Floating Pill) */}
          <button 
              onClick={flyToRandom}
              className="pointer-events-auto shadow-premium-hover bg-white text-primary border border-white/40 backdrop-blur-md px-5 py-2.5 rounded-full flex items-center gap-2 transition-all active:scale-95 active:bg-gray-50 group hover:bg-gray-50 ring-1 ring-black/5"
          >
              <Compass size={18} className="animate-spin-slow group-hover:rotate-180 transition-transform duration-700" />
              <span className="font-display font-bold text-sm tracking-wide">Discover Random</span>
          </button>

          {/* 2. Main Control Panel (Floating Card) */}
          <div className="w-full pointer-events-auto bg-white/95 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl p-4 flex flex-col gap-4 animate-in slide-in-from-bottom-20 duration-500">
              
              {/* Search Input Area */}
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
                          <button 
                              onClick={() => setSearchQuery('')} 
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 active:scale-90 transition-transform"
                          >
                              <div className="bg-gray-200 rounded-full p-0.5 text-white hover:bg-gray-300 transition-colors">
                                 <X size={14} strokeWidth={3} />
                              </div>
                          </button>
                      )}
                   </div>

                   {/* Mobile Search Results (Pop Up above input) */}
                   {searchQuery && (
                      <div 
                        ref={mobileResultsRef}
                        className="absolute bottom-full left-0 w-full mb-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-h-[40vh] overflow-y-auto custom-scrollbar animate-in slide-in-from-bottom-2 fade-in"
                      >
                          {filteredSearchResults.length > 0 ? (
                              <ul className="py-0">
                                  {filteredSearchResults.map((country, index) => (
                                      <li key={country.id}>
                                          <button 
                                              onClick={() => handleResultClick(country)}
                                              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors border-b border-gray-100 last:border-none active:bg-blue-50`}
                                          >
                                              <span className="text-xl shadow-sm rounded-sm overflow-hidden">{country.flag}</span>
                                              <div>
                                                  <p className="text-sm font-bold text-text">{country.name}</p>
                                                  <p className="text-xs text-gray-500">{country.region}</p>
                                              </div>
                                              <div className="ml-auto text-gray-300">
                                                 <ChevronRight size={16} />
                                              </div>
                                          </button>
                                      </li>
                                  ))}
                              </ul>
                          ) : (
                              <div className="p-6 text-center text-sm text-gray-500 font-medium">
                                  No results found for "{searchQuery}"
                              </div>
                          )}
                      </div>
                   )}
              </div>

              {/* Filter Chips (Horizontal Scroll) */}
              <div className="w-full overflow-x-auto no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                 <div className="flex gap-2.5 px-1 pb-1">
                   {REGIONS.map(region => (
                     <button
                       key={region}
                       onClick={() => setSelectedRegion(region)}
                       className={`
                         whitespace-nowrap flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border select-none active:scale-95
                         ${selectedRegion === region 
                           ? 'bg-primary text-white border-primary shadow-md shadow-primary/25 scale-105' 
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

      {/* Landscape-Only Controls (Visible ONLY in landscape mode) */}
      <div className="hidden [@media(max-height:620px)]:flex fixed bottom-4 right-4 z-[1000] gap-2">
          <Button 
            onClick={flyToRandom} 
            variant="primary" 
            className="w-14 h-14 p-0 rounded-full flex items-center justify-center shadow-lg" 
            size="sm"
          >
            <Compass size={28} className="animate-spin-slow" />
          </Button>
      </div>

    </div>
  );
};

export default MapPage;
