import { currencySymbols, formatCurrency } from '../utils/currencyUtils';

const categoryStyles = {
  Food: 'bg-emerald-500/10 text-emerald-200 ring-emerald-300/20',
  Travel: 'bg-sky-500/10 text-sky-200 ring-sky-300/20',
  Marketing: 'bg-violet-500/10 text-violet-200 ring-violet-300/20',
  Utilities: 'bg-amber-500/10 text-amber-200 ring-amber-300/20',
  Other: 'bg-slate-500/10 text-slate-200 ring-slate-300/20',
};

const formatExpenseDate = (timestamp) => {
  if (!timestamp) return 'No date';
  const date = new Date(timestamp);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-IN', options);
};

const ExpenseCard = ({ expense, onDelete }) => {
  return (
    <article className="group rounded-3xl border border-white/10 bg-slate-950/95 p-5 shadow-lg shadow-slate-950/20 transition duration-300 hover:-translate-y-0.5 hover:border-indigo-400/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-100">{expense.name}</h3>
          <p className="mt-2 text-sm text-slate-500">Added on {formatExpenseDate(expense.timestamp)}</p>
        </div>
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ring-1 ${categoryStyles[expense.category]}`}>
          {expense.category}
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-2xl font-semibold text-slate-50">{formatCurrency(Number(expense.amount), 'INR')}</p>
        <button
          onClick={() => onDelete(expense.id)}
          className="inline-flex items-center justify-center rounded-2xl bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
        >
          Delete
        </button>
      </div>
    </article>
  );
};

export default ExpenseCard;
