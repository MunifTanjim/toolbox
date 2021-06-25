import { render, screen } from 'test-utils';
import { BaseLayout } from './BaseLayout';

describe('BaseLayout', () => {
  test('renders correctly', () => {
    render(
      <BaseLayout data-testid="layout" title="Test">
        Content
      </BaseLayout>
    );

    expect(screen.getByTestId('layout').innerHTML).toMatchInlineSnapshot(
      `"Content"`
    );
  });
});
