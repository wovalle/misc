has = val => {
  this.currentOp = 'array';
  this.currentOpVal = val;
  return withProxy(this);
};

having = has;

class ThingArray extends Array {
  each(fn) {
    return this.forEach(e => fn.call(e, e));
  }
}

const withProxy = obj => {
  return new Proxy(obj, {
    get: (target, name) => {
      if (target.currentOp === 'bool') {
        target[`is_a_${name}`] = target.currentOpVal === 'is_a';
        target.currentOp = null;
        target.currentOpVal = null;
      }

      if (target.currentOp === 'array') {
        if (target.currentOpVal === 1) {
          target[name] = new Thing(name, false);
        } else {
          target[name] = ThingArray.from(new Array(target.currentOpVal)).map(
            () => new Thing(name.slice(0, -1), false)
          );
        }
        target.currentOp = null;
        target.currentOpVal = null;
      }

      if (['is_a', 'is_not_a'].includes(name)) {
        target.currentOp = 'bool';
        target.currentOpVal = name;
        return withProxy(target);
      }

      if (['is_the'].includes(name)) {
        target.currentOp = 'declaration';
        return withProxy(target);
      }

      if (target.currentOp === 'declaration') {
        target.currentOp = 'declaration_var';
        target.currentOpVal = name;
        return withProxy(target);
      }

      if (target.currentOp === 'declaration_var') {
        target;
        target.currentOp = null;
        target.currentOpVal = null;
        return withProxy(target);
      }

      const result = target[name];
      return typeof result === 'function' ? result.bind(target) : result;
    },
  });
};

class Thing {
  constructor(name, useProxy = true) {
    this.name = name;
    this.currentOp = null;
    this.currentOpVal = null;
    this.has = has.bind(this);
    this.having = this.has;

    return useProxy ? withProxy(this) : this;
  }
}

module.exports = Thing;
