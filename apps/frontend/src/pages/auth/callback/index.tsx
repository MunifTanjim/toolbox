import { Layout } from 'components/Layout';
import { useEffect } from 'react';

export default function AuthCallback(): JSX.Element {
  useEffect(() => {
    const params = window.location.search;
    if (window.opener) {
      console.log('params', params);
      window.opener.postMessage(params ?? 'a=b', '*');
    }
  }, []);

  return (
    <Layout title="Toolbox Auth" justify="center" align="center">
      Hello
    </Layout>
  );
}
