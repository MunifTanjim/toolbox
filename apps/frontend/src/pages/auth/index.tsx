import { BaseLayout } from 'components/layouts';
import { useEffect, useRef } from 'react';

export default function Auth(): JSX.Element {
  const popupWindowRef = useRef<Window | null>(null);

  useEffect(() => {
    const receiveMessage = (event: MessageEvent) => {
      if (event.origin !== window.origin) {
        return;
      }
      const { data } = event;
      console.log(data.source);
      // if we trust the sender and the source is our popup
      if (data.source === 'toolbox-signin') {
        console.log(data);
      }
    };

    const strWindowFeatures = '';
    // 'toolbar=no, menubar=no, width=600, height=700, top=100, left=100';

    if (popupWindowRef.current === null || popupWindowRef.current.closed) {
      popupWindowRef.current = window.open(
        // `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/signin/github`,
        `/auth/callback?code=1234`,
        'toolbox-signin',
        strWindowFeatures
      );
    } else {
      popupWindowRef.current.focus();
    }

    // add the listener for receiving a message from the popup
    window.addEventListener('message', receiveMessage);

    return () => {
      window.removeEventListener('message', receiveMessage, false);
    };
  }, []);

  return (
    <BaseLayout title="Toolbox Auth" justify="center" align="center">
      Hello
    </BaseLayout>
  );
}
