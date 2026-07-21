'use client';

import OrgUnitManager from '@/components/OrgUnitManager';

export default function CentrosDeCustoPage() {
  return (
    <OrgUnitManager
      title="Centros de Custo"
      subtitle="Centros de custo vinculados a uma empresa."
      resource="cost-centers"
      entityLabel="centro de custo"
    />
  );
}
