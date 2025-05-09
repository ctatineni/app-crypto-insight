
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, Server, FileKey } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const { apps, isLoading } = useAppContext();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crypto-teal mx-auto"></div>
          <p className="mt-4 text-crypto-blue">Loading application data...</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = apps.map(app => ({
    name: app.name,
    vulnerabilities: app.metrics.vulnerabilities,
    certificates: app.metrics.certificates
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Applications</CardTitle>
            <Shield className="h-4 w-4 text-crypto-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-crypto-blue">{apps.length}</div>
            <p className="text-xs text-slate-500 mt-1">Applications monitored</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Critical Vulnerabilities</CardTitle>
            <AlertTriangle className="h-4 w-4 text-crypto-red" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-crypto-red">
              {apps.reduce((acc, app) => acc + app.metrics.criticalVulnerabilities, 0)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Across all applications</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Hosts</CardTitle>
            <Server className="h-4 w-4 text-crypto-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-crypto-teal">
              {apps.reduce((acc, app) => acc + app.metrics.hosts, 0)}
            </div>
            <p className="text-xs text-slate-500 mt-1">VM, Physical and Containers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Expired Certificates</CardTitle>
            <FileKey className="h-4 w-4 text-crypto-yellow" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-crypto-yellow">
              {apps.reduce((acc, app) => acc + app.metrics.expiredCertificates, 0)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Require immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Application Risk Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="vulnerabilities" name="Vulnerabilities" fill="#ef4444" />
                <Bar dataKey="certificates" name="Certificates" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium">App Name</th>
                  <th className="text-left py-3 px-4 font-medium">Description</th>
                  <th className="text-left py-3 px-4 font-medium">Owner</th>
                  <th className="text-center py-3 px-4 font-medium">Risk Score</th>
                  <th className="text-center py-3 px-4 font-medium">Vulns</th>
                  <th className="text-center py-3 px-4 font-medium">Certs</th>
                  <th className="text-right py-3 px-4 font-medium">Last Scan</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((app) => (
                  <tr 
                    key={app.id} 
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                    onClick={() => navigate(`/app/${app.id}`)}
                  >
                    <td className="py-3 px-4 font-medium text-crypto-blue">{app.name}</td>
                    <td className="py-3 px-4 text-slate-600">{app.description}</td>
                    <td className="py-3 px-4 text-slate-600">{app.owner}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-white text-xs font-semibold
                        ${app.riskScore > 70 ? 'bg-crypto-red' : 
                        app.riskScore > 40 ? 'bg-crypto-yellow' : 
                        'bg-crypto-green'}`}
                      >
                        {app.riskScore}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-medium text-crypto-red">{app.metrics.vulnerabilities}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-medium text-crypto-light-blue">{app.metrics.certificates}</span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600">{app.lastScan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
