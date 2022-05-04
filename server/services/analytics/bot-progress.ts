import type { AnalyticsBotProgress, Bot } from 'global/types';

import type { Position } from 'shared/types';
import { emptyBotProgress, ONE_HUNDRED } from 'shared/constants';


export class BotProgress {
  static calculateForOneActivation(positions: Position[], { activations, initialCapital }: Bot): AnalyticsBotProgress {
    const initialBotProgress: AnalyticsBotProgress = BotProgress.getInitialBotProgress();

    if (!positions.length) return initialBotProgress;

    const { botActivationIndex } = positions[0];

    const progress: AnalyticsBotProgress = positions
      .reduce((progress, { totalFee, result }) => {
        progress.totalFee += totalFee;
        progress.totalResult += result + totalFee;

        if (result < 0) {
          progress.totalLoss += result
        } else {
          progress.totalProfit += result;
        }

        return progress;
      }, initialBotProgress);

    progress.botActivationIndex = botActivationIndex;

    const capital: number = botActivationIndex === activations.length
      ? initialCapital
      : activations[botActivationIndex].initialCapital;

    progress.changePercent = BotProgress.calculateChange(capital, progress.totalResult);

    return progress;
  }


  private static getInitialBotProgress(): AnalyticsBotProgress {
    return { ...emptyBotProgress };
  }

  private static calculateChange(capital: number, totalResult: number): number {
    return ONE_HUNDRED * totalResult / capital;
  }
}
