import React from 'react';
import { PageContents, PageContentsEntry } from '@/components/PageContents/PageContents';

const entries: PageContentsEntry[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'why', label: 'Why timestamp a release?' },
  { id: 'highlights', label: 'Design notes' },
  { id: 'quick-start', label: 'Drop-in workflow' },
  { id: 'confirmation', label: 'Wait for confirmation' },
  { id: 'verify', label: 'Verifying a release' },
  { id: 'learn-more', label: 'Learn more' },
];

export function Contents() {
  return <PageContents entries={entries} />;
}
