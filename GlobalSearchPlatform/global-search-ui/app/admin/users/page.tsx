"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'Admin') {
      alert("Bu sayfaya sadece adminler girebilir!");
      router.push('/');
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5295/api/Users');
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (err) {
      console.error("Kullanıcılar yüklenemedi", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBan = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5295/api/Users/ban/${id}`, { method: 'PUT' });
      if (res.ok) {
        // Listeyi yerel olarak güncelle
        setUsers(users.map(u => u.id === id ? { ...u, isBanned: !u.isBanned } : u));
      }
    } catch (err) {
      alert("İşlem başarısız.");
    }
  };

  if (loading) return <div style={{padding:'50px', textAlign:'center'}}>Yükleniyor...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>🛡️ Kullanıcı Yönetimi</h2>
      
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8fafc' }}>
            <tr style={{ textAlign: 'left' }}>
              <th style={{ padding: '15px' }}>ID</th>
              <th style={{ padding: '15px' }}>Kullanıcı Adı</th>
              <th style={{ padding: '15px' }}>Rol</th>
              <th style={{ padding: '15px' }}>Durum</th>
              <th style={{ padding: '15px' }}>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '15px' }}>{u.id}</td>
                <td style={{ padding: '15px', fontWeight: 'bold' }}>{u.username}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', background: u.role === 'Admin' ? '#ebf8ff' : '#f7fafc', color: u.role === 'Admin' ? '#3182ce' : '#4a5568' }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>
                  {u.isBanned ? 
                    <span style={{ color: '#e53e3e', fontWeight: 'bold' }}>🚫 Yasaklı</span> : 
                    <span style={{ color: '#38a169', fontWeight: 'bold' }}>✅ Aktif</span>
                  }
                </td>
                <td style={{ padding: '15px' }}>
                  {u.role !== 'Admin' && (
                    <button 
                      onClick={() => toggleBan(u.id)}
                      style={{ 
                        padding: '8px 15px', 
                        borderRadius: '6px', 
                        border: 'none', 
                        cursor: 'pointer',
                        background: u.isBanned ? '#38a169' : '#e53e3e',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      {u.isBanned ? "Yasağı Kaldır" : "Kullanıcıyı Banla"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}