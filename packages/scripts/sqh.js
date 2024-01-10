function d(m) {
  return m.length === 1 ? "'\\''" : `'"${m}"'`;
}

const n = /\x00+/g;
// eslint-disable-next-line no-useless-escape
const b = /^[A-Za-z0-9,:=_\.\/\-]+$/;
const p = /'+/g;

function q(o, x) {
  if (!x) {
    return o.empty || "''";
  }
  const s = String(x).replace(n, "");
  const m = b.exec(s);
  if (m && m[0].length === s.length) {
    const g = o.gratuitous || "";
    return g + s + g;
  }
  return ("'" + s.replace(p, d) + "'").replace(/^''/, "").replace(/''$/, "");
}

function shq(x) {
  return q(false, x);
}

function cfg(opt) {
  if (!opt) {
    return shq;
  }
  return function custom(x) {
    return q(opt, x);
  };
}

Object.assign(shq, {
  cfg,
  always: cfg({ gratuitous: "'" }),
});

export default shq;
