import fs from 'fs/promises';
import path from 'path';
import { prisma } from '../lib/prisma';
import { FileType } from '@prisma/client';

const storageRoot = process.env.FILE_STORAGE_PATH || path.join(process.cwd(), 'storage');

export const ensureStorage = async () => {
  await fs.mkdir(storageRoot, { recursive: true });
};

export const saveFileRecord = async ({
  invoiceId,
  type,
  buffer,
  filename,
  mimeType
}: {
  invoiceId: string;
  type: FileType;
  buffer: Buffer;
  filename: string;
  mimeType: string;
}) => {
  await ensureStorage();
  const filePath = path.join(storageRoot, filename);
  await fs.writeFile(filePath, buffer);

  return prisma.fileRecord.create({
    data: {
      invoiceId,
      type,
      path: filePath,
      mimeType
    }
  });
};
