import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  PlusCircle, Edit3, Trash2, IndianRupee, Calendar, Tag, FileText, 
  CheckCircle2, AlertCircle, Wallet, Receipt, X, ArrowUpRight, TrendingDown
} from 'lucide-react';

const API_URL = '/api/expenses';

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: '', amount: '', category: 'Food', date: '' });
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 3500);
  };

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(API_URL);
      setExpenses(res.data);
    } catch (err) {
      showAlert('error', 'Could not connect to backend server.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.amount || !form.date) {
      showAlert('error', 'All fields are required.');
      return;
    }
    if (parseFloat(form.amount) <= 0) {
      showAlert('error', 'Amount must be greater than zero.');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
        showAlert('success', 'Expense updated successfully!');
        setEditingId(null);
      } else {
        await axios.post(API_URL, form);
        showAlert('success', 'Expense added successfully!');
      }
      setForm({ title: '', amount: '', category: 'Food', date: '' });
      fetchExpenses();
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Operation failed.');
    }
  };

  const handleEdit = (exp) => {
    setEditingId(exp._id);
    setForm({
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
      date: exp.date ? exp.date.split('T')[0] : ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        showAlert('success', 'Expense removed successfully.');
        fetchExpenses();
      } catch (err) {
        showAlert('error', 'Failed to delete expense.');
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: '', amount: '', category: 'Food', date: '' });
  };

  const totalSpent = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const getCategoryStyle = (cat) => {
    const styles = {
      Food: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      Travel: 'bg-blue-50 text-blue-600 border-blue-100',
      Bills: 'bg-rose-50 text-rose-600 border-rose-100',
      Shopping: 'bg-purple-50 text-purple-600 border-purple-100',
      Other: 'bg-amber-50 text-amber-600 border-amber-100'
    };
    return styles[cat] || 'bg-slate-50 text-slate-600 border-slate-100';
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-800 font-sans p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-emerald-500 text-white rounded-2xl shadow-md shadow-emerald-500/20">
              <Wallet className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Personal Expense Tracker</h1>
              <p className="text-xs text-slate-400 font-medium">MERN Stack Exit Assessment</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#F8FAFC] border border-slate-100 p-3.5 rounded-2xl w-full sm:w-auto">
            <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Spent</span>
              <p className="text-2xl font-extrabold text-slate-900">
                ₹{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Alert Notification */}
        {alert.message && (
          <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm transition-all ${
            alert.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <div className="flex items-center gap-3">
              {alert.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
              <span className="text-sm font-medium">{alert.message}</span>
            </div>
            <button onClick={() => setAlert({ type: '', message: '' })} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Form + Table Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Form Card */}
          <div className="lg:col-span-1 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm h-fit space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                {editingId ? <Edit3 className="w-5 h-5 text-emerald-500" /> : <PlusCircle className="w-5 h-5 text-emerald-500" />}
                {editingId ? 'Edit Expense' : 'Add Expense'}
              </h2>
              {editingId && (
                <button onClick={cancelEdit} className="text-xs font-semibold text-slate-400 hover:text-slate-600">
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Expense Title</label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="e.g., Grocery Shopping"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Amount (₹)</label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g., 300"
                    value={form.amount}
                    onChange={e => setForm({ ...form, amount: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Category</label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                  >
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Bills">Bills</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-500/20 transition active:scale-[0.98]"
              >
                {editingId ? 'Update Expense' : 'Save Expense'}
              </button>
            </form>
          </div>

          {/* Right Transaction History Card */}
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-500" />
                Recent Transactions
              </h2>
              <span className="text-xs font-semibold text-slate-400 bg-[#F8FAFC] px-3 py-1 rounded-full border border-slate-100">
                {expenses.length} Total Records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F8FAFC] text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-6">Title</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-slate-400">
                        <Receipt className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm font-medium">No expenses recorded yet.</p>
                      </td>
                    </tr>
                  ) : (
                    expenses.map(exp => (
                      <tr key={exp._id} className="hover:bg-[#F8FAFC]/60 transition">
                        <td className="py-4 px-6 font-semibold text-slate-900">{exp.title}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryStyle(exp.category)}`}>
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-400 text-xs font-medium">
                          {new Date(exp.date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-900">
                          ₹{Number(exp.amount).toFixed(2)}
                        </td>
                        <td className="py-4 px-6 text-right space-x-1">
                          <button
                            onClick={() => handleEdit(exp)}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(exp._id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}