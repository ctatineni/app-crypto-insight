
import React from 'react';
import { BarChart4, TrendingUp, Calendar } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const Analytics = () => {
  const { isLoading } = useAppContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crypto-teal mx-auto"></div>
          <p className="mt-4 text-crypto-blue">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  // Mock data for trend charts
  const timeSeriesData = [
    { month: 'Jan', vulnerabilities: 18, certificates: 10, expired: 2 },
    { month: 'Feb', vulnerabilities: 15, certificates: 11, expired: 1 },
    { month: 'Mar', vulnerabilities: 20, certificates: 12, expired: 3 },
    { month: 'Apr', vulnerabilities: 14, certificates: 12, expired: 2 },
    { month: 'May', vulnerabilities: 12, certificates: 15, expired: 1 },
    { month: 'Jun', vulnerabilities: 8, certificates: 15, expired: 0 },
    { month: 'Jul', vulnerabilities: 10, certificates: 14, expired: 1 },
    { month: 'Aug', vulnerabilities: 5, certificates: 16, expired: 0 },
    { month: 'Sep', vulnerabilities: 6, certificates: 16, expired: 0 },
    { month: 'Oct', vulnerabilities: 3, certificates: 18, expired: 0 },
    { month: 'Nov', vulnerabilities: 2, certificates: 18, expired: 0 },
    { month: 'Dec', vulnerabilities: 12, certificates: 20, expired: 3 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-crypto-blue">Security Analytics</h1>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-md p-2">
            <Calendar className="h-4 w-4 text-slate-500" />
            <span className="text-sm">Last 12 months</span>
          </div>
          <Button variant="outline" size="sm">Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-crypto-green" />
              Security Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Overall Score</span>
                <span className="text-lg font-bold text-crypto-green">+24%</span>
              </div>
              <p className="text-sm text-slate-500">
                Security posture improved 24% compared to last year due to proactive vulnerability management.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <BarChart4 className="h-5 w-5 text-crypto-blue" />
              Improvement Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-crypto-red"></div>
                <span className="text-sm text-slate-700">Certificate Management</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-crypto-yellow"></div>
                <span className="text-sm text-slate-700">Library Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-crypto-blue"></div>
                <span className="text-sm text-slate-700">Key Rotation</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-crypto-teal" />
              Key Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Avg. Resolution Time</span>
                <span className="text-sm font-medium">3.2 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Critical Vulnerabilities</span>
                <span className="text-sm font-medium text-crypto-red">4 open</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Certificates Expiring (30d)</span>
                <span className="text-sm font-medium text-crypto-yellow">6</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>12-Month Security Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timeSeriesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="vulnerabilities" 
                  name="Vulnerabilities"
                  stroke="#ef4444" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="certificates" 
                  name="Certificates"
                  stroke="#0ea5e9" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="expired" 
                  name="Expired Certs"
                  stroke="#f59e0b" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-medium text-crypto-blue mb-2">Vulnerability Reduction Trend</h3>
              <p className="text-slate-700">
                The system has detected a 37% reduction in vulnerabilities over the past 6 months, primarily due to the consistent patching of OpenSSL libraries and implementation of automated certificate renewal. Continue this practice to maintain the positive trend.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-medium text-crypto-blue mb-2">Certificate Management Improvement</h3>
              <p className="text-slate-700">
                Certificate expiration incidents have decreased by 85% since implementing automated renewal processes. The system recommends extending this automation to all remaining certificates to eliminate expiration risks completely.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-medium text-crypto-blue mb-2">Predicted Future Issues</h3>
              <p className="text-slate-700">
                Based on current usage patterns and industry trends, the AI predicts potential security issues with Node-Crypto library within the next 3 months. Consider evaluating alternative libraries or implementing additional security controls.
              </p>
            </div>
            
            <div className="p-4 border bg-crypto-teal/5 border-crypto-teal/20 rounded-lg">
              <h3 className="text-lg font-medium text-crypto-teal mb-2">AI Recommendation</h3>
              <p className="text-slate-700">
                To achieve optimal security posture, prioritize implementing a formal key rotation policy for all cryptographic assets. Based on the analysis, applications implementing regular key rotation have 76% fewer security incidents than those without such policies.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
