
import React, { useState } from 'react';
import { Search, Filter, FileKey, Shield, Server, Lightbulb } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { useToast } from '@/hooks/use-toast';

const Inventory = () => {
  const { certificates, hosts, isLoading } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const { toast } = useToast();
  
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

  const getAiRecommendation = (asset: any, type: 'certificate' | 'host') => {
    if (type === 'certificate') {
      if (asset.isExpired) {
        return "This certificate has expired. Urgent action required: Generate a new certificate using a modern algorithm like ECDSA with P-256 curve, implement auto-renewal with a service like Let's Encrypt, and update all dependencies.";
      } else if (asset.algorithm === 'RSA' && asset.keySize < 3072) {
        return "The RSA key size is below the recommended 3072 bits. Consider upgrading to ECDSA (P-256) for better security and performance or increase RSA key size to at least 3072 bits for sensitive data.";
      } else if (asset.algorithm === 'HMAC' && asset.keySize < 256) {
        return "HMAC key size is below recommended security levels. Increase key size to at least 256 bits and implement a key rotation policy with automatic updates.";
      } else if (asset.vulnerabilities > 0) {
        return `Found ${asset.vulnerabilities} potential security ${asset.vulnerabilities === 1 ? 'issue' : 'issues'} with this certificate. Check the Vulnerabilities tab for detailed information and remediation steps.`;
      }
      return "No immediate issues detected. Follow best practices by implementing regular key rotation and monitoring for algorithm deprecation notices.";
    } else {
      // Host recommendations
      const lastScanDate = new Date(asset.lastScan);
      const today = new Date();
      const daysDifference = Math.floor((today.getTime() - lastScanDate.getTime()) / (1000 * 3600 * 24));
      
      if (daysDifference > 7) {
        return `Last cryptographic scan was ${daysDifference} days ago. It's recommended to scan at least weekly for critical infrastructure. Schedule an automated scan now.`;
      } else if (asset.type === 'Container') {
        return "For containerized environments, ensure ephemeral secrets are properly managed. Use a secrets management solution like HashiCorp Vault or Kubernetes Secrets, and implement secrets rotation on container recreation.";
      } else if (asset.os.includes('Ubuntu') || asset.os.includes('CentOS')) {
        return `Ensure ${asset.os} is updated with the latest security patches. Implement automated vulnerability scanning for cryptographic libraries and configure automated updates for security patches.`;
      }
      return "Apply defense-in-depth strategies by implementing regular cryptographic inventory audits, secret scanning in CI/CD pipelines, and runtime protection.";
    }
  };

  const handleShowRecommendation = (asset: any, type: 'certificate' | 'host') => {
    setSelectedAsset({
      ...asset,
      type,
      recommendation: getAiRecommendation(asset, type)
    });
  };

  const handleApplyRecommendation = () => {
    toast({
      title: "Remediation plan created",
      description: "The AI-recommended remediation plan has been added to your tasks",
    });
    setSelectedAsset(null);
  };

  return (
    <div className="space-y-6">
      {selectedAsset && (
        <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-crypto-teal" />
                AI Remediation Recommendation
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex flex-col space-y-1.5">
                <h3 className="font-semibold text-lg">Asset Details</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedAsset.type === 'certificate' ? (
                    <>
                      <span className="font-medium">{selectedAsset.name}</span> - {selectedAsset.algorithm} {selectedAsset.keySize} bits
                    </>
                  ) : (
                    <>
                      <span className="font-medium">{selectedAsset.name}</span> - {selectedAsset.type}, {selectedAsset.os}
                    </>
                  )}
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  AI Analysis
                </h3>
                <Card className="border-crypto-teal/20 bg-crypto-teal/5">
                  <CardContent className="pt-6">
                    <p>{selectedAsset.recommendation}</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedAsset(null)}>Cancel</Button>
                <Button onClick={handleApplyRecommendation}>Apply Recommendation</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

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
                      <th className="text-center py-3 px-4 font-medium">Actions</th>
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
                        <td className="py-3 px-4 text-center">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="hover:bg-crypto-teal/10 text-crypto-teal"
                            onClick={() => handleShowRecommendation(cert, 'certificate')}
                          >
                            <Lightbulb className="h-4 w-4" />
                            <span className="sr-only">AI Recommendations</span>
                          </Button>
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
                      <th className="text-center py-3 px-4 font-medium">Actions</th>
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
                        <td className="py-3 px-4 text-center">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="hover:bg-crypto-teal/10 text-crypto-teal"
                            onClick={() => handleShowRecommendation(host, 'host')}
                          >
                            <Lightbulb className="h-4 w-4" />
                            <span className="sr-only">AI Recommendations</span>
                          </Button>
                        </td>
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
