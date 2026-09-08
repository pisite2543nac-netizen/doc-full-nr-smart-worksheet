import {
  NavLink,
  Outlet,
  useNavigate
} from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

const navGroups = [
  {
    label: "ระบบหลัก",
    items: [
      ["/admin", "▦", "ภาพรวม", false],
      ["/admin/system", "⚙", "ตั้งค่าระบบ", false],
      ["/admin/users", "👥", "ผู้ใช้งาน", false]
    ]
  },
  {
    label: "จัดการการเรียน",
    items: [
      ["/admin/subjects", "📚", "รายวิชา", false],
      ["/admin/classrooms", "🏫", "ห้องเรียน", false],
      ["/admin/worksheets", "📝", "ใบงาน", false],
      ["/admin/assignments", "📌", "มอบหมายงาน", true]
    ]
  },
  {
    label: "ตรวจงานและผลการเรียน",
    items: [
      ["/admin/submissions", "📥", "งานที่ส่ง", true],
      ["/admin/grading", "✓", "ตรวจ / ให้คะแนน", true],
      ["/admin/qr", "▣", "QR / Barcode", true],
      ["/admin/reports", "📊", "รายงาน", true],
      ["/admin/audit", "◷", "ประวัติระบบ", true]
    ]
  }
];

export default function AdminLayout() {
  const navigate = useNavigate();

  async function logout() {
    await signOut(auth);
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">NR</div>
          <div>
            <strong className="brand-title">DOC-FULL-NR</strong>
            <div className="brand-subtitle">Smart Worksheet System</div>
          </div>
        </div>

        <div className="topbar-actions">
          <span className="status-pill"><span className="status-dot" /> Online</span>
          <button className="btn secondary" onClick={logout}>ออกจากระบบ</button>
        </div>
      </header>

      <div className="layout">
        <aside className="card sidebar">
          <div className="sidebar-head">
            <span className="eyebrow">ADMIN CONSOLE</span>
            <strong>เมนูจัดการระบบ</strong>
          </div>

          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <div className="nav-group-label">{group.label}</div>
              {group.items.map(([to, icon, label, planned]) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/admin"}
                  className={({ isActive }) => "nav" + (isActive ? " active" : "")}
                >
                  <span className="nav-icon" aria-hidden="true">{icon}</span>
                  <span className="nav-label">{label}</span>
                  {planned && <span className="nav-badge">เร็ว ๆ นี้</span>}
                </NavLink>
              ))}
            </div>
          ))}

          <div className="sidebar-footer">
            <span className="muted">Firebase Project</span>
            <strong>doc-full-nr</strong>
          </div>
        </aside>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
