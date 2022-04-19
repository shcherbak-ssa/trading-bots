import type { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store as BaseStore } from 'vuex';

import type { StoreState } from 'shared/types';
import { initialStoreState } from 'shared/constants';

import { mutations } from './mutations';


export type Store = BaseStore<StoreState>;

export const storeKey: InjectionKey<Store> = Symbol();

export const store = createStore<StoreState>({
  state() {
    return initialStoreState;
  },

  mutations,
});

export function useStore(): Store {
  return baseUseStore(storeKey);
}
