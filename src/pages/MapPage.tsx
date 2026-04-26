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

export default function MapPage() {
  const [points, setPoints] = useState<GatheringPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAndProcessData().then(data => {
      setPoints(data);
      setLoading(false);
    });
  }, []);

  const filteredPoints = points.filter(p => 
    p.ilce.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.alanAdi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans">
      <aside className="w-80 h-full bg-white border-r border-slate-200 flex flex-col z-10 shadow-sm shrink-0">
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
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll">
            {filteredPoints.filter(p => p.lat && p.lng).slice(0, 50).map((point, index) => (
              <div key={point.id || index} className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                <h3 className="text-sm font-semibold text-slate-800">{point.alanAdi}</h3>
                <p className="text-xs text-slate-500 mt-1">{point.ilce}{point.mahalle ? `, ${point.mahalle}` : ''}</p>
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
                <span className="text-xs text-slate-500">Koordinatlar çözümleniyor...</span>
              </div>
            )}
        </div>
        
        <div className="p-6 border-t border-slate-100 text-[10px] text-slate-400 text-center uppercase tracking-widest">
          Toplam {filteredPoints.length} Alan Listelendi
        </div>
      </aside>

      <main className="flex-1 relative">
        <div className="absolute top-6 left-6 flex flex-wrap items-center gap-3 z-[400] pointer-events-none">
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
            {filteredPoints.map((point) => (point.lat && point.lng) ? (
              <Marker 
                key={point.id} 
                position={[point.lat, point.lng]}
              >
                <Tooltip direction="top" offset={[0, -20]} className="font-sans">
                  {point.alanAdi}
                </Tooltip>
                <Popup className="font-sans">
                  <div className="min-w-[240px]">
                    <h2 className="font-bold text-slate-900 leading-tight mb-4 text-base">{point.alanAdi} Toplanma Alanı</h2>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="w-5 text-slate-400 mt-0.5 shrink-0">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {point.ilce}, {point.mahalle} Mah. {point.sokak && `${point.sokak} Sk.`}
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 text-slate-400 mt-0.5 shrink-0">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <p className="text-sm text-slate-600 mt-0.5">
                          {point.kapasite ? `${point.kapasite} m² Kapasite` : `Kapasite Bilinmiyor`}
                        </p>
                      </div>
                    </div>
                    <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all text-center" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`, '_blank')}>
                       Yol Tarifi Al
                    </button>
                  </div>
                </Popup>
              </Marker>
            ) : null)}
          </MapContainer>
        </div>
      </main>
    </div>
  );
}
