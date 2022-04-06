import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

import { StoreState } from './store';


declare module '@vue/runtime-core' {
  interface State extends StoreState {}

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
