import React from 'react';
import { PageContents, PageContentsEntry } from '@/components/PageContents/PageContents';

const entries: PageContentsEntry[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'conventions', label: 'JSON:API Conventions' },
  { id: 'errors', label: 'Errors' },
  { id: 'status', label: 'Status' },
  { id: 'stamps', label: 'Stamps' },
  { id: 'stamps-list', label: 'List stamps', indent: true },
  { id: 'stamps-get', label: 'Get a stamp', indent: true },
  { id: 'stamps-create', label: 'Create a stamp', indent: true },
  { id: 'hashes', label: 'Hashes' },
  { id: 'wallet', label: 'Wallet' },
  { id: 'wallet-full', label: 'Wallet info', indent: true },
  { id: 'wallet-balance', label: 'Balance only', indent: true },
  { id: 'disclaimer', label: 'Disclaimer' },
];

export function Contents() {
  return <PageContents entries={entries} />;
}
