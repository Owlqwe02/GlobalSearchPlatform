"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AddAdPage() {
    const router = useRouter();
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    
    const [ad, setAd] = useState({
        title: '',
        category: 'Emlak',
        price: 0,
        description: '',
        km: 0,
        modelYear: 2026,
        roomCount: '1+1',
        squareMeter: 0
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            alert("Lütfen önce giriş yapın!");
            router.push('/login');
        }
    }, [router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setImages(prev => [...prev, ...selectedFiles]);
            const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return alert("Giriş yapmanız gerekiyor!");
        const user = JSON.parse(storedUser);

        if (images.length === 0) return alert("Lütfen en az bir resim seçin!");
        setUploading(true);

        try {
            // 1. Resim Yükleme
            const formData = new FormData();
            images.forEach(img => formData.append('files', img));
            const uploadRes = await fetch('http://localhost:5295/api/Advertisements/upload-multiple', {
                method: 'POST',
                body: formData
            });
            const { urls } = await uploadRes.json();

            // 2. İlan Kaydetme (Model ile birebir uyumlu paket)
            const adPayload = {
                Title: ad.title,
                Category: ad.category,
                Price: Number(ad.price),
                Description: ad.description,
                ImageUrl: urls[0],
                UserId: Number(user.id),
                IsActive: true,
                // Modelde büyük harf KM olarak tanımlanmış:
                KM: ad.category === 'Vasıta' ? Number(ad.km) : null,
                ModelYear: ad.category === 'Vasıta' ? Number(ad.modelYear) : null,
                RoomCount: ad.category === 'Emlak' ? ad.roomCount : null,
                SquareMeter: ad.category === 'Emlak' ? Number(ad.squareMeter) : null,
                
                // Diğer Zorunlu Alanlar
                TargetUrl: "https://google.com",
                StartDate: new Date().toISOString(),
                EndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
                ClickCount: 0,
                ZoneId: 1 
            };

            const res = await fetch('http://localhost:5295/api/Advertisements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(adPayload)
            });

            if (res.ok) {
                alert("İlan başarıyla yayınlandı! 🎉");
                router.push('/my-ads');
            } else {
                const errorData = await res.json();
                console.error("Backend Hatası:", errorData);
                alert("İlan kaydedilemedi. Konsola bakınız.");
            }
        } catch (err) {
            alert("Bağlantı hatası!");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', background: 'white', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontFamily: 'sans-serif' }}>
            <h2 style={{textAlign:'center', color: '#2d3748', marginBottom: '25px'}}>🚀 Yeni İlan Ver</h2>
            
            <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                <div style={{border:'2px dashed #cbd5e0', padding:'25px', textAlign:'center', cursor:'pointer', borderRadius: '15px', backgroundColor: '#f8fafc'}} onClick={() => document.getElementById('fileInput')?.click()}>
                    <input type="file" id="fileInput" multiple hidden onChange={handleFileChange} accept="image/*" />
                    <p style={{margin: 0, color: '#4a5568', fontWeight: 'bold'}}>📸 Resimleri Cihazdan Seç</p>
                    <div style={{display:'flex', gap:'10px', flexWrap:'wrap', justifyContent:'center', marginTop: '15px'}}>
                        {previews.map((p, i) => <img key={i} src={p} width="80" height="80" style={{borderRadius:'10px', objectFit:'cover'}} alt="önizleme" />)}
                    </div>
                </div>

                <input placeholder="İlan Başlığı" required style={{padding:'12px', borderRadius: '10px', border: '1px solid #e2e8f0'}} onChange={e => setAd({...ad, title: e.target.value})} />
                
                <div style={{display: 'flex', gap: '20px'}}>
                    <select style={{flex: 1, padding:'12px', borderRadius: '10px', border: '1px solid #e2e8f0'}} value={ad.category} onChange={e => setAd({...ad, category: e.target.value})}>
                        <option value="Emlak">Emlak</option>
                        <option value="Vasıta">Vasıta</option>
                        <option value="Teknoloji">Teknoloji</option>
                    </select>
                    <input type="number" placeholder="Fiyat (₺)" required style={{flex: 1, padding:'12px', borderRadius: '10px', border: '1px solid #e2e8f0'}} onChange={e => setAd({...ad, price: Number(e.target.value)})} />
                </div>
                
                {ad.category === 'Emlak' && (
                    <div style={{display:'flex', gap:'15px', backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '12px'}}>
                        <input placeholder="Oda Sayısı (3+1)" style={{flex: 1, padding:'10px', borderRadius: '8px', border: '1px solid #cbd5e0'}} onChange={e => setAd({...ad, roomCount: e.target.value})} />
                        <input type="number" placeholder="Metrekare (m²)" style={{flex: 1, padding:'10px', borderRadius: '8px', border: '1px solid #cbd5e0'}} onChange={e => setAd({...ad, squareMeter: Number(e.target.value)})} />
                    </div>
                )}

                {ad.category === 'Vasıta' && (
                    <div style={{display:'flex', gap:'15px', backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '12px'}}>
                        <input type="number" placeholder="KM" style={{flex: 1, padding:'10px', borderRadius: '8px', border: '1px solid #cbd5e0'}} onChange={e => setAd({...ad, km: Number(e.target.value)})} />
                        <input type="number" placeholder="Model Yılı" style={{flex: 1, padding:'10px', borderRadius: '8px', border: '1px solid #cbd5e0'}} onChange={e => setAd({...ad, modelYear: Number(e.target.value)})} />
                    </div>
                )}

                <textarea placeholder="İlan Açıklaması" style={{padding:'12px', minHeight:'120px', borderRadius: '10px', border: '1px solid #e2e8f0'}} onChange={e => setAd({...ad, description: e.target.value})} />

                <button disabled={uploading} style={{padding:'18px', background: uploading ? '#94a3b8' : '#3182ce', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: uploading ? 'not-allowed' : 'pointer'}}>
                    {uploading ? "İşleniyor..." : "🚀 İlanı Hemen Yayınla"}
                </button>
            </form>
        </div>
    );
}