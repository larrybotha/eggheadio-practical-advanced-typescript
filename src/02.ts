import * as assert from 'assert';

const log = (...args: any[]) => console.log(...args);

const africaPopulation = 1234567890;
const africaPopulationReadable = 1_234_567_890;

log(africaPopulation, africaPopulationReadable);
log(assert.equal(africaPopulation, africaPopulationReadable));

class AmountInput {
  private static MAX_ALLOWED = 99_999_999;

  amount: number = 0;

  showTooltip() {
    setTimeout(() => {
      // show tooltip
    }, 2_500);
  }

  formatMillion() {
    return `${this.amount / 1_000_000_000}M`;
  }
}
