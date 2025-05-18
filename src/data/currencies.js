// Currencies with proper symbols and formatting
export const currencies = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    format: (amount) => `$${amount.toFixed(2)}`,
    location: 'prefix',
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    format: (amount) => `€${amount.toFixed(2)}`,
    location: 'prefix',
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    format: (amount) => `£${amount.toFixed(2)}`,
    location: 'prefix',
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    format: (amount) => `¥${Math.round(amount)}`,
    location: 'prefix',
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'CA$',
    format: (amount) => `CA$${amount.toFixed(2)}`,
    location: 'prefix',
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    format: (amount) => `A$${amount.toFixed(2)}`,
    location: 'prefix',
  },
  {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    format: (amount) => `₹${amount.toFixed(2)}`,
    location: 'prefix',
  },
  {
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: '¥',
    format: (amount) => `¥${amount.toFixed(2)}`,
    location: 'prefix',
  },
  {
    code: 'BRL',
    name: 'Brazilian Real',
    symbol: 'R$',
    format: (amount) => `R$${amount.toFixed(2)}`,
    location: 'prefix',
  },
  {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    format: (amount) => `R${amount.toFixed(2)}`,
    location: 'prefix',
  },
];

export const getFormattedAmount = (amount, currencyCode) => {
  const currency = currencies.find((cur) => cur.code === currencyCode);
  if (!currency) return `${amount.toFixed(2)}`;
  return currency.format(amount);
};

export default currencies;