import React, { useState, useEffect } from 'react';
import { Users, Building, FileText, Shield, TrendingUp, Activity, Check, X, Eye } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInstitutions: 0,
    totalCertificates: 0,
    totalVerifications: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [users, setUsers] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const [statsRes, activityRes, usersRes, certificatesRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/admin/stats`, config),
        axios.get(`${process.env.REACT_APP_API_URL}/admin/recent-activity`, config),
        axios.get(`${process.env.REACT_APP_API_URL}/admin/users`, config),
        axios.get(`${process.env.REACT_APP_API_URL}/certificates?limit=20`, config)
      ]);

      setStats(statsRes.data);
      setRecentActivity(activityRes.data.activities || []);
      setUsers(usersRes.data.users || []);
      setCertificates(certificatesRes.data.certificates || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusToggle = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${process.env.REACT_APP_API_URL}/admin/users/${userId}/status`, {
        isActive: !currentStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const verifyCertificate = async (certificateId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/certificates/${certificateId}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Certificate verified successfully!');
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to verify certificate:', error);
      toast.error('Failed to verify certificate');
    }
  };

  const revokeCertificate = async (certificateId) => {
    const reason = prompt('Please enter the reason for revoking this certificate:');
    if (!reason) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/certificates/${certificateId}/revoke`, 
        { reason }, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      toast.success('Certificate revoked successfully!');
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to revoke certificate:', error);
      toast.error('Failed to revoke certificate');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Activity className="h-4 w-4" />
          <span>System Status: Active</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Building className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Institutions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInstitutions}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Certificates</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCertificates}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Shield className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Verifications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVerifications}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-1 bg-primary-100 rounded-full">
                  <TrendingUp className="h-4 w-4 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Management */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Management</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {users.map((user) => (
              <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-200 rounded-full">
                    <Users className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleUserStatusToggle(user._id, user.isActive)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certificate Management */}
      <div className="card mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Certificate Management</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Institution
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {certificates.map((certificate) => (
                <tr key={certificate._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {certificate.studentName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {certificate.studentEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{certificate.courseName}</div>
                    <div className="text-sm text-gray-500">{certificate.certificateType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {certificate.institutionName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      certificate.isVerified
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {certificate.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(`/certificate/${certificate._id}`, '_blank')}
                        className="text-primary-600 hover:text-primary-900"
                        title="View Certificate"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {!certificate.isVerified ? (
                        <button
                          onClick={() => verifyCertificate(certificate._id)}
                          className="text-green-600 hover:text-green-900"
                          title="Verify Certificate"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => revokeCertificate(certificate._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Revoke Certificate"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;