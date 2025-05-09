
import React, { useState } from 'react';
import { Code2, Search, FileCode, AlertTriangle, ChevronRight } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const Libraries = () => {
  const { libraries, isLoading } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crypto-teal mx-auto"></div>
          <p className="mt-4 text-crypto-blue">Loading library data...</p>
        </div>
      </div>
    );
  }

  // Filter libraries based on search
  const filteredLibraries = libraries.filter(lib =>
    lib.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lib.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lib.version.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group libraries by language
  const languageGroups = libraries.reduce((acc: Record<string, number>, lib) => {
    acc[lib.language] = (acc[lib.language] || 0) + 1;
    return acc;
  }, {});

  // Prepare chart data
  const chartData = Object.keys(languageGroups).map(language => ({
    name: language,
    count: languageGroups[language]
  }));

  // Map languages to colors
  const languageColors: Record<string, string> = {
    'JavaScript': '#f7df1e',
    'Python': '#3776ab',
    'Java': '#007396',
    'C/C++': '#00599c',
    'Go': '#00add8',
    'Ruby': '#cc342d'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold text-crypto-blue">Cryptographic Libraries & Languages</h2>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search libraries..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-crypto-teal" />
              Programming Languages Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  barSize={60}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="count" 
                    fill="#0d9488"
                    name="Libraries"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vulnerability Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col p-4 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Total Libraries</span>
                  <span className="text-2xl font-bold text-crypto-blue">{libraries.length}</span>
                </div>
              </div>

              <div className="flex flex-col p-4 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Vulnerable Libraries</span>
                  <span className="text-2xl font-bold text-crypto-yellow">
                    {libraries.filter(lib => lib.vulnerabilities > 0).length}
                  </span>
                </div>
              </div>

              <div className="flex flex-col p-4 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Critical Vulnerabilities</span>
                  <span className="text-2xl font-bold text-crypto-red">2</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-crypto-teal/10 border border-crypto-teal/20">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-crypto-teal/20 p-2">
                    <AlertTriangle className="h-5 w-5 text-crypto-teal" />
                  </div>
                  <div>
                    <h3 className="font-medium text-crypto-blue mb-1">AI Recommendation</h3>
                    <p className="text-sm text-slate-600">Update OpenSSL to version 3.0.3 to address critical vulnerabilities.</p>
                    <button className="mt-2 text-sm text-crypto-teal flex items-center gap-1 hover:underline">
                      View Details
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Library Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium">Library</th>
                  <th className="text-left py-3 px-4 font-medium">Version</th>
                  <th className="text-left py-3 px-4 font-medium">Language</th>
                  <th className="text-center py-3 px-4 font-medium">Usage Count</th>
                  <th className="text-center py-3 px-4 font-medium">Vulnerabilities</th>
                  <th className="text-left py-3 px-4 font-medium">Hosts</th>
                </tr>
              </thead>
              <tbody>
                {filteredLibraries.map((lib) => (
                  <tr key={lib.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-crypto-blue">{lib.name}</td>
                    <td className="py-3 px-4 text-slate-600">{lib.version}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: languageColors[lib.language] || '#64748b' }}
                        ></div>
                        <span>{lib.language}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600">{lib.usageCount}</td>
                    <td className="py-3 px-4 text-center">
                      {lib.vulnerabilities > 0 ? (
                        <div className="flex items-center justify-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-crypto-red" />
                          <span className="font-medium text-crypto-red">{lib.vulnerabilities}</span>
                        </div>
                      ) : (
                        <span className="text-crypto-green">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {lib.hosts.map((host, idx) => (
                          <Badge key={idx} variant="outline" className="bg-slate-100">
                            {host}
                          </Badge>
                        ))}
                      </div>
                    </td>
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

export default Libraries;
