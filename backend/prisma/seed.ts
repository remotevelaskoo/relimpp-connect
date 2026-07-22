import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Papéis conforme seção 5 da especificação funcional.
const ROLES: Array<{ key: string; name: string; description: string }> = [
  { key: 'platform_admin', name: 'Administrador da Plataforma', description: 'Configura módulos, usuários e permissões.' },
  { key: 'director', name: 'Gestor/Diretoria', description: 'Acompanha indicadores e aprova alçadas maiores.' },
  { key: 'area_manager', name: 'Gestor de Área', description: 'Aprova solicitações e acompanha a equipe.' },
  { key: 'requester', name: 'Solicitante', description: 'Cria solicitações e confirma recebimentos.' },
  { key: 'buyer', name: 'Comprador', description: 'Conduz cotações e gera pedidos.' },
  { key: 'receiving', name: 'Almoxarifado/Recebimento', description: 'Registra entregas e divergências.' },
  { key: 'fiscal', name: 'Fiscal/Financeiro', description: 'Confere documentos fiscais.' },
  { key: 'auditor', name: 'Auditoria/Consulta', description: 'Acesso somente leitura.' },
];

// Permissões mínimas do MVP 0.
const PERMISSIONS = [
  { resource: 'company', action: 'view' },
  { resource: 'company', action: 'create' },
  { resource: 'company', action: 'edit' },
  { resource: 'user', action: 'view' },
  { resource: 'user', action: 'create' },
  // Gestão de usuários/papéis/permissões (telas de Administração).
  { resource: 'user', action: 'manage' },
  // Ações do fluxo de Solicitação de Compra.
  { resource: 'purchase_request', action: 'submit' },
  { resource: 'purchase_request', action: 'approve' },
  { resource: 'purchase_request', action: 'reject' },
  { resource: 'purchase_request', action: 'return' },
  { resource: 'purchase_request', action: 'cancel' },
  // Ações de homologação de Fornecedor.
  { resource: 'supplier', action: 'submit_for_review' },
  { resource: 'supplier', action: 'approve' },
  { resource: 'supplier', action: 'suspend' },
  { resource: 'supplier', action: 'block' },
  { resource: 'supplier', action: 'reactivate' },
  { resource: 'supplier', action: 'inactivate' },
];

// Permissões atribuídas a papéis não-admin (platform_admin recebe todas, abaixo).
// Reflete a seção 5/8.3 da Especificação: quem solicita, quem aprova, quem compra.
const ROLE_PERMISSIONS: Record<string, string[]> = {
  requester: ['purchase_request:submit', 'purchase_request:cancel'],
  area_manager: [
    'purchase_request:approve',
    'purchase_request:reject',
    'purchase_request:return',
  ],
  director: [
    'purchase_request:approve',
    'purchase_request:reject',
    'purchase_request:return',
  ],
  buyer: [
    'purchase_request:submit',
    'purchase_request:cancel',
    'supplier:submit_for_review',
    'supplier:approve',
    'supplier:suspend',
    'supplier:block',
    'supplier:reactivate',
    'supplier:inactivate',
  ],
};

// Categorias base configuráveis.
const CATEGORIES = [
  { type: 'purchase', key: 'product', name: 'Produto' },
  { type: 'purchase', key: 'service', name: 'Serviço' },
  { type: 'purchase', key: 'recurring', name: 'Material recorrente' },
  { type: 'purchase', key: 'emergency', name: 'Contratação emergencial' },
  { type: 'supplier', key: 'materials', name: 'Materiais' },
  { type: 'supplier', key: 'services', name: 'Serviços' },
  { type: 'document', key: 'contract', name: 'Contrato' },
  { type: 'document', key: 'certificate', name: 'Certidão' },
];

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@relimpp.local';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin@123';

  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { key: role.key },
      update: { name: role.name, description: role.description },
      create: role,
    });
  }

  for (const p of PERMISSIONS) {
    const key = `${p.resource}:${p.action}`;
    await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key, resource: p.resource, action: p.action },
    });
  }

  // Administrador recebe todas as permissões existentes.
  const adminRole = await prisma.role.findUniqueOrThrow({
    where: { key: 'platform_admin' },
  });
  const allPermissions = await prisma.permission.findMany();
  for (const perm of allPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: adminRole.id, permissionId: perm.id },
    });
  }

  for (const [roleKey, permissionKeys] of Object.entries(ROLE_PERMISSIONS)) {
    const role = await prisma.role.findUniqueOrThrow({ where: { key: roleKey } });
    for (const permissionKey of permissionKeys) {
      const permission = await prisma.permission.findUniqueOrThrow({
        where: { key: permissionKey },
      });
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        update: {},
        create: { roleId: role.id, permissionId: permission.id },
      });
    }
  }

  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { type_key: { type: c.type, key: c.key } },
      update: { name: c.name },
      create: c,
    });
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: 'Administrador Relimpp', passwordHash, active: true },
    create: {
      name: 'Administrador Relimpp',
      email: adminEmail,
      passwordHash,
      active: true,
    },
  });

  const existingScope = await prisma.userRoleScope.findFirst({
    where: { userId: admin.id, roleId: adminRole.id },
  });
  if (!existingScope) {
    await prisma.userRoleScope.create({
      data: { userId: admin.id, roleId: adminRole.id },
    });
  }

  // eslint-disable-next-line no-console
  console.log(`Seed concluído. Admin: ${adminEmail} / senha: ${adminPassword}`);
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
