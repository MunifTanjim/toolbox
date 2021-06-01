export type Endpoint = {
  'auth.getSession': {
    request: {
      token: string;
    };
    response: {
      session: {
        subscriber: number;
        name: string;
        key: string;
      };
    };
  };
  'user.getInfo': {
    request: {
      sk?: string;
      user?: string;
    };
    response: {
      user: {
        playlists: string;
        playcount: string;
        gender: 'n';
        name: string;
        subscriber: string;
        url: string;
        country: string;
        image: Array<{
          size: 'small' | 'medium' | 'large' | 'extralarge';
          '#text': string;
        }>;
        registered: {
          unixtime: string;
          '#text': number;
        };
        type: 'user';
        age: string;
        bootstrap: string;
        realname: string;
      };
    };
  };
};
