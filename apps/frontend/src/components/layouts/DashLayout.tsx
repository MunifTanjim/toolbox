import { Button } from '@chakra-ui/button';
import { Heading } from '@chakra-ui/react';
import { useSession } from 'hooks/useSession';
import type { BaseLayoutProps } from './BaseLayout';
import { BaseLayout } from './BaseLayout';

type DashLayoutProps = Omit<BaseLayoutProps, 'isLoading'>;

export function DashLayout({
  children,
  title,
  ...props
}: DashLayoutProps): JSX.Element | null {
  const { isAuthed, isLoading, isRefreshing, signout, user } = useSession({
    onUnauthedRedirect: '/',
  });

  if (!isAuthed) {
    return null;
  }

  return (
    <BaseLayout isLoading={isLoading} title={title} {...props}>
      <Heading mb={4}>Howdy, {user.name}!</Heading>
      <Button colorScheme="red" isLoading={isRefreshing} onClick={signout}>
        Sign Out
      </Button>
      {children}
    </BaseLayout>
  );
}
