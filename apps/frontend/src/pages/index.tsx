import { Button } from '@chakra-ui/button';
import { useColorMode } from '@chakra-ui/color-mode';
import { Image } from '@chakra-ui/image';
import { Flex, Heading, Link, VStack } from '@chakra-ui/layout';
import { BaseLayout } from 'components/layouts';
import { useSession } from 'hooks/useSession';

export default function Home(): JSX.Element {
  const { isLoading } = useSession({ onAuthedRedirect: '/dash' });

  const { colorMode } = useColorMode();

  return (
    <BaseLayout
      isLoading={isLoading}
      title="Toolbox"
      align="center"
      justify="center"
    >
      <VStack direction="column" justify="center" align="center" spacing={8}>
        <Heading size="3xl" textTransform="uppercase">
          Toolbox
        </Heading>

        <Flex>
          <Button
            leftIcon={
              <Image
                src={`/images/github-mark-${colorMode}.png`}
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
    </BaseLayout>
  );
}
