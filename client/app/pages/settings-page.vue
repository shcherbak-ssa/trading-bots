<template>
  <page-container title="Settings">
    <div class="settings-container">
      <section-brokers-settings />
    </div>
  </page-container>
</template>

<script setup lang="ts">
// Components
import PageContainer from 'components/page-container.vue';
import SectionBrokersSettings from 'components/sections/section-brokers-settings.vue';
</script>

<style lang="scss" scoped>
.settings-container {
  margin: 0 auto;
  max-width: 768px;
}
</style>
