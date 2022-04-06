import { createStore } from 'vuex';

import type { StoreState } from 'shared/types';
import { initialStoreState } from 'shared/constants';


export const store = createStore<StoreState>({
  state() {
    return initialStoreState;
  },
});
