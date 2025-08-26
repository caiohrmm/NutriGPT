"use client";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.replace('/login');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Bem-vindo, {user.name}</h1>
          <button onClick={logout} className="bg-gray-200 rounded px-3 py-1">Sair</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href="/patients" className="border rounded p-4 hover:bg-gray-50">Patients</a>
          <a href="/appointments" className="border rounded p-4 hover:bg-gray-50">Appointments</a>
          <a href="/measurements" className="border rounded p-4 hover:bg-gray-50">Measurements</a>
          <a href="/plans" className="border rounded p-4 hover:bg-gray-50">Plans</a>
        </div>
      </div>
    </div>
  );
}


