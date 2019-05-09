class Query {
  constructor() {
    this.collection = [];
    this.mapFn = null;
    this.whereFns = [];
    this.groupByFns = null;
    this.orderByFn = null;
    this.havingFn = null;
  }

  select(fn) {
    this.mapFn = fn;
    return this;
  }

  from(col) {
    this.collection = col;
    return this;
  }

  where(...fns) {
    this.whereFns.push(fns);
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

  having(fn) {
    this.havingFn = fn;
    return this;
  }

  execute() {
    let data = this.collection;

    if (this.whereFns.length) {
      data = this.whereFns.reduce((_, fns) => {
        return fns.reduce((acc2, fn) => {
          acc2 = acc2.concat(data.filter(fn).reverse());
          return acc2;
        }, []);
      }, []);
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

    if (this.havingFn) {
      data = data.filter(this.havingFn);
    }

    return data;
  }
}

module.exports = () => new Query();
