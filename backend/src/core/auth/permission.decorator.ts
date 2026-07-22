import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permission';

// Uso: @RequirePermission('purchase_request:approve')
// Combine sempre com @UseGuards(JwtAuthGuard, PermissionsGuard) no mesmo controller/rota.
export const RequirePermission = (permissionKey: string) =>
  SetMetadata(PERMISSION_KEY, permissionKey);
