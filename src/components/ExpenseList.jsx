import ExpenseCard from './ExpenseCard';

const ExpenseList = ({ expenses, onDelete }) => {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-soft backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-indigo-300/70">Expense log</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-100">Recent activities</h2>
        </div>
        <span className="rounded-full bg-slate-950/75 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-300">
          {expenses.length} items
        </span>
      </div>

      {expenses.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-700/70 bg-slate-950/80 p-8 text-center text-slate-400">
          <p className="mb-3 text-lg font-medium text-slate-100">No expenses yet — your wallet is proud of you.</p>
          <p className="max-w-md mx-auto text-sm leading-6 text-slate-400">
            Add a few items to build your monthly budget, monitor category health, and keep your spending on track.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {expenses.map((expense) => (
            <ExpenseCard key={expense.id} expense={expense} onDelete={onDelete} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ExpenseList;
