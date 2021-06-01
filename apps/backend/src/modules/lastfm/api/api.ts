import config from 'config';
import { createHash } from 'crypto';
import type { RequestInit } from 'node-fetch';
import fetch, { Headers, Request } from 'node-fetch';
import { URL } from 'url';
import { LastfmAPIError } from './error';
import type { Endpoint } from './types';

const lastfmApp = config.get('module.lastfm.app');

const baseUrl = 'https://ws.audioscrobbler.com/2.0';

const md5 = (data: string) => createHash('md5').update(data).digest('hex');

const getApiSignature = (params: URLSearchParams) => {
  params.sort();

  let payload = '';

  for (const [key, value] of params.entries()) {
    if (['format', 'callback'].includes(key)) {
      continue;
    }

    payload = `${payload}${key}${value}`;
  }

  payload = `${payload}${lastfmApp.sharedSecret}`;

  const signature = md5(payload);

  return signature;
};

export const api = async <EndpointMethod extends keyof Endpoint>(
  endpointMethod: EndpointMethod,
  parameters: Endpoint[EndpointMethod]['request'],
  { sign, type = 'read' }: { sign?: boolean; type?: 'read' | 'write' } = {}
): Promise<Endpoint[EndpointMethod]['response']> => {
  const params = Object.fromEntries([
    ['api_key', lastfmApp.apiKey],
    ['format', 'json'],
    ['method', endpointMethod],
    ...Object.entries(parameters).filter((kv): kv is [string, string] =>
      Boolean(kv[1])
    ),
  ]);

  const queryParams = new URLSearchParams(params);

  if (sign || queryParams.has('sk')) {
    const apiSig = getApiSignature(queryParams);
    queryParams.set('api_sig', apiSig);
  }

  let body: RequestInit['body'];
  const headers = new Headers();
  const method = type === 'read' ? 'GET' : 'POST';
  const url = new URL(baseUrl);

  if (method === 'POST') {
    headers.set('content-type', 'application/x-www-form-urlencoded');
    body = queryParams;
  } else {
    url.search = queryParams.toString();
  }

  const request = new Request(url, {
    body,
    method,
    headers,
  });

  const response = await fetch(request);

  const data = await response.json();

  if (!response.ok) {
    throw new LastfmAPIError(data.message, data.error, response.status);
  }

  return data;
};
