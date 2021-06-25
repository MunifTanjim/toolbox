import * as session from 'hooks/useSession';
import { render, screen } from 'test-utils';
import { DashLayout } from './DashLayout';

jest.mock('hooks/useSession');

describe('DashLayout', () => {
  test('render null for unauthed user', async () => {
    jest.spyOn(session, 'useSession').mockReturnValue({
      isAuthed: false,
      isLoading: false,
      isRefreshing: false,
      signout: jest.fn(),
      user: null,
    });

    render(<DashLayout title="Test">Content</DashLayout>);

    expect(screen.queryByText('Content')).toBeNull();
  });
});
