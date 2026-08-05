"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  {
    title: "Intelligence Feed",
    body: "Start here to see real-time anomalies. The AI tracks segments running over budget.",
    target: "/insights",
    selector: "[data-tour='insights']"
  },
  {
    title: "Deal Approval",
    body: "Review individual deals. AI confidence scores help you approve or counter in seconds.",
    target: "/deal-approval",
    selector: "[data-tour='deals']"
  },
  {
    title: "Planning Workbench",
    body: "Adjust incentive mixes per segment. Use 'Rebalance for ROI' to optimize spend automatically.",
    target: "/planning",
    selector: "[data-tour='planning']"
  },
  {
    title: "Audit Trail",
    body: "Every decision is logged. Review historical overrides and performance results here.",
    target: "/history",
    selector: "[data-tour='history']"
  },
  {
    title: "Data Sovereignty",
    body: "Connect external ERP or CRM systems. Marginguard uses these to build your response curves.",
    target: "/settings",
    selector: "[data-tour='settings']"
  }
];

export default function OnboardingTour({ userRole }: { userRole?: string }) {
  const [step, setStep] = useState(-1);
  const router = useRouter();

  const filteredSteps = STEPS.filter(s => {
    if (userRole === "ADMIN") return true;
    // Operator steps
    return ["Intelligence Feed", "Deal Approval", "Planning Workbench"].includes(s.title);
  });

  useEffect(() => {
    const completed = localStorage.getItem("marginguard_tour_complete");
    if (!completed && filteredSteps.length > 0 && step === -1) {
      setStep(0);
    }
  }, [filteredSteps.length, step]);

  if (step === -1 || filteredSteps.length === 0) return null;

  const current = filteredSteps[step];

  const handleNext = () => {
    if (step < filteredSteps.length - 1) {
      setStep(step + 1);
      router.push(filteredSteps[step + 1].target);
    } else {
      localStorage.setItem("marginguard_tour_complete", "true");
      setStep(-1);
    }
  };

  return (
    <div style={{
      position: "fixed", bottom: "32px", right: "32px", width: "320px",
      background: "var(--card)", border: "1px solid var(--blue)", borderRadius: "12px",
      padding: "24px", boxShadow: "0 20px 40px rgba(15,42,74,0.15)", zIndex: 9999,
      animation: "rise 0.4s ease-out"
    }}>
      <div className="label-caps" style={{ color: "var(--blue)", marginBottom: "8px", fontSize: "10px" }}>
        Deployment Briefing · Step {step + 1} of {filteredSteps.length}
      </div>
      <h3 className="serif" style={{ fontSize: "20px", marginBottom: "12px", color: "var(--ink)" }}>{current.title}</h3>
      <p style={{ fontSize: "14px", color: "var(--slate)", lineHeight: 1.5, marginBottom: "20px" }}>{current.body}</p>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button 
            onClick={() => { localStorage.setItem("marginguard_tour_complete", "true"); setStep(-1); }}
            style={{ background: "transparent", border: "none", color: "var(--slate)", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}
        >
            Skip briefing
        </button>
        <button 
            onClick={handleNext}
            style={{ 
                background: "var(--blue)", color: "white", border: "none", 
                padding: "8px 16px", borderRadius: "6px", fontWeight: 600, 
                fontSize: "13px", cursor: "pointer" 
            }}
        >
            {step === filteredSteps.length - 1 ? "Complete Deployment" : "Next Objective"}
        </button>
      </div>
    </div>
  );
}
