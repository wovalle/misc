class Query {
  constructor() {
    this.collection = null;
    this.selectFn = null;
    this.whereFns = [];
    this.groupByFns = null;
    this.orderByFn = null;
    this.havingFns = [];
  }

  select(fn) {
    if (this.selectFn) {
      throw new Error('Duplicate SELECT');
    }
    this.selectFn = fn ? fn : e => e;
    return this;
  }

  from(...cols) {
    if (this.collection) {
      throw new Error('Duplicate FROM');
    }

    if (cols.length > 1) {
      const mergedCollections = [];
      for (let i = 0; i < cols.length - 1; i++) {
        for (let j = 0; j < cols.length; j++) {
          for (let k = 0; k < cols[i].length; k++) {
            mergedCollections.push([cols[i][j], cols[i + 1][k]]);
          }
        }
      }
      this.collection = mergedCollections || [];
    } else {
      this.collection = cols[0] || [];
    }
    return this;
  }

  where(...fns) {
    this.whereFns.push(fns);
    return this;
  }

  groupBy(...fns) {
    if (this.groupByFns) {
      throw new Error('Duplicate GROUPBY');
    }

    this.groupByFns = fns;
    return this;
  }

  orderBy(fn) {
    if (this.orderByFn) {
      throw new Error('Duplicate ORDERBY');
    }

    this.orderByFn = fn;
    return this;
  }

  having(...fns) {
    this.havingFns.push(fns);
    return this;
  }

  execute() {
    let data = this.collection || [];

    if (this.whereFns.length) {
      data = this.whereFns.reduce((andAcc, fns) => {
        return fns.reduce((acc, fn) => {
          acc = acc.concat(andAcc.filter(fn));
          return acc;
        }, []);
      }, data);
    }

    if (this.groupByFns) {
      const groupBy = (arr, fns) => {
        if (!fns[0]) {
          return arr;
        }

        const obj = arr.reduce((acc, cur) => {
          const k = fns[0](cur);
          acc.set(k, acc.get(k) ? acc.get(k).concat([cur]) : [cur]);
          return acc;
        }, new Map());

        return [...obj].map(e => {
          return [e[0], groupBy(e[1], fns.slice(1))];
        });
      };

      data = groupBy(data, this.groupByFns);
    }

    if (this.havingFns.length) {
      data = this.havingFns.reduce((_, fns) => {
        return fns.reduce((acc, fn) => {
          return acc.concat(data.filter(fn));
        }, []);
      }, []);
    }

    if (this.selectFn) {
      data = data.map(this.selectFn);
    }

    if (this.orderByFn) {
      data = data.sort(this.orderByFn);
    }

    // console.log(JSON.stringify(data, null, 2));
    return data;
  }
}

module.exports = () => new Query();
