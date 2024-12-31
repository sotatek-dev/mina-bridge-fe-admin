import AssetsContent from './content';
import AssetsProvider from './context';

export enum Action {
  CREATE = 'create',
  DETAIL = 'detail',
}

export default function Assets() {
  return (
    <AssetsProvider>
      <AssetsContent />
    </AssetsProvider>
  );
}
