import { Button } from '@chakra-ui/button';
import { Image } from '@chakra-ui/image';
import { Flex, Heading, Link, VStack } from '@chakra-ui/layout';
import { useSession } from 'hooks/useSession';
import { Layout } from '../components/Layout';

export default function Home(): JSX.Element {
  useSession({ onAuthedRedirect: '/dash' });

  return (
    <Layout title="Toolbox" align="center" justify="center" bgColor="gray.800">
      <VStack direction="column" justify="center" align="center" spacing={8}>
        <Heading size="3xl" color="gray.100" textTransform="uppercase">
          Toolbox
        </Heading>

        <Flex>
          <Button
            leftIcon={
              <Image
                src={'/images/github-mark-dark.png'}
                alt="GitHub logo"
                h="1.5em"
              />
            }
            as={Link}
            href={`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/signin/github`}
            _hover={{ textDecoration: 'none' }}
          >
            Sign In with GitHub
          </Button>
        </Flex>
      </VStack>
    </Layout>
  );
}
