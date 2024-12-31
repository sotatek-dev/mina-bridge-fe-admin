import AssetsContent from './content';
import AssetsProvider from './context';

export default function Assets() {
  return (
    <AssetsProvider>
      <AssetsContent />
    </AssetsProvider>
  );
}
