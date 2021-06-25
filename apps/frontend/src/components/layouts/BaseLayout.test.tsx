import { render, screen } from 'test-utils';
import { BaseLayout } from './BaseLayout';

describe('BaseLayout', () => {
  test('renders correctly', () => {
    render(<BaseLayout title="Test">Content</BaseLayout>);

    expect(screen.queryByText('Content')).not.toBeNull();
  });
});
