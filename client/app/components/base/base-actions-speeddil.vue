<template>
  <base-actions
      :model="actions"
      direction="left"
      @show="toggleMenuByEvent(true)"
      @hide="toggleMenuByEvent(false)"
  >
    <template #button="{ toggle }">
      <base-button
          :class="{ 'actions-is-open': state.actionsIsOpen }"
          class="actions-button circle"
          @click="toggleMenuByButtonClick(toggle)"
      >
        <base-icon :icon="addIcon" class="base-icon" />
      </base-button>
    </template>

    <template #item="{ item }">
      <base-button
          class="circle"
          v-tooltip.bottom="item.label"
          @click="runItemCommand(item)"
      >
        <base-icon :icon="item.icon" class="base-icon" />
      </base-button>
    </template>
  </base-actions>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

import type { ActionComponentItem } from 'shared/types';
import { IconList } from 'shared/constants';


// Types
type ComponentProps = {
  actions: ActionComponentItem[];
}

type ComponentState = {
  actionsIsOpen: boolean,
  menuToggle: null | (() => void);
}


// Data
const props = defineProps<ComponentProps>();
const state = reactive<ComponentState>({
  actionsIsOpen: false,
  menuToggle: null,
});

const addIcon = IconList.ADD;


// Methods
function toggleMenuByButtonClick(toggle: () => void): void {
  toggle();

  state.menuToggle = toggle;
}

function toggleMenuByEvent(actionsIsOpen: boolean): void {
  state.actionsIsOpen = actionsIsOpen;
  state.menuToggle = null;
}

function runItemCommand({ command }: ActionComponentItem): void {
  command();

  if (state.menuToggle !== null) {
    state.menuToggle();
  }
}
</script>

<style lang="scss" scoped>
.actions-is-open {
  transform: rotate(135deg);
}

.actions-button {
  margin-left: 10px;
}
</style>
