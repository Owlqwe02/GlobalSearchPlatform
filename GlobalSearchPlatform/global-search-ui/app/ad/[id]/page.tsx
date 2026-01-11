"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function AdDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [ad, setAd] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id && params.id !== "0") {
            fetch(`http://localhost:5295/api/Advertisements/${params.id}`)
                .then(res => res.json())
                .then(data => {
                    setAd(data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [params.id]);

    if (loading) return <div style={{textAlign:'center', padding:'100px'}}>⌛ Yükleniyor...</div>;
    if (!ad) return <div style={{textAlign:'center', padding:'100px'}}>❌ İlan bulunamadı.</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
            <button onClick={() => router.back()} style={{ marginBottom: '20px', cursor: 'pointer', background: 'none', border: 'none', color: '#2563eb', fontWeight: 'bold' }}>← Geri Dön</button>
            
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                {/* SOL: Resim Alanı */}
                <div style={{ flex: 1, minWidth: '350px' }}>
                    <img 
                        src={ad.imageUrl || "/no-image.png"} 
                        style={{ width: '100%', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', objectFit: 'cover' }} 
                        alt={ad.title} 
                    />
                </div>

                {/* SAĞ: Bilgi Alanı */}
                <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>{ad.title}</h1>
                    <div style={{ fontSize: '36px', color: '#2563eb', fontWeight: '900' }}>{ad.price?.toLocaleString()} ₺</div>
                    
                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                        <p style={{ margin: '5px 0' }}><strong>Kategori:</strong> {ad.category}</p>
                        {ad.km > 0 && <p style={{ margin: '5px 0' }}><strong>KM:</strong> {ad.km}</p>}
                        {ad.modelYear > 0 && <p style={{ margin: '5px 0' }}><strong>Model:</strong> {ad.modelYear}</p>}
                    </div>

                    <div style={{ marginTop: '10px' }}>
                        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Açıklama</h3>
                        <p style={{ lineHeight: '1.6', color: '#4b5563' }}>{ad.description || "Açıklama girilmemiş."}</p>
                    </div>
                    
                    <button style={{ width: '100%', padding: '18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', marginTop: 'auto' }}>
                        📞 Satıcıyla İletişime Geç
                    </button>
                </div>
            </div>
        </div>
    );
}