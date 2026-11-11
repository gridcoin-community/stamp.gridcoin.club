import React from 'react';
import { PageContents, PageContentsEntry } from '@/components/PageContents/PageContents';
import { versus } from './versus';

const entries: PageContentsEntry[] = [
  { id: 'summary', label: 'Summary' },
  { id: 'table', label: 'Side by side' },
  ...versus.map(({ id, name }) => ({ id, label: `vs ${name}`, indent: true })),
  { id: 'pick-something-else', label: 'When to pick something else' },
];

export function Contents() {
  return <PageContents entries={entries} />;
}
