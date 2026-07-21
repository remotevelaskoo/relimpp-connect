'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, clearToken, getToken } from '@/lib/api';

interface MenuItem {
  href: string;
  label: string;
}

interface MenuGroup {
  label?: string;
  items: MenuItem[];
}

const MENU: MenuGroup[] = [
  {
    items: [{ href: '/dashboard', label: 'Início' }],
  },
  {
    label: 'Compras',
    items: [
      { href: '/dashboard/compras/solicitacoes', label: 'Solicitações' },
    ],
  },
  {
    label: 'Cadastros',
    items: [
      { href: '/dashboard/empresas', label: 'Empresas' },
      { href: '/dashboard/filiais', label: 'Filiais' },
      { href: '/dashboard/departamentos', label: 'Departamentos' },
      { href: '/dashboard/obras', label: 'Obras' },
      { href: '/dashboard/centros-de-custo', label: 'Centros de Custo' },
    ],
  },
];

interface Me {
  name: string;
  email: string;
  roles: string[];
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [me, setMe] = useState<Me | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    api<Me>('/auth/me')
      .then((data) => {
        setMe(data);
        setReady(true);
      })
      .catch(() => {
        clearToken();
        router.replace('/login');
      });
  }, [router]);

  function logout() {
    clearToken();
    router.replace('/login');
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Carregando…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 flex-col bg-slate-900 text-slate-100">
        <div className="border-b border-slate-800 px-6 py-5">
          <p className="text-lg font-bold text-brand-light">Relimpp Connect</p>
          <p className="text-xs text-slate-400">Plataforma Corporativa</p>
        </div>
        <nav className="flex-1 space-y-4 px-3 py-4">
          {MENU.map((group, idx) => (
            <div key={group.label ?? `group-${idx}`} className="space-y-1">
              {group.label && (
                <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {group.label}
                </p>
              )}
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-lg px-3 py-2 text-sm ${
                      active
                        ? 'bg-brand text-white'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="border-t border-slate-800 px-6 py-4 text-xs text-slate-400">
          <p className="font-medium text-slate-200">{me?.name}</p>
          <p>{me?.email}</p>
          <button
            onClick={logout}
            className="mt-3 rounded-md bg-slate-800 px-3 py-1.5 text-slate-200 hover:bg-slate-700"
          >
            Sair
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto px-8 py-8">{children}</main>
    </div>
  );
}
