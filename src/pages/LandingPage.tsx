import { Link } from 'react-router-dom';
import { MapPin, ShieldAlert, ArrowRight, Activity } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-indigo-100">
      <nav className="border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-indigo-600" />
              <span className="font-semibold text-lg tracking-tight">İstanbul Toplanma Alanları</span>
            </div>
            <div>
              <Link
                to="/map"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-full transition-colors"
              >
                Haritayı Görüntüle
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 py-24 lg:py-32 overflow-hidden flex flex-col items-center text-center">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white"></div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-8">
            <Activity className="w-4 h-4" />
            <span>Güncel Veri Akışı Aktif</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-900 max-w-4xl">
            Olası Bir Afette
            <span className="block text-indigo-600">Nereye Gideceğinizi Biliyor Musunuz?</span>
          </h1>
          
          <p className="mt-6 text-lg text-neutral-600 max-w-2xl leading-relaxed">
            İstanbul genelindeki toplanma alanlarını ve güvenli bölgeleri harita üzerinde interaktif olarak görüntüleyin. Kendiniz ve aileniz için en yakın acil durum noktasını hemen keşfedin.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              to="/map"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-all shadow-sm hover:shadow-md"
            >
              <MapPin className="w-5 h-5" />
              Toplanma Alanlarını İncele
            </Link>
            <a
              href="#neden-onemli"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-medium text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-full transition-all"
            >
              Neden Önemli?
            </a>
          </div>
        </section>

        {/* Features / Why it's important */}
        <section id="neden-onemli" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight">Erişilebilir Acil Durum Bilgisi</h2>
              <p className="mt-4 text-neutral-600">Açık kaynak destekli veri seti sayesinde doğru alanları keşfedin.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
                <div className="w-12 h-12 bg-white rounded-xl border border-neutral-200 flex items-center justify-center mb-6 shadow-sm">
                  <MapPin className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Konum Bazlı Filtreleme</h3>
                <p className="text-neutral-600 leading-relaxed text-sm">Harita üzerinde gezerek veya ilçelere göre filtreleyerek size en yakın toplanma alanlarını keşfedin.</p>
              </div>
              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
                <div className="w-12 h-12 bg-white rounded-xl border border-neutral-200 flex items-center justify-center mb-6 shadow-sm">
                  <Activity className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Hızlı Koordinat Eşleştirme</h3>
                <p className="text-neutral-600 leading-relaxed text-sm">Açık Adres formatlı toplanma alanları yapay zeka ve eksik verileri kapatan Nominatim API ile anında dönüştürülüyor.</p>
              </div>
              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
                <div className="w-12 h-12 bg-white rounded-xl border border-neutral-200 flex items-center justify-center mb-6 shadow-sm">
                  <ShieldAlert className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Güvenilir Ön Bellekleme</h3>
                <p className="text-neutral-600 leading-relaxed text-sm">Kesinti anında dahi sayfa daha önce açıldıysa bölgesel veriler önbellek sayesinde haritada görülebilecek şekilde tasarlandı.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-neutral-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-neutral-500">
          <p>Olası afet durumlarında kullanılacak açık veriler esas alınarak hazırlanmıştır. Kesin ve en güncel bilgiler için resmi Afad veya İBB duyurularını takip ediniz.</p>
        </div>
      </footer>
    </div>
  );
}
