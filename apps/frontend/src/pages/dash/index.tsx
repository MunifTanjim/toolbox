import { Button } from '@chakra-ui/button';
import { Flex, Heading, VStack } from '@chakra-ui/layout';
import { Layout } from 'components/Layout';
import { useSession } from 'hooks/useSession';

export default function Dash(): JSX.Element {
  const session = useSession({ onUnauthedRedirect: '/' });

  return (
    <Layout title="Toolbox Dashboard" align="center" justify="center">
      <VStack direction="column" justify="center" align="center" spacing={8}>
        <Heading size="3xl" color="gray.100" textTransform="uppercase">
          Hello, {session.user?.name}!
        </Heading>

        <Flex>
          <Button onClick={session.signout}>Sign Out</Button>
        </Flex>
      </VStack>
    </Layout>
  );
}
