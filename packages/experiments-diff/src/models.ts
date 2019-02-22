export class ExperimentVariant {
  public key: string = '';
  public weight: number = 0;
}

export class Experiment {
  public name: string = '';
  public key: string = '';
  public hypothesis: string = '';
  public variants: ExperimentVariant[] = [];
  public rollout: number = 0;
}

export enum ExperimentPriority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}
