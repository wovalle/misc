import { expect } from 'chai';
import { getDiff, ChangeType } from './index';

describe('getDiff', () => {
  describe('simple entities', () => {
    it('should work with simple changes', () => {
      const objA = {
        a: 1,
        b: 'string',
      };

      const objB = {
        a: 2,
        b: 'string',
      };

      const diff = getDiff(objA, objB);

      expect(diff[0].prop).to.eql('a');
      expect(diff[0].type).to.eql(ChangeType.Edit);
    });

    it('should work with adding props', () => {
      const objA = {
        a: 1,
      };

      const objB = {
        a: 1,
        b: 'string',
      };

      const diff = getDiff(objA, objB);

      expect(diff[0].prop).to.eql('b');
      expect(diff[0].type).to.eql(ChangeType.Add);
    });

    it('should work with removing props', () => {
      const objA = {
        a: 1,
        b: 'string',
      };

      const objB = {
        a: 1,
      };

      const diff = getDiff(objA, objB);

      expect(diff[0].prop).to.eql('b');
      expect(diff[0].type).to.eql(ChangeType.Delete);
    });

    it('should work with multiple changes', () => {
      const objA = {
        a: 1,
        b: 'string',
      };

      const objB = {
        a: 2,
        b: 'str',
      };

      const diff = getDiff(objA, objB);

      expect(diff.length).to.eql(2);
    });
  });
  describe('object entities', () => {
    it('should work with simple changes', () => {
      const objA = {
        a: 1,
        b: {
          c: 1,
          d: 'lol',
        },
      };

      const objB = {
        a: 1,
        b: {
          c: 2,
          d: 'lol',
        },
      };

      const diff = getDiff(objA, objB);

      expect(diff[0].prop).to.eql('b.c');
      expect(diff[0].type).to.eql(ChangeType.Edit);
    });

    it('should work with adding props', () => {
      const objA = {
        a: 1,
        b: {
          c: 1,
        },
      };

      const objB = {
        a: 1,
        b: {
          c: 1,
          d: 'lol',
        },
      };

      const diff = getDiff(objA, objB);

      expect(diff[0].prop).to.eql('b.d');
      expect(diff[0].type).to.eql(ChangeType.Add);
    });

    it('should work with removing props', () => {
      const objA = {
        a: 1,
        b: {
          c: 1,
          d: 'lol',
        },
      };

      const objB = {
        a: 1,
        b: {
          c: 1,
        },
      };

      const diff = getDiff(objA, objB);
      expect(diff[0].prop).to.eql('b.d');
      expect(diff[0].type).to.eql(ChangeType.Delete);
    });

    it('should work with multiple changes', () => {
      const objA = {
        a: 1,
        b: {
          c: 2,
        },
      };

      const objB = {
        a: 2,
        b: {
          c: 1,
          d: 'lol',
        },
      };

      const diff = getDiff(objA, objB);
      expect(diff.length).to.eql(3);
    });
  });
  describe('array entities', () => {
    it('should work with simple changes', () => {
      const objA = {
        a: 1,
        b: [{ c: 'lol' }],
      };

      const objB = {
        a: 1,
        b: [{ c: 'lola' }],
      };

      const diff = getDiff(objA, objB, {
        path: '',
        isArray: false,
        arrMeta: [{ path: 'b', key: 'c' }],
      });

      expect(diff[0].prop).to.eql('b.c');
      expect(diff[0].index).to.eql(0);
      expect(diff[0].type).to.eql(ChangeType.ElemEdited);
    });

    it('should work with adding props', () => {
      const objA = {
        a: 1,
        b: [{ c: 'lol' }],
      };

      const objB = {
        a: 1,
        b: [{ c: 'lol', d: '1' }],
      };

      const diff = getDiff(objA, objB, {
        path: '',
        isArray: false,
        arrMeta: [{ path: 'b', key: 'c' }],
      });

      expect(diff[0].prop).to.eql('b.d');
      expect(diff[0].index).to.eql(0);
      expect(diff[0].type).to.eql(ChangeType.ElemAdded);
    });

    it('should work with removing props', () => {
      const objA = {
        a: 1,
        b: [{ c: 'lol', d: '1' }],
      };

      const objB = {
        a: 1,
        b: [{ c: 'lol' }],
      };

      const diff = getDiff(objA, objB, {
        path: '',
        isArray: false,
        arrMeta: [{ path: 'b', key: 'c' }],
      });

      expect(diff[0].prop).to.eql('b.d');
      expect(diff[0].index).to.eql(0);
      expect(diff[0].type).to.eql(ChangeType.ElemDeleted);
    });

    it('should work with multiple changes', () => {
      const objA = {
        a: 1,
        b: [{ c: 'lol' }],
      };

      const objB = {
        a: 1,
        b: [{ c: 'lol', d: '1' }],
      };

      const diff = getDiff(objA, objB, {
        path: '',
        isArray: false,
        arrMeta: [{ path: 'b', key: 'c' }],
      });

      expect(diff[0].prop).to.eql('b.d');
      expect(diff[0].type).to.eql(ChangeType.ElemAdded);
    });
  });
});
