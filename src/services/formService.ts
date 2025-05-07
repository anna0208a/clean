import { ExtractedData } from "../App";
// 假設的必填欄位清單
export const REQUIRED_FIELDS: string[] = ["欄位A", "欄位B", "欄位C", "欄位D"];

/**
 * 根據 extractedData 與 manualData 中必填欄位是否填入來計算進度
 */
export const computeProgress = (
  extractedData: Record<string, string>[],
  manualData: Record<number, Record<string, string>>
): number => {
  let totalFields = 0;
  let filledFields = 0;

  extractedData.forEach((row, rowIndex) => {
    REQUIRED_FIELDS.forEach((field) => {
      totalFields++;
      const value =
        row[field]?.trim() ||
        manualData?.[rowIndex]?.[field]?.trim() || "";
      if (value !== "") {
        filledFields++;
      }
    });
  });

  return (filledFields / totalFields) * 100;
};


/**
 * 將手動填寫的資料合併到已提取資料中
 */
export const mergeExtractedAndManualData = (
  extractedData: Record<string, string>[],
  manualData: Record<number, Record<string, string>>,
  missingFields: { rowIndex: number; field: string }[]
): Record<string, string>[] => {
  const newExtractedData = [...extractedData];

  missingFields.forEach(({ rowIndex, field }) => {
    if (!newExtractedData[rowIndex]) return;
    const manualValue = manualData?.[rowIndex]?.[field];
    if (manualValue && manualValue.trim() !== "") {
      newExtractedData[rowIndex][field] = manualValue.trim();
    }
  });

  return newExtractedData;
};


/**
 * 模擬 Excel 匯出功能，可替換成實際使用 SheetJS 等庫的實作
 */
export const exportExcel = (data: ExtractedData): void => {
  alert("Excel 檔案已生成！資料：" + JSON.stringify(data));
  console.log('data=', JSON.stringify(data)) // = python 的 print
};
