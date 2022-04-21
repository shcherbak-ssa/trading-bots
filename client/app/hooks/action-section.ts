import type { BotClientInfo, Broker } from 'global/types';

import { SectionComponent, StoreMutation } from 'shared/constants';

import { useCloseItemSection } from 'app/hooks/item-section';
import { Store, useStore } from 'app/store';

import BrokerActions from 'components/actions/broker-actions.vue';
import BotActions from 'components/actions/bot-actions.vue';
import Default from 'components/actions/default.vue';


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

export function useActionSectionComponent() {
  const { state: storeState }: Store = useStore();

  return () => {
    switch (storeState.actionSection.component) {
      case SectionComponent.BROKER:
        return BrokerActions;
      case SectionComponent.BOT:
        return BotActions;
      default:
        return Default;
    }
  }
}
