
import React, { useState } from 'react';
import { Search, Filter, FileKey, Shield, Server } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

const Inventory = () => {
  const { certificates, hosts, isLoading } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crypto-teal mx-auto"></div>
          <p className="mt-4 text-crypto-blue">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  // Certificate types data for pie chart
  const certificateTypes = certificates.reduce((acc: Record<string, number>, cert) => {
    acc[cert.type] = (acc[cert.type] || 0) + 1;
    return acc;
  }, {});

  const certificatesChartData = Object.keys(certificateTypes).map(type => ({
    name: type,
    value: certificateTypes[type]
  }));

  // Host types data for pie chart
  const hostTypes = hosts.reduce((acc: Record<string, number>, host) => {
    acc[host.type] = (acc[host.type] || 0) + 1;
    return acc;
  }, {});

  const hostsChartData = Object.keys(hostTypes).map(type => ({
    name: type,
    value: hostTypes[type]
  }));

  // Colors for pie charts
  const CHART_COLORS = ['#0d9488', '#0ea5e9', '#f59e0b', '#ef4444', '#10b981'];

  // Filter certificates based on search
  const filteredCertificates = certificates.filter(cert =>
    cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.algorithm.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter hosts based on search
  const filteredHosts = hosts.filter(host =>
    host.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    host.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    host.os.toLowerCase().includes(searchTerm.toLowerCase()) ||
    host.ipAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search inventory..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md hover:bg-slate-50">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <FileKey className="h-5 w-5 text-crypto-teal" />
              Certificate Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={certificatesChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {certificatesChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-crypto-light-blue" />
              Host Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hostsChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {hostsChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cryptographic Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="certificates">
            <TabsList className="mb-4">
              <TabsTrigger value="certificates" className="flex items-center gap-2">
                <FileKey className="h-4 w-4" />
                Certificates & Keys
              </TabsTrigger>
              <TabsTrigger value="hosts" className="flex items-center gap-2">
                <Server className="h-4 w-4" />
                Hosts
              </TabsTrigger>
            </TabsList>
            
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
                    {filteredCertificates.map((cert) => (
                      <tr key={cert.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium text-crypto-blue">{cert.name}</td>
                        <td className="py-3 px-4 text-slate-600">{cert.type}</td>
                        <td className="py-3 px-4 text-slate-600">{cert.algorithm}</td>
                        <td className="py-3 px-4 text-center text-slate-600">{cert.keySize} bits</td>
                        <td className="py-3 px-4 text-center text-slate-600">{cert.hosts.length}</td>
                        <td className="py-3 px-4 text-center">
                          {cert.vulnerabilities > 0 ? (
                            <span className="flex items-center justify-center gap-1">
                              <Shield className="h-4 w-4 text-crypto-red" />
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
                    {filteredHosts.map((host) => (
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

export default Inventory;
