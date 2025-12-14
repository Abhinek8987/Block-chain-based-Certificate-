import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Eye, QrCode, Download, Calendar, Award, AlertTriangle, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const [certificates, setCertificates] = useState([]);
  const [stats, setStats] = useState({
    totalCertificates: 0,
    verifiedCertificates: 0,
    pendingCertificates: 0
  });
  const [loading, setLoading] = useState(true);
  const [showRevocationAlert, setShowRevocationAlert] = useState(false);
  const [revokedCertificates, setRevokedCertificates] = useState([]);

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

      console.log('Fetching student dashboard data with token:', token ? 'Present' : 'Missing');

      const [certificatesRes, statsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/certificates/student`, config),
        axios.get(`${process.env.REACT_APP_API_URL}/certificates/student/stats`, config)
      ]);

      console.log('Student certificates response:', certificatesRes.data);
      console.log('Student stats response:', statsRes.data);

      const allCerts = certificatesRes.data.certificates || [];
      
      // Extra safety: Filter out revoked certificates on client side too
      const activeCerts = allCerts.filter(cert => !cert.isRevoked);
      setCertificates(activeCerts);
      setStats(statsRes.data);

      // Check for revoked certificates and show one-time notification
      const revokedCerts = allCerts.filter(cert => cert.isRevoked);
      const userEmail = localStorage.getItem('userEmail') || 'user';
      const revocationKey = `revocationNotified_${userEmail}`;
      
      if (revokedCerts.length > 0 && !localStorage.getItem(revocationKey)) {
        setRevokedCertificates(revokedCerts);
        setShowRevocationAlert(true);
        localStorage.setItem(revocationKey, 'true');
        
        // Show toast notification as well
        toast.error(`${revokedCerts.length} certificate(s) have been revoked. Please contact your institution.`, {
          duration: 6000
        });
      }
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

  const downloadCertificate = async (certificateId, fileName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/certificates/${certificateId}/download`,
        { 
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'certificate.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download certificate:', error);
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
      {/* Revocation Alert */}
      {showRevocationAlert && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Certificate Revocation Notice
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p className="font-semibold">
                  {revokedCertificates.length === 1 
                    ? 'Your certificate has been removed by the institution.'
                    : `${revokedCertificates.length} of your certificates have been removed by the institutions.`
                  }
                </p>
                <p className="mt-2">
                  <strong>What to do:</strong>
                </p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Contact your <strong>college coordinator</strong> for immediate assistance</li>
                  <li>Reach out to the <strong>institution administrator</strong> for clarification</li>
                  <li>Request information about the reason for removal</li>
                  <li>Ask about the process for certificate restoration if applicable</li>
                </ul>
                <div className="mt-3 p-2 bg-red-100 rounded">
                  <strong>Affected Certificate(s):</strong>
                  <ul className="list-disc list-inside mt-1">
                    {revokedCertificates.map(cert => (
                      <li key={cert._id} className="text-xs">
                        <strong>{cert.courseName}</strong> - {cert.institutionName}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => {
                    setShowRevocationAlert(false);
                    // Mark as acknowledged for this session
                    const userEmail = localStorage.getItem('userEmail') || 'user';
                    const ackKey = `revocationAcknowledged_${userEmail}`;
                    localStorage.setItem(ackKey, 'true');
                  }}
                  className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                  title="Dismiss notification"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Award className="h-4 w-4" />
          <span>Student Dashboard</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Certificates</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCertificates}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Verified</p>
              <p className="text-2xl font-bold text-gray-900">{stats.verifiedCertificates}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingCertificates}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Your Certificates</h2>

        {certificates.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No certificates found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Your certificates will appear here once they are issued by institutions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <div key={certificate._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Award className="h-6 w-6 text-primary-600" />
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    certificate.isVerified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {certificate.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {certificate.certificateType}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{certificate.courseName}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Issued by {certificate.institutionName}
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  {formatDate(certificate.issueDate)}
                </p>

                <div className="flex items-center space-x-2">
                  <Link
                    to={`/certificate/${certificate._id}`}
                    className="flex-1 btn-primary text-center text-sm py-2"
                  >
                    <Eye className="h-4 w-4 inline mr-1" />
                    View
                  </Link>
                  <Link
                    to={`/qr-generate/${certificate._id}`}
                    className="btn-secondary text-sm py-2 px-3"
                  >
                    <QrCode className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => downloadCertificate(certificate._id, `${certificate.certificateType}.pdf`)}
                    className="btn-secondary text-sm py-2 px-3"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;