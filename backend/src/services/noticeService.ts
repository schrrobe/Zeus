import { randomUUID } from 'crypto';
import type { AdminNotice } from '../types';

const notices = new Map<string, AdminNotice>();

export const noticeService = {
  async create(payload: Omit<AdminNotice, 'id'>) {
    const id = randomUUID();
    const notice: AdminNotice = { id, ...payload };
    notices.set(id, notice);
    return notice;
  },

  async list() {
    return Array.from(notices.values());
  }
};
