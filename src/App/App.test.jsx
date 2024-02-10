import { render, screen } from '@testing-library/react';
import App from './App';
import { test } from 'vitest'

test('renders login page at start', async () => {
  render(<App />);
  const linkElement = await screen.findByText(/Entrar al SIPAM/i);
});
