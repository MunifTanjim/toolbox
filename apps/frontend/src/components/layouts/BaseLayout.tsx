import { Flex, FlexProps } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import NextHead from 'next/head';

function Head({ title }: { title: string }) {
  return (
    <NextHead>
      <title>{title}</title>
    </NextHead>
  );
}

export type BaseLayoutProps = {
  children: React.ReactNode;
  isLoading?: boolean;
  title: string;
} & FlexProps;

export function BaseLayout({
  children,
  isLoading,
  title,
  ...props
}: BaseLayoutProps): JSX.Element {
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
