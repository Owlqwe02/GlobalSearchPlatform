"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddAdPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [ad, setAd] = useState({
        title: '',
        category: 'Emlak',
        price: '',
        description: '',
        km: '',
        modelYear: '',
        roomCount: '1+1',
        squareMeter: ''
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
        if (selectedFile) setPreview(URL.createObjectURL(selectedFile));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return alert("Lütfen bir resim seçin!");

        const formData = new FormData();
        formData.append('file', file);

        try {
            // 1. Resmi Yükle
            const uploadRes = await fetch('http://localhost:5295/api/Advertisements/upload', {
                method: 'POST',
                body: formData
            });
            const { url } = await uploadRes.json();

            // 2. İlanı Kaydet
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : { id: 1 };

            const adData = {
                Title: ad.title,
                Category: ad.category,
                Price: Number(ad.price),
                Description: ad.description,
                ImageUrl: url,
                UserId: user.id,
                TargetUrl: "https://google.com",
                IsActive: true,
                // Kategoriye göre veri gönderimi
                KM: ad.category === 'Vasıta' ? Number(ad.km) : null,
                ModelYear: ad.category === 'Vasıta' ? Number(ad.modelYear) : null,
                RoomCount: ad.category === 'Emlak' ? ad.roomCount : null,
                SquareMeter: ad.category === 'Emlak' ? Number(ad.squareMeter) : null
            };

            const res = await fetch('http://localhost:5295/api/Advertisements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(adData)
            });

            if (res.ok) {
                alert("İlan başarıyla yayınlandı! 🎉");
                router.push('/my-ads');
            } else {
                alert("İlan kaydedilemedi.");
            }
        } catch (err) {
            alert("İşlem sırasında bir hata oluştu.");
        }
    };

    return (
        <div style={formCardStyle}>
            <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#1a202c' }}>🚀 Yeni İlan Yayınla</h2>
            <form onSubmit={handleSubmit} style={formStyle}>
                
                {/* Resim Yükleme */}
                <div style={uploadBoxStyle}>
                    <input type="file" onChange={handleFileChange} id="fileInput" hidden />
                    <label htmlFor="fileInput" style={{ cursor: 'pointer', display: 'block' }}>
                        {preview ? (
                            <img src={preview} style={previewStyle} alt="Önizleme" />
                        ) : (
                            <div style={{ padding: '30px', color: '#64748b' }}>
                                <span style={{ fontSize: '30px' }}>📸</span><br/>
                                <b>Fotoğraf Seç</b>
                            </div>
                        )}
                    </label>
                </div>

                <input placeholder="İlan Başlığı" style={inputStyle} required onChange={e => setAd({ ...ad, title: e.target.value })} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <select style={inputStyle} value={ad.category} onChange={e => setAd({ ...ad, category: e.target.value })}>
                        <option value="Emlak">🏠 Emlak</option>
                        <option value="Vasıta">🚗 Vasıta</option>
                        <option value="Teknoloji">💻 Teknoloji</option>
                        <option value="Moda">👕 Moda</option>
                        <option value="Ev/Bahçe">🛋️ Ev & Bahçe</option>
                        <option value="Diğer">📦 Diğer</option>
                    </select>
                    <input type="number" placeholder="Fiyat (₺)" style={inputStyle} required onChange={e => setAd({ ...ad, price: e.target.value })} />
                </div>

                {/* Emlak Özel Alanları */}
                {ad.category === 'Emlak' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <select style={inputStyle} onChange={e => setAd({ ...ad, roomCount: e.target.value })}>
                            <option value="1+0">1+0</option>
                            <option value="1+1">1+1</option>
                            <option value="2+1">2+1</option>
                            <option value="3+1">3+1</option>
                            <option value="4+1+">4+1 ve üzeri</option>
                        </select>
                        <input type="number" placeholder="Metrekare (m²)" style={inputStyle} onChange={e => setAd({ ...ad, squareMeter: e.target.value })} />
                    </div>
                )}

                {/* Vasıta Özel Alanları */}
                {ad.category === 'Vasıta' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <input type="number" placeholder="Kilometre (KM)" style={inputStyle} onChange={e => setAd({ ...ad, km: e.target.value })} />
                        <input type="number" placeholder="Model Yılı" style={inputStyle} onChange={e => setAd({ ...ad, modelYear: e.target.value })} />
                    </div>
                )}

                <textarea placeholder="İlan Açıklaması" style={{ ...inputStyle, minHeight: '100px' }} onChange={e => setAd({ ...ad, description: e.target.value })} />

                <button type="submit" style={submitBtnStyle}>İlanı Yayınla</button>
            </form>
        </div>
    );
}

// Tasarım Stilleri
const formCardStyle: React.CSSProperties = { maxWidth: '550px', margin: '40px auto', padding: '30px', background: '#fff', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' };
const formStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '15px' };
const inputStyle: React.CSSProperties = { padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none' };
const uploadBoxStyle: React.CSSProperties = { border: '2px dashed #cbd5e1', borderRadius: '15px', textAlign: 'center', background: '#f8fafc', overflow: 'hidden' };
const previewStyle: React.CSSProperties = { width: '100%', maxHeight: '200px', objectFit: 'cover' };
const submitBtnStyle: React.CSSProperties = { padding: '16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '10px' };