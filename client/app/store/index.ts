import type { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store as BaseStore, CommitOptions } from 'vuex';

import type { StoreState } from 'shared/types';
import { initialStoreState } from 'shared/config';

import { getters, Getters } from './getters';
import { mutations, Mutations } from './mutations';


export type Store = Omit<BaseStore<StoreState>, 'getters' | 'commit'> & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>;
  };

  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1] & { type: K }>(
    payloadWithType: P,
    options?: CommitOptions
  ): void;
};

export const storeKey: InjectionKey<Store> = Symbol();

export const store = createStore({
  state() {
    return initialStoreState;
  },

  getters,
  mutations,
});

export function useStore(): Store {
  return baseUseStore(storeKey);
}
