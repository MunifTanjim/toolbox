import { Heading, Flex } from '@chakra-ui/react';
import { useSession } from 'hooks/useSession';
import { Topbar } from '../Topbar';
import type { BaseLayoutProps } from './BaseLayout';
import { BaseLayout } from './BaseLayout';

type DashLayoutProps = Omit<BaseLayoutProps, 'isLoading'>;

export function DashLayout({
  children,
  title,
  ...props
}: DashLayoutProps): JSX.Element | null {
  const { isAuthed, isLoading, user } = useSession({
    onUnauthedRedirect: '/',
  });

  if (!isAuthed) {
    return null;
  }

  return (
    <BaseLayout isLoading={isLoading} title={title} {...props}>
      <Topbar />

      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        flexGrow={1}
        w="100%"
      >
        <Heading mb={4}>Howdy, {user.name}!</Heading>
        {children}
      </Flex>
    </BaseLayout>
  );
}
