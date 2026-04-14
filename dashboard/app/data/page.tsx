"use client";

import { useState } from "react";
import { Upload, Send, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface IndustryData {
  industry: string;
  companySize: string;
  accountCount: number;
  dataClassification: string[];
  riskLevel: string;
  compliance: string[];
  notes: string;
}

export default function DataInputPage() {
  const [formData, setFormData] = useState<IndustryData>({
    industry: "technology",
    companySize: "enterprise",
    accountCount: 5,
    dataClassification: [],
    riskLevel: "medium",
    compliance: [],
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const industries = [
    "technology",
    "finance",
    "healthcare",
    "retail",
    "manufacturing",
    "energy",
    "government",
    "education",
    "other",
  ];

  const companySizes = ["startup", "smb", "mid-market", "enterprise"];

  const dataClassifications = [
    "Public",
    "Internal",
    "Confidential",
    "Restricted",
    "PII",
    "PHI",
    "Financial Data",
  ];

  const riskLevels = ["low", "medium", "high", "critical"];

  const complianceFrameworks = [
    "SOC 2",
    "ISO 27001",
    "PCI DSS",
    "HIPAA",
    "GDPR",
    "CCPA",
    "FedRAMP",
    "NIST",
  ];

  const toggleArrayValue = (arr: string[], value: string) => {
    return arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/industry-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Industry data submitted successfully!", {
          description: "Your configuration will be analyzed with guardrails.",
        });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2000);
      } else {
        toast.error("Failed to submit data", {
          description: "Please try again.",
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error submitting data", {
        description: "Please check your connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          Industry Data Input
        </h1>
        <p className="text-zinc-400">
          Configure your organization&apos;s profile for security analysis and guardrail recommendations.
        </p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Industry Selection */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              Industry
            </label>
            <select
              value={formData.industry}
              onChange={(e) =>
                setFormData({ ...formData, industry: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500"
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind.charAt(0).toUpperCase() + ind.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Company Size */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              Company Size
            </label>
            <select
              value={formData.companySize}
              onChange={(e) =>
                setFormData({ ...formData, companySize: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500"
            >
              {companySizes.map((size) => (
                <option key={size} value={size}>
                  {size.charAt(0).toUpperCase() + size.slice(1).replace("-", " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Account Count */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              Number of AWS Accounts
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={formData.accountCount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  accountCount: parseInt(e.target.value),
                })
              }
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Data Classification */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              Data Classification (select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {dataClassifications.map((dc) => (
                <label
                  key={dc}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-900 border border-slate-700 hover:border-sky-500 cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={formData.dataClassification.includes(dc)}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        dataClassification: toggleArrayValue(
                          formData.dataClassification,
                          dc
                        ),
                      })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-white">{dc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Risk Level */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              Overall Risk Level
            </label>
            <div className="grid grid-cols-4 gap-3">
              {riskLevels.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, riskLevel: level })}
                  className={`py-3 px-4 rounded-lg font-semibold transition ${
                    formData.riskLevel === level
                      ? level === "critical"
                        ? "bg-red-600 text-white"
                        : level === "high"
                        ? "bg-orange-600 text-white"
                        : level === "medium"
                        ? "bg-yellow-600 text-white"
                        : "bg-green-600 text-white"
                      : "bg-slate-900 border border-slate-700 text-slate-300 hover:border-sky-500"
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Compliance Frameworks */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              Required Compliance Frameworks
            </label>
            <div className="grid grid-cols-2 gap-3">
              {complianceFrameworks.map((fw) => (
                <label
                  key={fw}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-900 border border-slate-700 hover:border-sky-500 cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={formData.compliance.includes(fw)}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        compliance: toggleArrayValue(formData.compliance, fw),
                      })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-white">{fw}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={4}
              placeholder="Any additional information about your organization or security concerns..."
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500 placeholder-slate-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-600 text-white font-semibold rounded-lg transition"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-sky-300 border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : submitted ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Submitted!
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Analyze Configuration
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Info Card */}
      <div className="glass-card rounded-2xl p-6 border border-sky-500/30 bg-sky-500/5">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-white mb-1">Analysis Benefits</h3>
            <p className="text-sm text-slate-300">
              Once submitted, your organization profile will be analyzed to:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-slate-300">
              <li>✓ Generate industry-specific guardrails</li>
              <li>✓ Recommend compliance controls</li>
              <li>✓ Identify security gaps</li>
              <li>✓ Suggest architectural improvements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
