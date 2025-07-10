import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';

const COLORS = ['#1976d2', '#27ae60', '#f1c40f', '#e74c3c', '#8e44ad', '#00bcd4', '#ff9800'];

function getStatusData(submissions) {
  const counts = {};
  submissions.forEach(s => {
    const status = s.status || 'unknown';
    counts[status] = (counts[status] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

function getDepartmentData(submissions) {
  const counts = {};
  submissions.forEach(s => {
    const dep = s.department || 'Other';
    counts[dep] = (counts[dep] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

function getMonthlyData(submissions) {
  const counts = {};
  submissions.forEach(s => {
    if (!s.createdat) return;
    const d = new Date(s.createdat);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)).map(([name, value]) => ({ name, value }));
}

export default function SubmissionCharts({ submissions }) {
  const statusData = getStatusData(submissions);
  const departmentData = getDepartmentData(submissions);
  const monthlyData = getMonthlyData(submissions);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center', margin: '2rem 0' }}>
      {/* Pie Chart: Status Breakdown */}
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 24, minWidth: 320 }}>
        <h3 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 12 }}>Status Breakdown</h3>
        <ResponsiveContainer width={300} height={240}>
          <PieChart>
            <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {statusData.map((entry, idx) => <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Bar Chart: Department-wise */}
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 24, minWidth: 340 }}>
        <h3 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 12 }}>Department-wise Submissions</h3>
        <ResponsiveContainer width={320} height={240}>
          <BarChart data={departmentData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Line Chart: Monthly Submissions */}
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 24, minWidth: 340 }}>
        <h3 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 12 }}>Monthly Submissions</h3>
        <ResponsiveContainer width={320} height={240}>
          <LineChart data={monthlyData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#e74c3c" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 