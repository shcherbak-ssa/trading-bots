<template>
  <prime-vue-toast position="bottom-left" group="notification">
    <template #message="{ message }">
      <div class="flex relative w-full">
        <div class="notification-icon">
          <base-icon v-if="message.severity === 'error'" :icon="errorIcon" class="base-icon" />

          <base-icon v-if="message.severity === 'info'" :icon="infoIcon" class="base-icon" />

          <base-icon v-if="message.severity === 'success'" :icon="successIcon" class="base-icon" />
        </div>

        <div>
          <div class="p-toast-summary">{{ message.summary }}</div>
          <div class="p-toast-detail">{{ message.detail }}</div>
        </div>

        <div class="notification-close-icon absolute cursor-pointer" @click="closeNotification">
          <base-icon :icon="addIcon" class="base-icon" />
        </div>
      </div>
    </template>
  </prime-vue-toast>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useToast } from 'primevue/usetoast';

import { IconList, StoreMutation } from 'shared/constants';
import { Store, useStore } from 'app/store';

// Components
import PrimeVueToast from 'primevue/toast';


// Data
const { state: storeState, commit }: Store = useStore();
const notifications = useToast();

const addIcon = IconList.ADD;
const errorIcon = IconList.NOTIFICATION_ERROR;
const infoIcon = IconList.NOTIFICATION_INFO;
const successIcon = IconList.NOTIFICATION_SUCCESS;

watch(() => storeState.notification, () => {
  if (storeState.notification) {
    notifications.add(storeState.notification);
  }
});


// Methods
function closeNotification(): void {
  if (storeState.notification) {
    notifications.removeGroup(storeState.notification.group);

    commit({
      type: StoreMutation.HIDE_NOTIFICATION,
    });
  }
}
</script>

<style lang="scss" scoped>
.notification-icon {
  margin-right: 14px;

  .base-icon {
    width: 28px;
    height: 28px;
  }
}

.notification-close-icon {
  top: -3px;
  right: -3px;

  .base-icon {
    transform: rotate(45deg);
  }
}
</style>
