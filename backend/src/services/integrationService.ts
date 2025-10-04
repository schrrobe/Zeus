import { randomUUID } from 'crypto';
import { userService } from './userService';

interface WalletConnection {
  id: string;
  userId: string;
  network: 'ethereum' | 'solana' | 'bitcoin';
  address: string;
  createdAt: Date;
}

interface ExchangeConnection {
  id: string;
  userId: string;
  exchange: 'bitvavo' | 'coinbase' | 'binance' | 'bitpanda';
  createdAt: Date;
}

const walletConnections: WalletConnection[] = [];
const exchangeConnections: ExchangeConnection[] = [];

export const integrationService = {
  async connectWallet(userId: string, payload: { network: WalletConnection['network']; address: string }) {
    const connection: WalletConnection = {
      id: randomUUID(),
      userId,
      network: payload.network,
      address: payload.address,
      createdAt: new Date()
    };
    walletConnections.push(connection);
    return connection;
  },

  async connectExchange(userId: string, payload: { exchange: ExchangeConnection['exchange']; apiKey: string; apiSecret: string; passphrase?: string }) {
    const connection: ExchangeConnection = {
      id: randomUUID(),
      userId,
      exchange: payload.exchange,
      createdAt: new Date()
    };
    exchangeConnections.push(connection);
    const user = await userService.findById(userId);
    user.exchangesConnected = exchangeConnections.filter((entry) => entry.userId === userId).length;
    return connection;
  }
};
