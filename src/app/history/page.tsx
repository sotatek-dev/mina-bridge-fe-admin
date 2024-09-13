import HistoryContent from './content';
import HistoryProvider from './context';

export type FormBridgeProps = {};

export default function History({}: FormBridgeProps) {
  return (
    <HistoryProvider>
      <HistoryContent />
    </HistoryProvider>
  );
}
