const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false
}));
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://127.0.0.1:8080'],
  credentials: true
}));
app.use(express.json());

// Mock data
const violations = [
  {
    id: "v1",
    type: "Public S3 Bucket (Sensitive Data)",
    severity: "High",
    status: "Auto-Fixed",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "v2",
    type: "IAM Over-permission (AdminAccess)",
    severity: "Medium",
    status: "Auto-Fixed",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "v3",
    type: "Insecure SG Rule (0.0.0.0/0)",
    severity: "High",
    status: "Auto-Fixed",
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

const logs = [
  {
    id: "l1",
    message: "SCP Enforced: Denied unencrypted S3 bucket creation",
    timestamp: new Date(Date.now() - 5000).toISOString(),
  },
];

const stats = {
  securityScore: 92,
  totalViolations: 3,
  activeViolations: 0,
  compliancePercentage: 98,
  lastScan: new Date().toISOString(),
};

const frameworks = [
  { name: "CIS AWS Foundations Benchmark v3.0", status: "Compliant", controlsPassed: 43, controlsTotal: 43 },
  { name: "NIST SP 800-53 Rev. 5", status: "Action Required", controlsPassed: 112, controlsTotal: 115 },
  { name: "SOC 2 Type II", status: "Compliant", controlsPassed: 64, controlsTotal: 64 },
  { name: "ISO/IEC 27001:2022", status: "Compliant", controlsPassed: 114, controlsTotal: 114 },
  { name: "PCI DSS v4.0", status: "Evaluating", controlsPassed: 0, controlsTotal: 0 },
];

const architecture = {
  components: [
    {
      id: "accounts",
      name: "AWS Accounts",
      description: "Master, Security, Log Archive",
      icon: "Layout",
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
    {
      id: "iam",
      name: "Identity & Access",
      description: "Least-privilege IAM Roles",
      icon: "Key",
      color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    },
    {
      id: "guardrails",
      name: "Guardrails",
      description: "SCP & AWS Config Rules",
      icon: "Shield",
      color: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    },
    {
      id: "monitoring",
      name: "Monitoring",
      description: "CloudTrail & GuardDuty",
      icon: "Activity",
      color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    },
    {
      id: "lambda",
      name: "Remediation",
      description: "Automated Lambda Fixes",
      icon: "Cpu",
      color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },
  ],
  controlFlow: [
    "Events are captured via CloudTrail and GuardDuty in member accounts.",
    "Guardrails (AWS Config) evaluate resources against compliance policies.",
    "Non-compliant resources trigger an EventBridge event for remediation.",
    "Lambda functions execute predefined remediation actions (e.g., closing ports).",
    "Logs are aggregated in the Central Log Archive for auditing.",
    "Security Score is recalculated in real-time based on posture."
  ]
};

const posture = {
  score: 92,
  trend: "+2%",
  lastUpdated: new Date().toISOString(),
  categories: [
    { name: "Encryption at Rest", score: 100, status: "Excellent" },
    { name: "Network Security", score: 95, status: "Good" },
    { name: "Access Management", score: 88, status: "Needs Attention" },
    { name: "Monitoring & Logging", score: 100, status: "Excellent" },
    { name: "Compliance", score: 90, status: "Good" }
  ]
};

// Routes
app.get('/api/violations', (req, res) => {
  res.json(violations);
});

app.patch('/api/violations', (req, res) => {
  const { id, status } = req.body;
  if (id && status) {
    const violation = violations.find(v => v.id === id);
    if (violation) {
      violation.status = status;
      if (status === "Auto-Fixed") {
        logs.push({
          id: `l${logs.length + 1}`,
          message: `Lambda automatically remediated issue: ${violation.type}`,
          timestamp: new Date().toISOString(),
        });
      }
      res.json({ success: true, stats });
    } else {
      res.status(404).json({ success: false, message: "Violation not found" });
    }
  } else {
    res.status(400).json({ success: false, message: "Invalid request" });
  }
});

app.get('/api/logs', (req, res) => {
  res.json(logs);
});

app.get('/api/stats', (req, res) => {
  res.json(stats);
});

app.get('/api/compliance', (req, res) => {
  res.json(frameworks);
});

app.get('/api/architecture', (req, res) => {
  res.json(architecture);
});

app.get('/api/posture', (req, res) => {
  res.json(posture);
});

app.get('/api/guardrails', (req, res) => {
  res.json({
    scps: [
      { name: "DENY-ROOT-ACCESS", description: "Blocks all root account API activity across member accounts." },
      { name: "DENY-REGION-RESTRICTION", description: "Restricts resource creation to approved AWS regions only." },
      { name: "DENY-S3-PUBLIC-ACL", description: "Prevents setting public ACLs on any S3 bucket across the org." },
      { name: "DENY-UNENCRYPTED-EBS", description: "Blocks launch of EC2 instances with unencrypted EBS volumes." },
      { name: "DENY-DISABLE-GUARDDUTY", description: "Prevents any principal from disabling GuardDuty in any account." }
    ],
    configRules: [
      { name: "S3_BUCKET_SSL_REQUESTS_ONLY", status: "COMPLIANT" },
      { name: "CLOUDTRAIL_ENABLED", status: "COMPLIANT" },
      { name: "ENCRYPTED_VOLUMES", status: "COMPLIANT" },
      { name: "INCOMING_SSH_DISABLED", status: "NON_COMPLIANT" }
    ]
  });
});

app.post('/api/simulate', (req, res) => {
  const violationTypes = [
    { type: "Public S3 Bucket", severity: "High" },
    { type: "IAM Over-permission", severity: "High" },
    { type: "Open Port 22 (SSH)", severity: "Medium" },
    { type: "Unencrypted EBS Volume", severity: "Medium" },
    { type: "MFA Not Enabled on Root", severity: "High" },
  ];

  const randomType = violationTypes[Math.floor(Math.random() * violationTypes.length)];

  const newViolation = {
    id: `v_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    type: randomType.type,
    severity: randomType.severity,
    status: "Detected",
    timestamp: new Date().toISOString(),
  };

  violations.push(newViolation);
  logs.push({
    id: `l${logs.length + 1}`,
    message: `Security violation detected: ${newViolation.type}`,
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, violation: newViolation });
});

// Industry data analysis endpoint
let industryDataConfig = null;

app.post('/api/industry-data', (req, res) => {
  const { industry, companySize, accountCount, dataClassification, riskLevel, compliance, notes } = req.body;

  if (!industry || !companySize) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  industryDataConfig = {
    industry,
    companySize,
    accountCount,
    dataClassification,
    riskLevel,
    compliance,
    notes,
    timestamp: new Date().toISOString(),
  };

  // Generate industry-specific guardrail recommendations
  const recommendations = generateGuardrailRecommendations(industryDataConfig);

  logs.push({
    id: `l${logs.length + 1}`,
    message: `Industry data ingested: ${industry}/${companySize}. Analyzing ${accountCount} account(s).`,
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, data: industryDataConfig, recommendations });
});

// Get industry data configuration
app.get('/api/industry-data', (req, res) => {
  if (!industryDataConfig) {
    return res.status(404).json({ success: false, message: "No industry data configured" });
  }
  res.json(industryDataConfig);
});

// Generate guardrail recommendations based on industry data
function generateGuardrailRecommendations(config) {
  const recommendations = {
    preventive: [],
    detective: [],
    responsive: [],
  };

  // Risk-based recommendations
  if (config.riskLevel === 'critical' || config.riskLevel === 'high') {
    recommendations.preventive.push("Enable MFA enforcement for all IAM principals");
    recommendations.preventive.push("Restrict access to sensitive resources with least-privilege IAM");
    recommendations.detective.push("Enable AWS Config for continuous compliance monitoring");
    recommendations.responsive.push("Configure automatic remediation Lambda functions");
  }

  // Industry-specific recommendations
  if (config.industry === "finance" || config.industry === "healthcare") {
    recommendations.preventive.push("Enable encryption at rest for all data stores");
    recommendations.preventive.push("Implement network segmentation and VPC isolation");
    recommendations.detective.push("Enable GuardDuty for threat detection");
    recommendations.detective.push("Enable AWS Config rule for PCI compliance");
  }

  // Compliance framework recommendations
  config.compliance.forEach(fw => {
    if (fw === "PCI DSS") {
      recommendations.preventive.push("Enforce encryption for payment card data");
      recommendations.detective.push("Enable VPC Flow Logs for network monitoring");
    }
    if (fw === "HIPAA") {
      recommendations.preventive.push("Enable HIPAA-eligible encryption");
      recommendations.preventive.push("Enable audit logging for PHI access");
    }
    if (fw === "GDPR") {
      recommendations.preventive.push("Implement data residency controls");
      recommendations.detective.push("Enable AWS CloudTrail for data access logs");
    }
  });

  // Data classification recommendations
  if (config.dataClassification.includes("PII") || config.dataClassification.includes("PHI")) {
    recommendations.preventive.push("Block public S3 bucket access");
    recommendations.detective.push("Enable Amazon Macie for sensitive data discovery");
    recommendations.responsive.push("Implement automated data redaction for logs");
  }

  return {
    summary: `Security posture recommendations for ${config.industry} (${config.companySize})`,
    recommendations,
    appliedAt: new Date().toISOString(),
  };
}

// Root health / info endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Secure Cloud backend API server',
    endpoints: [
      '/api/violations',
      '/api/logs',
      '/api/stats',
      '/api/compliance',
      '/api/architecture',
      '/api/posture',
      '/api/guardrails',
      '/api/simulate',
      '/api/industry-data',
    ],
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});