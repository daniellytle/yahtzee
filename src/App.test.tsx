import { render, screen } from '@testing-library/react';
import App from '../src/App';

test('renders roll button', () => {
  render(<App />);
  const RollButton = screen.getByText("Roll");
  expect(RollButton).toBeInTheDocument();
});
