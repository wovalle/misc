function highlight(code) {
  const isNumber = n => !Number.isNaN(Number.parseInt(n));
  return code
    .split('')
    .reduce((acc, cur) => {
      if (
        isNumber(acc[0])
          ? isNumber(cur)
          : !isNumber(acc[0]) && (acc[0] || '').includes(cur)
      ) {
        acc[0] = (acc[0] || '') + cur;
      } else {
        acc.unshift(cur);
      }
      return acc;
    }, [])
    .reverse()
    .map(c => {
      const span = p => `<span style="color: ${p}">${c}</span>`;
      if (c[0] === 'F') return span('pink');
      else if (c[0] === 'L') return span('red');
      else if (c[0] === 'R') return span('green');
      else if (isNumber(c)) return span('orange');
      else return c;
    })
    .join('');
}
