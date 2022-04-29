<template>
  <div class="group-container">
    <div class="group-heading">
      {{ props.heading }}
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
// Types
type ComponentProps = {
  heading: string;
}


// Data
const props = defineProps<ComponentProps>();
</script>

<style lang="scss" scoped>
.group-container:not(:last-child) {
  margin-bottom: 40px;
}

.group-heading {
  font: 700 .7rem/1.16rem 'DM Sans';
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 20px;
  opacity: 0.5;
}
</style>
