"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Advertisement {
  id: number;
  title: string;
  category: string;
  price: number;
  isActive: boolean;
  username?: string; // İlan sahibinin adı (opsiyonel)
}

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Admin kontrolü
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.role !== 'Admin') {
      alert("Yetkisiz erişim!");
      router.push('/');
      return;
    }

    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await fetch('http://localhost:5295/api/Advertisements');
      if (res.ok) {
        setAds(await res.json());
      }
    } catch (err) {
      console.error("İlanlar yüklenemedi", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAd = async (id: number) => {
    if (!confirm("Bu ilanı tamamen silmek istediğinize emin misiniz?")) return;

    try {
      // Admin silme endpoint'ini kullanıyoruz
      const res = await fetch(`http://localhost:5295/api/Users/delete-ad/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setAds(ads.filter(ad => ad.id !== id));
        alert("İlan başarıyla silindi.");
      }
    } catch (err) {
      alert("Silme işlemi sırasında hata oluştu.");
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Yükleniyor...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* Üst Menü */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', backgroundColor: '#1a202c', padding: '20px', borderRadius: '12px', color: 'white' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>🛡️ Admin Panel</h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#a0aec0' }}>Tüm ilanları buradan yönetebilirsiniz.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => router.push('/admin/users')}
            style={{ backgroundColor: '#4a5568', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            👥 Kullanıcı Yönetimi
          </button>
          <button 
            onClick={() => router.push('/')}
            style={{ backgroundColor: '#2d3748', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}
          >
            Ana Sayfa
          </button>
        </div>
      </div>

      {/* İlan Tablosu */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '15px' }}>ID</th>
              <th style={{ padding: '15px' }}>Başlık</th>
              <th style={{ padding: '15px' }}>Kategori</th>
              <th style={{ padding: '15px' }}>Fiyat</th>
              <th style={{ padding: '15px' }}>Durum</th>
              <th style={{ padding: '15px' }}>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {ads.map(ad => (
              <tr key={ad.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                <td style={{ padding: '15px', color: '#64748b' }}>#{ad.id}</td>
                <td style={{ padding: '15px', fontWeight: 'bold' }}>{ad.title}</td>
                <td style={{ padding: '15px' }}>{ad.category}</td>
                <td style={{ padding: '15px' }}>{ad.price.toLocaleString()} ₺</td>
                <td style={{ padding: '15px' }}>
                  {ad.isActive ? (
                    <span style={{ color: '#38a169', fontSize: '13px' }}>● Aktif</span>
                  ) : (
                    <span style={{ color: '#e53e3e', fontSize: '13px' }}>● Pasif</span>
                  )}
                </td>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => router.push(`/ad/${ad.id}`)}
                      style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #3182ce', color: '#3182ce', background: 'none', cursor: 'pointer' }}
                    >
                      İncele
                    </button>
                    <button 
                      onClick={() => deleteAd(ad.id)}
                      style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {ads.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: '#a0aec0' }}>Hiç ilan bulunamadı.</div>}
      </div>
    </div>
  );
}