<template>
  <button-action
      type="button"
      icon="pencil"
      tooltip="Edit"
      actionClass="primary"
      :blocked="props.blocked"
  />
</template>

<script setup lang="ts">

// Components
import ButtonAction from 'components/button-action.vue';


// Types
type ComponentProps = {
  blocked?: boolean;
}


// Data
const props = defineProps<ComponentProps>();
</script>

<style lang="scss" scoped></style>
