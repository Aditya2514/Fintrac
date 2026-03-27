import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { FinanceProvider } from './context/FinanceContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Budget from './pages/Budget';
import Analytics from './pages/Analytics';
import AIAdvisor from './pages/AIAdvisor';
import AIAnalyzer from './pages/AIAnalyzer';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <FinanceProvider>
          <ErrorBoundary>
            <Router>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route element={<Layout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/transactions/new" element={<AddTransaction />} />
                  <Route path="/transactions/edit/:id" element={<AddTransaction />} />
                  <Route path="/budget" element={<Budget />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/ai-advisor" element={<AIAdvisor />} />
                  <Route path="/ai-analyzer" element={<AIAnalyzer />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
              <ToastContainer position="bottom-right" theme="colored" />
            </Router>
          </ErrorBoundary>
        </FinanceProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;
