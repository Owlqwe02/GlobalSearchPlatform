"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // Giriş mi Kayıt mı?
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // API URL'si (Login veya Register)
    const endpoint = isLogin ? 'login' : 'register';
    
    try {
      const res = await fetch(`http://localhost:5295/api/Auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        if (isLogin) {
          const user = await res.json();
          // Kullanıcıyı tarayıcı hafızasına kaydet
          localStorage.setItem('user', JSON.stringify(user));
          alert("Giriş Başarılı! Yönlendiriliyorsunuz...");
          
          // Eğer Adminseniz panele, değilseniz ana sayfaya
          if (user.role === 'Admin') router.push('/admin/ads');
          else router.push('/');
        } else {
          alert("Kayıt Başarılı! Şimdi giriş yapabilirsiniz.");
          setIsLogin(true); // Giriş ekranına dön
        }
      } else {
        alert("Hata: " + (await res.text()));
      }
    } catch (err) {
      alert("Bağlantı hatası!");
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '350px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1f2937' }}>
          {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="text" 
            placeholder="Kullanıcı Adı" 
            required 
            value={formData.username}
            onChange={e => setFormData({...formData, username: e.target.value})}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
          />
          <input 
            type="password" 
            placeholder="Şifre" 
            required 
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
          />
          <button type="submit" style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
            {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>

        <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
          {isLogin ? 'Hesabın yok mu?' : 'Zaten hesabın var mı?'}
          <span 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ color: '#3b82f6', fontWeight: 'bold', cursor: 'pointer', marginLeft: '5px' }}
          >
            {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
          </span>
        </div>
        
        <div style={{marginTop:'20px', textAlign:'center'}}>
           <a href="/" style={{textDecoration:'none', fontSize:'12px', color:'#9ca3af'}}>← Ana Sayfaya Dön</a>
        </div>
      </div>
    </div>
  );
}