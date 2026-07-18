import React from 'react';
import { PageContents, PageContentsEntry } from '@/components/PageContents/PageContents';

const entries: PageContentsEntry[] = [
  { id: 'acceptance', label: 'Read this first' },
  { id: 'service', label: 'What stamp is, and isn’t' },
  { id: 'what-it-proves', label: 'What a stamp proves' },
  { id: 'acceptable-use', label: 'Acceptable use' },
  { id: 'privacy', label: 'Privacy and personal data' },
  { id: 'open-source', label: 'Open source' },
  { id: 'disclaimer', label: 'Disclaimer of warranties' },
  { id: 'liability', label: 'Limitation of liability' },
  { id: 'general', label: 'General' },
];

export function Contents() {
  return <PageContents entries={entries} />;
}
