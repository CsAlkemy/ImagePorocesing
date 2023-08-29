import { render, screen } from '@testing-library/react';
import photoRoom from './PhotoRoom';

test('renders learn react link', () => {
  render(<photoRoom />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
