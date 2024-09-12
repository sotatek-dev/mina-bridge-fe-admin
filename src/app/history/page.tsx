import HistoryContent from './content';
import HistoryProvider from './context';

const History = () => {
  return (
    <HistoryProvider>
      <HistoryContent />
    </HistoryProvider>
  );
};

export default History;
