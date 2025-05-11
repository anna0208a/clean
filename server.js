import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ExcelJS from "exceljs";
import { uploadPDF } from './0328/pcrver.js';
import { generateExcel } from './0328/pcrver.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // ✅ 允許你的前端網頁訪問
}));


app.post('/api/analyze', upload.single('pdf'), async (req, res) => {
  try {
    const filePath = req.file.path;
    console.log("收到 PDF 檔案路徑：", filePath);

    const result = await uploadPDF(filePath); // => 回傳字串 JSON

    // 處理 Gemini 回傳格式
    const cleanJsonString = result.replace(/```json/g, '').replace(/```/g, '').trim();

    let extractedRows;
    try {
      extractedRows = JSON.parse(cleanJsonString); // 預期是 array of objects
    } catch (e) {
      console.error("❌ JSON 解析錯誤：", e);
      return res.status(400).json({ error: '無法解析 Gemini 回傳內容為合法 JSON' });
    }

    // 逐列檢查缺漏欄位
    const missingFieldsPerRow = extractedRows.flatMap((row, rowIndex) => {
      return Object.entries(row)
        .filter(([_, value]) => value === '' || value == null)
        .map(([field]) => ({
          rowIndex,
          field
        }));
    });

    res.json({
      extracted: extractedRows, // array of rows
      missing: missingFieldsPerRow // array of { rowIndex, field }
    });

    await fs.unlink(filePath).catch(() => {});
  } catch (err) {
    console.error("❌ 分析錯誤：", err);
    res.status(500).json({ error: '分析失敗' });
  }
});
app.post('/api/export', async (req, res) => {
  try {
    const data = req.body.data; // 前端送來的資料
    console.log("📦 收到 Excel 資料：", data); // ✅ 請保留這行
    await generateExcel(data); // 傳進去生成 Excel
    res.status(200).json({ message: 'Excel 已生成' });
  } catch (err) {
    console.error("❌ 產生 Excel 錯誤：", err);
    res.status(500).json({ error: 'Excel 產生失敗' });
  }
});


app.get('/api/download', (req, res) => {
  const file = path.join(__dirname, 'Carbon_Footprint_Report.xlsx');
  res.download(file);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

