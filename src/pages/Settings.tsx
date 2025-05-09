
import React from 'react';
import { Bell, Shield, Clock, Upload, Save, Users, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-crypto-blue">Settings</h1>

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Organization Name</label>
                <Input defaultValue="Acme Corporation" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Default Scanning Schedule</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <select className="w-full p-2 border border-slate-200 rounded-md">
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <Input type="time" defaultValue="02:00" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable AI-powered analysis</p>
                  <p className="text-sm text-slate-500">
                    Use AI to enhance vulnerability detection and provide recommendations
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-slate-500">
                    Toggle between light and dark themes
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="pt-4">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Data Retention Period</p>
                  <p className="text-sm text-slate-500">
                    How long to keep historical scan data
                  </p>
                </div>
                <select className="p-2 border border-slate-200 rounded-md">
                  <option>30 days</option>
                  <option>90 days</option>
                  <option>180 days</option>
                  <option>1 year</option>
                  <option>Forever</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Export Data</p>
                  <p className="text-sm text-slate-500">
                    Download all your security data
                  </p>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <Bell className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="font-medium">Critical Vulnerabilities</p>
                    <p className="text-sm text-slate-500">
                      Get notified about critical vulnerabilities
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <Clock className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="font-medium">Certificate Expiration</p>
                    <p className="text-sm text-slate-500">
                      Get notified before certificates expire
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="pl-8 mb-4">
                <label className="text-sm font-medium block mb-2">Notification Lead Time</label>
                <select className="p-2 border border-slate-200 rounded-md w-full">
                  <option>7 days before expiration</option>
                  <option>14 days before expiration</option>
                  <option>30 days before expiration</option>
                  <option>60 days before expiration</option>
                </select>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <RefreshCw className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="font-medium">Scan Completion</p>
                    <p className="text-sm text-slate-500">
                      Get notified when security scans complete
                    </p>
                  </div>
                </div>
                <Switch />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <Users className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="font-medium">Team Notifications</p>
                    <p className="text-sm text-slate-500">
                      Enable team-wide notifications
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="pt-4">
                <Button>Save Notification Settings</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notification Channels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-slate-500">
                    Send notifications via email
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Recipients</label>
                <Input defaultValue="security-team@example.com, admin@example.com" />
                <p className="text-xs text-slate-500">Separate email addresses with commas</p>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Slack Integration</p>
                  <p className="text-sm text-slate-500">
                    Send notifications to Slack
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <Shield className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-slate-500">
                      Add an extra layer of security
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div>
                <p className="font-medium mb-2">AI Security Level</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="ai-balanced" name="ai-security" defaultChecked />
                    <label htmlFor="ai-balanced">Balanced (Recommended)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="ai-strict" name="ai-security" />
                    <label htmlFor="ai-strict">Strict (More False Positives)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="ai-lenient" name="ai-security" />
                    <label htmlFor="ai-lenient">Lenient (Fewer False Positives)</label>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="font-medium">API Access</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-500">Enable API access to CryptoGuard</p>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">API Key</label>
                <div className="flex gap-2">
                  <Input type="password" defaultValue="sk_live_cryptoguard_api_key_12345" readOnly className="flex-1" />
                  <Button variant="outline" size="sm">Regenerate</Button>
                </div>
                <p className="text-xs text-slate-500">This key grants full access to the API</p>
              </div>
              
              <div className="pt-4">
                <Button>Save Security Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">CI/CD Integration</p>
                  <p className="text-sm text-slate-500">
                    Integrate cryptographic checks into your CI/CD pipeline
                  </p>
                </div>
                <div className="flex gap-2">
                  <Switch defaultChecked />
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">SIEM Integration</p>
                  <p className="text-sm text-slate-500">
                    Send security events to your SIEM system
                  </p>
                </div>
                <div className="flex gap-2">
                  <Switch />
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">Ticket System Integration</p>
                  <p className="text-sm text-slate-500">
                    Automatically create tickets for vulnerabilities
                  </p>
                </div>
                <div className="flex gap-2">
                  <Switch defaultChecked />
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Ticket System URL</label>
                <Input defaultValue="https://jira.example.com/webhook/crypto" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">API Token</label>
                <Input type="password" defaultValue="jira_api_token_12345" />
              </div>
              
              <div className="pt-4">
                <Button>Save Integration Settings</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Add New Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                  <img src="https://placeholder.svg" alt="GitHub" className="h-10 w-10 mb-2" />
                  <span>GitHub</span>
                </Button>
                <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                  <img src="https://placeholder.svg" alt="GitLab" className="h-10 w-10 mb-2" />
                  <span>GitLab</span>
                </Button>
                <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                  <img src="https://placeholder.svg" alt="Slack" className="h-10 w-10 mb-2" />
                  <span>Slack</span>
                </Button>
                <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                  <img src="https://placeholder.svg" alt="Microsoft Teams" className="h-10 w-10 mb-2" />
                  <span>Teams</span>
                </Button>
                <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                  <img src="https://placeholder.svg" alt="Jira" className="h-10 w-10 mb-2" />
                  <span>Jira</span>
                </Button>
                <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                  <Save className="h-10 w-10 mb-2" />
                  <span>Other</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
