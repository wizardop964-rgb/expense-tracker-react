import { useMemo } from 'react';
import { formatCurrency } from '../utils/currencyUtils';
import { categoryOptions, monthlyThresholds, getMonthlySpendingStatus } from '../utils/expenseUtils';

const statusStyles = {
  healthy: 'bg-emerald-500/15 text-emerald-200',
  caution: 'bg-amber-500/15 text-amber-200',
  excessive: 'bg-rose-500/15 text-rose-200',
};

const barStyles = {
  healthy: 'bg-emerald-400',
  caution: 'bg-amber-400',
  excessive: 'bg-rose-400',
};

const getCurrentMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const getExpenseMonthKey = (timestamp) => {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const SummaryPanel = ({ total, expenses }) => {
  const monthlyStats = useMemo(() => {
    const currentMonth = getCurrentMonthKey();
    const currentMonthExpenses = expenses.filter((exp) => getExpenseMonthKey(exp.timestamp) === currentMonth);

    return categoryOptions.map((category) => {
      const monthlyAmount = currentMonthExpenses
        .filter((exp) => exp.category === category)
        .reduce((sum, exp) => sum + Number(exp.amount), 0);

      const thresholds = monthlyThresholds[category];
      const statusInfo = getMonthlySpendingStatus(monthlyAmount, category);

      return {
        category,
        monthlyAmount,
        thresholds,
        ...statusInfo,
      };
    });
  }, [expenses]);

  const warningCount = monthlyStats.filter((cat) => cat.status !== 'healthy').length;

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-soft backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-indigo-300/70">Monthly Summary</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-100">This month&apos;s budget</h2>
        </div>
        <div className="rounded-3xl bg-slate-950/70 px-4 py-2 text-sm text-slate-300 ring-1 ring-white/10">
          {warningCount ? `${warningCount} alert${warningCount > 1 ? 's' : ''}` : 'On track'}
        </div>
      </div>

      <div className="rounded-3xl bg-slate-950/90 p-5 ring-1 ring-white/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">Total this month</p>
            <p className="mt-2 text-4xl font-semibold text-slate-100">{formatCurrency(total, 'INR')}</p>
          </div>
          <div className="rounded-3xl bg-indigo-500/10 px-3 py-2 text-sm font-semibold text-indigo-200">
            ₹
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {monthlyStats.map((category) => (
            <div key={category.category} className="rounded-3xl bg-slate-900/80 p-4 ring-1 ring-white/5 transition hover:bg-slate-900">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-100">{category.category}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {formatCurrency(category.monthlyAmount, 'INR')}
                    {category.thresholds ? ` • limit ₹${category.thresholds.caution.toLocaleString('en-IN')}` : ''}
                  </p>
                </div>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[category.status]}`}>
                  {category.status === 'healthy'
                    ? `${Math.round(category.percentage)}%`
                    : category.status === 'caution'
                    ? `${Math.round(category.percentage)}% - Caution`
                    : `Exceeded`}
                </span>
              </div>

              <div className="mt-4 rounded-full bg-slate-800/80 h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barStyles[category.status]}`}
                  style={{ width: `${Math.min(100, category.percentage)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SummaryPanel;
