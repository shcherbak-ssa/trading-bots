<template>
  <div class="app-layout flex full">
    <app-menu class="flex-shrink-0" />

    <div class="app-page-container relative full">
      <router-view />

      <div
          class="app-item absolute"
          :class="{ 'is-active': storeState.itemSection.isActive }"
      >
        <component :is="itemSectionComponent()" />
      </div>
    </div>

    <div
        class="app-action flex-shrink-0 relative"
        :class="{ 'is-active': storeState.actionSection.isActive }"
    >
      <component :is="actionSectionComponent()" />
    </div>

    <app-notification />
    <app-confirm-popup />
  </div>
</template>

<script setup lang="ts">
import { useActionSectionComponent, useItemSectionComponent } from 'app/hooks';
import { Store, useStore } from 'app/store';


// Components
import AppMenu from 'components/app-menu.vue';
import AppNotification from 'components/app-notification.vue';
import AppConfirmPopup from 'components/app-confirm-popup.vue';


// Data
const { state: storeState }: Store = useStore();

const actionSectionComponent = useActionSectionComponent();
const itemSectionComponent = useItemSectionComponent();
</script>

<style lang="scss" scoped>
.app-layout {
  background: var(--colors-background-app);
  flex: auto;
}

.app-page-container {
  padding: var(--sizes-space-y) var(--sizes-space-default);
}

.app-action {
  transition: .2s;
  width: 0;

  &.is-active {
    width: 400px;
  }
}

.app-item {
  transition: .2s;
  width: calc(50% - 45px);
  height: calc(100% - 140px);
  top: 105px;
  right: var(--sizes-space-default);
  transform: translateX(110%);

  &.is-active {
    transform: translateX(0);
  }
}
</style>
