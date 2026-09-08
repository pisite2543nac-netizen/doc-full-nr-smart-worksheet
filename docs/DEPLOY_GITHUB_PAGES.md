# Deploy GitHub Pages

Repository: `pisite2543nac-netizen/doc-full-nr-smart-worksheet`

1. อัปโหลด Source V2 ทั้งหมดขึ้น branch `main`.
2. GitHub → Settings → Pages.
3. Build and deployment → Source → **GitHub Actions**.
4. Actions → `Deploy GitHub Pages Demo` → รอ Success.
5. เปิด `https://pisite2543nac-netizen.github.io/doc-full-nr-smart-worksheet/`.

Workflow ใช้ `VITE_BASE_PATH=/doc-full-nr-smart-worksheet/` และ HashRouter จึง Refresh path ได้โดยไม่ 404.
