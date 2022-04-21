<template>
  <div
      v-tooltip.bottom="props.tooltip"
      class="button-action"
      :class="props.actionClass"
      @click="processClick($event)"
  >
    <base-icon
        v-if="state.isLoading"
        type="pi"
        icon="spin"
        class="pi-spinner"
        style="font-size: 1rem"
    />

    <base-icon v-else type="pi" :icon="props.icon" />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useConfirm } from 'primevue/useconfirm';


// Types
type ComponentState = {
  isLoading: boolean;
}

type ComponentProps = {
  icon: string;
  actionClass: 'primary' | 'accent' | 'danger';
  type: 'button' | 'confirm';
  blocked?: boolean;
  tooltip?: string;
  popupType?: 'danger' | 'confirm',
  popupMessage?: string;
  popupCommand?: () => Promise<void>;
}

// Data
const confirmPopup = useConfirm();

const emits = defineEmits(['click']);
const props = defineProps<ComponentProps>();

const state = reactive<ComponentState>({
  isLoading: false,
});


// Methods
function processClick(e: Event): void {
  if (state.isLoading || props.blocked) return;

  if (props.type === 'button') {
    emits('click');

    return;
  }

  confirmPopup.require({
    // @ts-ignore
    target: e.currentTarget,
    message: props.popupMessage,
    group: props.popupType,
    acceptClass: props.popupType,
    accept: async () => {
      state.isLoading = true;

      if (props.popupCommand) {
        await props.popupCommand();
      }

      state.isLoading = false;
    },
    reject: () => {},
  });
}
</script>

<style lang="scss" scoped>
.button-action {
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 30px;
  height: 30px;
  position: relative;

  &.primary {
    background: var(--colors-primary-01);
    color: var(--colors-primary);
  }

  &.accent {
    background: var(--colors-accent-01);
    color: var(--colors-accent);
  }

  &.danger {
    background: var(--colors-secondary-01);
    color: var(--colors-secondary);
  }

  &::after {
    border-radius: 100%;
    content: '';
    cursor: pointer;
    display: block;
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
  }

  .pi-play {
    margin-left: 3px;
  }
}
</style>
