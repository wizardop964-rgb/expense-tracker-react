const InsightsPanel = ({ insight }) => {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-soft backdrop-blur-xl transition duration-300 hover:border-indigo-300/20">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-indigo-300/70">Monthly insights</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-100">Smart spending analysis</h2>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-3xl bg-slate-950/90 p-5 ring-1 ring-white/5">
          <p className="text-sm text-slate-400">This month</p>
          <p className="mt-3 text-lg font-semibold text-slate-100">{insight.headline}</p>
          {insight.highlights && insight.highlights.length > 0 && (
            <p className="mt-2 text-sm leading-6 text-slate-400">{insight.highlights[0]}</p>
          )}
        </div>

        <div className="rounded-3xl bg-slate-950/90 p-5 ring-1 ring-white/5">
          <p className="text-sm text-slate-400">Status</p>
          <p className="mt-3 text-lg font-semibold text-slate-100">{insight.note}</p>
        </div>

        {insight.warnings && insight.warnings.length > 0 && (
          <div className="rounded-3xl bg-slate-950/90 p-5 ring-1 ring-white/5">
            <p className="text-sm text-slate-400">Alerts</p>
            <ul className="mt-3 space-y-3">
              {insight.warnings.slice(0, 3).map((warning, index) => (
                <li key={index} className="rounded-2xl border border-amber-500/15 bg-amber-500/5 px-4 py-3 text-sm text-amber-100">
                  ⚠ {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {(!insight.warnings || insight.warnings.length === 0) && (
          <div className="rounded-3xl bg-slate-950/90 p-5 ring-1 ring-white/5">
            <p className="text-sm text-slate-400">Alerts</p>
            <p className="mt-3 text-sm text-emerald-200">All tracked categories are within healthy ranges.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default InsightsPanel;
