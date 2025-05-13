import { ExtractedData } from "@/App";
import { REQUIRED_FIELDS } from "@/services/formService";
import { useState, useRef } from "react";
import { YStack, XStack, Button, Input, Text } from "tamagui";

// UploadStep Props
interface UploadStepProps {
  onExtractionComplete: (extracted: Record<string, string>[], missing: { rowIndex: number; field: string }[]) => void;
}



const UploadStep: React.FC<UploadStepProps> = ({ onExtractionComplete }) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setPdfFile(file);
  };

  // 直接進行 extraction 處理
  const handleExtraction = async () => {
    if (!pdfFile) {
      alert("請先上傳 PDF 檔案！");
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append("pdf", pdfFile);

      const response = await fetch("http://localhost:3000/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text(); // ← 顯示詳細錯誤
        console.error("Server error:", errorText);
        throw new Error("伺服器回應錯誤");
      }

      const result = await response.json();
      const extracted = result.extracted as ExtractedData;
      const missing = result.missing as { rowIndex: number; field: string }[];


      onExtractionComplete(extracted, missing);
    } catch (err:any) {
      console.error("錯誤：", err);
      alert("上傳或分析失敗：" + err.message);
    }
  };

  return (
    <YStack gap="$7">
      <Text fontSize={20} fontWeight="bold">
        Step 1：上傳 PDFs
      </Text>
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ border: "1px solid #ccc", padding: 8 }}
      />
      <XStack gap="$3">
        <Button onPress={handleExtraction}>上傳並分析</Button>
        <Button
  onPress={() => {
    // 直接跳到 Step 3 並初始化空資料（由 App.tsx 根據空資料進入 step 3）
    onExtractionComplete([], []); // extracted = [], missing = []
  }}
>
  略過上傳
</Button>

      </XStack>
    </YStack>
  );
};

export default UploadStep;
