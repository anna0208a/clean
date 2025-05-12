import React, { useState } from "react";
import { TamaguiProvider } from "@tamagui/core";
import config from "./tamagui.config"; // your configuration
import "./App.css";
import { YStack } from "tamagui";
import UploadStep from "./page/UploadStep";
import ManualInputStep from "./page/ManualInputStep";
import ProgressDisplay from "./page/components/ProgressDisplay";
import FinalStep from "./page/FinalStep";
import {
  computeProgress,
  mergeExtractedAndManualData,
  exportExcel,
} from "./services/formService";


// 定義 extractedData 的型別
export type ExtractedData = Record<string, string>[]; // 表示多筆列資料

const App: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  // 存放 PDF 提取結果
  const [extractedData, setExtractedData] = useState<ExtractedData>([]);
  // 存放缺少的欄位（由 PDF 提取結果判定）
  const [missingFields, setMissingFields] = useState<{ rowIndex: number, field: string }[]>([]);
  // 存放使用者手動填入的值
  const [manualData, setManualData] = useState<Record<number, Record<string, string>>>({});


  // 使用 service 模組計算進度
  const progress = computeProgress(extractedData, manualData, missingFields);

  // 上傳步驟完成後回調：更新提取結果及缺少欄位，並前往手動補充
  const handleExtractionComplete = (
    extracted: ExtractedData,
    missing: { rowIndex: number; field: string }[]
  ) => {
    setExtractedData(extracted);
    setMissingFields(missing);
    setStep(2);
  };
  

  // 處理手動填寫欄位變更
// 更新 handleInputChange，需傳 rowIndex
const handleInputChange = (rowIndex: number, field: string, value: string) => {
  setManualData(prev => ({
    ...prev,
    [rowIndex]: {
      ...prev[rowIndex],
      [field]: value
    }
  }));
};


  // 手動填寫送出後，合併資料後進入下一步
  const handleManualSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newExtractedData = mergeExtractedAndManualData(
      extractedData,
      manualData,
      missingFields
    );
    setExtractedData(newExtractedData);
    setStep(3);
  };

  // 匯出 Excel
  const handleExportExcel = () => {
    exportExcel(mergeExtractedAndManualData(extractedData, manualData, missingFields));

  };

  // 上一步：從 Step 2 返回 Step 1
  const handlePreviousFromManual = () => {
    setStep(1);
  };

  // 上一步：從 Step 3 返回 Step 2
  const handlePreviousFromFinal = () => {
    setStep(2);
  };

  // 重新開始：重置所有狀態
  const handleRestart = () => {
    setStep(1);
    setExtractedData([]);

    setMissingFields([]);
    setManualData({});
  };

  return (
    <TamaguiProvider config={config}>
      <YStack
        gap={"$8"}
        padding="$4"
        w="100vw"
        h="100vh"
        alignItems="center"
        justifyContent="center"
      >
        {/* 全局進度顯示：每個步驟上方皆顯示目前欄位填入進度 */}
        <ProgressDisplay progress={progress} />
        {step === 1 && (
          <UploadStep onExtractionComplete={handleExtractionComplete} />
        )}
        {step === 2 && (
          <ManualInputStep
            missingFieldsPerRow={missingFields}
            manualData={manualData}
            onInputChange={handleInputChange}
            onSubmit={handleManualSubmit}
            onPrevious={handlePreviousFromManual}
          />
        )}
        {step === 3 && (
          <FinalStep
            onExport={handleExportExcel}
            onRestart={handleRestart}
            onPrevious={handlePreviousFromFinal}
            extractedData={extractedData}
          />
        )}
      </YStack>
    </TamaguiProvider>
  );
};

export default App;
