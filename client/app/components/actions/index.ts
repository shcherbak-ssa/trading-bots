import { ActionSectionComponent } from 'shared/constants';

import ConnectBrokerAction from './connect-broker-action.vue';
import DefaultAction from './default-action.vue';


export function actionSectionComponent(component: ActionSectionComponent) {
  switch (component) {
    case ActionSectionComponent.CONNECT_BROKER:
      return ConnectBrokerAction;
    default:
      return DefaultAction;
  }
}
