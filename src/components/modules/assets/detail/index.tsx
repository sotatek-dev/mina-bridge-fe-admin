'use client';

import DetailContent from './content';
import DetailProvider from './context';

export default function AssetDetail() {
  return (
    <DetailProvider>
      <DetailContent />
    </DetailProvider>
  );
}
