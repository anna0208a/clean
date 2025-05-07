import { YStack, Text, Progress } from "tamagui";

// ProgressDisplay Props
interface ProgressDisplayProps {
  progress: number;
}

const ProgressDisplay: React.FC<ProgressDisplayProps> = ({ progress }) => (
  <YStack gap={5}>
    <Text>提取進度：{progress.toFixed(0)}%</Text>
    <Progress value={progress} max={100}>
      <Progress.Indicator animation="bouncy" />
    </Progress>
  </YStack>
);

export default ProgressDisplay;
