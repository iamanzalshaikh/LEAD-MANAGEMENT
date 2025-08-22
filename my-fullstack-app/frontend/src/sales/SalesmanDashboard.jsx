import React, { useState, useEffect, useContext } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { FaUsers, FaCheckCircle, FaChartLine, FaDollarSign, FaProjectDiagram } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { userDataContext } from '../context/userContext';

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

const SalesmanDashboard = () => {
  const { serverUrl } = useContext(AuthContext);
  const { userdata } = useContext(userDataContext); // Logged-in user info

  const [stats, setStats] = useState({
    totalLeads: 0,
    convertedLeads: 0,
    activeLeads: 0,
    conversionRate: 0
  });
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userdata?._id) {
      fetchSalesmanStats(userdata._id);
    }
  }, [userdata]);

  const fetchSalesmanStats = async (salesmanId) => {
    try {
      setLoading(true);

      // 📊 Fetch main stats
      const statsRes = await axios.get(`${serverUrl}/api/dashboard/salesman/${salesmanId}/stats`);
      console.log("Salesman stats from API:", statsRes.data);

      const s = statsRes.data;

      setStats({
        totalLeads: s.totalLeads || 0,
        convertedLeads: s.convertedLeads || 0,
        activeLeads: s.activeLeads || 0,
        conversionRate: parseFloat(s.conversionRate || 0)
      });

      // 📈 Fetch monthly trends
      const trendsRes = await axios.get(`${serverUrl}/api/dashboard/monthly-trends?salesmanId=${salesmanId}`);
      const trendsData = Array.isArray(trendsRes.data) ? trendsRes.data : [];

      const months = Array.from({ length: 12 }, (_, i) => i + 1);
      const currentYear = new Date().getFullYear();

      const formattedTrends = months.map(month => {
        const trend = trendsData.find(t => t._id.month === month && t._id.year === currentYear);
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
      setError("Failed to load your stats.");
      toast.error("Failed to load your stats.");
      setLoading(false);
    }
  };

  // 🔹 Charts
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
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Sales Dashboard</h1>

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

        <div className="bg-white p-4 rounded-lg shadow h-56">
          <h3 className="mb-2 font-semibold text-md">Monthly Trends</h3>
          <Line data={monthlyTrendsData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

export default SalesmanDashboard;
