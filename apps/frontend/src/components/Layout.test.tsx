import { render, screen } from 'test-utils';
import { Layout } from './Layout';

describe('Layout', () => {
  test('renders correctly', () => {
    render(
      <Layout data-testid="layout" title="Test">
        Content
      </Layout>
    );

    expect(screen.getByTestId('layout').innerHTML).toMatchInlineSnapshot(
      `"Content"`
    );
  });
});
