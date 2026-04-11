import React from 'react';
import { PageContents, PageContentsEntry } from '@/components/PageContents/PageContents';

const entries: PageContentsEntry[] = [
  { id: 'proof-of-existence', label: 'Proof of Existence' },
  { id: 'about-the-service', label: 'About the Service' },
  { id: 'protocol-overview', label: 'Protocol Summary' },
  { id: 'costs', label: 'Costs' },
];

export function Contents() {
  return <PageContents entries={entries} />;
}
