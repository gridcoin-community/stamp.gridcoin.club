import {
  describe,
  it,
  expect,
  vi,
  afterEach,
} from 'vitest';
import { plausibleClass, trackLinkPrivately } from '@/lib/track';

describe('plausibleClass', () => {
  it('encodes the event name and props with + for spaces', () => {
    expect(plausibleClass('Nav Click', { item: 'API Documentation' }))
      .toBe('plausible-event-name=Nav+Click plausible-event-item=API+Documentation');
  });

  it('drops empty props', () => {
    expect(plausibleClass('Scroll Top', { item: '' })).toBe('plausible-event-name=Scroll+Top');
  });
});

describe('trackLinkPrivately', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends only the given props and stops the click reaching Plausible', () => {
    const plausible = vi.fn();
    vi.stubGlobal('window', { plausible });
    const stopPropagation = vi.fn();

    trackLinkPrivately('Explorer Click', { item: 'TX ID' })
      .onClick({ type: 'click', button: 0, stopPropagation });

    expect(plausible).toHaveBeenCalledWith('Explorer Click', { props: { item: 'TX ID' } });
    expect(stopPropagation).toHaveBeenCalled();
  });

  it('ignores right-clicks', () => {
    const plausible = vi.fn();
    vi.stubGlobal('window', { plausible });
    const stopPropagation = vi.fn();

    trackLinkPrivately('Email Click').onAuxClick({ type: 'auxclick', button: 2, stopPropagation });

    expect(plausible).not.toHaveBeenCalled();
    expect(stopPropagation).not.toHaveBeenCalled();
  });
});
