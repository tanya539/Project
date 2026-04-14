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
  origin: "*"
}));
app.use(express.json());

const violations = [];
const logs = [];

let stats = {
  securityScore: 0,
  totalViolations: 0,
  activeViolations: 0,
  compliancePercentage: 0,
  lastScan: null,
};

let frameworks = [];
let architecture = {
  components: [],
  controlFlow: [],
};
let posture = {
  score: 0,
  trend: "0%",
  lastUpdated: null,
  categories: [],
};
let guardrailsData = {
  scps: [],
  configRules: [],
};

let industryDataConfig = null;

function normalizeArray(input) {
  if (Array.isArray(input)) return input;
  if (typeof input === 'string') return input.split(/[,;|]/).map(v => v.trim()).filter(Boolean);
  return [];
}

function mapComplianceControls(controls) {
  const mapped = new Set();

  controls.forEach((control) => {
    const normalized = String(control || "").toUpperCase();
    if (/PCI/.test(normalized)) mapped.add("PCI DSS");
    else if (/HIPAA/.test(normalized)) mapped.add("HIPAA");
    else if (/GDPR/.test(normalized)) mapped.add("GDPR");
    else if (/CCPA/.test(normalized)) mapped.add("CCPA");
    else if (/NIST/.test(normalized)) mapped.add("NIST");
    else if (/CIS/.test(normalized)) mapped.add("SOC 2");
    else if (/ORG-/.test(normalized)) mapped.add("ISO 27001");
  });

  return Array.from(mapped).length ? Array.from(mapped) : ["NIST"];
}

function extractLogsFromPayload(payload) {
  if (!payload) return null;
  if (Array.isArray(payload)) return payload;

  const candidateKeys = ["logs", "Records", "records", "Events", "events", "cloudtrailEvents"];
  for (const key of candidateKeys) {
    if (Array.isArray(payload[key])) return payload[key];
  }

  return null;
}

function deriveIndustryDataFromLogs(logs) {
  if (!Array.isArray(logs) || logs.length === 0) return null;

  const services = new Set();
  const complianceControls = [];
  const ouLevels = new Set();
  let highestRisk = 1;
  let containsSensitive = false;

  logs.forEach((entry) => {
    if (entry.service) services.add(String(entry.service));
    if (entry.ou_level || entry.ouLevel) ouLevels.add(String(entry.ou_level ?? entry.ouLevel));
    if (entry.compliance_control || entry.complianceControl) {
      complianceControls.push(String(entry.compliance_control ?? entry.complianceControl));
    }

    const actionText = `${entry.action || ""} ${entry.scenario || ""}`.toLowerCase();
    if (/delete|disable|stop|unsecure|unencrypted|public|open|root|replicate|export|remove|weaken/.test(actionText)) {
      highestRisk = Math.max(highestRisk, 3);
    } else if (/create|update|attach|put|modify/.test(actionText)) {
      highestRisk = Math.max(highestRisk, 2);
    }

    if (/PII|PHI|personal|sensitive|payment/.test(actionText) || /PII|PHI/.test(String(entry.compliance_control || entry.complianceControl))) {
      containsSensitive = true;
    }
  });

  const industry = services.has("CloudTrail") || services.has("S3") || services.has("IAM") ? "technology" : services.has("GuardDuty") ? "security" : "technology";
  const companySize = logs.length > 40 ? "enterprise" : logs.length > 15 ? "mid-market" : "smb";
  const accountCount = Math.max(1, Math.min(100, Math.ceil((ouLevels.size || 1) * 2)));

  return {
    industry,
    companySize,
    accountCount,
    dataClassification: containsSensitive ? ["Confidential"] : ["Internal"],
    riskLevel: highestRisk === 3 ? "critical" : highestRisk === 2 ? "high" : "medium",
    compliance: mapComplianceControls(complianceControls),
    notes: `Imported ${logs.length} audit log records and derived security posture.`,
  };
}

