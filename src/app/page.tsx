'use client';

import { NetworkDesigner } from '@/components/network-designer/NetworkDesigner';

export default function Home() {
  return (
    <div className="h-screen w-full overflow-hidden bg-background">
      <NetworkDesigner />
    </div>
  );
}