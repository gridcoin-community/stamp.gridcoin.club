import { createContext } from 'react';
import { StateInterface } from './reducer';

interface DefaultContext {
  state: StateInterface,
  dispatch: React.Dispatch<any>,
}

export const FilesContext = createContext<DefaultContext>({
  state: {} as StateInterface,
  dispatch: () => {},
});
