import type { StoreState } from 'shared/types';
import { StoreMutation } from 'shared/constants';


export const mutations = {
  [StoreMutation.TOGGLE_MENU](state: StoreState) {
    state.isAppMenuOpen = !state.isAppMenuOpen;
  },
}
