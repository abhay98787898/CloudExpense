'use client';

import { useState, useEffect } from 'react';
import { getExpenses } from '@/lib/api';
import { API_BASE_URL } from '@/lib/config';
import ExpenseTable from '@/components/ExpenseTable';
import Loader from '@/components/Loader';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await getExpenses();
        setExpenses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load expenses');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Expenses</h1>
          <p className="text-gray-600">View and filter all your tracked expenses</p>
        </div>
        <button
          type="button"
          onClick={() => {
            const token = localStorage.getItem('accessToken');
            if (!token) { setError('Please sign in again to export your expenses.'); return; }
            const link = document.createElement('a');
            link.href = `${API_BASE_URL}/expenses/export.csv`;
            link.download = 'cloudexpense-expenses.csv';
            // Fetch with auth header because this endpoint is protected.
            fetch(link.href, { headers: { Authorization: `Bearer ${token}` } })
              .then(async (response) => {
                if (!response.ok) throw new Error('Export failed');
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                link.href = url; link.click(); URL.revokeObjectURL(url);
              })
              .catch(() => setError('Could not export expenses. Please try again.'));
          }}
          className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700"
        >Export CSV</button>
      </div>

      {loading && <Loader />}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {!loading && !error && <ExpenseTable expenses={expenses} />}
    </div>
  );
}
