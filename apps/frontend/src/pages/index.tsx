import { Flex, Heading } from '@chakra-ui/layout';
import { Layout } from '../components/Layout';

export default function Home(): JSX.Element {
  return (
    <Layout title="Toolbox" align="center" justify="center" bgColor="gray.800">
      <Flex direction="column" justify="center" align="center">
        <Heading size="3xl" color="gray.100" textTransform="uppercase">
          Toolbox
        </Heading>
      </Flex>
    </Layout>
  );
}
