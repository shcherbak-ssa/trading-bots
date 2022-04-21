import type { BotClientInfo } from 'global/types';

import { SectionComponent, StoreMutation } from 'shared/constants';

import { useCloseActionSection } from 'app/hooks/action-section';
import { Store, useStore } from 'app/store';

import BotItem from 'components/items/bot-item.vue';


export function useOpenItemSection(component: SectionComponent) {
  const { commit }: Store = useStore();

  const closeActionSection = useCloseActionSection();

  return ({ bot }: { bot?: BotClientInfo }) => {
    closeActionSection();

    commit({
      type: StoreMutation.ITEM_SECTION_OPEN,
      botId: bot?.id,
      component,
    });
  };
}

export function useCloseItemSection() {
  const { state: storeState, commit }: Store = useStore();

  return () => {
    if (!storeState.itemSection.isActive) return;

    commit({
      type: StoreMutation.ITEM_SECTION_CLOSE,
    });
  };
}

export function useItemSectionComponent() {
  const { state: storeState }: Store = useStore();

  return () => {
    switch (storeState.itemSection.component) {
      case SectionComponent.BOT:
        return BotItem;
    }
  };
}
