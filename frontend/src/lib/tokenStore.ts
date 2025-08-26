import { atom } from 'jotai';

// Access token mantido em memória. Opcionalmente, poderíamos persistir em sessionStorage.
export const accessTokenAtom = atom<string | null>(null);

