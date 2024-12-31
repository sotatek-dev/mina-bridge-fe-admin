'use client';
import DeployContent from './content';
import DeployProvider from './context';

export default function AssetDeploy() {
  return (
    <DeployProvider>
      <DeployContent />
    </DeployProvider>
  );
}
