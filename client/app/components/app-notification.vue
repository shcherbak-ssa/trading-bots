<template>
  <prime-vue-toast position="bottom-left" group="notification">
    <template #message="{ message }">
      <div class="flex relative w-full">
        <div class="notification-icon">
          <base-icon v-if="message.severity === 'error'" type="mi" :icon="errorIcon" />

          <base-icon v-if="message.severity === 'info'" type="mi" :icon="infoIcon" />

          <base-icon v-if="message.severity === 'success'" type="mi" :icon="successIcon" />
        </div>

        <div>
          <div class="p-toast-summary">{{ message.summary }}</div>
          <div class="p-toast-detail">{{ message.detail }}</div>
        </div>

        <div class="notification-close-icon absolute cursor-pointer" @click="closeNotification">
          <base-icon type="pi" icon="times" />
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

const errorIcon = IconList.NOTIFICATION_ERROR;
const infoIcon = IconList.NOTIFICATION_INFO;
const successIcon = IconList.NOTIFICATION_SUCCESS;

watch(() => storeState.app.notification, () => {
  if (storeState.app.notification) {
    notifications.add(storeState.app.notification);
  }
});


// Methods
function closeNotification(): void {
  if (storeState.app.notification) {
    notifications.removeGroup(storeState.app.notification.group);

    commit({
      type: StoreMutation.APP_HIDE_NOTIFICATION,
    });
  }
}
</script>

<style lang="scss" scoped>
.notification-icon {
  margin-right: 14px;

  .base-mi-icon {
    width: 28px;
    height: 28px;
  }
}

.notification-close-icon {
  top: -3px;
  right: -3px;
}
</style>
