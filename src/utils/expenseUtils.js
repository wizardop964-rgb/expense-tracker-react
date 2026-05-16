export const categoryThresholds = {
  Food: 25000,
  Utilities: 15000,
  Travel: 200000,
  Marketing: 1000000,
  Other: null,
};

export const monthlyThresholds = {
  Food: { healthy: 12000, caution: 25000 },
  Utilities: { healthy: 8000, caution: 15000 },
  Travel: { healthy: 50000, caution: 200000 },
  Marketing: { healthy: 200000, caution: 1000000 },
  Other: null,
};

export const categoryOptions = Object.keys(categoryThresholds);

const getCurrentMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const getExpenseMonthKey = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const getDayOfMonth = (timestamp) => {
  return new Date(timestamp).getDate();
};

const getDaysInCurrentMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
};

const getCurrentDayOfMonth = () => {
  return new Date().getDate();
};

export const getMonthlySpendingStatus = (monthlyAmount, category) => {
  const thresholds = monthlyThresholds[category];

  if (!thresholds) {
    return {
      status: 'healthy',
      percentage: 0,
      message: `${category} has no strict monthly limit.`,
    };
  }

  const { healthy, caution } = thresholds;
  const percentage = Math.min(100, (monthlyAmount / caution) * 100);

  if (monthlyAmount >= caution) {
    return {
      status: 'excessive',
      percentage: Math.min(100, (monthlyAmount / caution) * 100),
      message: `${category} spending has crossed the monthly threshold.`,
    };
  }

  if (monthlyAmount >= healthy) {
    return {
      status: 'caution',
      percentage: (monthlyAmount / caution) * 100,
      message: `${category} spending is approaching the monthly limit.`,
    };
  }

  return {
    status: 'healthy',
    percentage: (monthlyAmount / caution) * 100,
    message: `${category} spending is within healthy monthly range.`,
  };
};

export const getSpendingPace = (monthlyAmount, category) => {
  const currentDay = getCurrentDayOfMonth();
  const daysInMonth = getDaysInCurrentMonth();
  const expectedDailyRate = monthlyThresholds[category]?.caution / daysInMonth || 0;
  const actualDailyRate = monthlyAmount / currentDay;
  const paceRatio = expectedDailyRate > 0 ? actualDailyRate / expectedDailyRate : 0;

  if (paceRatio > 1.3) {
    return {
      pace: 'fast',
      paceRatio,
      message: `${category} spending pace is unusually high for this month.`,
    };
  }

  if (paceRatio > 1.1) {
    return {
      pace: 'moderate-fast',
      paceRatio,
      message: `${category} expenses are increasing faster than expected.`,
    };
  }

  if (paceRatio < 0.7) {
    return {
      pace: 'slow',
      paceRatio,
      message: `${category} spending is tracking below normal pace.`,
    };
  }

  return {
    pace: 'normal',
    paceRatio,
    message: `${category} spending pace is tracking normally.`,
  };
};

export const getMonthlyInsights = (expenses, categoryStats) => {
  const currentMonth = getCurrentMonthKey();
  const currentMonthExpenses = expenses.filter((exp) => getExpenseMonthKey(exp.timestamp) === currentMonth);

  if (currentMonthExpenses.length === 0) {
    return {
      headline: 'Fresh month ahead — start tracking to build smart insights.',
      note: 'Your wallet is proud of you.',
      warnings: [],
      highlights: [],
    };
  }

  const monthlyStats = categoryOptions.map((category) => {
    const monthlyAmount = currentMonthExpenses
      .filter((exp) => exp.category === category)
      .reduce((sum, exp) => sum + Number(exp.amount), 0);

    return {
      category,
      monthlyAmount,
      status: getMonthlySpendingStatus(monthlyAmount, category),
      pace: monthlyAmount > 0 ? getSpendingPace(monthlyAmount, category) : null,
    };
  });

  const warnings = [];
  const highlights = [];

  monthlyStats.forEach((stat) => {
    if (stat.status.status === 'excessive') {
      warnings.push(`${stat.category} spending crossed the monthly safety threshold.`);
    } else if (stat.status.status === 'caution') {
      const percentage = Math.round(stat.status.percentage);
      warnings.push(`You have already used ${percentage}% of your monthly ${stat.category.toLowerCase()} budget.`);
    }

    if (stat.pace && (stat.pace.pace === 'fast' || stat.pace.pace === 'moderate-fast')) {
      warnings.push(stat.pace.message);
    }

    if (stat.status.status === 'healthy' && stat.monthlyAmount > 0) {
      highlights.push(`${stat.category} expenses remain healthy this month.`);
    }
  });

  const healthyCount = monthlyStats.filter((s) => s.status.status === 'healthy').length;
  const note = warnings.length === 0 
    ? 'Your spending habits look balanced for this month.'
    : `${warnings.length} area${warnings.length > 1 ? 's' : ''} may need attention.`;

  const highestSpending = monthlyStats.reduce((max, stat) => {
    return stat.monthlyAmount > max.monthlyAmount ? stat : max;
  });

  return {
    headline: highestSpending.monthlyAmount > 0 
      ? `${highestSpending.category} is your top spending category this month.`
      : 'Start tracking expenses to see monthly insights.',
    note,
    warnings: [...new Set(warnings)],
    highlights: [...new Set(highlights)],
    monthlyStats,
  };
};

export const spendingStatus = (amount, category) => {
  const threshold = categoryThresholds[category];
  if (!threshold) {
    return {
      threshold: null,
      ratio: 0,
      status: 'healthy',
      message: 'No spending threshold set for this category.',
    };
  }

  const ratio = threshold === 0 ? 0 : amount / threshold;
  const percentage = Math.min(100, ratio * 100);
  const roundedRatio = Number(ratio.toFixed(2));

  if (roundedRatio >= 1) {
    return {
      threshold,
      ratio: roundedRatio,
      percentage,
      status: 'excessive',
      message: `${category} spending crossed the healthy limit.`,
    };
  }

  if (roundedRatio >= 0.75) {
    return {
      threshold,
      ratio: roundedRatio,
      percentage,
      status: 'caution',
      message: `${category} spending is nearing the threshold.`,
    };
  }

  return {
    threshold,
    ratio: roundedRatio,
    percentage,
    status: 'healthy',
    message: `${category} spending remains within a healthy range.`,
  };
};

export const getInsightSummary = (categoryStats) => {
  const activeCategories = categoryStats.filter((category) => category.amount > 0);

  if (activeCategories.length === 0) {
    return {
      headline: 'No expenses to analyze yet.',
      note: 'No expenses yet — your wallet is proud of you.',
      warnings: [],
      highlight: 'Add a few items to build a clear spending picture.',
    };
  }

  const highest = activeCategories.reduce((current, category) => {
    return category.amount > current.amount ? category : current;
  }, activeCategories[0]);

  const warnings = activeCategories
    .filter((category) => category.status !== 'healthy')
    .map((category) => category.message);

  const note = warnings.length
    ? 'A few categories may need a closer look. Keep tracking to stay on top of them.'
    : 'Your spending habits look balanced.';

  return {
    headline: `${highest.category} spending is currently your highest expense.`,
    note,
    warnings,
    highlight: `Highest spending category: ${highest.category} (${highest.amount.toLocaleString('en-IN')})`,
  };
};
