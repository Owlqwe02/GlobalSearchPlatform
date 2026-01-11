"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditAdPage() {
    const { id } = useParams();
    const router = useRouter();
    const [ad, setAd] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Mevcut ilan verilerini çek
    useEffect(() => {
        if (id) {
            fetch(`http://localhost:5295/api/Advertisements/${id}`)
                .then(res => res.json())
                .then(data => {
                    setAd(data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [id]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:5295/api/Advertisements/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ad)
            });
            if (res.ok) {
                alert("İlan başarıyla güncellendi!");
                router.push('/my-ads');
            } else {
                alert("Güncelleme sırasında bir hata oluştu.");
            }
        } catch (err) {
            alert("Sunucuya bağlanılamadı.");
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Yükleniyor...</div>;
    if (!ad) return <div style={{ textAlign: 'center', padding: '100px' }}>İlan bulunamadı.</div>;

    return (
        <div style={formCardStyle}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1a202c' }}>📝 İlanı Düzenle</h2>
            
            <form onSubmit={handleUpdate} style={formStyle}>
                {/* Resim Önizleme Paneli */}
                <div style={uploadBoxStyle}>
                    <img src={ad.imageUrl} style={previewStyle} alt="Önizleme" />
                    <p style={{ fontSize: '12px', marginTop: '10px', color: '#718096' }}>Mevcut İlan Resmi</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={labelStyle}>İlan Başlığı</label>
                    <input 
                        value={ad.title} 
                        style={inputStyle} 
                        onChange={e => setAd({ ...ad, title: e.target.value })} 
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={labelStyle}>Kategori</label>
                        <select 
                            value={ad.category} 
                            style={inputStyle} 
                            onChange={e => setAd({ ...ad, category: e.target.value })}
                        >
                            <option value="Emlak">Emlak</option>
                            <option value="Vasıta">Vasıta</option>
                            <option value="Teknoloji">Teknoloji</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={labelStyle}>Fiyat (₺)</label>
                        <input 
                            type="number" 
                            value={ad.price} 
                            style={inputStyle} 
                            onChange={e => setAd({ ...ad, price: Number(e.target.value) })} 
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={labelStyle}>Açıklama</label>
                    <textarea 
                        value={ad.description} 
                        style={{ ...inputStyle, minHeight: '120px' }} 
                        onChange={e => setAd({ ...ad, description: e.target.value })} 
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button type="submit" style={{ ...submitBtnStyle, flex: 2 }}>💾 Güncelle</button>
                    <button 
                        type="button" 
                        onClick={() => router.back()} 
                        style={{ ...submitBtnStyle, background: '#f1f5f9', color: '#64748b', flex: 1 }}
                    >
                        Vazgeç
                    </button>
                </div>
            </form>
        </div>
    );
}

// --- TASARIM STİLLERİ (Hataları Gideren Kısım) ---

const formCardStyle: React.CSSProperties = { 
    maxWidth: '550px', 
    margin: '50px auto', 
    padding: '30px', 
    background: '#fff', 
    borderRadius: '24px', 
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    fontFamily: 'sans-serif'
};

const formStyle: React.CSSProperties = { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '15px' 
};

const labelStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#4a5568',
    marginLeft: '5px'
};

const inputStyle: React.CSSProperties = { 
    padding: '12px', 
    borderRadius: '12px', 
    border: '1px solid #e2e8f0', 
    fontSize: '15px',
    outline: 'none',
    width: '100%'
};

const uploadBoxStyle: React.CSSProperties = { 
    border: '2px dashed #e2e8f0', 
    padding: '15px', 
    borderRadius: '18px', 
    textAlign: 'center', 
    background: '#f8fafc' 
};

const previewStyle: React.CSSProperties = { 
    width: '100%', 
    maxHeight: '180px', 
    objectFit: 'cover', 
    borderRadius: '12px' 
};

const submitBtnStyle: React.CSSProperties = { 
    padding: '14px', 
    background: '#2563eb', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '12px', 
    fontWeight: 'bold', 
    cursor: 'pointer',
    fontSize: '15px',
    transition: 'opacity 0.2s'
};