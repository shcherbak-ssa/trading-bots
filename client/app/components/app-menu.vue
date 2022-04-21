<template>
  <div
      class="app-menu h-full"
      :class="{
        'is-open': isMenuOpen,
        'is-close': !isMenuOpen,
      }"
  >
    <div class="menu colors-bg-section flex-column full">
      <div class="menu-list">
        <div
            v-for="(item, index) in menuItems"
            :key="index"
            :class="{
              'menu-item flex relative w-full cursor-pointer select-none': true,
              'is-active': isCurrentRoute(item),
            }"
            v-tooltip.right="{
              value: item.label,
              class: isMenuOpen ? 'hide' : '',
            }"
            @click="handleMenuItemClick(item)"
        >
          <base-icon type="mi" class="menu-icon" :icon="item.icon" />

          <div v-if="isMenuOpen" class="menu-label">
            {{ item.label }}
          </div>
        </div>
      </div>

      <div class="menu-toggle flex-center">
        <base-icon
            type="mi"
            class="menu-icon cursor-pointer"
            :icon="isMenuOpen ? openMenuIcon : closeMenuIcon"
            @click="toggleMenu"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import type { AppMenuItem } from 'shared/types';
import { IconList, StoreMutation } from 'shared/constants';
import { appMenuItems } from 'shared/config';

import { useCloseActionSection, useCloseItemSection } from 'app/hooks';
import { Store, useStore } from 'app/store';


// Data
const { state: storeState, commit }: Store = useStore();
const router = useRouter();

const closeActionSection = useCloseActionSection();
const closeItemSection = useCloseItemSection();

const isMenuOpen = computed<boolean>(() => storeState.app.isMenuOpen);
const openMenuIcon = IconList.MENU_OPEN;
const closeMenuIcon = IconList.MENU_CLOSE;
const menuItems = appMenuItems;


// Methods
function isCurrentRoute({ to }: AppMenuItem) {
  return router.currentRoute.value.path === to;
}

function handleMenuItemClick(item: AppMenuItem): void {
  if (isCurrentRoute(item)) return;

  router.push(item.to);

  closeActionSection();
  closeItemSection();
}

function toggleMenu(): void {
  commit({
    type: StoreMutation.APP_TOGGLE_MENU,
  });
}
</script>

<style lang="scss" scoped>
.app-menu {
  transition: .2s;

  &.is-open {
    padding: 0;
    width: 225px;

    .menu {
      padding-top: 103px;
    }
  }

  &.is-close {
    padding: var(--sizes-space-y) 0 var(--sizes-space-y) var(--sizes-space-default);
    width: 115px;

    .menu {
      border-radius: var(--sizes-border-radius-default);
      padding-top: 68px;
    }

    .menu-icon {
      margin-right: 0;
    }
  }
}

.menu {
  justify-content: space-between;
  padding: 0 var(--sizes-space-default) var(--sizes-space-y);
  transition: .2s;
}

.menu-item {
  align-items: center;
  margin-bottom: var(--sizes-space-default);
  opacity: .5;


  &.is-active {
    color: var(--colors-primary);
    opacity: 1;
  }
}

.menu-icon {
  margin-right: 14px;
}

.menu-label {
  font-weight: 500;
  line-height: 1.25rem;
}

.menu-toggle {
  opacity: .5;

  .menu-icon {
    margin: 0;
  }
}
</style>
