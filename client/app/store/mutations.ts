import type { ErrorItem } from 'global/types';

import type { StoreState, StoreNotification } from 'shared/types';
import { ActionSectionComponent, StoreMutation } from 'shared/constants';


export const mutations = {
  // App
  [StoreMutation.TOGGLE_MENU](state: StoreState): void {
    state.isAppMenuOpen = !state.isAppMenuOpen;
  },

  // Actions
  [StoreMutation.OPEN_ACTION_SECTION](state: StoreState, { component }: { component: ActionSectionComponent }): void {
    state.isActionSectionActive = true;
    state.actionSectionComponent = component;
  },

  [StoreMutation.CLOSE_ACTION_SECTION](state: StoreState): void {
    state.isActionSectionActive = false;
    state.actionSectionComponent = ActionSectionComponent.DEFAULT;
  },

  // Notifications
  [StoreMutation.SHOW_NOTIFICATION](state: StoreState, notification: StoreNotification): void {
    state.notification = notification;
  },

  [StoreMutation.HIDE_NOTIFICATION](state: StoreState): void {
    state.notification = null;
  },

  // Errors
  [StoreMutation.ADD_ERROR](state: StoreState, { key, errors }: { key: string, errors: ErrorItem[] }): void {
    const stateErrors = { ...state.errors };

    stateErrors[key] = errors;
    state.errors = stateErrors;
  },

  [StoreMutation.REMOVE_ERROR](state: StoreState, { key }: { key: string }): void {
    const stateErrors = { ...state.errors };

    if (key in stateErrors) {
      delete stateErrors[key];
    }

    state.errors = stateErrors;
  },

  // User
  [StoreMutation.UPDATE_USER](
    state: StoreState,
    { key, value }: { key: keyof StoreState['user'], value: StoreState['user'][keyof StoreState['user']] },
  ): void  {
    state.user[key] = value;
  }
};
