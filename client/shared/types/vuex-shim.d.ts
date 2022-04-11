import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

import { StoreState } from './store';


declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<StoreState>
  }
}
