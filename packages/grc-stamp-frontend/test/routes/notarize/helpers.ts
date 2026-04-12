import { StateInterface } from '@/routes/notarize/reducer';

export function makeFile(name: string): File {
  return new File(['content'], name, { type: 'text/plain' });
}

export function makeStateWithFile(name: string): StateInterface {
  const file = makeFile(name);
  return {
    [name]: {
      file,
      preview: `blob:${name}`,
      existing: false,
    },
  };
}
