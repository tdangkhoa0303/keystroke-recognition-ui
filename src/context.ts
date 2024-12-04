import { createContext, useContext } from 'react';

export type TypingInstance = {
  start: () => void;
  stop: () => void;
  getTypingPattern: (params: {
    type: 0 | 1 | 2;
    text: string;
    textId?: number;
    length?: number;
    targetId?: string;
    caseSensitive?: boolean;
  }) => string;
};

const TypingContext = createContext<TypingInstance | null>(null);

export const useTypingInstance = () => {
  const context = useContext(TypingContext);

  return context;
};

export default TypingContext.Provider;
