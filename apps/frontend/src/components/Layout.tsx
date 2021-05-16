import { Flex, FlexProps } from '@chakra-ui/layout';
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
  return (
    <>
      <Head title={title} />

      <Flex direction="column" w="100%" minH="100vh" {...props}>
        {children}
      </Flex>
    </>
  );
}
