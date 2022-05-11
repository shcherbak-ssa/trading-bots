import type { AnalyticsBotProgress, Bot } from 'global/types';

import type { Position } from 'shared/types';
import { FRACTION_DIGITS_TO_HUNDREDTHS, ONE_HUNDRED } from 'shared/constants';
import { emptyBotProgress } from 'shared/config';
import { roundNumber } from 'shared/utils';


export class BotProgress {
  static calculateTotal(positions: Position[], bot: Bot): AnalyticsBotProgress {
    const progress: AnalyticsBotProgress[] = BotProgress.calculateForAllActivations(positions, bot);

    if (progress.length) {
      const totalProgress: AnalyticsBotProgress = progress.reduce((total, current) => {
        total.changePercent += current.changePercent;
        total.totalLoss += current.totalLoss;
        total.totalFee += current.totalFee;
        total.totalProfit += current.totalProfit
        total.totalResult += current.totalResult;

        return total;
      }, BotProgress.getInitialBotProgress());

      BotProgress.roundProgress(totalProgress);
      totalProgress.state = 'filled';

      return totalProgress;
    }

    return BotProgress.getInitialBotProgress();
  }

  static calculateForAllActivations(positions: Position[], bot: Bot): AnalyticsBotProgress[] {
    const { activations } = bot;
    const progress: AnalyticsBotProgress[] = [];

    if (bot.active) {
      const currentActivationPositions: Position[] = BotProgress.getActivationPositions(positions, activations.length);

      const currentActivationProgress: AnalyticsBotProgress
        = BotProgress.calculateForOneActivation(currentActivationPositions, bot);

      currentActivationProgress.botActivationIndex = activations.length;

      progress.push(currentActivationProgress);
    }

    const prevActivationsProgress: AnalyticsBotProgress[]
      = activations.map((activation, activationIndex) => {
        const activationPositions: Position[] = BotProgress.getActivationPositions(positions, activationIndex);

        return BotProgress.calculateForOneActivation(activationPositions, bot);
      });

    progress.push(...prevActivationsProgress);

    return progress;
  }

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
    progress.state = 'filled';

    BotProgress.roundProgress(progress);

    return progress;
  }


  private static getInitialBotProgress(): AnalyticsBotProgress {
    return { ...emptyBotProgress };
  }

  private static calculateChange(capital: number, totalResult: number): number {
    return ONE_HUNDRED * roundNumber(totalResult, FRACTION_DIGITS_TO_HUNDREDTHS) / capital;
  }

  private static roundProgress(progress: AnalyticsBotProgress): void {
    const round = (num: number) => roundNumber(num, FRACTION_DIGITS_TO_HUNDREDTHS);

    const { changePercent, totalResult, totalProfit, totalLoss, totalFee } = progress;

    progress.changePercent = round(changePercent);
    progress.totalResult = round(totalResult);
    progress.totalProfit = round(totalProfit);
    progress.totalLoss = round(totalLoss);
    progress.totalFee = round(totalFee);
  }

  private static getActivationPositions(positions: Position[], activationIndex: number): Position[] {
    return positions.filter(({ botActivationIndex }) => {
      return botActivationIndex === activationIndex;
    });
  }
}
