import { useMemo, useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import SummaryPanel from '../components/SummaryPanel';
import InsightsPanel from '../components/InsightsPanel';
import CurrencyConverter from '../components/CurrencyConverter';
import useLocalStorage from '../hooks/useLocalStorage';
import { categoryOptions, getMonthlyInsights } from '../utils/expenseUtils';

const HomePage = () => {
  const [expenses, setExpenses] = useLocalStorage('expense-tracker-data', []);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + Number(expense.amount), 0),
    [expenses]
  );

  const categoryStats = useMemo(
    () =>
      categoryOptions.map((category) => {
        const amount = expenses
          .filter((expense) => expense.category === category)
          .reduce((sum, expense) => sum + Number(expense.amount), 0);

        return {
          category,
          amount,
        };
      }),
    [expenses]
  );

  const monthlyInsight = useMemo(() => getMonthlyInsights(expenses, categoryStats), [expenses, categoryStats]);

  const addExpense = (expense) => {
    setExpenses((current) => [
      { id: Date.now().toString(), ...expense },
      ...current,
    ]);
  };

  const deleteExpense = (id) => {
    setExpenses((current) => current.filter((expense) => expense.id !== id));
  };

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8 rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-soft backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-indigo-300/70">Expense Tracker</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
              Keep spendings clear, simple, and smart.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Track expenses, monitor category health, and stay aligned with realistic budgets.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-950/80 px-4 py-3 text-sm text-slate-300 ring-1 ring-white/10 shadow-lg shadow-slate-950/20 sm:px-5">
            Built for smarter financial decisions.
          </div>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1.65fr_1.05fr]">
        <div className="space-y-6">
          <ExpenseForm categoryOptions={categoryOptions} onAdd={addExpense} />
          <ExpenseList expenses={expenses} onDelete={deleteExpense} />
        </div>

        <div className="space-y-6">
          <SummaryPanel total={total} expenses={expenses} />
          <InsightsPanel insight={monthlyInsight} />
          <CurrencyConverter
            total={total}
            selectedCurrency={selectedCurrency}
            onCurrencyChange={setSelectedCurrency}
          />
        </div>
      </div>

      <footer className="mt-8 rounded-3xl border border-white/10 bg-slate-900/70 px-6 py-4 text-center text-sm text-slate-400">
        Built for smarter financial decisions.
      </footer>
    </div>
  );
};

export default HomePage;
