'use client';

import OrgUnitManager from '@/components/OrgUnitManager';

export default function DepartamentosPage() {
  return (
    <OrgUnitManager
      title="Departamentos"
      subtitle="Departamentos vinculados a uma empresa."
      resource="departments"
      entityLabel="departamento"
    />
  );
}
