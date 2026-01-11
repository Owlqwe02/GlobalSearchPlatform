"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Render API URL
    const baseUrl = "https://globalsearchplatform.onrender.com/api";
    const endpoint = isLogin ? 'Auth/login' : 'Auth/register';
    
    try {
      const res = await fetch(`${baseUrl}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const user = await res.json();
        if (isLogin) {
          localStorage.setItem('user', JSON.stringify(user));
          alert("Giriş Başarılı!");
          router.push(user.role === 'Admin' ? '/admin/ads' : '/');
        } else {
          alert("Kayıt Başarılı! Şimdi giriş yapabilirsiniz.");
          setIsLogin(true);
        }
      } else {
        const errorMsg = await res.text();
        alert("Hata: " + errorMsg);
      }
    } catch (err) {
      alert("Sunucuya ulaşılamıyor. Render uyanıyor olabilir, lütfen 1 dakika bekleyip tekrar deneyin.");
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '350px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'black' }}>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" placeholder="Kullanıcı Adı" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', color: 'black' }} />
          <input type="password" placeholder="Şifre" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', color: 'black' }} />
          <button type="submit" style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#3b82f6', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</button>
        </form>
        <p onClick={() => setIsLogin(!isLogin)} style={{ marginTop: '15px', textAlign: 'center', cursor: 'pointer', color: '#3b82f6' }}>
          {isLogin ? 'Hesabın yok mu? Kayıt Ol' : 'Zaten hesabın var mı? Giriş Yap'}
        </p>
      </div>
    </div>
  );
}