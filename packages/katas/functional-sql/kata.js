class Query {
  constructor() {
    this.data = [];
    this.mapFn = null;
    this.whereFn = null;
    this.groupByFns = null;
    this.orderByFn = null;
  }

  select(fn) {
    this.mapFn = fn;
    return this;
  }
  from(arr = []) {
    this.data = arr;
    return this;
  }

  where(fn) {
    this.whereFn = fn;
    return this;
  }

  groupBy(...fns) {
    this.groupByFns = fns;
    return this;
  }

  orderBy(fn) {
    this.orderByFn = fn;
    return this;
  }

  execute() {
    let data = this.data;
    if (this.whereFn) {
      data = data.filter(this.whereFn);
    }

    if (this.groupByFns) {
      const groupBy = (arr, fns) => {
        if (!fns[0]) {
          return arr;
        }

        const obj = arr.reduce((acc, cur) => {
          const k = fns[0](cur);
          acc.set(k, acc.get(k) ? acc.get(k).concat(cur) : [cur]);
          return acc;
        }, new Map());

        return [...obj].map(e => {
          return [e[0], groupBy(e[1], fns.slice(1))];
        });
      };

      data = groupBy(data, this.groupByFns);
    }

    if (this.orderByFn) {
      data = data.sort(this.orderByFn);
    }

    if (this.mapFn) {
      data = data.map(this.mapFn);
    }

    return data;
  }
}

module.exports = () => new Query();
