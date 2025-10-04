import type { ZeusUser } from './index';

declare global {
  namespace Express {
    interface Request {
      user?: Pick<ZeusUser, 'id' | 'role' | 'tier'>;
    }
  }
}

export {};
