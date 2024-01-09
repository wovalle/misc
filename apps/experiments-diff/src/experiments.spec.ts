import { expect } from 'chai';
import { Experiment, ExperimentPriority, ExperimentVariant } from './models';
import { ExperimentsDiff } from './experiments';
import { ChangeType } from '.';

describe('ExperimentDiff', () => {
  describe('should diff', () => {
    it('simple changes', () => {
      const localExperiment = new Experiment();
      localExperiment.key = 'local-experiment';
      localExperiment.name = 'Local Experiment';

      const remoteExperiment = new Experiment();
      remoteExperiment.key = 'remote-experiment';
      remoteExperiment.name = 'Remote Experiment';

      const diff = ExperimentsDiff.Diff(localExperiment, remoteExperiment);

      expect(diff.length).to.eql(2);
      expect(diff[0].prop).to.eql('name');
      expect(diff[0].type).to.eql(ChangeType.Edit);
      expect(diff[0].priority).to.eql(ExperimentPriority.Low);
      expect(diff.length).to.eql(2);
      expect(diff[1].prop).to.eql('key');
      expect(diff[1].type).to.eql(ChangeType.Edit);
      expect(diff[1].priority).to.eql(ExperimentPriority.High);
    });
    it('variant changes', () => {
      const localExperiment = new Experiment();
      localExperiment.key = 'experiment-a';
      localExperiment.name = 'experiment-a';
      localExperiment.variants = [
        { key: 'control', weight: 50 },
        { key: 'variant-a', weight: 50 },
      ];

      const remoteExperiment = new Experiment();
      remoteExperiment.key = 'experiment-a';
      remoteExperiment.name = 'experiment-a';
      remoteExperiment.variants = [
        { key: 'control', weight: 40 },
        { key: 'variant-a', weight: 60 },
      ];

      const diff = ExperimentsDiff.Diff(localExperiment, remoteExperiment);

      expect(diff.length).to.eql(2);
      expect(diff[0].prop).to.eql('variants.weight');
      expect(diff[0].type).to.eql(ChangeType.ElemEdited);
      expect(diff[0].priority).to.eql(ExperimentPriority.Medium);
      expect(diff[0].prev).to.eql(localExperiment.variants[0].weight);
      expect(diff[0].next).to.eql(remoteExperiment.variants[0].weight);
      expect(diff[0].index).to.eql(0);

      expect(diff[1].prop).to.eql('variants.weight');
      expect(diff[1].type).to.eql(ChangeType.ElemEdited);
      expect(diff[1].priority).to.eql(ExperimentPriority.Medium);
      expect(diff[1].prev).to.eql(localExperiment.variants[1].weight);
      expect(diff[1].next).to.eql(remoteExperiment.variants[1].weight);
      expect(diff[1].index).to.eql(1);
    });
  });
});
