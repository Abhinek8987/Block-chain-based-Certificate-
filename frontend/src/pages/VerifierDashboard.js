import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, Eye, QrCode, CheckCircle, XCircle, Clock } from 'lucide-react';
import axios from 'axios';

const VerifierDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentVerifications, setRecentVerifications] = useState([]);
  const [stats, setStats] = useState({
    totalVerifications: 0,
    validCertificates: 0,
    invalidCertificates: 0
  });
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, verificationsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/verifier/stats`),
        axios.get(`${process.env.REACT_APP_API_URL}/verifier/recent-verifications`)
      ]);

      setStats(statsRes.data);
      setRecentVerifications(verificationsRes.data.verifications || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setSearchLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/certificates/search?q=${encodeURIComponent(searchQuery)}`
      );
      setSearchResults(response.data.certificates || []);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const verifyCertificate = async (certificateId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/certificates/${certificateId}/verify`);
      
      // Update the search results with verification status
      setSearchResults(prev => 
        prev.map(cert => 
          cert._id === certificateId 
            ? { ...cert, verificationStatus: response.data.isValid ? 'valid' : 'invalid' }
            : cert
        )
      );
      
      // Refresh dashboard data
      fetchDashboardData();
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'invalid':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800';
      case 'invalid':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
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
        <h1 className="text-3xl font-bold text-gray-900">Verifier Dashboard</h1>
        <Link to="/qr-scan" className="btn-primary flex items-center space-x-2">
          <QrCode className="h-5 w-5" />
          <span>Scan QR Code</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Verifications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVerifications}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valid Certificates</p>
              <p className="text-2xl font-bold text-gray-900">{stats.validCertificates}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Invalid Certificates</p>
              <p className="text-2xl font-bold text-gray-900">{stats.invalidCertificates}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Search & Verify Certificates</h2>
        
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by certificate ID, student name, or email..."
                className="input-field pl-10"
              />
            </div>
            <button
              type="submit"
              disabled={searchLoading}
              className="btn-primary disabled:opacity-50"
            >
              {searchLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-900">Search Results</h3>
            <div className="space-y-3">
              {searchResults.map((certificate) => (
                <div key={certificate._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-medium text-gray-900">
                          {certificate.certificateType}
                        </h4>
                        {getStatusIcon(certificate.verificationStatus)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Student: {certificate.studentName} ({certificate.studentEmail})
                      </p>
                      <p className="text-sm text-gray-500">
                        Institution: {certificate.institutionName}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Issued: {formatDate(certificate.issueDate)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        getStatusColor(certificate.verificationStatus)
                      }`}>
                        {certificate.verificationStatus || 'Unverified'}
                      </span>
                      <Link
                        to={`/certificate/${certificate._id}`}
                        className="btn-secondary text-sm py-1 px-3"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => verifyCertificate(certificate._id)}
                        className="btn-primary text-sm py-1 px-3"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Verifications */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Verifications</h2>
        
        {recentVerifications.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No verifications yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start verifying certificates to see your activity here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentVerifications.map((verification, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(verification.status)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {verification.certificateType}
                    </p>
                    <p className="text-xs text-gray-500">
                      {verification.studentName} - {formatDate(verification.verifiedAt)}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  getStatusColor(verification.status)
                }`}>
                  {verification.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifierDashboard;