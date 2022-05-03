<template>
  <prime-vue-confirm-popup group="danger">
    <template #message="{ message }">
      <div class="confirm-popup-icon flex-align-center">
        <base-icon type="pi" class="flex-shrink-0" icon="exclamation-triangle" />

        <span>Attention</span>
      </div>

      <div class="p-confirm-popup-message" v-html="message.message" />
    </template>
  </prime-vue-confirm-popup>

  <prime-vue-confirm-popup group="confirm">
    <template #message="{ message }">
      <div class="confirm-popup-icon flex-align-center">
        <base-icon type="pi" class="flex-shrink-0" icon="info-circle" />

        <span>Confirm action</span>
      </div>

      <div class="p-confirm-popup-message" v-html="message.message" />
    </template>
  </prime-vue-confirm-popup>
</template>

<script setup lang="ts">
// Components
import PrimeVueConfirmPopup from 'primevue/confirmpopup';
</script>

<style lang="scss" scoped>
.confirm-popup-icon {
  font-weight: 500;
  margin-bottom: 14px;

  .base-icon {
    font-size: 1.2rem;
    margin-right: 10px;
  }
}
</style>
