import React, { useState, useEffect } from "react";
import { YStack, XStack, Button, Input, Text, Separator } from "tamagui";

interface ExtraInputStepProps {
  extraRows: Record<string, string>[];
  onSubmit: (rows: Record<string, string>[]) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const FIELDS = [
  "生命週期階段",
  "群組",
  "名稱",
  "總活動量",
  "總活動量單位",
  "每單位數量",
  "每單位數量單位",
  "排放名稱",
  "數值",
  "排放係數宣告單位",
  "數據來源",
];

const ExtraInputStep: React.FC<ExtraInputStepProps> = ({ extraRows, onSubmit, onPrevious, onNext }) => {
  const [rows, setRows] = useState<Record<string, string>[]>([]);

  useEffect(() => {
    if (extraRows.length === 0) {
      setRows([Object.fromEntries(FIELDS.map(field => [field, ""]))]);
    } else {
      setRows(extraRows);
    }
  }, [extraRows]);

  const addRow = () => {
    setRows([...rows, Object.fromEntries(FIELDS.map(field => [field, ""]))]);
  };

  const handleChange = (rowIndex: number, field: string, value: string) => {
    const updated = [...rows];
    updated[rowIndex][field] = value;
    setRows(updated);
  };

  const handleNextStep = () => {
    onSubmit(rows); // 保存資料
    onNext();       // 前往最終匯出頁
  };

  return (
    <YStack gap="$5" maxWidth={800}>
      <Text fontSize={20} fontWeight="bold">
        Step 3：若有其他項目，請補充新增列
      </Text>
      {rows.map((row, rowIndex) => (
        <YStack key={rowIndex} borderWidth={1} borderColor="#ccc" borderRadius={6} p="$3" gap="$2">
          <Text fontWeight="bold">第 {rowIndex + 1} 列</Text>
          {FIELDS.map(field => (
            <YStack key={field}>
              <Text>{field}</Text>
              <Input
                value={row[field] || ""}
                placeholder={`請輸入 ${field}`}
                onChangeText={(val: string) => handleChange(rowIndex, field, val)}
              />
            </YStack>
          ))}
        </YStack>
      ))}

      <XStack gap="$4" mt="$4">
        <Button onPress={onPrevious}>{`<`} 上一步</Button>
        <Button theme="green" onPress={addRow}>➕ 新增一列</Button>
        <Button theme="active" onPress={handleNextStep}>下一步 {`>`}</Button>
      </XStack>
    </YStack>
  );
};

export default ExtraInputStep;
