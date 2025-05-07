// FinalStep Props
import { YStack, XStack, Button, Text } from "tamagui";

interface FinalStepProps {
  onExport: () => void;
  onRestart: () => void;
  onPrevious: () => void;
}

const FinalStep: React.FC<FinalStepProps> = ({
  onExport,
  onRestart,
  onPrevious,
}) => {
  return (
    <YStack gap={"$5"}>
      <Text fontSize={20} fontWeight="bold">
        Step 3：分析成功！
      </Text>
      <YStack gap={"$5"}>
        <XStack gap={"$5"}>
          <Button onPress={onPrevious}>{`<`}上一步</Button>
          <Button theme="blue" onPress={() => {
  // 呼叫後端產生 Excel
  onExport();
  // 直接開啟下載網址
  setTimeout(() => {
    window.location.href = 'http://localhost:3001/api/download';
  }, 500); // 等待 0.5 秒確保檔案已生成
}}>
  匯出並下載 Excel
</Button>

        </XStack>
        <Button onPress={onRestart}>重新開始</Button>
      </YStack>
    </YStack>
  );
};

export default FinalStep;
