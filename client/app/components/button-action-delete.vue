<template>
  <button-action
      type="confirm"
      icon="trash"
      actionClass="danger"
      tooltip="Delete"
      popupType="danger"
      :blocked="props.blocked"
      :popupMessage="props.message"
      :popupCommand="props.deleteFunction"
  />
</template>

<script setup lang="ts">

// Components
import ButtonAction from 'components/button-action.vue';


// Types
type ComponentProps = {
  message: string;
  blocked: boolean;
  deleteFunction: () => Promise<void>;
}


// Data
const props = defineProps<ComponentProps>();
</script>

<style lang="scss" scoped></style>
