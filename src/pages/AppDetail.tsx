
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  AlertTriangle, 
  Server, 
  FileKey, 
  Code2, 
  ArrowLeft,
  ChevronRight,
  Check,
  Clock,
  ShieldAlert,
  Info
} from 'lucide-react';
import { useAppContext, AppData } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

const AppDetail = () => {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const { apps, hosts, certificates, libraries, vulnerabilities, isLoading } = useAppContext();
  const [app, setApp] = useState<AppData | null>(null);
  
  useEffect(() => {
    if (!isLoading && appId) {
      const foundApp = apps.find(a => a.id === appId);
      if (foundApp) {
        setApp(foundApp);
      } else {
        // App not found, redirect to dashboard
        navigate('/');
      }
    }
  }, [appId, apps, isLoading, navigate]);

  if (isLoading || !app) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crypto-teal mx-auto"></div>
          <p className="mt-4 text-crypto-blue">Loading application data...</p>
        </div>
      </div>
    );
  }

  // Filter entities related to this app (in a real app, this would be done via API)
  // For demo purposes, we'll just use all entities
  const appHosts = hosts;
  const appCertificates = certificates;
  const appLibraries = libraries;
  const appVulnerabilities = vulnerabilities;

  // Prepare chart data for certificates
  const certStatusData = [
    { name: 'Valid', value: app.metrics.certificates - app.metrics.expiredCertificates, color: '#10b981' },
    { name: 'Expired', value: app.metrics.expiredCertificates, color: '#ef4444' }
  ];

  // Prepare chart data for vulnerabilities
  const vulnSeverityData = [
    { name: 'Critical', value: app.metrics.criticalVulnerabilities, color: '#ef4444' },
    { name: 'High', value: 3, color: '#f59e0b' },
    { name: 'Medium', value: 5, color: '#f59e0b' },
    { name: 'Low', value: app.metrics.vulnerabilities - app.metrics.criticalVulnerabilities - 8, color: '#10b981' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-slate-500 hover:text-slate-700 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-crypto-blue">{app.name}</h1>
          <p className="text-slate-500">{app.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-500">Last scan: {app.lastScan}</span>
          <Button size="sm">Scan Now</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Security Risk Score</CardTitle>
            <CardDescription>Overall security risk assessment for {app.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={`
                w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold
                ${app.riskScore > 70 ? 'bg-crypto-red text-white' : 
                app.riskScore > 40 ? 'bg-crypto-yellow text-white' : 
                'bg-crypto-green text-white'}
              `}>
                {app.riskScore}
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">Risk score</span>
                  <span className="text-sm font-medium text-slate-700">
                    {app.riskScore > 70 ? 'High' : app.riskScore > 40 ? 'Medium' : 'Low'}
                  </span>
                </div>
                <Progress 
                  value={app.riskScore} 
                  className={`h-2 ${
                    app.riskScore > 70 ? 'bg-slate-200' : 
                    app.riskScore > 40 ? 'bg-slate-200' : 
                    'bg-slate-200'
                  }`}
                />
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-crypto-teal/5 border-crypto-teal/20">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-crypto-teal/20 p-2">
                  <Shield className="h-5 w-5 text-crypto-teal" />
                </div>
                <div>
                  <h3 className="font-medium text-crypto-blue mb-1">AI Security Recommendation</h3>
                  <p className="text-sm text-slate-600">
                    {app.riskScore > 70 ? 
                      'Critical security issues detected. Immediate remediation required for expired certificates and OpenSSL vulnerabilities.' : 
                      app.riskScore > 40 ? 
                      'Medium risk detected. Address the OpenSSL vulnerabilities and implement a key rotation policy.' : 
                      'Low security risk. Continue monitoring and consider implementing automated certificate renewal.'}
                  </p>
                  <button className="mt-2 text-sm text-crypto-teal flex items-center gap-1 hover:underline">
                    View Detailed Analysis
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Resource Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Server className="h-5 w-5 text-crypto-blue" />
                  </div>
                  <div>
                    <p className="font-medium">Hosts</p>
                    <p className="text-sm text-slate-500">VMs, Servers, Containers</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-crypto-blue">{app.metrics.hosts}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FileKey className="h-5 w-5 text-crypto-green" />
                  </div>
                  <div>
                    <p className="font-medium">Certificates</p>
                    <p className="text-sm text-slate-500">SSL/TLS, Keys, Auth</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-crypto-green">{app.metrics.certificates}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Code2 className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium">Libraries</p>
                    <p className="text-sm text-slate-500">Crypto Libraries</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-purple-500">{app.metrics.cryptoLibraries}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-red-200 bg-red-50">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-crypto-red" />
                  </div>
                  <div>
                    <p className="font-medium">Vulnerabilities</p>
                    <p className="text-sm text-slate-500">Security Issues</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-crypto-red">{app.metrics.vulnerabilities}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="certificates" className="flex items-center gap-2">
                <FileKey className="h-4 w-4" />
                Certificates
              </TabsTrigger>
              <TabsTrigger value="vulnerabilities" className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                Vulnerabilities
              </TabsTrigger>
              <TabsTrigger value="hosts" className="flex items-center gap-2">
                <Server className="h-4 w-4" />
                Hosts
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Certificate Status</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={certStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {certStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Vulnerability Severity</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={vulnSeverityData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {vulnSeverityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-medium mb-4">AI Security Assessment</h3>
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 rounded-lg border border-slate-200">
                    <div className="bg-crypto-red/10 p-2 rounded-full h-fit">
                      <AlertTriangle className="h-6 w-6 text-crypto-red" />
                    </div>
                    <div>
                      <h4 className="font-medium">Critical Issue: OpenSSL Vulnerability</h4>
                      <p className="text-slate-600 mb-2">
                        The OpenSSL library (version 3.0.1) used in this application contains a critical vulnerability 
                        (CVE-2025-0123) that could lead to remote code execution.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-crypto-red">
                        <Clock className="h-4 w-4" />
                        <span>Urgent action required</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 p-4 rounded-lg border border-slate-200">
                    <div className="bg-crypto-yellow/10 p-2 rounded-full h-fit">
                      <Shield className="h-6 w-6 text-crypto-yellow" />
                    </div>
                    <div>
                      <h4 className="font-medium">Warning: Key Rotation Policy</h4>
                      <p className="text-slate-600 mb-2">
                        JWT signing keys are not being rotated regularly, which violates security best practices.
                        Implement a key rotation schedule of at least once every 90 days.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-crypto-yellow">
                        <Clock className="h-4 w-4" />
                        <span>Address within 30 days</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 p-4 rounded-lg border border-slate-200">
                    <div className="bg-crypto-green/10 p-2 rounded-full h-fit">
                      <Check className="h-6 w-6 text-crypto-green" />
                    </div>
                    <div>
                      <h4 className="font-medium">Good Practice: Strong TLS Configuration</h4>
                      <p className="text-slate-600">
                        The application uses modern TLS 1.3 protocol with strong cipher suites, following
                        current security best practices.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="certificates" className="mt-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Type</th>
                      <th className="text-left py-3 px-4 font-medium">Algorithm</th>
                      <th className="text-center py-3 px-4 font-medium">Key Size</th>
                      <th className="text-center py-3 px-4 font-medium">Host Count</th>
                      <th className="text-center py-3 px-4 font-medium">Vulnerabilities</th>
                      <th className="text-right py-3 px-4 font-medium">Expires</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appCertificates.map((cert) => (
                      <tr key={cert.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium text-crypto-blue">{cert.name}</td>
                        <td className="py-3 px-4 text-slate-600">{cert.type}</td>
                        <td className="py-3 px-4 text-slate-600">{cert.algorithm}</td>
                        <td className="py-3 px-4 text-center text-slate-600">{cert.keySize} bits</td>
                        <td className="py-3 px-4 text-center text-slate-600">{cert.hosts.length}</td>
                        <td className="py-3 px-4 text-center">
                          {cert.vulnerabilities > 0 ? (
                            <span className="flex items-center justify-center gap-1">
                              <AlertTriangle className="h-4 w-4 text-crypto-red" />
                              <span className="font-medium text-crypto-red">{cert.vulnerabilities}</span>
                            </span>
                          ) : (
                            <span className="text-crypto-green">None</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`${cert.isExpired ? 'text-crypto-red' : 'text-slate-600'}`}>
                            {cert.isExpired ? 'EXPIRED' : cert.expires}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="vulnerabilities" className="mt-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium">Title</th>
                      <th className="text-center py-3 px-4 font-medium">Severity</th>
                      <th className="text-left py-3 px-4 font-medium">Affected Assets</th>
                      <th className="text-center py-3 px-4 font-medium">Status</th>
                      <th className="text-right py-3 px-4 font-medium">Detected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appVulnerabilities.map((vuln) => (
                      <tr key={vuln.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium text-crypto-blue">{vuln.title}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge 
                            className={`
                              ${vuln.severity === 'Critical' ? 'bg-crypto-red hover:bg-crypto-red' :
                              vuln.severity === 'High' ? 'bg-crypto-yellow hover:bg-crypto-yellow' :
                              vuln.severity === 'Medium' ? 'bg-yellow-500 hover:bg-yellow-500' : 
                              'bg-crypto-green hover:bg-crypto-green'}
                            `}
                          >
                            {vuln.severity}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {vuln.affected.map((asset, idx) => (
                              <Badge key={idx} variant="outline" className="bg-slate-100">
                                {asset}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge 
                            className={`
                              ${vuln.status === 'Open' ? 'bg-slate-500 hover:bg-slate-500' :
                              vuln.status === 'In Progress' ? 'bg-blue-500 hover:bg-blue-500' :
                              vuln.status === 'Resolved' ? 'bg-crypto-green hover:bg-crypto-green' : 
                              'bg-purple-500 hover:bg-purple-500'}
                            `}
                          >
                            {vuln.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right text-slate-600">{vuln.detected}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="hosts" className="mt-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium">Host Name</th>
                      <th className="text-left py-3 px-4 font-medium">Type</th>
                      <th className="text-left py-3 px-4 font-medium">Operating System</th>
                      <th className="text-left py-3 px-4 font-medium">IP Address</th>
                      <th className="text-right py-3 px-4 font-medium">Last Scan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appHosts.map((host) => (
                      <tr key={host.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium text-crypto-blue">{host.name}</td>
                        <td className="py-3 px-4 text-slate-600">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${host.type === 'VM' ? 'bg-blue-100 text-blue-800' : 
                            host.type === 'Container' ? 'bg-purple-100 text-purple-800' : 
                            'bg-green-100 text-green-800'}`}
                          >
                            {host.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{host.os}</td>
                        <td className="py-3 px-4 text-slate-600 font-mono">{host.ipAddress}</td>
                        <td className="py-3 px-4 text-right text-slate-600">{host.lastScan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppDetail;
