
import React, { useState } from 'react';
import { AlertTriangle, Search, Filter, X, ShieldAlert, ShieldCheck, ShieldQuestion, BarChart3 } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

type VulnerabilityType = {
  id: string;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  affected: string[];
  detected: string;
  remediation: string;
  aiRecommendation: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Accepted Risk';
};

type VulnerabilityDetailProps = {
  vulnerability: VulnerabilityType;
  onClose: () => void;
};

// Vulnerability detail component
const VulnerabilityDetail = ({ vulnerability, onClose }: VulnerabilityDetailProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{vulnerability.title}</DialogTitle>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge 
              className={`
                ${vulnerability.severity === 'Critical' ? 'bg-crypto-red hover:bg-crypto-red' :
                vulnerability.severity === 'High' ? 'bg-crypto-yellow hover:bg-crypto-yellow' :
                vulnerability.severity === 'Medium' ? 'bg-yellow-500 hover:bg-yellow-500' : 
                'bg-crypto-green hover:bg-crypto-green'}
              `}
            >
              {vulnerability.severity}
            </Badge>
            <Badge 
              className={`
                ${vulnerability.status === 'Open' ? 'bg-slate-500 hover:bg-slate-500' :
                vulnerability.status === 'In Progress' ? 'bg-blue-500 hover:bg-blue-500' :
                vulnerability.status === 'Resolved' ? 'bg-crypto-green hover:bg-crypto-green' : 
                'bg-purple-500 hover:bg-purple-500'}
              `}
            >
              {vulnerability.status}
            </Badge>
            <span className="text-sm text-slate-500">Detected: {vulnerability.detected}</span>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-slate-700">{vulnerability.description}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Affected Assets</h3>
            <div className="flex flex-wrap gap-2">
              {vulnerability.affected.map(asset => (
                <Badge key={asset} variant="outline" className="bg-slate-100">
                  {asset}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Standard Remediation</h3>
            <p className="text-slate-700">{vulnerability.remediation}</p>
          </div>
          
          <Card className="border-crypto-teal/20 bg-crypto-teal/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-crypto-teal" />
                AI-Powered Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">{vulnerability.aiRecommendation}</p>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline">Mark as In Progress</Button>
            <Button>Resolve Vulnerability</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Vulnerabilities = () => {
  const { vulnerabilities, isLoading } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVulnerability, setSelectedVulnerability] = useState<VulnerabilityType | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string | null>(null);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crypto-teal mx-auto"></div>
          <p className="mt-4 text-crypto-blue">Loading vulnerability data...</p>
        </div>
      </div>
    );
  }

  // Filter vulnerabilities based on search term and filters
  const filteredVulnerabilities = vulnerabilities.filter(vuln => {
    const matchesSearch = 
      vuln.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vuln.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? vuln.status === statusFilter : true;
    const matchesSeverity = severityFilter ? vuln.severity === severityFilter : true;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  // Count vulnerabilities by severity
  const severityCounts = vulnerabilities.reduce((acc: Record<string, number>, vuln) => {
    acc[vuln.severity] = (acc[vuln.severity] || 0) + 1;
    return acc;
  }, {});

  // Prepare chart data
  const chartData = [
    { name: 'Critical', value: severityCounts['Critical'] || 0, fill: '#ef4444' },
    { name: 'High', value: severityCounts['High'] || 0, fill: '#f59e0b' },
    { name: 'Medium', value: severityCounts['Medium'] || 0, fill: '#f59e0b' },
    { name: 'Low', value: severityCounts['Low'] || 0, fill: '#10b981' },
  ];

  // Get severity icon based on severity level
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <AlertTriangle className="h-4 w-4 text-crypto-red" />;
      case 'High':
        return <ShieldAlert className="h-4 w-4 text-crypto-yellow" />;
      case 'Medium':
        return <ShieldQuestion className="h-4 w-4 text-yellow-500" />;
      case 'Low':
        return <ShieldCheck className="h-4 w-4 text-crypto-green" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {selectedVulnerability && (
        <VulnerabilityDetail 
          vulnerability={selectedVulnerability} 
          onClose={() => setSelectedVulnerability(null)} 
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card 
          className={`cursor-pointer hover:shadow-md transition-shadow ${!statusFilter ? 'ring-2 ring-crypto-teal' : ''}`}
          onClick={() => setStatusFilter(null)}
        >
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-slate-500">All Vulnerabilities</p>
              <p className="text-2xl font-bold">{vulnerabilities.length}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-slate-400" />
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer hover:shadow-md transition-shadow ${statusFilter === 'Open' ? 'ring-2 ring-crypto-teal' : ''}`}
          onClick={() => setStatusFilter(statusFilter === 'Open' ? null : 'Open')}
        >
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-slate-500">Open</p>
              <p className="text-2xl font-bold text-slate-600">
                {vulnerabilities.filter(v => v.status === 'Open').length}
              </p>
            </div>
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-200">
              <AlertTriangle className="h-5 w-5 text-slate-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer hover:shadow-md transition-shadow ${statusFilter === 'In Progress' ? 'ring-2 ring-crypto-teal' : ''}`}
          onClick={() => setStatusFilter(statusFilter === 'In Progress' ? null : 'In Progress')}
        >
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-slate-500">In Progress</p>
              <p className="text-2xl font-bold text-blue-500">
                {vulnerabilities.filter(v => v.status === 'In Progress').length}
              </p>
            </div>
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-100">
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer hover:shadow-md transition-shadow ${statusFilter === 'Resolved' ? 'ring-2 ring-crypto-teal' : ''}`}
          onClick={() => setStatusFilter(statusFilter === 'Resolved' ? null : 'Resolved')}
        >
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-slate-500">Resolved</p>
              <p className="text-2xl font-bold text-crypto-green">
                {vulnerabilities.filter(v => v.status === 'Resolved').length}
              </p>
            </div>
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-green-100">
              <ShieldCheck className="h-5 w-5 text-crypto-green" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Vulnerabilities by Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  barSize={60}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" background={{ fill: '#f1f5f9' }}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Severity Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button
                onClick={() => setSeverityFilter(severityFilter === 'Critical' ? null : 'Critical')}
                className={`flex items-center justify-between w-full p-3 rounded-lg border ${
                  severityFilter === 'Critical' ? 'border-crypto-red bg-crypto-red/10' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-crypto-red" />
                  <span className="font-medium">Critical</span>
                </div>
                <Badge className="bg-crypto-red">{severityCounts['Critical'] || 0}</Badge>
              </button>
              
              <button
                onClick={() => setSeverityFilter(severityFilter === 'High' ? null : 'High')}
                className={`flex items-center justify-between w-full p-3 rounded-lg border ${
                  severityFilter === 'High' ? 'border-crypto-yellow bg-crypto-yellow/10' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-crypto-yellow" />
                  <span className="font-medium">High</span>
                </div>
                <Badge className="bg-crypto-yellow">{severityCounts['High'] || 0}</Badge>
              </button>
              
              <button
                onClick={() => setSeverityFilter(severityFilter === 'Medium' ? null : 'Medium')}
                className={`flex items-center justify-between w-full p-3 rounded-lg border ${
                  severityFilter === 'Medium' ? 'border-yellow-500 bg-yellow-500/10' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldQuestion className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">Medium</span>
                </div>
                <Badge className="bg-yellow-500">{severityCounts['Medium'] || 0}</Badge>
              </button>
              
              <button
                onClick={() => setSeverityFilter(severityFilter === 'Low' ? null : 'Low')}
                className={`flex items-center justify-between w-full p-3 rounded-lg border ${
                  severityFilter === 'Low' ? 'border-crypto-green bg-crypto-green/10' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-crypto-green" />
                  <span className="font-medium">Low</span>
                </div>
                <Badge className="bg-crypto-green">{severityCounts['Low'] || 0}</Badge>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Vulnerability List</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search vulnerabilities..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
                {filteredVulnerabilities.map((vuln) => (
                  <tr 
                    key={vuln.id} 
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                    onClick={() => setSelectedVulnerability(vuln)}
                  >
                    <td className="py-3 px-4 font-medium text-crypto-blue">{vuln.title}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getSeverityIcon(vuln.severity)}
                        <span className={`
                          ${vuln.severity === 'Critical' ? 'text-crypto-red' :
                          vuln.severity === 'High' ? 'text-crypto-yellow' :
                          vuln.severity === 'Medium' ? 'text-yellow-500' : 
                          'text-crypto-green'}
                        `}>
                          {vuln.severity}
                        </span>
                      </div>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Vulnerabilities;
