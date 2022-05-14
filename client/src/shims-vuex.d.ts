import { ComponentCustomProperties } from 'vue'

import { Store } from 'shared/types/store';


declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store;
  }
}
