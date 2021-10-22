import { createContext } from 'react';
import { StateInterface } from './reducer';

interface DefaultFilesContext {
  state: StateInterface;
  dispatch: React.Dispatch<any>;
}

export const FilesContext = createContext<DefaultFilesContext>({
  state: {} as StateInterface,
  dispatch: () => {},
});

interface DefaultErrorContext {
  error?: string;
  setError: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const ErrorContext = createContext<DefaultErrorContext>({
  error: undefined,
  setError: () => {},
});
