class Thing {
  constructor(name, withProxy = true) {
    this.name = name;
    this.currentOp = null;
    this.currentOpVal = null;
    this.having = this.has;
    this.ignore = ['currentOp', 'currentOpVal'];
    return withProxy ? this._proxify(this) : this;
  }

  _proxify(obj) {
    return new Proxy(obj, {
      get(target, name) {
        if (target.currentOp === 'bool') {
          target[`is_a_${name}`] = target.currentOpVal === 'is_a';
          target.currentOp = null;
          target.currentOpVal = null;
          return target;
        }

        if (target.currentOp === 'array') {
          if (target.currentOpVal === 1) {
            target[name] = new Thing(name, false);
          } else {
            target[name] = Array.from(new Array(target.currentOpVal)).map(
              () => new Thing(name.slice(0, -1), false)
            );
          }
          target.currentOp = null;
          target.currentOpVal = null;
          return target;
        }

        if (['is_a', 'is_not_a'].includes(name)) {
          target.currentOp = 'bool';
          target.currentOpVal = name;
          return target._proxify(target);
        }

        return target[name];
      },
    });
  }

  has(val) {
    this.currentOp = 'array';
    this.currentOpVal = val;
    return this;
  }
}

module.exports = Thing;
