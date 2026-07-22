import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { diskStorage } from 'multer';

// Armazenamento local em disco (ver Database Book) — trocar por S3/blob storage antes de produção.
export const UPLOADS_ROOT = path.join(process.cwd(), 'uploads', 'purchase-requests');

export function purchaseRequestAttachmentStorage() {
  return diskStorage({
    destination: (req, _file, cb) => {
      const requestId = req.params.id;
      const dir = path.join(UPLOADS_ROOT, requestId);
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    // Nome gerado (não o original) para evitar colisão e path traversal;
    // o nome original fica só no banco, para exibição/download.
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${randomUUID()}${ext}`);
    },
  });
}

export function attachmentAbsolutePath(storagePath: string): string {
  return path.join(UPLOADS_ROOT, storagePath);
}
