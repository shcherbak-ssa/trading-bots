<template>
  <page-container title="Bots">
    <template v-slot:actions>
      <base-button class="circle" @click="createBot">
        <base-icon :icon="addIcon" class="base-icon" />
      </base-button>
    </template>


  </page-container>
</template>

<script setup lang="ts">
import { IconList, ActionSectionComponent, StoreMutation } from 'shared/constants';

import { Store, useStore } from 'app/store';


// Components
import PageContainer from 'components/page-container.vue';
import SectionContainer from 'components/section-container.vue';


// Data
const { commit }: Store = useStore();
const addIcon = IconList.ADD;


// Methods
function createBot(): void {
  commit({
    type: StoreMutation.OPEN_ACTION_SECTION,
    component: ActionSectionComponent.CREATE_BOT,
  });
}
</script>

<style lang="scss" scoped></style>
