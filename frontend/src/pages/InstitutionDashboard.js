import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Upload, Eye, QrCode, Calendar, Users, Globe, Check, X, TrendingUp, Shield, Download } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const InstitutionDashboard = () => {
  const [certificates, setCertificates] = useState([]);
  const [stats, setStats] = useState({
    totalCertificates: 0,
    totalStudents: 0,
    recentUploads: 0
  });
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    // Trigger animations after data loads
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      console.log('Fetching dashboard data with token:', token ? 'Present' : 'Missing');

      const [certificatesRes, statsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/certificates/institution`, config),
        axios.get(`${process.env.REACT_APP_API_URL}/certificates/institution/stats`, config)
      ]);

      console.log('Certificates response:', certificatesRes.data);
      console.log('Stats response:', statsRes.data);

      setCertificates(certificatesRes.data.certificates || []);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const verifyCertificate = async (certificateId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      await axios.post(`${process.env.REACT_APP_API_URL}/certificates/${certificateId}/verify`, {}, config);
      
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
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      await axios.post(`${process.env.REACT_APP_API_URL}/certificates/${certificateId}/revoke`, 
        { reason }, 
        config
      );
      
      toast.success('Certificate revoked successfully!');
      
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to revoke certificate:', error);
      toast.error('Failed to revoke certificate');
    }
  };

  // Color configuration object to avoid dynamic Tailwind classes
  const colorConfig = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      iconBg: 'bg-blue-50',
      iconText: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      iconBg: 'bg-green-50',
      iconText: 'text-green-600'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      iconBg: 'bg-purple-50',
      iconText: 'text-purple-600'
    }
  };

  // Stats cards configuration
  const statsCards = [
    {
      value: stats.totalCertificates,
      label: "Total Certificates",
      icon: FileText,
      colorKey: 'blue',
      trend: "+12%"
    },
    {
      value: stats.totalStudents,
      label: "Total Students",
      icon: Users,
      colorKey: 'green',
      trend: "+8%"
    },
    {
      value: stats.recentUploads,
      label: "Recent Uploads",
      icon: Calendar,
      colorKey: 'purple',
      trend: "This Month"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #e0f2fe 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientBackground 15s ease infinite'
      }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* CSS Styles */}
      <style>{`
        @keyframes gradientBackground {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .gradient-bg {
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #e0f2fe 100%);
          background-size: 200% 200%;
          animation: gradientBackground 15s ease infinite;
        }
        
        .fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        
        .dashboard-container {
          min-height: 100vh;
          width: 100%;
        }
      `}</style>

      <div className="dashboard-container gradient-bg">
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
          
          {/* Page Header with Animation */}
          <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-700 ${isAnimating ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Institution Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage certificates, students, and verification status</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link 
                to="/upload" 
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center gap-2 font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <Upload className="h-4 w-4" />
                Upload Certificate
              </Link>
              <Link 
                to="/multilingual-upload" 
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 flex items-center gap-2 font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <Globe className="h-4 w-4" />
                Multilingual Generator
              </Link>
            </div>
          </div>

          {/* Stats Cards with Staggered Animation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statsCards.map((stat, index) => {
              const colors = colorConfig[stat.colorKey];
              return (
                <div 
                  key={index}
                  className={`bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 ${isAnimating ? 'opacity-100' : 'opacity-0 translate-y-6'}`}
                  style={{
                    transitionDelay: `${index * 150}ms`
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 ${colors.iconBg} rounded-xl`}>
                      <stat.icon className={`h-6 w-6 ${colors.iconText}`} />
                    </div>
                    <span className={`text-xs font-medium ${colors.text} ${colors.bg} px-3 py-1 rounded-full`}>
                      {(stat.colorKey === 'blue' || stat.colorKey === 'green') && (
                        <TrendingUp className="h-3 w-3 inline mr-1" />
                      )}
                      {stat.trend}
                    </span>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Certificates Table Section with Animation */}
          <div 
            className={`bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-700 ${isAnimating ? 'opacity-100' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '450ms' }}
          >
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Certificates</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {certificates.length} certificates issued
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1.5 transition-colors duration-200">
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                  <Link 
                    to="/upload" 
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                  >
                    + Upload New
                  </Link>
                </div>
              </div>
            </div>

            {certificates.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center animate-pulse">
                  <FileText className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">No certificates yet</h3>
                <p className="mt-2 text-gray-600 max-w-sm mx-auto">
                  Start by uploading your first certificate to issue to students.
                </p>
                <div className="mt-8">
                  <Link 
                    to="/upload" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <Upload className="h-4 w-4" />
                    Upload First Certificate
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Certificate Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {certificates.map((certificate, index) => (
                      <tr 
                        key={certificate._id} 
                        className="hover:bg-gray-50 transition-all duration-200 hover:shadow-sm fade-in-up"
                        style={{
                          animationDelay: `${index * 50 + 600}ms`
                        }}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{certificate.studentName}</div>
                            <div className="text-sm text-gray-500 mt-0.5">{certificate.studentEmail}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{certificate.certificateType}</div>
                            <div className="text-sm text-gray-600 mt-0.5">{certificate.courseName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">
                            {formatDate(certificate.issueDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                            certificate.isVerified
                              ? 'bg-green-50 text-green-700 hover:bg-green-100'
                              : certificate.status === 'revoked'
                              ? 'bg-red-50 text-red-700 hover:bg-red-100'
                              : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                          }`}>
                            {certificate.isVerified ? 'Verified' : 
                             certificate.status === 'revoked' ? 'Revoked' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/certificate/${certificate._id}`}
                              className="text-gray-400 hover:text-indigo-600 transition-all duration-200 p-2 rounded-lg hover:bg-indigo-50 hover:scale-110"
                              title="View Certificate"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <Link
                              to={`/qr-generate/${certificate._id}`}
                              className="text-gray-400 hover:text-gray-600 transition-all duration-200 p-2 rounded-lg hover:bg-gray-100 hover:scale-110"
                              title="Generate QR Code"
                            >
                              <QrCode className="h-4 w-4" />
                            </Link>
                            {!certificate.isVerified ? (
                              <button
                                onClick={() => verifyCertificate(certificate._id)}
                                className="text-gray-400 hover:text-green-600 transition-all duration-200 p-2 rounded-lg hover:bg-green-50 hover:scale-110"
                                title="Verify Certificate"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => revokeCertificate(certificate._id)}
                                className="text-gray-400 hover:text-red-600 transition-all duration-200 p-2 rounded-lg hover:bg-red-50 hover:scale-110"
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
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default InstitutionDashboard;