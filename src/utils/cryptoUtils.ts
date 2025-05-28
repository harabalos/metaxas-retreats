
export interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  address: string;
  network: string;
  qrCode: string;
}

export const cryptoCurrencies: Record<string, CryptoCurrency> = {
  btc: {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    network: 'Bitcoin Network',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
  },
  eth: {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    network: 'Ethereum Mainnet',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ethereum:0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
  },
  usdt: {
    id: 'usdt',
    name: 'Tether',
    symbol: 'USDT',
    address: '0x55d398326f99059fF775485246999027B3197955',
    network: 'BSC (BEP20)',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=0x55d398326f99059fF775485246999027B3197955'
  },
  matic: {
    id: 'matic',
    name: 'Polygon',
    symbol: 'MATIC',
    address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    network: 'Polygon Network',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=polygon:0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0'
  },
  sol: {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    address: '7KLv7p2b9vUriprQ6L3DT5n3bl8J5riCyNfR7WqZJzGz',
    network: 'Solana Network',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=solana:7KLv7p2b9vUriprQ6L3DT5n3bl8J5riCyNfR7WqZJzGz'
  }
};

export const paymentProviders = [
  { id: 'btcpay', name: 'BTCPay Server' },
  { id: 'coinbase', name: 'Coinbase Commerce' },
  { id: 'nowpayments', name: 'NowPayments.io' }
];
