import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCollection } from "../lib/db";

const groups = [
  ["users", "ผู้ใช้งาน", "👥"],
  ["subjects", "รายวิชา", "📚"],
  ["classrooms", "ห้องเรียน", "🏫"],
  ["worksheets", "ใบงาน", "📝"]
];

const quickLinks = [
  ["/admin/subjects", "จัดการรายวิชา", "เพิ่ม/ตรวจสอบรายวิชา"],
  ["/admin/classrooms", "จัดการห้องเรียน", "สร้างห้องและเตรียมรายชื่อนักเรียน"],
  ["/admin/worksheets", "สร้างใบงาน", "สร้าง Draft และ Publish ใบงาน"],
  ["/admin/assignments", "มอบหมายงาน", "UX/UI พร้อมสำหรับขั้นถัดไป"]
];

export default function DashboardPage() {
  const [counts, setCounts] = useState({});
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    Promise.all(groups.map(async ([name]) => [name, (await listCollection(name)).length]))
      .then((rows) => setCounts(Object.fromEntries(rows)))
      .catch((error) => {
        console.error(error);
        setLoadError("ไม่สามารถโหลดสถิติทั้งหมดได้ในขณะนี้");
      });
  }, []);

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMIN DASHBOARD</span>
          <h1>ภาพรวมระบบ</h1>
          <p className="muted">DOC-FULL-NR Smart Worksheet · Firebase Project: doc-full-nr</p>
        </div>
        <span className="module-status live">Core Online</span>
      </div>

      {loadError && <div className="notice">{loadError}</div>}

      <div className="metrics">
        {groups.map(([key, label, icon]) => (
          <div className="card metric" key={key}>
            <div className="metric-top">
              <span className="metric-icon">{icon}</span>
              <span className="metric-trend">LIVE</span>
            </div>
            <span className="muted">{label}</span>
            <strong>{counts[key] ?? "..."}</strong>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">QUICK ACTIONS</span>
              <h2>ทางลัดการทำงาน</h2>
            </div>
          </div>

          <div className="quick-grid">
            {quickLinks.map(([to, title, description]) => (
              <Link className="quick-link" to={to} key={to}>
                <div>
                  <strong>{title}</strong>
                  <p>{description}</p>
                </div>
                <span>→</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="card panel system-card">
          <span className="eyebrow">SYSTEM STATUS</span>
          <h2>สถานะโครงระบบ</h2>
          <div className="status-list">
            <div><span className="status-dot" /><span>Firebase Authentication</span><b>พร้อม</b></div>
            <div><span className="status-dot" /><span>Cloud Firestore</span><b>พร้อม</b></div>
            <div><span className="status-dot" /><span>Firebase Hosting</span><b>พร้อม</b></div>
            <div><span className="status-dot planned-dot" /><span>Cloud Functions / Grading</span><b>ถัดไป</b></div>
          </div>
        </div>
      </div>

      <div className="notice info-notice">
        <strong>โครงสร้างความปลอดภัย:</strong> submissions, submissionGrades, submissionOverrides และ auditLogs ถูกเตรียมให้ Browser ไม่เขียนโดยตรง เพื่อเชื่อม Cloud Functions ฝั่ง Server ในขั้นต่อไป
      </div>
    </section>
  );
}
