import {
  useState
} from "react";
import {
  auth
} from "../lib/firebase";
import {
  ensureSystemSettings
} from "../lib/db";

export default function SystemPage() {
  const [message, setMessage] = useState("");

  async function setupSystem() {
    setMessage("กำลังตั้งค่า...");

    try {
      await ensureSystemSettings(
        auth.currentUser.uid
      );

      setMessage(
        "✅ systemSettings พร้อมใช้งาน โดยไม่แก้ไขข้อมูลรายวิชา"
      );
    } catch (error) {
      setMessage(
        "❌ " + error.message
      );
    }
  }

  return (
    <section>
      <h2>ตั้งค่าระบบ</h2>

      <div className="card panel">
        <h3>ฐานข้อมูลระบบ</h3>

        <p className="muted">
          อัปเดตเฉพาะ systemSettings/general และ
          systemSettings/security เท่านั้น
        </p>

        <button
          className="btn"
          onClick={setupSystem}
        >
          ตั้งค่าระบบ
        </button>

        {
          message && (
            <div
              className={
                message.startsWith("✅")
                  ? "success"
                  : "error"
              }
            >
              {message}
            </div>
          )
        }
      </div>

      <div className="notice">
        รายวิชาที่มีอยู่ใน Firestore จะคงเดิมทั้งหมด
        ระบบเวอร์ชันนี้ไม่ Seed หรือเขียนทับรายวิชาอัตโนมัติ
      </div>
    </section>
  );
}
