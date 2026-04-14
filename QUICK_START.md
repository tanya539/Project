# Quick Start Guide - Secure Cloud Landing Zone

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/tanya539/Project.git
cd Project
```

2. **Install dependencies**:
```bash
npm run install:all
```

3. **Start all services**:
```bash
npm start
```

Services will be available at:
- **Landing Page**: http://localhost:8080
- **Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 📋 Feature Overview

### Dashboard Home (`/dashboard`)
- Real-time security metrics
- Security score, violations, resources count
- Continuous security guardrails status
- Attack simulation button

### Security Posture (`/posture`)
- Deep-dive security analytics
- Category-based scores (Identity & Access, Data Protection, Infrastructure)
- Real-time trend charts
- Posture trend analysis

### Guardrails (`/guardrails`)
- Service Control Policies (SCPs) overview
- AWS Config rules status
- Enforcement status tracking
- Resource evaluation metrics

### Compliance (`/compliance`)
- Compliance framework mapping
- Controls passed/total tracking
- Compliance status for:
  - CIS AWS Foundations Benchmark
  - NIST SP 800-53
  - SOC 2 Type II
  - ISO/IEC 27001
  - PCI DSS

### Architecture (`/architecture`)
- AWS landing zone visualization
- Multi-account architecture overview
- Security component relationships
- Control flow documentation

### Threat Detection (`/violations`)
- Real-time security violations
- Severity assessment
- Auto-remediation status
- Violation history

### Audit Trail (`/logs`)
- Live CloudTrail events
- Lambda remediation logs
- System event streaming
- Event filtering and search

### **NEW - Industry Data Input** (`/data`)
Configure your organization to get tailored recommendations:

**Steps:**
1. Navigate to "Industry Data" in sidebar
2. Select your industry (Finance, Healthcare, TechCorp, etc.)
3. Choose company size (Startup, SMB, Mid-Market, Enterprise)
4. Enter number of AWS accounts
5. Select data classifications you use
6. Set risk level (Low, Medium, High, Critical)
7. Select compliance frameworks (PCI DSS, HIPAA, GDPR, etc.)
8. Add any additional notes
9. Click **Analyze Configuration**

**Result:** System generates industry-specific guardrail recommendations including:
- Preventive controls (Block, Prevent, Enforce)
- Detective controls (Monitor, Audit, Alert)
- Responsive controls (Remediate, Fix, Restore)

## 🔧 API Endpoints

### Dashboard APIs (Gateway through Next.js)
- `GET /api/stats` - Dashboard metrics
- `GET /api/violations` - Security violations
- `GET /api/logs` - Audit logs
- `GET /api/compliance` - Compliance frameworks
- `GET /api/architecture` - System architecture
- `GET /api/posture` - Security posture
- `GET /api/guardrails` - Guardrail details
- `POST /api/simulate` - Simulate security event
- `PATCH /api/violations` - Update violation status

### Industry Data API
- `POST /api/industry-data` - Submit organization profile
- `GET /api/industry-data` - Retrieve stored profile

## 🎯 Example: Testing Industry Data Analysis

1. Navigate to http://localhost:3000/data
2. Fill the form:
   - Industry: Finance
   - Company Size: Enterprise
   - AWS Accounts: 5
   - Data Classifications: PII, Financial Data
   - Risk Level: High
   - Compliance: PCI DSS, GDPR
   - Notes: Processing customer payment data

3. Click "Analyze Configuration"
4. System generates recommendations for financial compliance and PII protection

## 🛡️ Security Features

### Real-Time Monitoring
- Continuous violation detection
- Automatic violation remediation
- Live security scoring

### Compliance Automation
- Framework control mapping
- Automated audit logging
- Compliance status tracking

### Industry-Specific Analysis
- Financial industry guardrails
- Healthcare compliance controls
- Government security standards
- Manufacturing operational security

## 📊 Monitoring Dashboard

The dashboard provides:
- **Security Score**: Current overall security posture (0-100)
- **Active Violations**: Real-time threat count
- **Resource Protection**: Monitored AWS resources
- **Guardrail Coverage**: Deployed preventive/detective controls

## 🔄 Development Mode

For development with hot reload:
```bash
npm run dev
```

Individual services:
```bash
npm run dev:landing   # Landing page
npm run dev:frontend  # Dashboard
npm run dev:backend   # Backend API
```

## 📝 Configuration Files

- `dashboard/next.config.ts` - API proxy configuration
- `backend/server.js` - Backend server setup
- `package.json` - Root dependencies

## 🐛 Troubleshooting

### Services not starting
- Check Node.js version: `node --version`
- Clear node_modules: `rm -r node_modules && npm install`

### Dashboard can't reach API
- Verify backend is running on port 3001
- Check Next.js rewrites in `next.config.ts`
- Restart dashboard: `npm run dev:frontend`

### Industry data not saving
- Ensure backend service is running
- Check browser console for errors
- Verify API response: `curl http://localhost:3001/api/industry-data`

## 📚 Additional Resources

- [AWS Landing Zone Documentation](https://aws.amazon.com/landing-zones/)
- [Compliance Framework CIS](https://www.cisecurity.org/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework/)

## 🔗 Repository

GitHub: https://github.com/tanya539/Project

## ✅ Verification Checklist

- [ ] All services running (Landing, Dashboard, Backend)
- [ ] Dashboard loads without errors
- [ ] Industry Data form displays
- [ ] Can submit organization profile
- [ ] Violations table shows data
- [ ] Logs panel streams events
- [ ] Compliance page loads frameworks
- [ ] Guardrails display rules
- [ ] Architecture shows components

---

**Status**: ✅ All Features Working | Last Updated: 2024
