import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Dummy data for charts
const last12Months = [...Array(12)].map((_, i) => {
  const d = new Date();
  d.setMonth(d.getMonth() - (11 - i));
  return d.toLocaleString('default', { month: 'short' });
});

const dummyData = {
  bookings: [...Array(12)].map(() => Math.floor(Math.random() * 50) + 10),
  users: [...Array(12)].map(() => Math.floor(Math.random() * 30) + 5),
  facilities: [...Array(12)].map(() => Math.floor(Math.random() * 20) + 2),
  earnings: [...Array(12)].map(() => Math.floor(Math.random() * 10000) + 1000),
};

const sportsData = {
  labels: ['Tennis', 'Basketball', 'Football', 'Badminton', 'Swimming'],
  data: [45, 35, 30, 25, 20],
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Calculate stats from dummy data
  const totalRevenue = dummyData.earnings.reduce((sum, val) => sum + val, 0);
  const totalBookings = dummyData.bookings.reduce((sum, val) => sum + val, 0);
  const stats = {
    totalUsers: dummyData.users.reduce((sum, val) => sum + val, 0),
    totalOwners: Math.floor(dummyData.facilities.reduce((sum, val) => sum + val, 0) * 0.8), // Assuming 80% approval rate
    totalBookings: totalBookings,
    totalActiveCourts: Math.floor(dummyData.facilities.reduce((sum, val) => sum + val, 0) * 1.5), // Assuming average 1.5 courts per facility
    mostActiveSports: sportsData.labels.slice(0, 3), // Top 3 most active sports
    totalRevenue: totalRevenue,
    avgRevenuePerBooking: Math.round(totalRevenue / totalBookings),
    activeSports: sportsData.labels.length,
    pendingApprovals: Math.floor(dummyData.facilities[dummyData.facilities.length - 1] * 0.2), // 20% of latest facilities pending
    totalFacilities: dummyData.facilities.reduce((sum, val) => sum + val, 0),
    thisMonthBookings: dummyData.bookings[dummyData.bookings.length - 1],
    thisMonthRevenue: dummyData.earnings[dummyData.earnings.length - 1],
  };

  if (loading) return <div className="p-6">Loading admin dashboard...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* User Statistics */}
        <StatCard 
          label="Total Users" 
          value={stats.totalUsers} 
          color="blue"
          subtitle="Registered Users" 
        />
        <StatCard 
          label="Facility Owners" 
          value={stats.totalOwners} 
          color="green"
          subtitle="Active Owners" 
        />
        <StatCard 
          label="Total Facilities" 
          value={stats.totalFacilities} 
          color="indigo"
          subtitle="Registered Facilities" 
        />
        <StatCard 
          label="Active Courts" 
          value={stats.totalActiveCourts} 
          color="orange"
          subtitle="Available Courts" 
        />

        {/* Booking & Revenue Statistics */}
        <StatCard 
          label="Total Bookings" 
          value={stats.totalBookings} 
          color="purple"
          subtitle="All Time" 
        />
        <StatCard 
          label="This Month Bookings" 
          value={stats.thisMonthBookings} 
          color="pink"
          subtitle="Current Month" 
        />
        <StatCard 
          label="Total Revenue" 
          value={`₹${stats.totalRevenue.toLocaleString()}`} 
          color="emerald"
          subtitle="All Time" 
        />
        <StatCard 
          label="This Month Revenue" 
          value={`₹${stats.thisMonthRevenue.toLocaleString()}`} 
          color="teal"
          subtitle="Current Month" 
        />

        {/* Additional Metrics */}
        <StatCard 
          label="Avg. Revenue/Booking" 
          value={`₹${stats.avgRevenuePerBooking.toLocaleString()}`} 
          color="cyan"
          subtitle="Per Booking" 
        />
        <StatCard 
          label="Active Sports" 
          value={stats.activeSports} 
          color="yellow"
          subtitle="Available Sports" 
        />
        <StatCard 
          label="Pending Approvals" 
          value={stats.pendingApprovals} 
          color="red"
          subtitle="Awaiting Review" 
        />
        <StatCard 
          label="Approval Rate" 
          value="80%" 
          color="lime"
          subtitle="Average Rate" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Booking Activity Chart */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="font-semibold text-lg mb-3">Booking Activity</h2>
          <Line
            data={{
              labels: last12Months,
              datasets: [{
                label: 'Number of Bookings',
                data: dummyData.bookings,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                title: { display: false },
                legend: { position: 'bottom' }
              }
            }}
          />
        </div>

        {/* User Registration Trend */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="font-semibold text-lg mb-3">User Registration Trend</h2>
          <Line
            data={{
              labels: last12Months,
              datasets: [{
                label: 'New Users',
                data: dummyData.users,
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.1
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                title: { display: false },
                legend: { position: 'bottom' }
              }
            }}
          />
        </div>

        {/* Facility Approval Trend */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="font-semibold text-lg mb-3">Facility Approval Trend</h2>
          <Line
            data={{
              labels: last12Months,
              datasets: [{
                label: 'Approved Facilities',
                data: dummyData.facilities,
                borderColor: 'rgb(255, 159, 64)',
                tension: 0.1
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                title: { display: false },
                legend: { position: 'bottom' }
              }
            }}
          />
        </div>

        {/* Most Active Sports */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="font-semibold text-lg mb-3">Most Active Sports</h2>
          <Bar
            data={{
              labels: sportsData.labels,
              datasets: [{
                label: 'Bookings',
                data: sportsData.data,
                backgroundColor: [
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                ]
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false }
              }
            }}
          />
        </div>

        {/* Earnings Simulation */}
        <div className="bg-white shadow rounded p-4 md:col-span-2">
          <h2 className="font-semibold text-lg mb-3">Earnings Overview</h2>
          <Line
            data={{
              labels: last12Months,
              datasets: [{
                label: 'Revenue (₹)',
                data: dummyData.earnings,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                fill: true,
                tension: 0.1
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                title: { display: false },
                legend: { position: 'bottom' }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: value => '₹' + value.toLocaleString()
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, subtitle }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
    orange: "bg-orange-100 text-orange-700",
    indigo: "bg-indigo-100 text-indigo-700",
    pink: "bg-pink-100 text-pink-700",
    emerald: "bg-emerald-100 text-emerald-700",
    teal: "bg-teal-100 text-teal-700",
    cyan: "bg-cyan-100 text-cyan-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
    lime: "bg-lime-100 text-lime-700",
  };

  return (
    <div className={`rounded-lg p-4 shadow ${colorClasses[color] || ""}`}>
      <h3 className="text-lg font-semibold">{label}</h3>
      <p className="text-2xl font-bold">{value ?? 0}</p>
      {subtitle && <p className="text-sm opacity-75 mt-1">{subtitle}</p>}
    </div>
  );
}
