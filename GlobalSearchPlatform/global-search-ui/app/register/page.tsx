"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Şifre Tekrar Kontrolü
    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler uyuşmuyor!");
      return;
    }

    try {
      const res = await fetch('http://localhost:5295/api/Auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          role: "User" // Varsayılan rol
        })
      });

      if (res.ok) {
        alert("Kayıt başarılı! Giriş yapabilirsiniz.");
        router.push('/login');
      } else {
        const data = await res.text();
        // 2. Aynı İsim Kontrolü (Backend'den gelen hata mesajı)
        setError(data || "Kayıt sırasında bir hata oluştu. Bu kullanıcı adı alınmış olabilir.");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı.");
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: '800', color: '#1e293b' }}>Kayıt Ol</h2>
        
        {error && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: '600' }}>Kullanıcı Adı</label>
            <input 
              type="text" 
              required 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: '600' }}>Şifre</label>
            <input 
              type="password" 
              required 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: '600' }}>Şifre Tekrar</label>
            <input 
              type="password" 
              required 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>
            Kayıt İşlemini Tamamla
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
          Zaten hesabınız var mı? <a href="/login" style={{ color: '#3182ce', fontWeight: 'bold', textDecoration: 'none' }}>Giriş Yap</a>
        </p>
      </div>
    </div>
  );
}