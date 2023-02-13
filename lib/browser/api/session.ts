import { fetchWithSession } from '@electron/internal/browser/api/net-fetch';
import { ClientRequestConstructorOptions, IncomingMessage } from 'electron/main';
import { ClientRequest } from '@electron/internal/browser/api/net-client-request';
import * as url from 'url';
const { fromPartition, Session } = process._linkedBinding('electron_browser_session');

Object.defineProperty(Session.prototype, 'net', {
  get () {
    const session = this;
    return {
      fetch (input: RequestInfo, init?: RequestInit) {
        return fetchWithSession(input, init, session);
      },
      request (optionsIn: ClientRequestConstructorOptions | string, callback?: (message: IncomingMessage) => void) {
        const options = typeof optionsIn === 'string'
          ? url.parse(optionsIn) as unknown as ClientRequestConstructorOptions
          : optionsIn;
        return new ClientRequest({ ...options, session }, callback);
      }
    };
  }
});

export default {
  fromPartition,
  get defaultSession () {
    return fromPartition('');
  }
};
