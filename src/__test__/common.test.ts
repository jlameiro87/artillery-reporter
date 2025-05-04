import { getScenarioCompletion } from '../utility/common';

describe('getScenarioCompletion', () => {
  it('returns completed and failed counts from counters', () => {
    const report = {
      aggregate: {
        counters: {
          'vusers.completed': 5,
          'vusers.failed': 2,
        },
        rates: {},
        histograms: {},
      },
      intermediate: [],
    };
    const result = getScenarioCompletion(report);
    expect(result).toEqual([
      { name: 'Completed', value: 5 },
      { name: 'Failed', value: 2 },
    ]);
  });

  it('returns zeros if counters missing', () => {
    const report = { aggregate: { counters: {}, rates: {}, histograms: {}, intermediate: [] } };
    const result = getScenarioCompletion(report);
    expect(result).toEqual([
      { name: 'Completed', value: 0 },
      { name: 'Failed', value: 0 },
    ]);
  });

  it('returns empty array if no aggregate', () => {
    const result = getScenarioCompletion({});
    expect(result).toEqual([]);
  });
});