function generateDashboardData(config) {
  const riskScoreMap = {
    low: 88,
    medium: 72,
    high: 55,
    critical: 38,
  };

  const baseScore = riskScoreMap[config.riskLevel] ?? 60;
  const complianceBonus = Math.min(20, (config.compliance?.length || 0) * 4);
  const securityScore = Math.min(100, Math.max(20, baseScore + complianceBonus));
  const compliancePercentage = config.compliance?.length ? Math.min(100, 40 + config.compliance.length * 10) : 0;

  const scoreCategory = (value) => {
    if (value >= 90) return "Excellent";
    if (value >= 75) return "Good";
    if (value >= 60) return "Needs Attention";
    return "Action Required";
  };

  const categories = [
    {
      name: "Encryption at Rest",
      score: config.dataClassification?.includes("PII") || config.dataClassification?.includes("PHI") ? 92 : 100,
      status: scoreCategory(config.dataClassification?.includes("PII") || config.dataClassification?.includes("PHI") ? 92 : 100),
    },
    {
      name: "Network Security",
      score: config.industry === "finance" || config.industry === "healthcare" ? 82 : 92,
      status: scoreCategory(config.industry === "finance" || config.industry === "healthcare" ? 82 : 92),
    },
    {
      name: "Access Management",
      score: config.riskLevel === "critical" ? 58 : config.riskLevel === "high" ? 72 : 84,
      status: scoreCategory(config.riskLevel === "critical" ? 58 : config.riskLevel === "high" ? 72 : 84),
    },
    {
      name: "Monitoring & Logging",
      score: config.compliance?.length ? 88 : 78,
      status: scoreCategory(config.compliance?.length ? 88 : 78),
    },
    {
      name: "Compliance",
      score: compliancePercentage,
      status: scoreCategory(compliancePercentage),
    },
  ];

  const frameworksData = normalizeArray(config.compliance).map((fw) => {
    const status = securityScore >= 70 ? "Compliant" : "Action Required";
    const isCompliant = status === "Compliant";
    return {
      name: fw,
      status,
      controlsPassed: isCompliant ? Math.floor(Math.random() * 20 + 80) : Math.floor(Math.random() * 20 + 50),
      controlsTotal: 100,
      color: isCompliant ? "text-emerald-500" : "text-amber-500",
      bg: isCompliant ? "bg-emerald-50" : "bg-amber-50",
      border: isCompliant ? "border-emerald-200" : "border-amber-200",
    };
  });

  const scps = [
    {
      name: "DENY-ROOT-ACCESS",
      description: "Blocks all root account API activity across member accounts.",
    },
    {
      name: "DENY-S3-PUBLIC-ACL",
      description: "Prevents setting public ACLs on any S3 bucket across the organization.",
    },
    {
      name: "DENY-UNENCRYPTED-EBS",
      description: "Blocks launch of EC2 instances with unencrypted EBS volumes.",
    },
  ];

  if (config.compliance?.includes("PCI DSS") || config.industry === "finance") {
    scps.push({
      name: "DENY-INSECURE-PAYMENT-ROUTES",
      description: "Prevents unencrypted payment transaction flows.",
    });
  }

  if (config.compliance?.includes("HIPAA") || config.industry === "healthcare") {
    scps.push({
      name: "DENY-PHI-EXFILTRATION",
      description: "Prevents export of PHI data from protected stores.",
    });
  }

  const configRules = [
    {
      name: "S3_BUCKET_SSL_REQUESTS_ONLY",
      status: config.compliance?.includes("PCI DSS") ? "COMPLIANT" : "NON_COMPLIANT",
    },
    {
      name: "CLOUDTRAIL_ENABLED",
      status: config.compliance?.length ? "COMPLIANT" : "NON_COMPLIANT",
    },
    {
      name: "ENCRYPTED_VOLUMES",
      status: config.dataClassification?.length ? "COMPLIANT" : "NON_COMPLIANT",
    },
    {
      name: "INCOMING_SSH_DISABLED",
      status: config.riskLevel === "critical" ? "NON_COMPLIANT" : "COMPLIANT",
    },
  ];

  const architectureData = {
    components: [
      {
        id: "accounts",
        name: "AWS Accounts",
        description: (config.companySize || "Organization") + " account structure with security, log archive, and shared services.",
        icon: "Layout",
        color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      },
      {
        id: "iam",
        name: "Identity & Access",
        description: "Least-privilege IAM roles and policy boundaries.",
        icon: "Key",
        color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      },
      {
        id: "guardrails",
        name: "Guardrails",
        description: "SCPs and AWS Config rules enforcing policy.",
        icon: "Shield",
        color: "bg-rose-500/20 text-rose-400 border-rose-500/30",
      },
      {
        id: "monitoring",
        name: "Monitoring",
        description: "CloudTrail and GuardDuty events centralized for analysis.",
        icon: "Activity",
        color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
      },
    ],
    controlFlow: [
      "Resources are assessed against policy guardrails during provisioning.",
      "AWS Config and GuardDuty monitor security posture continuously.",
      "Violations trigger automated remediation and audit logging.",
      "Security score is recalculated after each assessment.",
    ],
  };

  const postureData = {
    score: securityScore,
    trend: securityScore >= 80 ? "+2%" : "+1%",
    lastUpdated: new Date().toISOString(),
    categories,
  };

  const guardrails = {
    scps,
    configRules,
  };

  const statsData = {
    totalAccounts: config.accountCount,
    activeResources: config.accountCount * 24,
    securityScore,
    totalViolations: 0,
    activeViolations: 0,
    compliancePercentage,
    frameworksActive: config.compliance?.length || 0,
    lastScan: new Date().toISOString(),
  };

  return {
    stats: statsData,
    frameworks: frameworksData,
    architecture: architectureData,
    posture: postureData,
    guardrails,
  };
}

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
          id: 'l' + (logs.length + 1),
          message: 'Lambda automatically remediated issue: ' + violation.type,
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
  res.json(guardrailsData);
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
    id: 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    type: randomType.type,
    severity: randomType.severity,
    status: "Detected",
    timestamp: new Date().toISOString(),
  };

  violations.push(newViolation);
  logs.push({
    id: 'l' + (logs.length + 1),
    message: 'Security violation detected: ' + newViolation.type,
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, violation: newViolation });
});

