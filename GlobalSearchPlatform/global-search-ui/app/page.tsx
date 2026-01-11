"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Advertisement {
  id: number;
  title: string;
  imageUrl: string;
  isActive: boolean;
  category: string;
  price: number;
}

export default function HomePage() {
  const router = useRouter();
  
  // --- KULLANICI STATE'İ ---
  const [user, setUser] = useState<any>(null);
  
  // --- İLAN VE FİLTRE STATE'LERİ ---
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false); 
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const categories = [
    { name: "Tümü", icon: "🌐" },
    { name: "Emlak", icon: "🏠" },
    { name: "Vasıta", icon: "🚗" },
    { name: "Turizm", icon: "🌴" },
    { name: "Reklam", icon: "📢" },
    { name: "Teknoloji", icon: "💻" }
  ];

  useEffect(() => {
    // Kullanıcı kontrolü
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
      else setUser(null);
    };
    checkUser();
    
    // İlanları çek
    fetchActiveAds();
  }, []);

  const fetchActiveAds = async () => {
    try {
      const res = await fetch('http://localhost:5295/api/Advertisements');
      if (res.ok) {
        const data = await res.json();
        setAds(data.filter((ad: any) => ad.isActive));
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  };

  const filteredAds = ads
    .filter(ad => {
      const categoryMatch = selectedCategory === "Tümü" || ad.category === selectedCategory;
      const searchMatch = ad.title.toLowerCase().includes(searchTerm.toLowerCase());
      const minPriceMatch = minPrice === "" || ad.price >= Number(minPrice);
      const maxPriceMatch = maxPrice === "" || ad.price <= Number(maxPrice);
      return categoryMatch && searchMatch && minPriceMatch && maxPriceMatch;
    })
    .sort((a, b) => {
      if (sortBy === "priceAsc") return a.price - b.price;
      if (sortBy === "priceDesc") return b.price - a.price;
      return b.id - a.id;
    });

  if (loading) return <div style={{height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>Yükleniyor...</div>;

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      
      <style jsx>{`
        .layout-container { max-width: 1200px; margin: 20px auto; padding: 0 20px; display: flex; gap: 30px; }
        .sidebar { width: 250px; flex-shrink: 0; }
        .sidebar-card { background: white; padding: 15px; border-radius: 16px; border: 1px solid #e2e8f0; position: sticky; top: 100px; }
        .grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; flex: 1; }
        .cat-item { display: flex; align-items: center; gap: 10px; padding: 12px; cursor: pointer; border-radius: 10px; transition: 0.2s; font-weight: 600; color: #475569; }
        .cat-item:hover { background: #f1f5f9; color: #3182ce; }
        .cat-active { background: #3182ce !important; color: white !important; }
        .search-area { display: flex; gap: 10px; max-width: 1200px; margin: 20px auto; padding: 0 20px; }
        .search-input { flex: 1; padding: 12px 20px; border-radius: 12px; border: 1px solid #e2e8f0; outline: none; background: white; }
        .filter-btn { background: #3182ce; color: white; border: none; padding: 0 20px; border-radius: 12px; cursor: pointer; font-weight: bold; }
        .filter-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: flex-end; }
        .filter-drawer { width: 320px; height: 100%; background: white; padding: 30px; box-shadow: -5px 0 15px rgba(0,0,0,0.1); }
      `}</style>

      {/* --- HEADER --- */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '15px 0', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 onClick={() => router.push('/')} style={{ fontSize: '22px', fontWeight: '800', cursor: 'pointer', margin: 0, color: '#1e293b' }}>
            🌍 Global Search
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {user ? (
              <>
                {user.role === 'Admin' && (
                  <button onClick={() => router.push('/admin/ads')} style={{ backgroundColor: '#1a202c', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>🛡️ Admin Panel</button>
                )}
                <button onClick={() => router.push('/my-ads')} style={{ backgroundColor: '#38a169', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>➕ İlanlarım</button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 12px', backgroundColor: '#f1f5f9', borderRadius: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700' }}>👤 {user.username}</span>
                  <button onClick={handleLogout} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px' }}>Çıkış</button>
                </div>
              </>
            ) : (
              <button onClick={() => router.push('/login')} style={{ backgroundColor: '#3182ce', color: 'white', border: 'none', padding: '10px 22px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>Giriş Yap</button>
            )}
          </div>
        </div>
      </header>

      {/* --- ARAMA ÇUBUĞU --- */}
      <div className="search-area">
        <input type="text" placeholder="Kelime ile ilan ara..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <button className="filter-btn" onClick={() => setShowFilters(true)}>⚙️ Filtrele</button>
      </div>

      <div className="layout-container">
        {/* --- SOL TARAF: SABİT KATEGORİLER --- */}
        <aside className="sidebar">
          <div className="sidebar-card">
            <p style={{fontSize:'12px', fontWeight:'700', color:'#94a3b8', marginBottom:'10px', paddingLeft:'10px'}}>KATEGORİLER</p>
            {categories.map(cat => (
              <div key={cat.name} className={`cat-item ${selectedCategory === cat.name ? 'cat-active' : ''}`} onClick={() => setSelectedCategory(cat.name)}>
                <span style={{fontSize:'18px'}}>{cat.icon}</span>
                {cat.name}
              </div>
            ))}
          </div>
        </aside>

        {/* --- ANA İÇERİK: İLANLAR --- */}
        <main style={{ flex: 1 }}>
          <div className="grid-container">
            {filteredAds.map((ad) => (
              <div key={ad.id} onClick={() => router.push(`/ad/${ad.id}`)} style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #e2e8f0' }}>
                <img src={ad.imageUrl} style={{ width: '100%', height: '170px', objectFit: 'cover' }} />
                <div style={{ padding: '15px' }}>
                  <h3 style={{ fontSize: '15px', margin: '0 0 8px 0', fontWeight: 'bold' }}>{ad.title}</h3>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#2563eb' }}>{ad.price.toLocaleString()} ₺</div>
                  <div style={{ marginTop: '10px', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight:'bold' }}>{ad.category}</div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* --- SAĞDAN AÇILAN FİLTRE PANELİ --- */}
      {showFilters && (
        <div className="filter-overlay" onClick={() => setShowFilters(false)}>
          <div className="filter-drawer" onClick={(e) => e.stopPropagation()}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'30px'}}>
              <h2 style={{margin:0, fontSize:'20px'}}>Detaylı Filtre</h2>
              <button onClick={() => setShowFilters(false)} style={{background:'none', border:'none', fontSize:'24px', cursor:'pointer'}}>×</button>
            </div>

            <label style={{fontWeight:'bold', fontSize:'14px'}}>Sıralama</label>
            <select style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ddd', marginBottom:'20px'}} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">En Yeniler</option>
              <option value="priceAsc">Fiyat (Artan)</option>
              <option value="priceDesc">Fiyat (Azalan)</option>
            </select>

            <label style={{fontWeight:'bold', fontSize:'14px'}}>Fiyat Aralığı</label>
            <div style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
               <input type="number" placeholder="Min" style={{width:'100%', padding:'10px', border:'1px solid #ddd', borderRadius:'8px'}} value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
               <input type="number" placeholder="Max" style={{width:'100%', padding:'10px', border:'1px solid #ddd', borderRadius:'8px'}} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>

            <button onClick={() => setShowFilters(false)} style={{width:'100%', padding:'15px', background:'#3182ce', color:'white', border:'none', borderRadius:'10px', fontWeight:'bold', cursor:'pointer'}}>Uygula</button>
          </div>
        </div>
      )}
    </div>
  );
}