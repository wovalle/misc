const fs = require('fs');
const Utimes = require('@ronomon/utimes');

const filenameRegex = /(?<id>(.*?))@(?<d>\d{2})-(?<m>\d{2})-(?<y>\d{4})_(?<h>\d{2})-(?<n>\d{2})-(?<s>\d{2})/;
const path = './';

const changeTime = async (root, file, time) => {
  const path = `${root}${file}`;

  const btime = time.getTime();
  const mtime = time.getTime();
  const atime = time.getTime();
  Utimes.utimes(path, btime, mtime, atime, err => {
    if (err) throw err;
    return Promise.resolve();
  });
};

fs.readdir(path, async function(err, items) {
  for (const file of items) {
    if (!file.endsWith('.jpg')) continue;
    const s = filenameRegex.exec(file);
    const d = new Date(
      +s.groups.y,
      +s.groups.m - 1,
      +s.groups.d,
      +s.groups.h,
      +s.groups.n,
      +s.groups.s
    );

    await changeTime(path, file, d);
    // console.log(file);
    console.log(file, d);
  }
});
