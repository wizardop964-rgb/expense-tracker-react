# Expense Tracker

A responsive React + Vite expense tracking application designed to help users monitor spending habits, analyze category-based expenses, and track monthly financial health with live currency conversion support.

---

## Live Demo

https://expense-tracker-react-beige-sigma.vercel.app/

---

## GitHub Repository

https://github.com/wizardop964-rgb/expense-tracker-react

---

## Features

- Add and delete expenses dynamically
- Categorize expenses (Food, Travel, Utilities, Marketing, Other)
- Real-time monthly spending analysis
- Category-based budget health indicators
- Smart monthly insights and warnings
- Spending pace tracking system
- Live currency conversion
- Automatic API fallback handling
- Responsive UI for desktop and mobile devices
- LocalStorage persistence for saved expenses
- Error handling and loading states for API failures

---

## Tech Stack

- React
- Vite
- TailwindCSS
- JavaScript (ES Modules)
- PostCSS
- Autoprefixer

---

## React Concepts Used

- useState
- useEffect
- useMemo
- Custom Hooks
- Component-based architecture
- Derived state management

---

## APIs Used

### Primary API
ExchangeRate API

### Fallback API
Frankfurter API

---

## Installation

Clone the repository:

```bash
git clone https://github.com/wizardop964-rgb/expense-tracker-react
```

---

## Project Note

This project is a responsive expense tracking application built using React, Vite, and TailwindCSS. The application allows users to add, categorize, monitor, and manage expenses while also providing monthly spending analysis and real-time currency conversion support.

The application uses two public currency exchange APIs. The primary API used is ExchangeRate API, while Frankfurter API is used as a fallback service to ensure reliability in case the primary API fails. Error handling and loading states were implemented to prevent the UI from breaking during API failures.

One of the main challenges during development was handling currency API reliability and creating realistic monthly spending insights based on time windows and category thresholds. Additional effort was also spent improving validation logic, responsive layouts, and creating a cleaner component-based architecture.

With more development time, additional features such as charts, authentication, recurring expense tracking, dark/light theme switching, and backend database integration could be added to further improve the application.

---

## Author

Arnav
