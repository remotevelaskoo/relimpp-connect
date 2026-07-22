'use client';

import OrgUnitManager from '@/components/OrgUnitManager';

export default function ObrasPage() {
  return (
    <OrgUnitManager
      title="Obras"
      subtitle="Obras/projetos vinculados a uma empresa."
      resource="projects"
      entityLabel="obra"
    />
  );
}
