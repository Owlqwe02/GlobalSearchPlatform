"use client";
import React, { useState, useEffect, use } from 'react'; // 1. 'use' eklendi
import { useRouter } from 'next/navigation';

interface ListingDetail {
  id: number;
  title: string;
  description: string;
  price: number;
  city: string;
  categoryId: number;
  imageUrl?: string;
}

// 2. params tipi Promise olarak güncellendi
export default function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const API_PORT = 5295;
  const router = useRouter();

  // 3. params'ı 'use' ile çözümlüyoruz (unwrap)
  const { id } = use(params); 

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Veriyi Çekme
  useEffect(() => {
    // id artık güvenli bir string
    fetch(`http://localhost:${API_PORT}/api/Listings/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("İlan bulunamadı");
        return res.json();
      })
      .then(data => {
        setListing(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  // --- SİLME FONKSİYONU ---
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Bu ilanı silmek istediğinize emin misiniz? Bu işlem geri alınamaz!");
    
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:${API_PORT}/api/Listings/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert("İlan başarıyla silindi.");
        router.push('/'); 
        router.refresh(); 
      } else {
        alert("Silme işlemi başarısız oldu.");
      }
    } catch (error) {
      console.error("Silme hatası:", error);
      alert("Bir hata oluştu.");
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Yükleniyor...</div>;
  if (!listing) return <div style={{ padding: '50px', textAlign: 'center' }}>İlan bulunamadı!</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      
      <a href="/" style={{ display: 'inline-block', marginBottom: '20px', textDecoration: 'none', color: '#666' }}>
        ← Vitrine Dön
      </a>

      <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', padding: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        
        <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
          <h1 style={{ margin: 0, color: '#333' }}>{listing.title}</h1>
          <h2 style={{ color: '#28a745', marginTop: '10px' }}>{listing.price} TL</h2>
        </div>

        <div style={{ width: '100%', height: '400px', backgroundColor: '#f0f0f0', marginBottom: '20px', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           {listing.imageUrl ? (
             <img src={listing.imageUrl} alt={listing.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
           ) : (
             <span style={{ color: '#999' }}>Resim Yok</span>
           )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '5px' }}>
          <div>
            <strong>Şehir:</strong> <br /> {listing.city}
          </div>
          <div>
            <strong>İlan No:</strong> <br /> #{listing.id}
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ borderBottom: '2px solid #0070f3', display: 'inline-block', paddingBottom: '5px' }}>Açıklama</h3>
          <p style={{ lineHeight: '1.6', color: '#555' }}>
            {listing.description}
          </p>
        </div>

        {/* BUTONLAR ALANI */}
        <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ flex: 1, padding: '15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
            Satıcı ile İletişime Geç
            </button>

            <button 
                onClick={handleDelete}
                style={{ flex: 1, padding: '15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}
            >
            İlanı Sil 🗑️
            </button>
        </div>

      </div>
    </div>
  );
}