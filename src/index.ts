export enum ChangeType {
  Add = 'Add',
  Edit = 'Edit',
  Delete = 'Delete',
  ElemAdded = 'ElemAdded',
  ElemEdited = 'ElemEdited',
  ElemDeleted = 'ElemDeleted',
}

export class Change {
  public type: ChangeType;
  public prop: string;

  constructor(prop: string, type: ChangeType) {
    this.type = type;
    this.prop = prop;
  }
}

// FakeSlack
// FakeDb

// We won't ever have many experiments at the same time,
// we can get away with the n^2

interface IArrayDiffOpts {
  path: string;
  key: string;
}

interface IDiffOpts {
  path: string;
  isArray: boolean;
  arrMeta: IArrayDiffOpts[];
}

export function getDiff<T extends Object>(
  local: T,
  remote: T,
  opts: IDiffOpts = { path: '', isArray: false, arrMeta: [] }
): Change[] {
  let changes: Change[] = [];
  const localKeys = Object.keys(local);
  const remoteKeys = Object.keys(remote);
  const getPath = (prop: string) => (opts.path ? `${opts.path}.${prop}` : prop);

  const commonKeys = localKeys.filter(x => remoteKeys.includes(x));
  const addedKeys = remoteKeys.filter(x => !commonKeys.includes(x));
  const deletedKeys = localKeys.filter(x => !commonKeys.includes(x));

  for (const k of commonKeys) {
    if (Array.isArray(local[k])) {
      const path = getPath(k);
      /*
        React simplifies this problem requiring a `key` prop
        to know for sure if the elem existence. 
      */
      const meta = opts.arrMeta.find(e => e.path === path);
      if (!meta) {
        throw new Error(
          `Could not compare array in '${path}' because no key was provided`
        );
      }

      const arrLocalEntries: Array<{ i: number; key: string }> =
        local[k].map(e => e[meta.key]) || [];

      const arrRemoteEntries: Array<{ i: number; key: string }> =
        remote[k].map(e => e[meta.key]) || [];

      const commonEntries = arrLocalEntries.filter(localEntry =>
        arrRemoteEntries.some(remoteEntry => remoteEntry.key === localEntry.key)
      );

      const onlyInLocal = arrRemoteEntries.filter(
        entry => !commonEntries.some(e => e.key === entry.key)
      );

      const onlyInRemote = arrLocalEntries.filter(
        entry => !commonEntries.some(e => e.key === entry.key)
      );

      let arrChanges: Change[] = [];

      for (let i = 0; i < local[k].length; i++) {
        const elemPath = `${path}.${i}`;
        if (onlyInLocal.includes(local[k][i])) {
          arrChanges.push(new Change(elemPath, ChangeType.ElemDeleted));
        } else {
          arrChanges = arrChanges.concat(
            getDiff(local[k][i], remote[k][i], {
              ...opts,
              path: elemPath,
              isArray: true,
            })
          );
        }
      }
      arrChanges = arrChanges.concat(
        onlyInRemote.map(e => new Change(path, ChangeType.ElemAdded))
      );

      changes = changes.concat(arrChanges);
    } else if (typeof local[k] === 'object') {
      changes = changes.concat(
        getDiff(local[k], remote[k], {
          path: getPath(k),
          isArray: false,
          arrMeta: opts.arrMeta,
        })
      );
    } else {
      if (local[k] !== remote[k]) {
        changes.push(
          new Change(
            getPath(k),
            opts.isArray ? ChangeType.ElemEdited : ChangeType.Edit
          )
        );
      }
    }
  }

  addedKeys.forEach(k =>
    changes.push(
      new Change(
        getPath(k),
        opts.isArray ? ChangeType.ElemAdded : ChangeType.Add
      )
    )
  );
  deletedKeys.forEach(k =>
    changes.push(
      new Change(
        getPath(k),
        opts.isArray ? ChangeType.ElemDeleted : ChangeType.Delete
      )
    )
  );

  return changes;
}
