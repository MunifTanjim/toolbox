import { Button, ButtonGroup } from '@chakra-ui/button';
import { Flex, Text, Heading } from '@chakra-ui/layout';
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/popover';
import { useSession } from 'hooks/useSession';

export function Topbar(): JSX.Element | null {
  const session = useSession({ onUnauthedRedirect: '/' });

  if (!session.isAuthed) {
    return null;
  }

  return (
    <Flex justify="space-between" alignItems="center" w="100%">
      <Flex>
        <Heading as="span" size="md" pl={4}>
          Toolbox
        </Heading>
      </Flex>
      <Flex>
        <Popover>
          <PopoverTrigger>
            <Button variant="ghost">Hi!</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverHeader>Howdy, {session.user.name}!</PopoverHeader>
            <PopoverBody>
              <Text>Email: {session.user.email}</Text>
            </PopoverBody>
            <PopoverFooter d="flex" justifyContent="flex-end">
              <ButtonGroup size="sm">
                <Button
                  colorScheme="red"
                  isLoading={session.isRefreshing}
                  onClick={session.signout}
                >
                  Sign Out
                </Button>
              </ButtonGroup>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      </Flex>
    </Flex>
  );
}
