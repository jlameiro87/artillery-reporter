import { ArtilleryReport } from '../types/artillery';
import { getScenarioCompletion } from '../utility/common';
import * as common from '../utility/common';

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

describe('common utility functions', () => {
  it('getAggregateStats returns expected structure', () => {
    const fakeReport = { aggregate: { counters: { 'http.requests': 10 }, rates: {}, histograms: {} } };
    const result = common.getAggregateStats(fakeReport);
    expect(result).toHaveProperty('requests');
  });

  it('highlight returns correct style for higher/lower', () => {
    expect(common.highlight(2, 1, 'higher')).toEqual({ fontWeight: 'bold', color: '#43a047' });
    expect(common.highlight(1, 2, 'higher')).toEqual({ fontWeight: 'bold', color: '#e53935' });
    expect(common.highlight(1, 1, 'higher')).toEqual({});
    expect(common.highlight(1, 2, 'lower')).toEqual({ fontWeight: 'bold', color: '#43a047' });
    expect(common.highlight(2, 1, 'lower')).toEqual({ fontWeight: 'bold', color: '#e53935' });
  });

  it('toChartData returns empty array for missing intermediate', () => {
    expect(common.toChartData(undefined)).toEqual([]);
  });

  it('getErrorRates returns empty array for missing input', () => {
    const fakeReport = {} as ArtilleryReport;
    expect(common.getErrorRates(fakeReport)).toEqual([]);
  });

  it('getThroughput returns empty array for missing input', () => {
    const fakeReport = {} as ArtilleryReport;
    expect(common.getThroughput(fakeReport)).toEqual([]);
  });

  it('getScenarioCompletion returns 0s for missing input', () => {
    const fakeReport = { aggregate: {} } as ArtilleryReport;
    expect(common.getScenarioCompletion(fakeReport)).toEqual([]);
  });
});
