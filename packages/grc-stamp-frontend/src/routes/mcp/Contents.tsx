import React from 'react';
import { PageContents, PageContentsEntry } from '@/components/PageContents/PageContents';

const entries: PageContentsEntry[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'tools', label: 'Tools' },
  { id: 'local', label: 'Local setup' },
  { id: 'hosted', label: 'Hosted endpoint' },
  { id: 'privacy', label: 'Privacy and cost' },
  { id: 'proof', label: 'Proof and certificates' },
  { id: 'learn-more', label: 'Learn more' },
];

export function Contents() {
  return <PageContents entries={entries} />;
}
