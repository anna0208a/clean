/* import React, { useState } from "react";
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
        overflow="auto" // ✅ 加上滾動
      >
        {//全局進度顯示：每個步驟上方皆顯示目前欄位填入進度 
        }
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

export default App; */
import React, { useState } from "react";
import { TamaguiProvider } from "@tamagui/core";
import config from "./tamagui.config";
import "./App.css";
import {
  YStack,
  XStack,
  Button,
  Text,
  Separator,
  Image,
} from "tamagui";
import UploadStep from "./page/UploadStep";
import ManualInputStep from "./page/ManualInputStep";
import FinalStep from "./page/FinalStep";
import ExtraInputStep from "./page/ExtraInputStep";
import ProgressDisplay from "./page/components/ProgressDisplay";
import {
  computeProgress,
  mergeExtractedAndManualData,
  exportExcel,
} from "./services/formService";

export type ExtractedData = Record<string, string>[];

const App: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [extractedData, setExtractedData] = useState<ExtractedData>([]);
  const [missingFields, setMissingFields] = useState<{ rowIndex: number; field: string }[]>([]);
  const [manualData, setManualData] = useState<Record<number, Record<string, string>>>({});
  const [extraRows, setExtraRows] = useState<Record<string, string>[]>([]);

  const progress = computeProgress(extractedData, manualData, missingFields);

  const handleExtractionComplete = (
    extracted: ExtractedData,
    missing: { rowIndex: number; field: string }[]
  ) => {
    setExtractedData(extracted);
    setMissingFields(missing);
    // 若使用者略過上傳，直接跳 Step 3（新增額外資料頁）
    if (extracted.length === 0 && missing.length === 0) {
      setStep(3);
    } else {
      setStep(2); // 否則進入手動補全欄位頁
    }
  };

  const handleInputChange = (rowIndex: number, field: string, value: string) => {
    setManualData(prev => ({
      ...prev,
      [rowIndex]: {
        ...prev[rowIndex],
        [field]: value,
      },
    }));
  };

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

  const handleExtraRowSubmit = (rows: Record<string, string>[]) => {
    setExtraRows(rows);
    setStep(4);
  };

  const handleExportExcel = () => {
    const allData = [...extractedData, ...extraRows];
    exportExcel(allData);
  };

  const handlePreviousFromManual = () => setStep(1);
  const handlePreviousFromFinal = () => setStep(3);
  const handlePreviousFromExtra = () => setStep(2);
  const handleRestart = () => {
    setStep(1);
    setExtractedData([]);
    setMissingFields([]);
    setManualData({});
    setExtraRows([]);
  };

  const steps = ["封面頁", "上傳PDF", "補全欄位", "新增項目", "匯出下載"];

  return (
    <TamaguiProvider config={config}>
      <XStack w="100vw" h="100vh">
        <YStack
          bg="#e6f2e6"
          w={200}
          p="$5"
          borderRightWidth={1}
          borderColor="#a3c9a8"
          gap="$4"
        >
          <Text fontWeight="bold" fontSize="$7" color="#2f5d3a">
            🌿 碳足跡填報平台
          </Text>
          {steps.slice(1).map((label, index) => (
            <Text
              key={label}
              color={step === index + 1 ? "#2f5d3a" : "#777"}
              fontWeight={step === index + 1 ? "bold" : "normal"}
            >
              {index + 1}. {label}
            </Text>
          ))}
        </YStack>

        <YStack
          flex={1}
          padding="$6"
          bg="#f4fbf4"
          overflow="auto"
          alignItems="center"
          borderColor="#d5e8d4"
        >
          {step === 0 && (
            <YStack gap="$4" ai="center" jc="center" mt={100}>
              <Image
                source={{ uri: "/logo.png" }}
                width={150}
                height={150}
                alt="logo"
              />
              <Text fontSize={30} fontWeight="bold" color="#2f5d3a">
                歡迎使用碳足跡自動填報系統
              </Text>
              <Text color="#555" fontSize={16}>
                自動提取 + 智慧補全 + 一鍵輸出報表
              </Text>
              <Button theme="green" size="$4" mt="$5" onPress={() => setStep(1)}>
                開始使用
              </Button>
            </YStack>
          )}

          {step > 0 && (
            <>
              <ProgressDisplay progress={progress} />
              <Separator my="$4" />

              {step === 1 && <UploadStep onExtractionComplete={handleExtractionComplete} />}
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
  <ExtraInputStep
    extraRows={extraRows}
    onSubmit={(rows) => setExtraRows(rows)}
    onPrevious={handlePreviousFromExtra}
    onNext={() => setStep(4)}
  />
)}

              {step === 4 && (
                <FinalStep
                  onExport={handleExportExcel}
                  onRestart={handleRestart}
                  onPrevious={handlePreviousFromFinal}
                  extractedData={[...extractedData, ...extraRows]}
                />
              )}
            </>
          )}
        </YStack>
      </XStack>
    </TamaguiProvider>
  );
};

export default App;