// FinalStep Props
import { YStack, XStack, Button, Text } from "tamagui";

interface FinalStepProps {
  onExport: () => void;
  onRestart: () => void;
  onPrevious: () => void;
  extractedData: any;
}

const FinalStep: React.FC<FinalStepProps> = ({
  onExport,
  onRestart,
  onPrevious,
  extractedData
}) => {
  return (
    <YStack gap={"$5"}>
      <Text fontSize={20} fontWeight="bold">
        Step 3：分析成功！
      </Text>
      <YStack gap={"$5"}>
        <XStack gap={"$5"}>
          <Button onPress={onPrevious}>{`<`}上一步</Button>
          <Button
  theme="blue"
  onPress={async () => {
    try {
      // 呼叫後端產生 Excel（等待完成）
      const response = await fetch('http://localhost:3000/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: extractedData }) // 若不需傳 data 可略過
      });

      if (response.ok) {
        // 自動觸發下載
        window.location.href = 'http://localhost:3000/api/download';
      } else {
        alert("產生 Excel 失敗");
      }
    } catch (error) {
      alert("無法連線到後端！");
    }
  }}
>
  匯出並下載 Excel
</Button>


        </XStack>
        <Button onPress={onRestart}>重新開始</Button>
      </YStack>
    </YStack>
  );
};

export default FinalStep;
