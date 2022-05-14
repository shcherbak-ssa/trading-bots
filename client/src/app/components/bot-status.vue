<template>
  <base-status
      v-if="props.bot.state === BotState.ARCHIVE"
      status="neutral"
      tooltip="Archived"
  />

  <base-status
      v-else-if="props.bot.active"
      status="success"
      tooltip="Active"
  />

  <base-status
      v-else-if="!props.bot.active"
      status="danger"
      tooltip="Inactive"
  />
</template>

<script setup lang="ts">
import type { BotClientInfo } from 'global/types';
import { BotState } from 'global/constants';


// Types
type ComponentProps = {
  bot: BotClientInfo;
}

// Data
const props = defineProps<ComponentProps>();
</script>

<style lang="scss" scoped></style>
