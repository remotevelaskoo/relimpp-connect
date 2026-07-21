'use client';

import OrgUnitManager from '@/components/OrgUnitManager';

export default function FiliaisPage() {
  return (
    <OrgUnitManager
      title="Filiais"
      subtitle="Unidades/filiais vinculadas a uma empresa."
      resource="branches"
      entityLabel="filial"
    />
  );
}
