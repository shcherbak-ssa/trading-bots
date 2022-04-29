<template>
  <prime-vue-confirm-popup group="danger">
    <template #message="{ message }">
      <div class="confirm-popup-icon flex-align-center">
        <base-icon type="mi" class="flex-shrink-0" :icon="deleteIcon" />
        <span>Attention</span>
      </div>

      <div class="p-confirm-popup-message" v-html="message.message" />
    </template>
  </prime-vue-confirm-popup>

  <prime-vue-confirm-popup group="confirm">
    <template #message="{ message }">
      <div class="confirm-popup-icon flex-align-center">
        <base-icon type="mi" class="flex-shrink-0" :icon="confirmIcon" />
        <span>Confirm action</span>
      </div>

      <div class="p-confirm-popup-message" v-html="message.message" />
    </template>
  </prime-vue-confirm-popup>
</template>

<script setup lang="ts">
import { IconList } from 'shared/constants';


// Components
import PrimeVueConfirmPopup from 'primevue/confirmpopup';


// Data
const deleteIcon = IconList.NOTIFICATION_ERROR;
const confirmIcon = IconList.NOTIFICATION_INFO;
</script>

<style lang="scss" scoped>
.confirm-popup-icon {
  font-weight: 500;
  margin-bottom: 14px;

  .base-mi-icon {
    width: 28px;
    height: 28px;
    margin-right: 10px;
  }
}
</style>
