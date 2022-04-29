<template>
  <page-container heading="Settings">
    <div class="settings-container">
      <brokers-settings />
    </div>
  </page-container>
</template>

<script setup lang="ts">
// Components
import PageContainer from 'components/containers/page-container.vue';
import BrokersSettings from 'components/sections/brokers-settings.vue';
</script>

<style lang="scss" scoped>
.settings-container {
  margin: 0 auto;
  max-width: 768px;
}
</style>
