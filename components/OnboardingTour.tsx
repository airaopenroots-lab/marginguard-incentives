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
  }
];

export default function OnboardingTour() {
  const [step, setStep] = useState(-1);
  const router = useRouter();

  useEffect(() => {
    const completed = localStorage.getItem("marginguard_tour_complete");
    if (!completed) {
      setStep(0);
    }
  }, []);

  if (step === -1) return null;

  const current = STEPS[step];

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      router.push(STEPS[step + 1].target);
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
        Deployment Briefing · Step {step + 1} of {STEPS.length}
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
            {step === STEPS.length - 1 ? "Complete Deployment" : "Next Objective"}
        </button>
      </div>
    </div>
  );
}
