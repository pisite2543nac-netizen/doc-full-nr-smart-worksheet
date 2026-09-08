import { Link } from "react-router-dom";

const content = {
  assignments: {
    title: "มอบหมายงาน",
    icon: "📌",
    description: "พื้นที่สำหรับเลือกใบงาน ห้องเรียน นักเรียน กำหนดวันเริ่ม-สิ้นสุด และติดตามสถานะการมอบหมาย"
  },
  submissions: {
    title: "งานที่ส่ง",
    icon: "📥",
    description: "พื้นที่สำหรับดูรายการส่งงาน สถานะตรงเวลา/ล่าช้า ไฟล์แนบ และประวัติการส่งซ้ำ"
  },
  grading: {
    title: "ตรวจ / ให้คะแนน",
    icon: "✓",
    description: "พื้นที่สำหรับตรวจคำตอบ ให้คะแนนตาม rubric บันทึกข้อเสนอแนะ และจัดการคะแนนที่แก้ไขย้อนหลัง"
  },
  qr: {
    title: "QR / Barcode",
    icon: "▣",
    description: "พื้นที่สำหรับสร้างและสแกน QR/Barcode เพื่อเปิดใบงาน ยืนยันตัวตน หรือเชื่อมงานในห้องเรียน"
  },
  reports: {
    title: "รายงาน",
    icon: "📊",
    description: "พื้นที่สำหรับสรุปผลรายวิชา ห้องเรียน การส่งงาน คะแนน และส่งออกข้อมูลในอนาคต"
  },
  audit: {
    title: "ประวัติระบบ",
    icon: "◷",
    description: "พื้นที่สำหรับตรวจสอบ audit log และประวัติการเปลี่ยนแปลงที่สำคัญของระบบ"
  }
};

export default function ComingSoonPage({ module }) {
  const item = content[module] || content.assignments;

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">UX/UI READY</span>
          <h1>{item.title}</h1>
          <p className="muted">หน้าจอนี้เตรียมโครงสร้าง UX/UI ไว้แล้ว และจะเชื่อมฟังก์ชันจริงในขั้นถัดไป</p>
        </div>
        <span className="module-status planned">Planned</span>
      </div>

      <div className="card empty-module">
        <div className="empty-module-icon">{item.icon}</div>
        <h2>{item.title}</h2>
        <p>{item.description}</p>

        <div className="roadmap-grid">
          <div className="mini-card">
            <strong>01</strong>
            <span>โครงหน้าและ Navigation</span>
            <small>พร้อมแล้ว</small>
          </div>
          <div className="mini-card">
            <strong>02</strong>
            <span>เชื่อม Firestore / Server</span>
            <small>ขั้นถัดไป</small>
          </div>
          <div className="mini-card">
            <strong>03</strong>
            <span>ทดสอบสิทธิ์และ Workflow</span>
            <small>ก่อน Production</small>
          </div>
        </div>

        <Link className="btn" to="/admin">กลับหน้าภาพรวม</Link>
      </div>
    </section>
  );
}
