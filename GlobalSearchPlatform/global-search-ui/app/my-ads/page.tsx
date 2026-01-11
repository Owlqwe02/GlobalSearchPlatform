"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Advertisement {
  id: number;
  title: string;
  price: number;
  category: string;
  isActive: boolean;
  userId: number;
}

export default function MyAdsPage() {
  const router = useRouter();
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchUserAds(parsedUser.id);
  }, []);

  const fetchUserAds = async (userId: number) => {
    try {
      // Backend'den tüm ilanları çekip kullanıcı ID'sine göre filtreliyoruz
      const res = await fetch(`http://localhost:5295/api/Advertisements`);
      if (res.ok) {
        const allAds = await res.json();
        const myAds = allAds.filter((ad: any) => ad.userId === userId);
        setAds(myAds);
      }
    } catch (err) {
      console.error("İlanlar yüklenirken hata oluştu:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAd = async (id: number) => {
    if (!confirm("Bu ilanı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) return;
    try {
      const res = await fetch(`http://localhost:5295/api/Advertisements/${id}`, { 
        method: 'DELETE' 
      });
      if (res.ok) {
        setAds(ads.filter(a => a.id !== id));
        alert("İlan başarıyla silindi.");
      }
    } catch (err) { 
      alert("Silme işlemi sırasında bir hata oluştu."); 
    }
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center', fontSize: '18px', color: '#64748b' }}>Yükleniyor...</div>;

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      
      {/* Üst Kısım */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#1e293b', fontSize: '28px', fontWeight: '800' }}>İlanlarım</h1>
          <p style={{ color: '#64748b', marginTop: '5px' }}>Toplam {ads.length} ilanınız bulunuyor.</p>
        </div>
        <button 
          onClick={() => router.push('/add-ad')} 
          style={{ background: '#3182ce', color: 'white', padding: '12px 25px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(49, 130, 206, 0.3)' }}
        >
          ➕ Yeni İlan Ekle
        </button>
      </div>

      {/* Tablo Konteynırı */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '18px' }}>İlan Bilgisi</th>
              <th style={{ padding: '18px' }}>Kategori</th>
              <th style={{ padding: '18px' }}>Fiyat</th>
              <th style={{ padding: '18px' }}>Durum</th>
              <th style={{ padding: '18px' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {ads.map(ad => (
              <tr key={ad.id} style={{ borderBottom: '1px solid #f1f5f9', transition: '0.2s' }}>
                <td style={{ padding: '18px' }}>
                  <span style={{ fontWeight: '700', color: '#1e293b', display: 'block' }}>{ad.title}</span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>ID: #{ad.id + 1000}</span>
                </td>
                <td style={{ padding: '18px' }}>
                  <span style={{ background: '#edf2f7', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: '#4a5568' }}>
                    {ad.category}
                  </span>
                </td>
                <td style={{ padding: '18px', fontWeight: '800', color: '#2d3748' }}>
                  {ad.price.toLocaleString()} ₺
                </td>
                <td style={{ padding: '18px' }}>
                  {ad.isActive ? (
                    <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '14px' }}>● Yayında</span>
                  ) : (
                    <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '14px' }}>● Pasif</span>
                  )}
                </td>
                <td style={{ padding: '18px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => router.push(`/ad/${ad.id}`)} 
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #3182ce', background: 'none', color: '#3182ce', cursor: 'pointer', fontWeight: '600' }}
                    >
                      👁️
                    </button>
                    <button 
                      onClick={() => router.push(`/edit-ad/${ad.id}`)} 
                      style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: '#edf2f7', color: '#2d3748', cursor: 'pointer', fontWeight: '600' }}
                    >
                      📝 Düzenle
                    </button>
                    <button 
                      onClick={() => deleteAd(ad.id)} 
                      style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontWeight: '600' }}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {ads.length === 0 && (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📦</div>
            <p>Henüz bir ilanınız bulunmuyor. Hemen bir tane oluşturun!</p>
          </div>
        )}
      </div>

      {/* Ana Sayfaya Dönüş */}
      <button 
        onClick={() => router.push('/')}
        style={{ marginTop: '20px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
      >
        ← Ana Sayfaya Dön
      </button>
    </div>
  );
}