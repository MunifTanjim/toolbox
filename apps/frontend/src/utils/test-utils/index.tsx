import { ChakraProvider } from '@chakra-ui/react';
import type { RenderOptions } from '@testing-library/react';
import { queries, render } from '@testing-library/react';
import React from 'react';
import customQueries from './custom-queries';

const AllProviders: React.FC = ({ children }) => {
  return <ChakraProvider>{children}</ChakraProvider>;
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>
): ReturnType<typeof render> => {
  return render(ui, {
    queries: { ...queries, ...customQueries },
    wrapper: AllProviders,
    ...options,
  });
};

export * from '@testing-library/react';
export { customRender as render };
