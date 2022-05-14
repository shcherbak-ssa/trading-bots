import type { BotClientInfo, Broker } from 'global/types';

import { SectionComponent, StoreMutation } from 'shared/constants';

import { useCloseItemSection } from 'app/hooks/item-section';
import { Store, useStore } from 'app/store';


export function useOpenActionSection(component: SectionComponent) {
  const { commit }: Store = useStore();

  const closeItemSection = useCloseItemSection();

  return ({ broker, bot }: { bot?: BotClientInfo, broker?: Broker }) => {
    closeItemSection();

    commit({
      type: StoreMutation.ACTION_SECTION_OPEN,
      component,
      broker,
      bot,
    });
  };
}

export function useCloseActionSection() {
  const { state: storeState, commit }: Store = useStore();

  return () => {
    if (!storeState.actionSection.isActive) return;

    if (storeState.actionSection.component === SectionComponent.BOT) {
      commit({
        type: StoreMutation.BROKER_RESET,
      });
    }

    commit({
      type: StoreMutation.ACTION_SECTION_CLOSE,
    });
  };
}
