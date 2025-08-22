import React, { useState, useEffect, useContext } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
} from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { FaUsers, FaCheckCircle, FaChartLine, FaDollarSign, FaProjectDiagram } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title
);

const AdminDashboard = () => {
  const { serverUrl } = useContext(AuthContext);

  const [stats, setStats] = useState({
    totalLeads: 0,
    convertedLeads: 0,
    conversionRate: 0,
    activeLeads: 0,
    leadScoreDistribution: { high: 0, medium: 0, low: 0 },
    salespeople: []
  });
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; 

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch dashboard stats
        const statsRes = await axios.get(`${serverUrl}/api/dashboard/stats`, {
          withCredentials: true
        });

        if (!isMounted) return;
        const statsData = statsRes.data || {};
        const conversionRate = statsData.totalLeads
          ? ((statsData.convertedLeads / statsData.totalLeads) * 100).toFixed(1)
          : 0;

        setStats({
          totalLeads: statsData.totalLeads || 0,
          convertedLeads: statsData.convertedLeads || 0,
          conversionRate: parseFloat(conversionRate),
          activeLeads: (statsData.totalLeads || 0) - (statsData.convertedLeads || 0),
          leadScoreDistribution: statsData.leadScoreDistribution || { high: 0, medium: 0, low: 0 },
          salespeople: statsData.salespeople || []
        });

        // Fetch monthly trends
        const trendsRes = await axios.get(`${serverUrl}/api/dashboard/monthly-trends`, {
          withCredentials: true
        });

        if (!isMounted) return;
        const trendsData = Array.isArray(trendsRes.data) ? trendsRes.data : [];

        const months = Array.from({ length: 12 }, (_, i) => i + 1);
        const currentYear = new Date().getFullYear();

        const formattedTrends = months.map(month => {
          const trend = trendsData.find(
            t => t._id.month === month && t._id.year === currentYear
          );
          return {
            month: `${currentYear}-${month.toString().padStart(2, '0')}`,
            created: trend?.totalLeads || 0,
            converted: trend?.converted || 0
          };
        });

        setMonthlyTrends(formattedTrends);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError('Failed to load dashboard data.');
          toast.error('Failed to load dashboard data.');
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, [serverUrl]);

  const leadScoreData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        data: [
          stats.leadScoreDistribution.high || 0,
          stats.leadScoreDistribution.medium || 0,
          stats.leadScoreDistribution.low || 0
        ],
        backgroundColor: ['#FF6384', '#FFCD56', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#FFCD56', '#36A2EB']
      }
    ]
  };

  const monthlyTrendsData = {
    labels: monthlyTrends.map(t => t.month),
    datasets: [
      {
        label: 'Created Leads',
        data: monthlyTrends.map(t => t.created),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.3
      },
      {
        label: 'Converted Leads',
        data: monthlyTrends.map(t => t.converted),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3
      }
    ]
  };

  const funnelData = {
    labels: ['Total Leads', 'Active Leads', 'Converted Leads'],
    datasets: [
      {
        label: 'Leads Funnel',
        data: [stats.totalLeads, stats.activeLeads, stats.convertedLeads],
        backgroundColor: ['#36A2EB', '#FFCD56', '#4BC0C0']
      }
    ]
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;

  return (
    <div className="p-4 bg-gray-100 min-h-screen space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Leads</p>
            <h2 className="text-xl font-bold">{stats.totalLeads}</h2>
          </div>
          <FaUsers className="text-blue-500 text-2xl" />
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Converted Leads</p>
            <h2 className="text-xl font-bold">{stats.convertedLeads}</h2>
          </div>
          <FaCheckCircle className="text-green-500 text-2xl" />
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Conversion Rate</p>
            <h2 className="text-xl font-bold">{stats.conversionRate}%</h2>
          </div>
          <FaChartLine className="text-purple-500 text-2xl" />
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Active Leads</p>
            <h2 className="text-xl font-bold">{stats.activeLeads}</h2>
          </div>
          <FaDollarSign className="text-yellow-500 text-2xl" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="mb-2 font-semibold text-md">Lead Score Distribution</h3>
          <Doughnut data={leadScoreData} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow h-56">
          <h3 className="mb-2 font-semibold text-md">Monthly Trends</h3>
          <Line data={monthlyTrendsData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow h-56">
          <h3 className="mb-2 font-semibold text-md flex items-center gap-2">
            <FaProjectDiagram /> Leads Funnel
          </h3>
          <Bar
            data={funnelData}
            options={{
              indexAxis: 'y',
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
