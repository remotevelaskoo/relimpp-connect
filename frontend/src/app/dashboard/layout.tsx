'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, clearToken, getToken } from '@/lib/api';

interface MenuItem {
  icon: string;
  href?: string;
  label: string;
  soon?: boolean;
}

interface MenuGroup {
  label?: string;
  items: MenuItem[];
}

// Estrutura alinhada ao Blueprint V02 (docs/11-blueprint/v02-menus-submenus.md).
const MENU: MenuGroup[] = [
  {
    items: [
      { icon: '🏠', href: '/dashboard', label: 'Dashboard' },
      { icon: '👤', href: '/dashboard/meu-trabalho', label: 'Meu Trabalho' },
      { icon: '📊', label: 'Operações', soon: true },
    ],
  },
  {
    label: 'Módulos',
    items: [
      { icon: '📦', href: '/dashboard/compras/solicitacoes', label: 'Compras' },
      { icon: '📑', label: 'Contratos', soon: true },
      { icon: '🚚', label: 'Frota', soon: true },
      { icon: '🏢', label: 'Patrimônio', soon: true },
      { icon: '💰', label: 'Financeiro', soon: true },
      { icon: '📈', label: 'Indicadores', soon: true },
      { icon: '🤖', label: 'IA', soon: true },
      { icon: '📁', label: 'Documentos', soon: true },
    ],
  },
  {
    label: 'Administração · Cadastros',
    items: [
      { icon: '🏢', href: '/dashboard/admin/cadastros/empresas', label: 'Empresas' },
      { icon: '🏬', href: '/dashboard/admin/cadastros/filiais', label: 'Filiais' },
      { icon: '🗂️', href: '/dashboard/admin/cadastros/departamentos', label: 'Departamentos' },
      { icon: '💲', href: '/dashboard/admin/cadastros/centros-de-custo', label: 'Centros de Custo' },
      { icon: '👷', href: '/dashboard/admin/cadastros/obras', label: 'Obras' },
      { icon: '🚛', href: '/dashboard/admin/cadastros/fornecedores', label: 'Fornecedores' },
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
        <nav className="flex-1 space-y-4 overflow-auto px-3 py-4">
          {MENU.map((group, idx) => (
            <div key={group.label ?? `group-${idx}`} className="space-y-1">
              {group.label && (
                <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {group.label}
                </p>
              )}
              {group.items.map((item) => {
                if (item.soon || !item.href) {
                  return (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-500"
                      title="Em breve"
                    >
                      <span>
                        <span className="mr-2">{item.icon}</span>
                        {item.label}
                      </span>
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] uppercase text-slate-400">
                        em breve
                      </span>
                    </div>
                  );
                }
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center rounded-lg px-3 py-2 text-sm ${
                      active
                        ? 'bg-brand text-white'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
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
