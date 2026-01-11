"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateListing() {
  const API_PORT = 5295; // Portunu kontrol et!
  const router = useRouter();

  // Form Bilgileri
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    city: '',
    imageUrl: '',
    categoryId: 1 // Varsayılan kategori
  });

  const [categories, setCategories] = useState<any[]>([]);

  // Kategorileri Çek (Seçim kutusu için)
  useEffect(() => {
    fetch(`http://localhost:${API_PORT}/api/Categories`)
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  // Form Gönderilince Çalışır
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:${API_PORT}/api/Listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        price: Number(formData.price) // Fiyatı sayıya çevir
      })
    });

    if (response.ok) {
      alert("İlan Başarıyla Eklendi! 🎉");
      router.push('/'); // Anasayfaya dön
    } else {
      alert("Hata oluştu!");
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Yeni İlan Ver 📢</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <input 
          type="text" placeholder="İlan Başlığı (Örn: Satılık Villa)" required 
          style={inputStyle}
          onChange={e => setFormData({...formData, title: e.target.value})}
        />

        <textarea 
          placeholder="Açıklama" required rows={3}
          style={inputStyle}
          onChange={e => setFormData({...formData, description: e.target.value})}
        />

        <input 
          type="number" placeholder="Fiyat (TL)" required 
          style={inputStyle}
          onChange={e => setFormData({...formData, price: e.target.value})}
        />

        <input 
          type="text" placeholder="Şehir" required 
          style={inputStyle}
          onChange={e => setFormData({...formData, city: e.target.value})}
        />

        <input 
          type="text" placeholder="Resim Linki (https://...)" 
          style={inputStyle}
          onChange={e => setFormData({...formData, imageUrl: e.target.value})}
        />

        <select 
          style={inputStyle}
          onChange={e => setFormData({...formData, categoryId: Number(e.target.value)})}
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <button type="submit" style={{ padding: '15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
          İlanı Yayınla 🚀
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '14px'
};