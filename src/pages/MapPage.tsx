import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { fetchAndProcessData, GatheringPoint } from '../lib/data';
import { ArrowLeft, Loader2, Navigation, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

// Fix for default Leaflet markers missing in Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const getImageUrl = (tip: string) => {
  const t = (tip || '').toLowerCase();
  if (t.includes('park') || t.includes('bahçe') || t.includes('orman')) return 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=400&h=200&q=80'; // Park/nature
  if (t.includes('okul') || t.includes('lise') || t.includes('üniversite') || t.includes('ilkokul')) return 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&h=200&q=80'; // School
  if (t.includes('cami') || t.includes('avlu') || t.includes('mescit')) return 'https://images.unsplash.com/photo-1541432901042-2d8eb64b63d7?auto=format&fit=crop&w=400&h=200&q=80'; // Mosque (Blue Mosque)
  if (t.includes('meydan') || t.includes('pazar')) return 'https://images.unsplash.com/photo-1541433604-58a43f8e5622?auto=format&fit=crop&w=400&h=200&q=80'; // Square/Market
  if (t.includes('otopark') || t.includes('garaj')) return 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=400&h=200&q=80'; // Parking
  if (t.includes('spor') || t.includes('stadyum')) return 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=400&h=200&q=80'; // Sports
  
  return 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=400&h=200&q=80'; // Default safe area
};

function MapUpdater({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, 16, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

export default function MapPage() {
  const [points, setPoints] = useState<GatheringPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState('Veriler Yükleniyor...');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    fetchAndProcessData((msg) => setLoadingMsg(msg)).then(data => {
      setPoints(data);
      setLoading(false);
    });
  }, []);

  const uniqueTypes = Array.from(new Set(points.map(p => p.tip).filter(Boolean)));

  const filteredPoints = points.filter(p => {
    const s = searchTerm.toLowerCase();
    const matchSearch = p.ilce.toLowerCase().includes(s) || 
                        p.alanAdi.toLowerCase().includes(s) ||
                        (p.mahalle && p.mahalle.toLowerCase().includes(s));
    const matchType = typeFilter ? p.tip === typeFilter : true;
    return matchSearch && matchType;
  });

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans relative">
      <aside className={`absolute md:relative inset-y-0 left-0 w-full md:w-80 bg-white border-r border-slate-200 flex-col z-20 shadow-xl md:shadow-sm shrink-0 transition-transform duration-300 md:translate-x-0 ${viewMode === 'list' ? 'translate-x-0 flex' : '-translate-x-full md:flex'}`}>
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <Link to="/" className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
               <Navigation className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">İst-Toplan</h1>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="İlçe veya Mahalle Ara..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            </div>
            
            <div className="relative">
              <select
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none text-slate-700"
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
              >
                <option value="">Tüm Türler</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll">
            {filteredPoints.filter(p => p.lat && p.lng).slice(0, 50).map((point, index) => (
              <div 
                key={point.id || index} 
                className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => {
                  if (point.lat && point.lng) {
                    setSelectedLocation([point.lat, point.lng]);
                    if (window.innerWidth < 768) {
                      setViewMode('map');
                    }
                  }
                }}
              >
                <h3 className="text-sm font-semibold text-slate-800">{point.alanAdi}</h3>
                <p className="text-xs text-slate-500 mt-1">{[point.ilce, point.mahalle ? `${point.mahalle} Mah.` : ''].filter(Boolean).join(', ')}</p>
                <div className="mt-2 flex items-center gap-2 text-[10px] font-medium text-blue-600 uppercase tracking-wider">
                  <span>{point.tip || 'Toplanma Alanı'}</span>
                </div>
              </div>
            ))}
            {filteredPoints.length === 0 && !loading && (
              <div className="text-center text-slate-500 text-sm py-10">Sonuç bulunamadı.</div>
            )}
            {loading && (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-xs text-slate-500 text-center max-w-[200px]">{loadingMsg}</span>
              </div>
            )}
        </div>
        
        <div className="p-6 border-t border-slate-100 text-[10px] text-slate-400 text-center uppercase tracking-widest">
          Toplam {filteredPoints.length} Alan Listelendi
        </div>
      </aside>

      <main className="flex-1 relative z-10 w-full h-full">
        <div className="absolute top-6 left-6 flex flex-wrap items-center gap-3 z-[400] pointer-events-none max-w-[calc(100vw-3rem)]">
          <div className="bg-white/80 backdrop-blur-[12px] px-4 py-2 rounded-full border border-white/30 text-xs font-semibold text-slate-600 shadow-sm flex items-center gap-2 pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Canlı Veri Akışı Bağlı
          </div>
          {searchTerm && (
            <div className="bg-white/80 backdrop-blur-[12px] px-4 py-2 rounded-full border border-white/30 text-xs font-semibold text-slate-600 shadow-sm pointer-events-auto">
              İlçe/Ara: {searchTerm}
            </div>
          )}
        </div>

        <div className="w-full h-full relative z-0">
          <MapContainer 
            center={[41.0082, 28.9784]} 
            zoom={12} 
            className="w-full h-full"
            maxZoom={18}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={selectedLocation} />
            {filteredPoints.map((point) => (point.lat && point.lng) ? (
              <Marker 
                key={point.id} 
                position={[point.lat, point.lng]}
              >
                <Tooltip direction="top" offset={[0, -20]} className="font-sans">
                  {point.alanAdi}
                </Tooltip>
                <Popup className="font-sans">
                  <div className="min-w-[260px] w-full bg-white flex flex-col">
                    <div className="w-full h-32 relative bg-slate-200">
                      <img src={getImageUrl(point.tip)} alt={point.alanAdi} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                      <div className="absolute bottom-3 left-4 right-4">
                        <div className="inline-block px-2 py-0.5 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider rounded border border-blue-500 mb-1">
                          {point.tip || 'Toplanma Alanı'}
                        </div>
                        <h2 className="font-bold text-white leading-tight text-sm line-clamp-2">{point.alanAdi}</h2>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3 mb-5">
                        <div className="flex items-start gap-3">
                          <div className="w-4 h-4 text-slate-400 mt-0.5 shrink-0 flex items-center justify-center">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {point.ilce}, {point.mahalle} Mah. {point.sokak && `${point.sokak} Sk.`}
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-4 h-4 text-slate-400 mt-0.5 shrink-0 flex items-center justify-center">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          </div>
                          <p className="text-sm text-slate-600">
                            {point.kapasite ? `${point.kapasite} m² Kapasite` : `Kapasite Bilinmiyor`}
                          </p>
                        </div>
                      </div>
                      <button className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all text-center flex justify-center items-center gap-2" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`, '_blank')}>
                         Yol Tarifi Al
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ) : null)}
          </MapContainer>
        </div>
      </main>

      {/* Mobile Navigation Toggle */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000] flex bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-slate-200 p-1.5">
        <button 
          onClick={() => setViewMode('list')}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Liste
        </button>
        <button 
          onClick={() => setViewMode('map')}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${viewMode === 'map' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <Navigation className="w-4 h-4" />
          Harita
        </button>
      </div>
    </div>
  );
}
