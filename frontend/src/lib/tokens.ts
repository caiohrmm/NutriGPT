import { getDefaultStore } from 'jotai';
import { accessTokenAtom } from './tokenStore';

const store = getDefaultStore();

export function getAccessToken(): string | null {
  return store.get(accessTokenAtom);
}

export function setAccessToken(token: string | null) {
  store.set(accessTokenAtom, token);
}

