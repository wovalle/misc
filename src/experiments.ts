import { Experiment, ExperimentPriority } from './models';
import { getDiff, Change } from '.';

interface IExperimentPriority {
  key: string;
  priority: ExperimentPriority;
}

interface IExperimentChange extends Change {
  priority: ExperimentPriority;
}

export class ExperimentsDiff {
  static PriorityList: IExperimentPriority[] = [
    {
      key: 'key',
      priority: ExperimentPriority.High,
    },
    {
      key: 'variants.weight',
      priority: ExperimentPriority.Medium,
    },
  ];

  static Diff(local: Experiment, remote: Experiment): IExperimentChange[] {
    const arrMeta = [{ path: 'variants', key: 'key' }];
    return getDiff(local, remote, { arrMeta }).map(d => {
      const experimentPriority = ExperimentsDiff.PriorityList.find(
        ep => ep.key === d.prop
      );

      return {
        prop: d.prop,
        type: d.type,
        prev: d.prev,
        next: d.next,
        index: d.index,
        priority: experimentPriority
          ? experimentPriority.priority
          : ExperimentPriority.Low,
      };
    });
  }
}
