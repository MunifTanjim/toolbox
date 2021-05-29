import { Flex, FlexProps } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import { useSession } from 'hooks/useSession';
import NextHead from 'next/head';

function Head({ title }: { title: string }) {
  return (
    <NextHead>
      <title>{title}</title>
    </NextHead>
  );
}

type LayoutProps = {
  children: React.ReactNode;
  title: string;
} & FlexProps;

export function Layout({
  children,
  title,
  ...props
}: LayoutProps): JSX.Element {
  const { isLoading } = useSession();

  return (
    <>
      <Head title={title} />

      <Flex direction="column" w="100%" minH="100vh" {...props}>
        {isLoading ? (
          <Flex justify="center" align="center" grow={1}>
            <Spinner color="whiteAlpha.500" size="xl" />
          </Flex>
        ) : (
          children
        )}
      </Flex>
    </>
  );
}
