<template>
  <div class="app-container flex full">
    <app-menu class="flex-shrink-0" />

    <router-view />

    <div
        class="app-action flex-shrink-0 relative"
        :class="{ 'is-active': storeState.isActionSectionActive }"
    >
      <component :is="actionSectionComponent(storeState.actionSectionComponent)" />
    </div>

    <base-notification />
    <base-confirm-popup />
  </div>
</template>

<script setup lang="ts">
import { Store, useStore } from 'app/store';
import { actionSectionComponent } from './actions';


// Components
import AppMenu from 'components/app-menu.vue';
import BaseNotification from 'components/base/base-notification.vue';
import BaseConfirmPopup from 'components/base/base-confirm-popup.vue';


// Data
const { state: storeState }: Store = useStore();
</script>

<style lang="scss" scoped>
.app-container {
  background: var(--colors-background-app);
  flex: auto;
}

.app-action {
  transition: .2s;
  width: 0;

  &.is-active {
    width: 360px;
  }
}
</style>
