
import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export type AppMetrics = {
  vulnerabilities: number;
  criticalVulnerabilities: number;
  certificates: number;
  expiredCertificates: number;
  cryptoLibraries: number;
  hosts: number;
};

export type AppData = {
  id: string;
  name: string;
  description: string;
  owner: string;
  lastScan: string;
  riskScore: number;
  metrics: AppMetrics;
};

export type Host = {
  id: string;
  name: string;
  type: 'VM' | 'Physical' | 'Container';
  os: string;
  ipAddress: string;
  lastScan: string;
};

export type Certificate = {
  id: string;
  name: string;
  type: string;
  algorithm: string;
  keySize: number;
  expires: string;
  isExpired: boolean;
  hosts: string[];
  vulnerabilities: number;
};

export type Library = {
  id: string;
  name: string;
  version: string;
  language: string;
  usageCount: number;
  vulnerabilities: number;
  hosts: string[];
};

export type Vulnerability = {
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

// Context type
type AppContextType = {
  apps: AppData[];
  currentApp: AppData | null;
  setCurrentApp: (app: AppData | null) => void;
  hosts: Host[];
  certificates: Certificate[];
  libraries: Library[];
  vulnerabilities: Vulnerability[];
  isLoading: boolean;
};

// Default context value
const defaultContextValue: AppContextType = {
  apps: [],
  currentApp: null,
  setCurrentApp: () => {},
  hosts: [],
  certificates: [],
  libraries: [],
  vulnerabilities: [],
  isLoading: true
};

// Create context
const AppContext = createContext<AppContextType>(defaultContextValue);

// Mock data generator
const generateMockData = () => {
  // Generate apps
  const mockApps: AppData[] = [
    {
      id: 'app-001',
      name: 'Banking Portal',
      description: 'Customer-facing banking application',
      owner: 'Financial Services Team',
      lastScan: '2025-05-08',
      riskScore: 86,
      metrics: {
        vulnerabilities: 12,
        criticalVulnerabilities: 3,
        certificates: 8,
        expiredCertificates: 1,
        cryptoLibraries: 4,
        hosts: 5
      }
    },
    {
      id: 'app-002',
      name: 'Payment Gateway',
      description: 'Transaction processing system',
      owner: 'Payments Team',
      lastScan: '2025-05-07',
      riskScore: 72,
      metrics: {
        vulnerabilities: 8,
        criticalVulnerabilities: 1,
        certificates: 12,
        expiredCertificates: 0,
        cryptoLibraries: 6,
        hosts: 8
      }
    },
    {
      id: 'app-003',
      name: 'Customer Data Platform',
      description: 'User data management system',
      owner: 'Data Team',
      lastScan: '2025-05-06',
      riskScore: 54,
      metrics: {
        vulnerabilities: 6,
        criticalVulnerabilities: 0,
        certificates: 5,
        expiredCertificates: 2,
        cryptoLibraries: 3,
        hosts: 4
      }
    },
    {
      id: 'app-004',
      name: 'Inventory Management',
      description: 'Product inventory tracking',
      owner: 'Operations Team',
      lastScan: '2025-05-09',
      riskScore: 32,
      metrics: {
        vulnerabilities: 4,
        criticalVulnerabilities: 0,
        certificates: 3,
        expiredCertificates: 0,
        cryptoLibraries: 2,
        hosts: 3
      }
    },
    {
      id: 'app-005',
      name: 'HR Portal',
      description: 'Human resources management',
      owner: 'HR Team',
      lastScan: '2025-05-05',
      riskScore: 28,
      metrics: {
        vulnerabilities: 3,
        criticalVulnerabilities: 0,
        certificates: 2,
        expiredCertificates: 0,
        cryptoLibraries: 1,
        hosts: 2
      }
    }
  ];

  // Generate hosts for app-001
  const mockHosts: Host[] = [
    {
      id: 'host-001',
      name: 'app-server-01',
      type: 'VM',
      os: 'Ubuntu 22.04 LTS',
      ipAddress: '10.0.1.15',
      lastScan: '2025-05-08'
    },
    {
      id: 'host-002',
      name: 'app-server-02',
      type: 'VM',
      os: 'Ubuntu 22.04 LTS',
      ipAddress: '10.0.1.16',
      lastScan: '2025-05-08'
    },
    {
      id: 'host-003',
      name: 'db-server-01',
      type: 'Physical',
      os: 'CentOS 8',
      ipAddress: '10.0.2.10',
      lastScan: '2025-05-07'
    },
    {
      id: 'host-004',
      name: 'cache-01',
      type: 'Container',
      os: 'Alpine Linux 3.16',
      ipAddress: '10.0.3.25',
      lastScan: '2025-05-08'
    },
    {
      id: 'host-005',
      name: 'auth-service',
      type: 'Container',
      os: 'Alpine Linux 3.16',
      ipAddress: '10.0.3.26',
      lastScan: '2025-05-08'
    }
  ];

  // Generate certificates
  const mockCertificates: Certificate[] = [
    {
      id: 'cert-001',
      name: 'banking-portal.example.com',
      type: 'TLS/SSL',
      algorithm: 'RSA',
      keySize: 2048,
      expires: '2025-12-31',
      isExpired: false,
      hosts: ['host-001', 'host-002'],
      vulnerabilities: 0
    },
    {
      id: 'cert-002',
      name: 'api.banking-portal.example.com',
      type: 'TLS/SSL',
      algorithm: 'ECDSA',
      keySize: 256,
      expires: '2025-11-15',
      isExpired: false,
      hosts: ['host-001'],
      vulnerabilities: 1
    },
    {
      id: 'cert-003',
      name: 'legacy-api-key',
      type: 'API Key',
      algorithm: 'HMAC',
      keySize: 128,
      expires: '2025-01-15',
      isExpired: true,
      hosts: ['host-003'],
      vulnerabilities: 2
    },
    {
      id: 'cert-004',
      name: 'jwt-signing-key',
      type: 'Signing Key',
      algorithm: 'RSA',
      keySize: 4096,
      expires: '2026-05-01',
      isExpired: false,
      hosts: ['host-004', 'host-005'],
      vulnerabilities: 0
    },
    {
      id: 'cert-005',
      name: 'cache-encryption-key',
      type: 'Encryption Key',
      algorithm: 'AES',
      keySize: 256,
      expires: '2026-01-01',
      isExpired: false,
      hosts: ['host-004'],
      vulnerabilities: 0
    }
  ];

  // Generate libraries
  const mockLibraries: Library[] = [
    {
      id: 'lib-001',
      name: 'OpenSSL',
      version: '3.0.1',
      language: 'C/C++',
      usageCount: 3,
      vulnerabilities: 2,
      hosts: ['host-001', 'host-002', 'host-003']
    },
    {
      id: 'lib-002',
      name: 'Bouncy Castle',
      version: '1.70',
      language: 'Java',
      usageCount: 2,
      vulnerabilities: 1,
      hosts: ['host-001', 'host-002']
    },
    {
      id: 'lib-003',
      name: 'PyOpenSSL',
      version: '22.0.0',
      language: 'Python',
      usageCount: 1,
      vulnerabilities: 0,
      hosts: ['host-003']
    },
    {
      id: 'lib-004',
      name: 'Node-Crypto',
      version: '1.1.0',
      language: 'JavaScript',
      usageCount: 2,
      vulnerabilities: 1,
      hosts: ['host-004', 'host-005']
    }
  ];

  // Generate vulnerabilities
  const mockVulnerabilities: Vulnerability[] = [
    {
      id: 'vuln-001',
      title: 'Weak RSA Key Size',
      description: 'Using RSA key sizes less than 3072 bits is not recommended for sensitive data protection.',
      severity: 'Medium',
      affected: ['cert-001'],
      detected: '2025-05-08',
      remediation: 'Generate new RSA keys with at least 3072 bits or consider using ECDSA.',
      aiRecommendation: 'Consider migrating from RSA 2048 to ECDSA P-256 or higher for better security and performance. This would require updating your TLS configuration and regenerating certificates.',
      status: 'Open'
    },
    {
      id: 'vuln-002',
      title: 'Expired Certificate',
      description: 'Certificate has expired and is no longer valid.',
      severity: 'Critical',
      affected: ['cert-003'],
      detected: '2025-05-07',
      remediation: 'Renew certificate immediately or replace with a new valid certificate.',
      aiRecommendation: 'The legacy API key has expired. Based on your system architecture, I recommend implementing certificate auto-renewal using a service like Let\'s Encrypt or transitioning to a JWT-based authentication system for your APIs.',
      status: 'In Progress'
    },
    {
      id: 'vuln-003',
      title: 'OpenSSL Vulnerability CVE-2025-0123',
      description: 'Buffer overflow vulnerability in OpenSSL 3.0.1 that could lead to remote code execution.',
      severity: 'Critical',
      affected: ['lib-001'],
      detected: '2025-05-07',
      remediation: 'Update OpenSSL to version 3.0.2 or later.',
      aiRecommendation: 'Urgent: Update OpenSSL to 3.0.3 immediately. This vulnerability is being actively exploited. A temporary mitigation is to disable TLSv1.1 protocol which isn\'t affected by this vulnerability until updates can be applied.',
      status: 'Open'
    },
    {
      id: 'vuln-004',
      title: 'Hardcoded Credentials',
      description: 'API keys hardcoded in application code.',
      severity: 'High',
      affected: ['lib-004'],
      detected: '2025-05-08',
      remediation: 'Move credentials to environment variables or a secure vault.',
      aiRecommendation: 'Implement HashiCorp Vault or AWS Secrets Manager to store API keys. Replace hardcoded values with runtime fetching of secrets. I can provide code examples for securely retrieving credentials at runtime.',
      status: 'Open'
    },
    {
      id: 'vuln-005',
      title: 'Insufficient Key Rotation',
      description: 'JWT signing keys are not being rotated regularly.',
      severity: 'Medium',
      affected: ['cert-004'],
      detected: '2025-05-07',
      remediation: 'Implement key rotation policy and procedures.',
      aiRecommendation: 'Implement a 90-day key rotation schedule for JWT signing keys. Use key identifiers in the JWT header to manage multiple active keys during rotation periods. This allows for a seamless transition without invalidating existing tokens immediately.',
      status: 'Open'
    }
  ];

  return {
    apps: mockApps,
    hosts: mockHosts,
    certificates: mockCertificates,
    libraries: mockLibraries,
    vulnerabilities: mockVulnerabilities
  };
};

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apps, setApps] = useState<AppData[]>([]);
  const [currentApp, setCurrentApp] = useState<AppData | null>(null);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Simulate data fetching on component mount
  useEffect(() => {
    const fetchData = async () => {
      // In a real app, this would be an API call
      setIsLoading(true);
      try {
        const data = generateMockData();
        setApps(data.apps);
        setHosts(data.hosts);
        setCertificates(data.certificates);
        setLibraries(data.libraries);
        setVulnerabilities(data.vulnerabilities);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        apps,
        currentApp,
        setCurrentApp,
        hosts,
        certificates,
        libraries,
        vulnerabilities,
        isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the context
export const useAppContext = () => useContext(AppContext);
