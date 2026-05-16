import { useEffect, useMemo, useState } from 'react';

const MAX_AMOUNT = 1000000;
const validNamePattern = /[A-Za-z]/;
const validAmountPattern = /^\d{0,7}(?:\.\d{0,2})?$/;

const ExpenseForm = ({ categoryOptions, onAdd }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categoryOptions[0]);
  const [nameError, setNameError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateName = (value) => {
    if (!value.trim()) {
      return 'Expense name is required.';
    }
    if (!validNamePattern.test(value)) {
      return 'Use at least one alphabet character for the expense name.';
    }
    if (value.trim().length < 3) {
      return 'Use a more descriptive name for this expense.';
    }
    return '';
  };

  const validateAmount = (value) => {
    if (!value) {
      return 'Amount is required.';
    }
    if (!validAmountPattern.test(value)) {
      return 'Enter a valid amount without symbols, letters, or scientific notation.';
    }
    const numericValue = Number(value);
    if (numericValue <= 0) {
      return 'The amount must be greater than zero.';
    }
    if (numericValue > MAX_AMOUNT) {
      return `Please keep amounts under ₹${MAX_AMOUNT.toLocaleString('en-IN')}.`;
    }
    return '';
  };

  useEffect(() => {
    if (successMessage) {
      const timer = window.setTimeout(() => setSuccessMessage(''), 3000);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [successMessage]);

  const handleNameChange = (event) => {
    const value = event.target.value;
    setName(value);
    setNameError(validateName(value));
    setSuccessMessage('');
  };

  const handleAmountChange = (event) => {
    const rawValue = event.target.value;
    const cleanedValue = rawValue.replace(/[^0-9.]/g, '');
    const parts = cleanedValue.split('.');
    const sanitized = parts.length > 1 ? `${parts[0]}.${parts[1].slice(0, 2)}` : parts[0];

    setAmount(sanitized);
    setAmountError(validateAmount(sanitized));
    setSuccessMessage('');
  };

  const handleAmountKeyDown = (event) => {
    if (['e', 'E', '+', '-'].includes(event.key)) {
      event.preventDefault();
    }
  };

  const isFormValid = useMemo(
    () => !nameError && !amountError && name.trim().length > 0 && amount.length > 0,
    [name, amount, nameError, amountError]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const localNameError = validateName(trimmedName);
    const localAmountError = validateAmount(amount);
    setNameError(localNameError);
    setAmountError(localAmountError);

    if (localNameError || localAmountError) {
      return;
    }

    const parsedAmount = Number(amount);
    onAdd({
      name: trimmedName,
      amount: parsedAmount,
      category,
      timestamp: Date.now(),
    });
    setName('');
    setAmount('');
    setCategory(categoryOptions[0]);
    setNameError('');
    setAmountError('');
    setSuccessMessage('Expense added successfully.');
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-soft backdrop-blur-xl transition duration-300 hover:border-indigo-300/20">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-indigo-300/70">Add Expense</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-100">Track your next transaction</h2>
        </div>
        <p className="rounded-3xl bg-slate-950/80 px-4 py-2 text-sm text-slate-300 ring-1 ring-white/10">
          Real-time validation keeps entries clean.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {successMessage && (
          <div className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100 ring-1 ring-emerald-500/20">
            {successMessage}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm text-slate-300">Expense name</span>
            <input
              value={name}
              onChange={handleNameChange}
              placeholder="Uber Ride, Grocery Shopping, Meta Ads"
              className={`mt-2 w-full rounded-2xl border px-4 py-3 text-slate-100 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 ${nameError ? 'border-rose-500/60 bg-rose-500/5' : 'border-slate-800 bg-slate-950/90'}`}
            />
            <p className="mt-2 text-sm text-slate-400">Use a clear business-style expense label.</p>
            {nameError && <p className="mt-2 text-sm text-rose-200">{nameError}</p>}
          </label>

          <label className="block">
            <span className="text-sm text-slate-300">Amount (₹)</span>
            <input
              value={amount}
              onChange={handleAmountChange}
              onKeyDown={handleAmountKeyDown}
              inputMode="decimal"
              placeholder="1200.00"
              className={`mt-2 w-full rounded-2xl border px-4 py-3 text-slate-100 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 ${amountError ? 'border-rose-500/60 bg-rose-500/5' : 'border-slate-800 bg-slate-950/90'}`}
            />
            <p className="mt-2 text-sm text-slate-400">Enter a realistic positive amount under ₹{MAX_AMOUNT.toLocaleString('en-IN')}.</p>
            {amountError && <p className="mt-2 text-sm text-rose-200">{amountError}</p>}
          </label>
        </div>

        <label className="block">
          <span className="text-sm text-slate-300">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
          >
            {categoryOptions.map((option) => (
              <option key={option} value={option} className="bg-slate-950 text-slate-100">
                {option}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${isFormValid ? 'bg-indigo-500 hover:bg-indigo-400' : 'cursor-not-allowed bg-slate-700/70 text-slate-400'}`}
        >
          Add expense
        </button>
      </form>
    </section>
  );
};

export default ExpenseForm;
