import { useEffect, useMemo, useState } from 'react';
import { currencySymbols, formatCurrency } from '../utils/currencyUtils';

const currencyOptions = ['USD', 'EUR', 'GBP', 'INR'];

const CurrencyConverter = ({ total, selectedCurrency, onCurrencyChange }) => {
  const [rates, setRates] = useState({ INR: 1 });
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState('');
  const [error, setError] = useState('');

  // Use a CORS-friendly public exchange API in the browser.
  const fetchRatesFromPrimary = async () => {
    const response = await fetch('https://open.er-api.com/v6/latest/INR');
    if (!response.ok) {
      throw new Error('Primary currency service returned bad status.');
    }

    const data = await response.json();
    if (!data || !data.rates) {
      throw new Error('Invalid primary response structure.');
    }

    return { USD: data.rates.USD, EUR: data.rates.EUR, GBP: data.rates.GBP, INR: 1 };
  };

  const fetchRatesFromFallback = async () => {
    const response = await fetch('https://api.frankfurter.dev/v1/latest?from=INR&to=USD,EUR,GBP');
    if (!response.ok) {
      throw new Error('Fallback currency service returned bad status.');
    }

    const data = await response.json();
    if (!data || !data.rates) {
      throw new Error('Invalid fallback response structure.');
    }

    return { USD: data.rates.USD, EUR: data.rates.EUR, GBP: data.rates.GBP, INR: 1 };
  };

  const fetchRates = async () => {
    setLoading(true);
    setError('');
    setWarning('');

    try {
      const primaryRates = await fetchRatesFromPrimary();
      setRates(primaryRates);
    } catch (primaryError) {
      console.warn('Primary currency source failed, trying fallback:', primaryError);

      try {
        const fallbackRates = await fetchRatesFromFallback();
        setRates(fallbackRates);
        setWarning('Primary currency service failed. Using fallback live rates.');
      } catch (fallbackError) {
        console.error('Both currency sources failed:', fallbackError);
        setError('Live rates are unavailable. Showing INR total only.');
        setRates({ INR: 1 });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const convertedTotal = useMemo(() => {
    if (selectedCurrency === 'INR') {
      return total;
    }

    const rate = rates[selectedCurrency];
    return rate ? total * rate : null;
  }, [rates, selectedCurrency, total]);

  const showError = error && selectedCurrency !== 'INR';
  const showWarning = warning && selectedCurrency !== 'INR';

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-soft backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-indigo-300/70">Currency converter</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-100">Convert total amount</h2>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="rounded-3xl border border-slate-800/70 bg-slate-950/90 p-5">
          <label className="mb-3 block text-sm text-slate-300">Choose currency</label>
          <select
            value={selectedCurrency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
          >
            {currencyOptions.map((currency) => (
              <option key={currency} value={currency} className="bg-slate-950 text-slate-100">
                {currency}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-3xl border border-slate-800/70 bg-slate-950/90 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Converted total</p>
              <p className="mt-3 text-3xl font-semibold text-slate-100">
                {loading ? 'Loading…' : convertedTotal !== null ? formatCurrency(convertedTotal, selectedCurrency) : '--'}
              </p>
            </div>
            <div className="rounded-3xl bg-indigo-500/10 px-4 py-3 text-xl text-indigo-200">
              {currencySymbols[selectedCurrency]}
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-400">
            {selectedCurrency === 'INR'
              ? 'Your total is already in Indian Rupees.'
              : loading
              ? 'Fetching live exchange rate…'
              : showError
              ? 'Live rates are unavailable. Showing INR total only.'
              : showWarning
              ? warning
              : `1 INR = ${rates[selectedCurrency] ? rates[selectedCurrency].toFixed(4) : '—'} ${selectedCurrency}`}
          </p>

          {showWarning && (
            <div className="mt-4 rounded-2xl bg-amber-500/10 px-4 py-3 text-sm text-amber-100 ring-1 ring-amber-500/20">
              {warning}
            </div>
          )}

          {showError && (
            <div className="mt-4 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200 ring-1 ring-rose-500/20">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={fetchRates}
            disabled={loading}
            className={`mt-5 inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${loading ? 'cursor-not-allowed bg-slate-700/70 text-slate-400' : 'bg-slate-800 text-slate-100 hover:bg-slate-700'}`}
          >
            {loading ? 'Refreshing rates…' : 'Retry live exchange rates'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CurrencyConverter;
