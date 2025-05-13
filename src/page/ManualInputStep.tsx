

import { ExtractedData } from "@/App";
import { YStack, XStack, Button, Input, Text } from "tamagui";

// ManualInputStep Props
interface ManualInputStepProps {
  missingFieldsPerRow: { rowIndex: number; field: string }[];
  manualData: Record<string, Record<string, string>>; // 每列一筆
  onInputChange: (rowIndex: number, field: string, value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onPrevious: () => void;
}

const ManualInputStep: React.FC<ManualInputStepProps> = ({
  missingFieldsPerRow,
  manualData,
  onInputChange,
  onSubmit,
  onPrevious,
}) => {
  return (
    <YStack gap="$7">
      <Text fontSize={18}>Step 2：請補充缺少的欄位</Text>
      <form onSubmit={onSubmit}>
        {missingFieldsPerRow.map(({ rowIndex, field }) => (
          <YStack key={`${rowIndex}-${field}`} mb={"$4"} gap="$2.5">
            <Text>第 {rowIndex + 1} 列：{field}</Text>
            <Input
              placeholder={`請輸入 ${field}`}
              value={manualData?.[rowIndex]?.[field] || ""}
              onChangeText={(value: string) =>
                onInputChange(rowIndex, field, value)
              }
            />
          </YStack>
        ))}
        <XStack gap="$5" mt="$5">
          <Button flex={1} onPress={onPrevious}>
            {`<`}上一步
          </Button>
          <Button flex={1} type="submit">
            下一步 {`>`}
          </Button>
        </XStack>
      </form>
    </YStack>
  );
}; 

export default ManualInputStep;
