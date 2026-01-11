"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL as string) || "https://globalsearchplatform.onrender.com/api";
    const endpoint = isLogin ? 'login' : 'register';
    
    try {
      const res = await fetch(`${baseUrl}/Auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        if (isLogin) {
          const user = await res.json();
          localStorage.setItem('user', JSON.stringify(user));
          alert("Giriş Başarılı!");
          user.role === 'Admin' ? router.push('/admin/ads') : router.push('/');
        } else {
          alert("Kayıt Başarılı!");
          setIsLogin(true);
        }
      } else {
        alert("Hata: " + (await res.text()));
      }
    } catch (err) {
      alert("Bağlantı hatası! API: " + baseUrl);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', width: '350px' }}>
        <h2 style={{ textAlign: 'center', color: 'black' }}>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" placeholder="Kullanıcı Adı" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} style={{ padding: '12px', color: 'black' }} />
          <input type="password" placeholder="Şifre" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ padding: '12px', color: 'black' }} />
          <button type="submit" style={{ padding: '12px', backgroundColor: '#3b82f6', color: 'white', cursor: 'pointer' }}>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</button>
        </form>
        <div style={{ marginTop: '15px', textAlign: 'center', color: 'black' }}>
          <span onClick={() => setIsLogin(!isLogin)} style={{ color: '#3b82f6', cursor: 'pointer' }}>{isLogin ? 'Kayıt Ol' : 'Giriş Yap'}</span>
        </div>
      </div>
    </div>
  );
}