import axios from 'axios';
import type { PortfolioSnapshot } from '../types';

type PriceMap = Record<string, number>;

const trackedAssets = ['BTC', 'ETH', 'SOL', 'MATIC', 'ADA'];

export const pricingService = {
  async fetchPrices(): Promise<PriceMap> {
    try {
      const response = await axios.get('https://min-api.cryptocompare.com/data/pricemulti', {
        params: {
          fsyms: trackedAssets.join(','),
          tsyms: 'EUR'
        }
      });
      return Object.fromEntries(
        Object.entries(response.data).map(([symbol, value]) => [symbol, (value as { EUR: number }).EUR])
      );
    } catch (error) {
      console.warn('Preisservice nicht erreichbar, fallback Werte werden genutzt.', error);
      return trackedAssets.reduce((acc, asset) => ({ ...acc, [asset]: this.randomNumber(20_000, 60_000) }), {} as PriceMap);
    }
  },

  generateWalletBreakdown(prices: PriceMap): PortfolioSnapshot['wallets'] {
    const networks: PortfolioSnapshot['wallets'] = [
      {
        network: 'ethereum',
        address: '0x1234...ABCD',
        valueEUR: prices.ETH * 3,
        percentage: 35,
        assets: [
          this.makeAsset('ETH', 'Ethereum', 3, prices.ETH, 'wallet', 'Ethereum Wallet'),
          this.makeAsset('MATIC', 'Polygon', 800, prices.MATIC ?? 0.6, 'wallet', 'Ethereum Wallet')
        ]
      },
      {
        network: 'solana',
        address: 'SoLanaWallet1234',
        valueEUR: prices.SOL * 120,
        percentage: 25,
        assets: [
          this.makeAsset('SOL', 'Solana', 120, prices.SOL, 'wallet', 'Solana Wallet')
        ]
      },
      {
        network: 'bitcoin',
        address: 'bc1QZeusWallet',
        valueEUR: prices.BTC * 0.8,
        percentage: 15,
        assets: [
          this.makeAsset('BTC', 'Bitcoin', 0.8, prices.BTC, 'wallet', 'Bitcoin Wallet')
        ]
      }
    ];
    return networks;
  },

  generateExchangeBreakdown(prices: PriceMap): PortfolioSnapshot['exchanges'] {
    const exchanges: PortfolioSnapshot['exchanges'] = [
      {
        exchangeName: 'Bitvavo',
        valueEUR: prices.ETH * 1.5,
        percentage: 15,
        assets: [
          this.makeAsset('ETH', 'Ethereum', 1.5, prices.ETH, 'exchange', 'Bitvavo'),
          this.makeAsset('ADA', 'Cardano', 2000, prices.ADA ?? 0.35, 'exchange', 'Bitvavo')
        ]
      },
      {
        exchangeName: 'Coinbase',
        valueEUR: prices.BTC * 0.4,
        percentage: 7,
        assets: [this.makeAsset('BTC', 'Bitcoin', 0.4, prices.BTC, 'exchange', 'Coinbase')]
      },
      {
        exchangeName: 'Bitpanda',
        valueEUR: prices.SOL * 40,
        percentage: 3,
        assets: [this.makeAsset('SOL', 'Solana', 40, prices.SOL, 'exchange', 'Bitpanda')]
      }
    ];
    return exchanges;
  },

  makeAsset(symbol: string, name: string, quantity: number, price: number, location: 'wallet' | 'exchange', provider: string) {
    return {
      assetSymbol: symbol,
      assetName: name,
      quantity,
      currentPriceEUR: price,
      valueEUR: quantity * price,
      change24hPercent: this.randomPercent(),
      location,
      provider
    };
  },

  randomNumber(min: number, max: number) {
    return Math.random() * (max - min) + min;
  },

  randomPercent() {
    return Math.round((Math.random() * 20 - 10) * 100) / 100;
  }
};