// Industry data analysis endpoint
let industryDataResults = null;

const handleIndustryData = (req, res) => {
  let industryDataPayload = req.body;
  let derivedConfig = null;

  const extractedLogs = extractLogsFromPayload(industryDataPayload);
  if (extractedLogs) {
    derivedConfig = deriveIndustryDataFromLogs(extractedLogs);
  }

  if (derivedConfig) {
    industryDataPayload = derivedConfig;
  }

  const {
    industry,
    companySize,
    accountCount,
    dataClassification,
    riskLevel,
    compliance,
    notes,
  } = industryDataPayload;

  if (!industry || !companySize || !riskLevel || !Number.isFinite(accountCount) || accountCount <= 0) {
    return res.status(400).json({ success: false, message: "Missing or invalid required fields" });
  }

  industryDataConfig = {
    industry,
    companySize,
    accountCount,
    dataClassification: Array.isArray(dataClassification) ? dataClassification : normalizeArray(dataClassification),
    riskLevel,
    compliance: Array.isArray(compliance) ? compliance : normalizeArray(compliance),
    notes: notes || "",
    timestamp: new Date().toISOString(),
  };

  const recommendations = generateGuardrailRecommendations(industryDataConfig);
  const generated = generateDashboardData(industryDataConfig);

  stats = generated.stats;
  frameworks = generated.frameworks;
  architecture = generated.architecture;
  posture = generated.posture;
  guardrailsData = generated.guardrails;

  industryDataResults = {
    config: industryDataConfig,
    recommendations,
    generated,
  };

  logs.push({
    id: 'l' + (logs.length + 1),
    message: 'Industry data imported for ' + industry + ' / ' + companySize + ' with ' + accountCount + ' accounts.',
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, data: industryDataConfig, recommendations, generated });
};

app.post('/api/industry-data', handleIndustryData);
// Backward-compatible endpoint for older clients still posting to /analyze.
app.post('/analyze', handleIndustryData);

app.get('/api/industry-data', (req, res) => {
  if (!industryDataConfig) {
    return res.status(404).json({ success: false, message: "No industry data configured" });
  }
  res.json({ config: industryDataConfig, generated: industryDataResults?.generated ?? null, recommendations: industryDataResults?.recommendations ?? null });
});

function generateGuardrailRecommendations(config) {
  const recommendations = {
    preventive: [],
    detective: [],
    responsive: [],
  };

  if (config.riskLevel === 'critical' || config.riskLevel === 'high') {
    recommendations.preventive.push("Enable MFA enforcement for all IAM principals");
    recommendations.preventive.push("Apply least-privilege IAM policies everywhere");
    recommendations.detective.push("Enable AWS Config for continuous compliance monitoring");
    recommendations.responsive.push("Configure automated Lambda remediation flows");
  }

  if (config.industry === "finance" || config.industry === "healthcare") {
    recommendations.preventive.push("Encrypt all data at rest and in transit");
    recommendations.preventive.push("Segment networks with private subnets");
    recommendations.detective.push("Enable GuardDuty for threat detection");
    recommendations.detective.push("Enforce AWS Config rules for sensitive workloads");
  }

  config.compliance.forEach(fw => {
    if (fw === "PCI DSS") {
      recommendations.preventive.push("Enforce encryption for payment card data");
      recommendations.detective.push("Enable VPC Flow Logs for transaction monitoring");
    }
    if (fw === "HIPAA") {
      recommendations.preventive.push("Enable HIPAA-eligible encryption for PHI stores");
      recommendations.preventive.push("Enable audit logging for PHI access");
    }
    if (fw === "GDPR") {
      recommendations.preventive.push("Implement data residency controls and access logging");
      recommendations.detective.push("Enable CloudTrail for data access events");
    }
  });

  if (config.dataClassification.includes("PII") || config.dataClassification.includes("PHI")) {
    recommendations.preventive.push("Block public S3 bucket access for sensitive data");
    recommendations.detective.push("Enable Amazon Macie for sensitive data discovery");
    recommendations.responsive.push("Implement automated data redaction for logs");
  }

  return {
    summary: 'Security posture recommendations for ' + config.industry + ' (' + config.companySize + ')',
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