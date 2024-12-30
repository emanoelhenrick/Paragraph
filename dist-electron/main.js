import Bo, { app as Te, ipcMain as L, nativeImage as qo, BrowserWindow as $t } from "electron";
import { fileURLToPath as Io } from "node:url";
import me from "node:path";
import Se, { TextEncoder as Uo } from "util";
import F from "path";
import Ge from "fs";
import si from "crypto";
import Ft from "os";
import Z, { Readable as Mo } from "stream";
import oi from "http";
import ri from "https";
import Hn from "url";
import Ho from "assert";
import ci from "tty";
import de from "zlib";
import { EventEmitter as Wo } from "events";
import Vo from "child_process";
import Jo from "net";
function pi(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var Wn = {}, Go = (n) => function() {
  const e = arguments.length, a = new Array(e);
  for (let i = 0; i < e; i += 1)
    a[i] = arguments[i];
  return new Promise((i, t) => {
    a.push((s, o) => {
      s ? t(s) : i(o);
    }), n.apply(null, a);
  });
};
const Cn = Ge, Ko = Go, Xo = (n) => [
  typeof Cn[n] == "function",
  !n.match(/Sync$/),
  !n.match(/^[A-Z]/),
  !n.match(/^create/),
  !n.match(/^(un)?watch/)
].every(Boolean), Yo = (n) => {
  const e = Cn[n];
  return Ko(e);
}, Zo = () => {
  const n = {};
  return Object.keys(Cn).forEach((e) => {
    Xo(e) ? e === "exists" ? n.exists = () => {
      throw new Error("fs.exists() is deprecated");
    } : n[e] = Yo(e) : n[e] = Cn[e];
  }), n;
};
var X = Zo(), _e = {};
const Qo = (n) => {
  const e = (a) => ["a", "e", "i", "o", "u"].indexOf(a[0]) !== -1 ? `an ${a}` : `a ${a}`;
  return n.map(e).join(" or ");
}, Lt = (n) => /array of /.test(n), Nt = (n) => n.split(" of ")[1], zt = (n) => Lt(n) ? zt(Nt(n)) : [
  "string",
  "number",
  "boolean",
  "array",
  "object",
  "buffer",
  "null",
  "undefined",
  "function"
].some((e) => e === n), Ie = (n) => n === null ? "null" : Array.isArray(n) ? "array" : Buffer.isBuffer(n) ? "buffer" : typeof n, er = (n, e, a) => a.indexOf(n) === e, nr = (n) => {
  let e = Ie(n), a;
  return e === "array" && (a = n.map((i) => Ie(i)).filter(er), e += ` of ${a.join(", ")}`), e;
}, ar = (n, e) => {
  const a = Nt(e);
  return Ie(n) !== "array" ? !1 : n.every((i) => Ie(i) === a);
}, Ba = (n, e, a, i) => {
  if (!i.some((s) => {
    if (!zt(s))
      throw new Error(`Unknown type "${s}"`);
    return Lt(s) ? ar(a, s) : s === Ie(a);
  }))
    throw new Error(
      `Argument "${e}" passed to ${n} must be ${Qo(
        i
      )}. Received ${nr(a)}`
    );
}, ir = (n, e, a, i) => {
  a !== void 0 && (Ba(n, e, a, ["object"]), Object.keys(a).forEach((t) => {
    const s = `${e}.${t}`;
    if (i[t] !== void 0)
      Ba(n, s, a[t], i[t]);
    else
      throw new Error(
        `Unknown argument "${s}" passed to ${n}`
      );
  }));
};
var U = {
  argument: Ba,
  options: ir
}, ne = {}, Vn = {};
Vn.normalizeFileMode = (n) => {
  let e;
  return typeof n == "number" ? e = n.toString(8) : e = n, e.substring(e.length - 3);
};
var Pe = {};
const Dt = X, tr = U, sr = (n, e) => {
  const a = `${n}([path])`;
  tr.argument(a, "path", e, ["string", "undefined"]);
}, or = (n) => {
  Dt.rmSync(n, {
    recursive: !0,
    force: !0,
    maxRetries: 3
  });
}, rr = (n) => Dt.rm(n, {
  recursive: !0,
  force: !0,
  maxRetries: 3
});
Pe.validateInput = sr;
Pe.sync = or;
Pe.async = rr;
const Jn = F, se = X, li = Vn, Di = U, Bt = Pe, cr = (n, e, a) => {
  const i = `${n}(path, [criteria])`;
  Di.argument(i, "path", e, ["string"]), Di.options(i, "criteria", a, {
    empty: ["boolean"],
    mode: ["string", "number"]
  });
}, qt = (n) => {
  const e = n || {};
  return typeof e.empty != "boolean" && (e.empty = !1), e.mode !== void 0 && (e.mode = li.normalizeFileMode(e.mode)), e;
}, It = (n) => new Error(
  `Path ${n} exists but is not a directory. Halting jetpack.dir() call for safety reasons.`
), pr = (n) => {
  let e;
  try {
    e = se.statSync(n);
  } catch (a) {
    if (a.code !== "ENOENT")
      throw a;
  }
  if (e && !e.isDirectory())
    throw It(n);
  return e;
}, ui = (n, e) => {
  const a = e || {};
  try {
    se.mkdirSync(n, a.mode);
  } catch (i) {
    if (i.code === "ENOENT")
      ui(Jn.dirname(n), a), se.mkdirSync(n, a.mode);
    else if (i.code !== "EEXIST") throw i;
  }
}, lr = (n, e, a) => {
  const i = () => {
    const s = li.normalizeFileMode(e.mode);
    a.mode !== void 0 && a.mode !== s && se.chmodSync(n, a.mode);
  }, t = () => {
    a.empty && se.readdirSync(n).forEach((o) => {
      Bt.sync(Jn.resolve(n, o));
    });
  };
  i(), t();
}, ur = (n, e) => {
  const a = qt(e), i = pr(n);
  i ? lr(n, i, a) : ui(n, a);
}, dr = (n) => new Promise((e, a) => {
  se.stat(n).then((i) => {
    i.isDirectory() ? e(i) : a(It(n));
  }).catch((i) => {
    i.code === "ENOENT" ? e(void 0) : a(i);
  });
}), mr = (n) => new Promise((e, a) => {
  se.readdir(n).then((i) => {
    const t = (s) => {
      if (s === i.length)
        e();
      else {
        const o = Jn.resolve(n, i[s]);
        Bt.async(o).then(() => {
          t(s + 1);
        });
      }
    };
    t(0);
  }).catch(a);
}), fr = (n, e, a) => new Promise((i, t) => {
  const s = () => {
    const r = li.normalizeFileMode(e.mode);
    return a.mode !== void 0 && a.mode !== r ? se.chmod(n, a.mode) : Promise.resolve();
  }, o = () => a.empty ? mr(n) : Promise.resolve();
  s().then(o).then(i, t);
}), di = (n, e) => {
  const a = e || {};
  return new Promise((i, t) => {
    se.mkdir(n, a.mode).then(i).catch((s) => {
      s.code === "ENOENT" ? di(Jn.dirname(n), a).then(() => se.mkdir(n, a.mode)).then(i).catch((o) => {
        o.code === "EEXIST" ? i() : t(o);
      }) : s.code === "EEXIST" ? i() : t(s);
    });
  });
}, xr = (n, e) => new Promise((a, i) => {
  const t = qt(e);
  dr(n).then((s) => s !== void 0 ? fr(
    n,
    s,
    t
  ) : di(n, t)).then(a, i);
});
ne.validateInput = cr;
ne.sync = ur;
ne.createSync = ui;
ne.async = xr;
ne.createAsync = di;
const Ut = F, Ce = X, xa = U, Mt = ne, hr = (n, e, a, i) => {
  const t = `${n}(path, data, [options])`;
  xa.argument(t, "path", e, ["string"]), xa.argument(t, "data", a, [
    "string",
    "buffer",
    "object",
    "array"
  ]), xa.options(t, "options", i, {
    mode: ["string", "number"],
    atomic: ["boolean"],
    jsonIndent: ["number"]
  });
}, On = ".__new__", Ht = (n, e) => {
  let a = e;
  return typeof a != "number" && (a = 2), typeof n == "object" && !Buffer.isBuffer(n) && n !== null ? JSON.stringify(n, null, a) : n;
}, Wt = (n, e, a) => {
  try {
    Ce.writeFileSync(n, e, a);
  } catch (i) {
    if (i.code === "ENOENT")
      Mt.createSync(Ut.dirname(n)), Ce.writeFileSync(n, e, a);
    else
      throw i;
  }
}, vr = (n, e, a) => {
  Wt(n + On, e, a), Ce.renameSync(n + On, n);
}, br = (n, e, a) => {
  const i = a || {}, t = Ht(e, i.jsonIndent);
  let s = Wt;
  i.atomic && (s = vr), s(n, t, { mode: i.mode });
}, Vt = (n, e, a) => new Promise((i, t) => {
  Ce.writeFile(n, e, a).then(i).catch((s) => {
    s.code === "ENOENT" ? Mt.createAsync(Ut.dirname(n)).then(() => Ce.writeFile(n, e, a)).then(i, t) : t(s);
  });
}), gr = (n, e, a) => new Promise((i, t) => {
  Vt(n + On, e, a).then(() => Ce.rename(n + On, n)).then(i, t);
}), yr = (n, e, a) => {
  const i = a || {}, t = Ht(e, i.jsonIndent);
  let s = Vt;
  return i.atomic && (s = gr), s(n, t, { mode: i.mode });
};
_e.validateInput = hr;
_e.sync = br;
_e.async = yr;
const Jt = X, Gt = _e, ha = U, wr = (n, e, a, i) => {
  const t = `${n}(path, data, [options])`;
  ha.argument(t, "path", e, ["string"]), ha.argument(t, "data", a, ["string", "buffer"]), ha.options(t, "options", i, {
    mode: ["string", "number"]
  });
}, Er = (n, e, a) => {
  try {
    Jt.appendFileSync(n, e, a);
  } catch (i) {
    if (i.code === "ENOENT")
      Gt.sync(n, e, a);
    else
      throw i;
  }
}, kr = (n, e, a) => new Promise((i, t) => {
  Jt.appendFile(n, e, a).then(i).catch((s) => {
    s.code === "ENOENT" ? Gt.async(n, e, a).then(i, t) : t(s);
  });
});
Wn.validateInput = wr;
Wn.sync = Er;
Wn.async = kr;
var Gn = {};
const Kn = X, mi = Vn, Bi = U, Xn = _e, Sr = (n, e, a) => {
  const i = `${n}(path, [criteria])`;
  Bi.argument(i, "path", e, ["string"]), Bi.options(i, "criteria", a, {
    content: ["string", "buffer", "object", "array"],
    jsonIndent: ["number"],
    mode: ["string", "number"]
  });
}, Kt = (n) => {
  const e = n || {};
  return e.mode !== void 0 && (e.mode = mi.normalizeFileMode(e.mode)), e;
}, Xt = (n) => new Error(
  `Path ${n} exists but is not a file. Halting jetpack.file() call for safety reasons.`
), _r = (n) => {
  let e;
  try {
    e = Kn.statSync(n);
  } catch (a) {
    if (a.code !== "ENOENT")
      throw a;
  }
  if (e && !e.isFile())
    throw Xt(n);
  return e;
}, Rr = (n, e, a) => {
  const i = mi.normalizeFileMode(e.mode), t = () => a.content !== void 0 ? (Xn.sync(n, a.content, {
    mode: i,
    jsonIndent: a.jsonIndent
  }), !0) : !1, s = () => {
    a.mode !== void 0 && a.mode !== i && Kn.chmodSync(n, a.mode);
  };
  t() || s();
}, Ar = (n, e) => {
  let a = "";
  e.content !== void 0 && (a = e.content), Xn.sync(n, a, {
    mode: e.mode,
    jsonIndent: e.jsonIndent
  });
}, jr = (n, e) => {
  const a = Kt(e), i = _r(n);
  i !== void 0 ? Rr(n, i, a) : Ar(n, a);
}, Tr = (n) => new Promise((e, a) => {
  Kn.stat(n).then((i) => {
    i.isFile() ? e(i) : a(Xt(n));
  }).catch((i) => {
    i.code === "ENOENT" ? e(void 0) : a(i);
  });
}), Cr = (n, e, a) => {
  const i = mi.normalizeFileMode(e.mode), t = () => new Promise((o, r) => {
    a.content !== void 0 ? Xn.async(n, a.content, {
      mode: i,
      jsonIndent: a.jsonIndent
    }).then(() => {
      o(!0);
    }).catch(r) : o(!1);
  }), s = () => {
    if (a.mode !== void 0 && a.mode !== i)
      return Kn.chmod(n, a.mode);
  };
  return t().then((o) => {
    if (!o)
      return s();
  });
}, Or = (n, e) => {
  let a = "";
  return e.content !== void 0 && (a = e.content), Xn.async(n, a, {
    mode: e.mode,
    jsonIndent: e.jsonIndent
  });
}, Pr = (n, e) => new Promise((a, i) => {
  const t = Kt(e);
  Tr(n).then((s) => s !== void 0 ? Cr(n, s, t) : Or(n, t)).then(a, i);
});
Gn.validateInput = Sr;
Gn.sync = jr;
Gn.async = Pr;
var Yn = {}, Ke = {}, oe = {};
const Yt = si, $r = F, fe = X, qi = U, qa = ["md5", "sha1", "sha256", "sha512"], Ia = ["report", "follow"], Fr = (n, e, a) => {
  const i = `${n}(path, [options])`;
  if (qi.argument(i, "path", e, ["string"]), qi.options(i, "options", a, {
    checksum: ["string"],
    mode: ["boolean"],
    times: ["boolean"],
    absolutePath: ["boolean"],
    symlinks: ["string"]
  }), a && a.checksum !== void 0 && qa.indexOf(a.checksum) === -1)
    throw new Error(
      `Argument "options.checksum" passed to ${i} must have one of values: ${qa.join(
        ", "
      )}`
    );
  if (a && a.symlinks !== void 0 && Ia.indexOf(a.symlinks) === -1)
    throw new Error(
      `Argument "options.symlinks" passed to ${i} must have one of values: ${Ia.join(
        ", "
      )}`
    );
}, Zt = (n, e, a) => {
  const i = {};
  return i.name = $r.basename(n), a.isFile() ? (i.type = "file", i.size = a.size) : a.isDirectory() ? i.type = "dir" : a.isSymbolicLink() ? i.type = "symlink" : i.type = "other", e.mode && (i.mode = a.mode), e.times && (i.accessTime = a.atime, i.modifyTime = a.mtime, i.changeTime = a.ctime, i.birthTime = a.birthtime), e.absolutePath && (i.absolutePath = n), i;
}, Lr = (n, e) => {
  const a = Yt.createHash(e), i = fe.readFileSync(n);
  return a.update(i), a.digest("hex");
}, Nr = (n, e, a) => {
  e.type === "file" && a.checksum ? e[a.checksum] = Lr(n, a.checksum) : e.type === "symlink" && (e.pointsAt = fe.readlinkSync(n));
}, zr = (n, e) => {
  let a = fe.lstatSync, i;
  const t = e || {};
  t.symlinks === "follow" && (a = fe.statSync);
  try {
    i = a(n);
  } catch (o) {
    if (o.code === "ENOENT")
      return;
    throw o;
  }
  const s = Zt(n, t, i);
  return Nr(n, s, t), s;
}, Dr = (n, e) => new Promise((a, i) => {
  const t = Yt.createHash(e), s = fe.createReadStream(n);
  s.on("data", (o) => {
    t.update(o);
  }), s.on("end", () => {
    a(t.digest("hex"));
  }), s.on("error", i);
}), Br = (n, e, a) => e.type === "file" && a.checksum ? Dr(n, a.checksum).then((i) => (e[a.checksum] = i, e)) : e.type === "symlink" ? fe.readlink(n).then((i) => (e.pointsAt = i, e)) : Promise.resolve(e), qr = (n, e) => new Promise((a, i) => {
  let t = fe.lstat;
  const s = e || {};
  s.symlinks === "follow" && (t = fe.stat), t(n).then((o) => {
    const r = Zt(n, s, o);
    Br(n, r, s).then(a, i);
  }).catch((o) => {
    o.code === "ENOENT" ? a(void 0) : i(o);
  });
});
oe.supportedChecksumAlgorithms = qa;
oe.symlinkOptions = Ia;
oe.validateInput = Fr;
oe.sync = zr;
oe.async = qr;
var Zn = {};
const Qt = X, Ir = U, Ur = (n, e) => {
  const a = `${n}(path)`;
  Ir.argument(a, "path", e, ["string", "undefined"]);
}, Mr = (n) => {
  try {
    return Qt.readdirSync(n);
  } catch (e) {
    if (e.code === "ENOENT")
      return;
    throw e;
  }
}, Hr = (n) => new Promise((e, a) => {
  Qt.readdir(n).then((i) => {
    e(i);
  }).catch((i) => {
    i.code === "ENOENT" ? e(void 0) : a(i);
  });
});
Zn.validateInput = Ur;
Zn.sync = Mr;
Zn.async = Hr;
const Pn = Ge, $n = F, qe = oe, Fn = (n) => n.isDirectory() ? "dir" : n.isFile() ? "file" : n.isSymbolicLink() ? "symlink" : "other", Wr = (n, e, a) => {
  e.maxLevelsDeep === void 0 && (e.maxLevelsDeep = 1 / 0);
  const i = e.inspectOptions !== void 0;
  e.symlinks && (e.inspectOptions === void 0 ? e.inspectOptions = { symlinks: e.symlinks } : e.inspectOptions.symlinks = e.symlinks);
  const t = (o, r) => {
    Pn.readdirSync(o, { withFileTypes: !0 }).forEach((c) => {
      const p = typeof c == "string";
      let l;
      p ? l = $n.join(o, c) : l = $n.join(o, c.name);
      let u;
      if (i)
        u = qe.sync(l, e.inspectOptions);
      else if (p) {
        const d = qe.sync(
          l,
          e.inspectOptions
        );
        u = { name: d.name, type: d.type };
      } else {
        const d = Fn(c);
        if (d === "symlink" && e.symlinks === "follow") {
          const x = Pn.statSync(l);
          u = { name: c.name, type: Fn(x) };
        } else
          u = { name: c.name, type: d };
      }
      u !== void 0 && (a(l, u), u.type === "dir" && r < e.maxLevelsDeep && t(l, r + 1));
    });
  }, s = qe.sync(n, e.inspectOptions);
  s ? (i ? a(n, s) : a(n, { name: s.name, type: s.type }), s.type === "dir" && t(n, 1)) : a(n, void 0);
}, Vr = 5, Jr = (n, e, a, i) => {
  e.maxLevelsDeep === void 0 && (e.maxLevelsDeep = 1 / 0);
  const t = e.inspectOptions !== void 0;
  e.symlinks && (e.inspectOptions === void 0 ? e.inspectOptions = { symlinks: e.symlinks } : e.inspectOptions.symlinks = e.symlinks);
  const s = [];
  let o = 0;
  const r = () => {
    if (s.length === 0 && o === 0)
      i();
    else if (s.length > 0 && o < Vr) {
      const u = s.pop();
      o += 1, u();
    }
  }, c = (u) => {
    s.push(u), r();
  }, p = () => {
    o -= 1, r();
  }, l = (u, d) => {
    const x = (m, v) => {
      v.type === "dir" && d < e.maxLevelsDeep && l(m, d + 1);
    };
    c(() => {
      Pn.readdir(u, { withFileTypes: !0 }, (m, v) => {
        m ? i(m) : (v.forEach((h) => {
          const b = typeof h == "string";
          let y;
          if (b ? y = $n.join(u, h) : y = $n.join(u, h.name), t || b)
            c(() => {
              qe.async(y, e.inspectOptions).then((w) => {
                w !== void 0 && (t ? a(y, w) : a(y, {
                  name: w.name,
                  type: w.type
                }), x(y, w)), p();
              }).catch((w) => {
                i(w);
              });
            });
          else {
            const w = Fn(h);
            if (w === "symlink" && e.symlinks === "follow")
              c(() => {
                Pn.stat(y, (_, k) => {
                  if (_)
                    i(_);
                  else {
                    const C = {
                      name: h.name,
                      type: Fn(k)
                    };
                    a(y, C), x(y, C), p();
                  }
                });
              });
            else {
              const _ = { name: h.name, type: w };
              a(y, _), x(y, _);
            }
          }
        }), p());
      });
    });
  };
  qe.async(n, e.inspectOptions).then((u) => {
    u ? (t ? a(n, u) : a(n, { name: u.name, type: u.type }), u.type === "dir" ? l(n, 1) : i()) : (a(n, void 0), i());
  }).catch((u) => {
    i(u);
  });
};
Ke.sync = Wr;
Ke.async = Jr;
var fi = {};
const Gr = typeof process == "object" && process && process.platform === "win32";
var Kr = Gr ? { sep: "\\" } : { sep: "/" }, Xr = es;
function es(n, e, a) {
  n instanceof RegExp && (n = Ii(n, a)), e instanceof RegExp && (e = Ii(e, a));
  var i = ns(n, e, a);
  return i && {
    start: i[0],
    end: i[1],
    pre: a.slice(0, i[0]),
    body: a.slice(i[0] + n.length, i[1]),
    post: a.slice(i[1] + e.length)
  };
}
function Ii(n, e) {
  var a = e.match(n);
  return a ? a[0] : null;
}
es.range = ns;
function ns(n, e, a) {
  var i, t, s, o, r, c = a.indexOf(n), p = a.indexOf(e, c + 1), l = c;
  if (c >= 0 && p > 0) {
    if (n === e)
      return [c, p];
    for (i = [], s = a.length; l >= 0 && !r; )
      l == c ? (i.push(l), c = a.indexOf(n, l + 1)) : i.length == 1 ? r = [i.pop(), p] : (t = i.pop(), t < s && (s = t, o = p), p = a.indexOf(e, l + 1)), l = c < p && c >= 0 ? c : p;
    i.length && (r = [s, o]);
  }
  return r;
}
var as = Xr, Yr = ec, is = "\0SLASH" + Math.random() + "\0", ts = "\0OPEN" + Math.random() + "\0", xi = "\0CLOSE" + Math.random() + "\0", ss = "\0COMMA" + Math.random() + "\0", os = "\0PERIOD" + Math.random() + "\0";
function va(n) {
  return parseInt(n, 10) == n ? parseInt(n, 10) : n.charCodeAt(0);
}
function Zr(n) {
  return n.split("\\\\").join(is).split("\\{").join(ts).split("\\}").join(xi).split("\\,").join(ss).split("\\.").join(os);
}
function Qr(n) {
  return n.split(is).join("\\").split(ts).join("{").split(xi).join("}").split(ss).join(",").split(os).join(".");
}
function rs(n) {
  if (!n)
    return [""];
  var e = [], a = as("{", "}", n);
  if (!a)
    return n.split(",");
  var i = a.pre, t = a.body, s = a.post, o = i.split(",");
  o[o.length - 1] += "{" + t + "}";
  var r = rs(s);
  return s.length && (o[o.length - 1] += r.shift(), o.push.apply(o, r)), e.push.apply(e, o), e;
}
function ec(n) {
  return n ? (n.substr(0, 2) === "{}" && (n = "\\{\\}" + n.substr(2)), Be(Zr(n), !0).map(Qr)) : [];
}
function nc(n) {
  return "{" + n + "}";
}
function ac(n) {
  return /^-?0\d/.test(n);
}
function ic(n, e) {
  return n <= e;
}
function tc(n, e) {
  return n >= e;
}
function Be(n, e) {
  var a = [], i = as("{", "}", n);
  if (!i) return [n];
  var t = i.pre, s = i.post.length ? Be(i.post, !1) : [""];
  if (/\$$/.test(i.pre))
    for (var o = 0; o < s.length; o++) {
      var r = t + "{" + i.body + "}" + s[o];
      a.push(r);
    }
  else {
    var c = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(i.body), p = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(i.body), l = c || p, u = i.body.indexOf(",") >= 0;
    if (!l && !u)
      return i.post.match(/,.*\}/) ? (n = i.pre + "{" + i.body + xi + i.post, Be(n)) : [n];
    var d;
    if (l)
      d = i.body.split(/\.\./);
    else if (d = rs(i.body), d.length === 1 && (d = Be(d[0], !1).map(nc), d.length === 1))
      return s.map(function(V) {
        return i.pre + d[0] + V;
      });
    var x;
    if (l) {
      var m = va(d[0]), v = va(d[1]), h = Math.max(d[0].length, d[1].length), b = d.length == 3 ? Math.abs(va(d[2])) : 1, y = ic, w = v < m;
      w && (b *= -1, y = tc);
      var _ = d.some(ac);
      x = [];
      for (var k = m; y(k, v); k += b) {
        var C;
        if (p)
          C = String.fromCharCode(k), C === "\\" && (C = "");
        else if (C = String(k), _) {
          var E = h - C.length;
          if (E > 0) {
            var R = new Array(E + 1).join("0");
            k < 0 ? C = "-" + R + C.slice(1) : C = R + C;
          }
        }
        x.push(C);
      }
    } else {
      x = [];
      for (var j = 0; j < d.length; j++)
        x.push.apply(x, Be(d[j], !1));
    }
    for (var j = 0; j < x.length; j++)
      for (var o = 0; o < s.length; o++) {
        var r = t + x[j] + s[o];
        (!e || l || r) && a.push(r);
      }
  }
  return a;
}
const G = cs = (n, e, a = {}) => (Ln(e), !a.nocomment && e.charAt(0) === "#" ? !1 : new Qn(e, a).match(n));
var cs = G;
const Ua = Kr;
G.sep = Ua.sep;
const ee = Symbol("globstar **");
G.GLOBSTAR = ee;
const sc = Yr, Ui = {
  "!": { open: "(?:(?!(?:", close: "))[^/]*?)" },
  "?": { open: "(?:", close: ")?" },
  "+": { open: "(?:", close: ")+" },
  "*": { open: "(?:", close: ")*" },
  "@": { open: "(?:", close: ")" }
}, Ma = "[^/]", ba = Ma + "*?", oc = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?", rc = "(?:(?!(?:\\/|^)\\.).)*?", ps = (n) => n.split("").reduce((e, a) => (e[a] = !0, e), {}), Mi = ps("().*{}+?[]^$\\!"), cc = ps("[.("), Hi = /\/+/;
G.filter = (n, e = {}) => (a, i, t) => G(a, n, e);
const pe = (n, e = {}) => {
  const a = {};
  return Object.keys(n).forEach((i) => a[i] = n[i]), Object.keys(e).forEach((i) => a[i] = e[i]), a;
};
G.defaults = (n) => {
  if (!n || typeof n != "object" || !Object.keys(n).length)
    return G;
  const e = G, a = (i, t, s) => e(i, t, pe(n, s));
  return a.Minimatch = class extends e.Minimatch {
    constructor(t, s) {
      super(t, pe(n, s));
    }
  }, a.Minimatch.defaults = (i) => e.defaults(pe(n, i)).Minimatch, a.filter = (i, t) => e.filter(i, pe(n, t)), a.defaults = (i) => e.defaults(pe(n, i)), a.makeRe = (i, t) => e.makeRe(i, pe(n, t)), a.braceExpand = (i, t) => e.braceExpand(i, pe(n, t)), a.match = (i, t, s) => e.match(i, t, pe(n, s)), a;
};
G.braceExpand = (n, e) => ls(n, e);
const ls = (n, e = {}) => (Ln(n), e.nobrace || !/\{(?:(?!\{).)*\}/.test(n) ? [n] : sc(n)), pc = 1024 * 64, Ln = (n) => {
  if (typeof n != "string")
    throw new TypeError("invalid pattern");
  if (n.length > pc)
    throw new TypeError("pattern is too long");
}, ga = Symbol("subparse");
G.makeRe = (n, e) => new Qn(n, e || {}).makeRe();
G.match = (n, e, a = {}) => {
  const i = new Qn(e, a);
  return n = n.filter((t) => i.match(t)), i.options.nonull && !n.length && n.push(e), n;
};
const lc = (n) => n.replace(/\\(.)/g, "$1"), uc = (n) => n.replace(/\\([^-\]])/g, "$1"), dc = (n) => n.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), mc = (n) => n.replace(/[[\]\\]/g, "\\$&");
let Qn = class {
  constructor(e, a) {
    Ln(e), a || (a = {}), this.options = a, this.set = [], this.pattern = e, this.windowsPathsNoEscape = !!a.windowsPathsNoEscape || a.allowWindowsEscape === !1, this.windowsPathsNoEscape && (this.pattern = this.pattern.replace(/\\/g, "/")), this.regexp = null, this.negate = !1, this.comment = !1, this.empty = !1, this.partial = !!a.partial, this.make();
  }
  debug() {
  }
  make() {
    const e = this.pattern, a = this.options;
    if (!a.nocomment && e.charAt(0) === "#") {
      this.comment = !0;
      return;
    }
    if (!e) {
      this.empty = !0;
      return;
    }
    this.parseNegate();
    let i = this.globSet = this.braceExpand();
    a.debug && (this.debug = (...t) => console.error(...t)), this.debug(this.pattern, i), i = this.globParts = i.map((t) => t.split(Hi)), this.debug(this.pattern, i), i = i.map((t, s, o) => t.map(this.parse, this)), this.debug(this.pattern, i), i = i.filter((t) => t.indexOf(!1) === -1), this.debug(this.pattern, i), this.set = i;
  }
  parseNegate() {
    if (this.options.nonegate) return;
    const e = this.pattern;
    let a = !1, i = 0;
    for (let t = 0; t < e.length && e.charAt(t) === "!"; t++)
      a = !a, i++;
    i && (this.pattern = e.slice(i)), this.negate = a;
  }
  // set partial to true to test if, for example,
  // "/a/b" matches the start of "/*/b/*/d"
  // Partial means, if you run out of file before you run
  // out of pattern, then that's fine, as long as all
  // the parts match.
  matchOne(e, a, i) {
    var t = this.options;
    this.debug(
      "matchOne",
      { this: this, file: e, pattern: a }
    ), this.debug("matchOne", e.length, a.length);
    for (var s = 0, o = 0, r = e.length, c = a.length; s < r && o < c; s++, o++) {
      this.debug("matchOne loop");
      var p = a[o], l = e[s];
      if (this.debug(a, p, l), p === !1) return !1;
      if (p === ee) {
        this.debug("GLOBSTAR", [a, p, l]);
        var u = s, d = o + 1;
        if (d === c) {
          for (this.debug("** at the end"); s < r; s++)
            if (e[s] === "." || e[s] === ".." || !t.dot && e[s].charAt(0) === ".") return !1;
          return !0;
        }
        for (; u < r; ) {
          var x = e[u];
          if (this.debug(`
globstar while`, e, u, a, d, x), this.matchOne(e.slice(u), a.slice(d), i))
            return this.debug("globstar found match!", u, r, x), !0;
          if (x === "." || x === ".." || !t.dot && x.charAt(0) === ".") {
            this.debug("dot detected!", e, u, a, d);
            break;
          }
          this.debug("globstar swallow a segment, and continue"), u++;
        }
        return !!(i && (this.debug(`
>>> no match, partial?`, e, u, a, d), u === r));
      }
      var m;
      if (typeof p == "string" ? (m = l === p, this.debug("string match", p, l, m)) : (m = l.match(p), this.debug("pattern match", p, l, m)), !m) return !1;
    }
    if (s === r && o === c)
      return !0;
    if (s === r)
      return i;
    if (o === c)
      return s === r - 1 && e[s] === "";
    throw new Error("wtf?");
  }
  braceExpand() {
    return ls(this.pattern, this.options);
  }
  parse(e, a) {
    Ln(e);
    const i = this.options;
    if (e === "**")
      if (i.noglobstar)
        e = "*";
      else
        return ee;
    if (e === "") return "";
    let t = "", s = !1, o = !1;
    const r = [], c = [];
    let p, l = !1, u = -1, d = -1, x, m, v, h = e.charAt(0) === ".", b = i.dot || h;
    const y = () => h ? "" : b ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)", w = (E) => E.charAt(0) === "." ? "" : i.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)", _ = () => {
      if (p) {
        switch (p) {
          case "*":
            t += ba, s = !0;
            break;
          case "?":
            t += Ma, s = !0;
            break;
          default:
            t += "\\" + p;
            break;
        }
        this.debug("clearStateChar %j %j", p, t), p = !1;
      }
    };
    for (let E = 0, R; E < e.length && (R = e.charAt(E)); E++) {
      if (this.debug("%s	%s %s %j", e, E, t, R), o) {
        if (R === "/")
          return !1;
        Mi[R] && (t += "\\"), t += R, o = !1;
        continue;
      }
      switch (R) {
        case "/":
          return !1;
        case "\\":
          if (l && e.charAt(E + 1) === "-") {
            t += R;
            continue;
          }
          _(), o = !0;
          continue;
        case "?":
        case "*":
        case "+":
        case "@":
        case "!":
          if (this.debug("%s	%s %s %j <-- stateChar", e, E, t, R), l) {
            this.debug("  in class"), R === "!" && E === d + 1 && (R = "^"), t += R;
            continue;
          }
          this.debug("call clearStateChar %j", p), _(), p = R, i.noext && _();
          continue;
        case "(": {
          if (l) {
            t += "(";
            continue;
          }
          if (!p) {
            t += "\\(";
            continue;
          }
          const j = {
            type: p,
            start: E - 1,
            reStart: t.length,
            open: Ui[p].open,
            close: Ui[p].close
          };
          this.debug(this.pattern, "	", j), r.push(j), t += j.open, j.start === 0 && j.type !== "!" && (h = !0, t += w(e.slice(E + 1))), this.debug("plType %j %j", p, t), p = !1;
          continue;
        }
        case ")": {
          const j = r[r.length - 1];
          if (l || !j) {
            t += "\\)";
            continue;
          }
          r.pop(), _(), s = !0, m = j, t += m.close, m.type === "!" && c.push(Object.assign(m, { reEnd: t.length }));
          continue;
        }
        case "|": {
          const j = r[r.length - 1];
          if (l || !j) {
            t += "\\|";
            continue;
          }
          _(), t += "|", j.start === 0 && j.type !== "!" && (h = !0, t += w(e.slice(E + 1)));
          continue;
        }
        case "[":
          if (_(), l) {
            t += "\\" + R;
            continue;
          }
          l = !0, d = E, u = t.length, t += R;
          continue;
        case "]":
          if (E === d + 1 || !l) {
            t += "\\" + R;
            continue;
          }
          x = e.substring(d + 1, E);
          try {
            RegExp("[" + mc(uc(x)) + "]"), t += R;
          } catch {
            t = t.substring(0, u) + "(?:$.)";
          }
          s = !0, l = !1;
          continue;
        default:
          _(), Mi[R] && !(R === "^" && l) && (t += "\\"), t += R;
          break;
      }
    }
    for (l && (x = e.slice(d + 1), v = this.parse(x, ga), t = t.substring(0, u) + "\\[" + v[0], s = s || v[1]), m = r.pop(); m; m = r.pop()) {
      let E;
      E = t.slice(m.reStart + m.open.length), this.debug("setting tail", t, m), E = E.replace(/((?:\\{2}){0,64})(\\?)\|/g, (j, V, Q) => (Q || (Q = "\\"), V + V + Q + "|")), this.debug(`tail=%j
   %s`, E, E, m, t);
      const R = m.type === "*" ? ba : m.type === "?" ? Ma : "\\" + m.type;
      s = !0, t = t.slice(0, m.reStart) + R + "\\(" + E;
    }
    _(), o && (t += "\\\\");
    const k = cc[t.charAt(0)];
    for (let E = c.length - 1; E > -1; E--) {
      const R = c[E], j = t.slice(0, R.reStart), V = t.slice(R.reStart, R.reEnd - 8);
      let Q = t.slice(R.reEnd);
      const he = t.slice(R.reEnd - 8, R.reEnd) + Q, tn = j.split(")").length, B = j.split("(").length - tn;
      let re = Q;
      for (let S = 0; S < B; S++)
        re = re.replace(/\)[+*?]?/, "");
      Q = re;
      const Ne = Q === "" && a !== ga ? "(?:$|\\/)" : "";
      t = j + V + Q + Ne + he;
    }
    if (t !== "" && s && (t = "(?=.)" + t), k && (t = y() + t), a === ga)
      return [t, s];
    if (i.nocase && !s && (s = e.toUpperCase() !== e.toLowerCase()), !s)
      return lc(e);
    const C = i.nocase ? "i" : "";
    try {
      return Object.assign(new RegExp("^" + t + "$", C), {
        _glob: e,
        _src: t
      });
    } catch {
      return new RegExp("$.");
    }
  }
  makeRe() {
    if (this.regexp || this.regexp === !1) return this.regexp;
    const e = this.set;
    if (!e.length)
      return this.regexp = !1, this.regexp;
    const a = this.options, i = a.noglobstar ? ba : a.dot ? oc : rc, t = a.nocase ? "i" : "";
    let s = e.map((o) => (o = o.map(
      (r) => typeof r == "string" ? dc(r) : r === ee ? ee : r._src
    ).reduce((r, c) => (r[r.length - 1] === ee && c === ee || r.push(c), r), []), o.forEach((r, c) => {
      r !== ee || o[c - 1] === ee || (c === 0 ? o.length > 1 ? o[c + 1] = "(?:\\/|" + i + "\\/)?" + o[c + 1] : o[c] = i : c === o.length - 1 ? o[c - 1] += "(?:\\/|" + i + ")?" : (o[c - 1] += "(?:\\/|\\/" + i + "\\/)" + o[c + 1], o[c + 1] = ee));
    }), o.filter((r) => r !== ee).join("/"))).join("|");
    s = "^(?:" + s + ")$", this.negate && (s = "^(?!" + s + ").*$");
    try {
      this.regexp = new RegExp(s, t);
    } catch {
      this.regexp = !1;
    }
    return this.regexp;
  }
  match(e, a = this.partial) {
    if (this.debug("match", e, this.pattern), this.comment) return !1;
    if (this.empty) return e === "";
    if (e === "/" && a) return !0;
    const i = this.options;
    Ua.sep !== "/" && (e = e.split(Ua.sep).join("/")), e = e.split(Hi), this.debug(this.pattern, "split", e);
    const t = this.set;
    this.debug(this.pattern, "set", t);
    let s;
    for (let o = e.length - 1; o >= 0 && (s = e[o], !s); o--)
      ;
    for (let o = 0; o < t.length; o++) {
      const r = t[o];
      let c = e;
      if (i.matchBase && r.length === 1 && (c = [s]), this.matchOne(c, r, a))
        return i.flipNegate ? !0 : !this.negate;
    }
    return i.flipNegate ? !1 : this.negate;
  }
  static defaults(e) {
    return G.defaults(e).Minimatch;
  }
};
G.Minimatch = Qn;
const fc = cs.Minimatch, xc = (n, e) => {
  const a = e.indexOf("/") !== -1, i = /^!?\//.test(e), t = /^!/.test(e);
  let s;
  if (!i && a) {
    const o = e.replace(/^!/, "").replace(/^\.\//, "");
    return /\/$/.test(n) ? s = "" : s = "/", t ? `!${n}${s}${o}` : `${n}${s}${o}`;
  }
  return e;
};
fi.create = (n, e, a) => {
  let i;
  typeof e == "string" ? i = [e] : i = e;
  const t = i.map((o) => xc(n, o)).map((o) => new fc(o, {
    matchBase: !0,
    nocomment: !0,
    nocase: a || !1,
    dot: !0,
    windowsPathsNoEscape: !0
  }));
  return (o) => {
    let r = "matching", c = !1, p, l;
    for (l = 0; l < t.length; l += 1) {
      if (p = t[l], p.negate && (r = "negation", l === 0 && (c = !0)), r === "negation" && c && !p.match(o))
        return !1;
      r === "matching" && !c && (c = p.match(o));
    }
    return c;
  };
};
const hc = F, us = Ke, ds = oe, ms = fi, Wi = U, vc = (n, e, a) => {
  const i = `${n}([path], options)`;
  Wi.argument(i, "path", e, ["string"]), Wi.options(i, "options", a, {
    matching: ["string", "array of string"],
    filter: ["function"],
    files: ["boolean"],
    directories: ["boolean"],
    recursive: ["boolean"],
    ignoreCase: ["boolean"]
  });
}, fs = (n) => {
  const e = n || {};
  return e.matching === void 0 && (e.matching = "*"), e.files === void 0 && (e.files = !0), e.ignoreCase === void 0 && (e.ignoreCase = !1), e.directories === void 0 && (e.directories = !1), e.recursive === void 0 && (e.recursive = !0), e;
}, xs = (n, e) => n.map((a) => hc.relative(e, a)), hs = (n) => {
  const e = new Error(`Path you want to find stuff in doesn't exist ${n}`);
  return e.code = "ENOENT", e;
}, vs = (n) => {
  const e = new Error(
    `Path you want to find stuff in must be a directory ${n}`
  );
  return e.code = "ENOTDIR", e;
}, bc = (n, e) => {
  const a = [], i = ms.create(
    n,
    e.matching,
    e.ignoreCase
  );
  let t = 1 / 0;
  return e.recursive === !1 && (t = 1), us.sync(
    n,
    {
      maxLevelsDeep: t,
      symlinks: "follow",
      inspectOptions: { times: !0, absolutePath: !0 }
    },
    (s, o) => {
      o && s !== n && i(s) && (o.type === "file" && e.files === !0 || o.type === "dir" && e.directories === !0) && (e.filter ? e.filter(o) && a.push(s) : a.push(s));
    }
  ), a.sort(), xs(a, e.cwd);
}, gc = (n, e) => {
  const a = ds.sync(n, { symlinks: "follow" });
  if (a === void 0)
    throw hs(n);
  if (a.type !== "dir")
    throw vs(n);
  return bc(n, fs(e));
}, yc = (n, e) => new Promise((a, i) => {
  const t = [], s = ms.create(
    n,
    e.matching,
    e.ignoreCase
  );
  let o = 1 / 0;
  e.recursive === !1 && (o = 1);
  let r = 0, c = !1;
  const p = () => {
    c && r === 0 && (t.sort(), a(xs(t, e.cwd)));
  };
  us.async(
    n,
    {
      maxLevelsDeep: o,
      symlinks: "follow",
      inspectOptions: { times: !0, absolutePath: !0 }
    },
    (l, u) => {
      if (u && l !== n && s(l) && (u.type === "file" && e.files === !0 || u.type === "dir" && e.directories === !0))
        if (e.filter) {
          const x = e.filter(u);
          typeof x.then == "function" ? (r += 1, x.then((v) => {
            v && t.push(l), r -= 1, p();
          }).catch((v) => {
            i(v);
          })) : x && t.push(l);
        } else
          t.push(l);
    },
    (l) => {
      l ? i(l) : (c = !0, p());
    }
  );
}), wc = (n, e) => ds.async(n, { symlinks: "follow" }).then((a) => {
  if (a === void 0)
    throw hs(n);
  if (a.type !== "dir")
    throw vs(n);
  return yc(n, fs(e));
});
Yn.validateInput = vc;
Yn.sync = gc;
Yn.async = wc;
var ea = {};
const Ec = si, Nn = F, sn = oe, Vi = U, bs = Ke, kc = (n, e, a) => {
  const i = `${n}(path, [options])`;
  if (Vi.argument(i, "path", e, ["string"]), Vi.options(i, "options", a, {
    checksum: ["string"],
    relativePath: ["boolean"],
    times: ["boolean"],
    symlinks: ["string"]
  }), a && a.checksum !== void 0 && sn.supportedChecksumAlgorithms.indexOf(a.checksum) === -1)
    throw new Error(
      `Argument "options.checksum" passed to ${i} must have one of values: ${sn.supportedChecksumAlgorithms.join(
        ", "
      )}`
    );
  if (a && a.symlinks !== void 0 && sn.symlinkOptions.indexOf(a.symlinks) === -1)
    throw new Error(
      `Argument "options.symlinks" passed to ${i} must have one of values: ${sn.symlinkOptions.join(
        ", "
      )}`
    );
}, Sc = (n, e) => n === void 0 ? "." : n.relativePath + "/" + e.name, _c = (n, e) => {
  const a = Ec.createHash(e);
  return n.forEach((i) => {
    a.update(i.name + i[e]);
  }), a.digest("hex");
}, hi = (n, e, a) => {
  a.relativePath && (e.relativePath = Sc(n, e)), e.type === "dir" && (e.children.forEach((i) => {
    hi(e, i, a);
  }), e.size = 0, e.children.sort((i, t) => i.type === "dir" && t.type === "file" ? -1 : i.type === "file" && t.type === "dir" ? 1 : i.name.localeCompare(t.name)), e.children.forEach((i) => {
    e.size += i.size || 0;
  }), a.checksum && (e[a.checksum] = _c(
    e.children,
    a.checksum
  )));
}, vi = (n, e, a) => {
  const i = e[0];
  if (e.length > 1) {
    const t = n.children.find((s) => s.name === i);
    return vi(t, e.slice(1));
  }
  return n;
}, Rc = (n, e) => {
  const a = e || {};
  let i;
  return bs.sync(n, { inspectOptions: a }, (t, s) => {
    if (s) {
      s.type === "dir" && (s.children = []);
      const o = Nn.relative(n, t);
      o === "" ? i = s : vi(
        i,
        o.split(Nn.sep)
      ).children.push(s);
    }
  }), i && hi(void 0, i, a), i;
}, Ac = (n, e) => {
  const a = e || {};
  let i;
  return new Promise((t, s) => {
    bs.async(
      n,
      { inspectOptions: a },
      (o, r) => {
        if (r) {
          r.type === "dir" && (r.children = []);
          const c = Nn.relative(n, o);
          c === "" ? i = r : vi(
            i,
            c.split(Nn.sep)
          ).children.push(r);
        }
      },
      (o) => {
        o ? s(o) : (i && hi(void 0, i, a), t(i));
      }
    );
  });
};
ea.validateInput = kc;
ea.sync = Rc;
ea.async = Ac;
var Xe = {}, $e = {};
const gs = X, jc = U, Tc = (n, e) => {
  const a = `${n}(path)`;
  jc.argument(a, "path", e, ["string"]);
}, Cc = (n) => {
  try {
    const e = gs.statSync(n);
    return e.isDirectory() ? "dir" : e.isFile() ? "file" : "other";
  } catch (e) {
    if (e.code !== "ENOENT")
      throw e;
  }
  return !1;
}, Oc = (n) => new Promise((e, a) => {
  gs.stat(n).then((i) => {
    i.isDirectory() ? e("dir") : i.isFile() ? e("file") : e("other");
  }).catch((i) => {
    i.code === "ENOENT" ? e(!1) : a(i);
  });
});
$e.validateInput = Tc;
$e.sync = Cc;
$e.async = Oc;
const Ue = F, J = X, bi = ne, zn = $e, ys = oe, Pc = _e, $c = fi, ws = Vn, Es = Ke, ya = U, Fc = (n, e, a, i) => {
  const t = `${n}(from, to, [options])`;
  ya.argument(t, "from", e, ["string"]), ya.argument(t, "to", a, ["string"]), ya.options(t, "options", i, {
    overwrite: ["boolean", "function"],
    matching: ["string", "array of string"],
    ignoreCase: ["boolean"]
  });
}, ks = (n, e) => {
  const a = n || {}, i = {};
  return a.ignoreCase === void 0 && (a.ignoreCase = !1), i.overwrite = a.overwrite, a.matching ? i.allowedToCopy = $c.create(
    e,
    a.matching,
    a.ignoreCase
  ) : i.allowedToCopy = () => !0, i;
}, Ss = (n) => {
  const e = new Error(`Path to copy doesn't exist ${n}`);
  return e.code = "ENOENT", e;
}, na = (n) => {
  const e = new Error(`Destination path already exists ${n}`);
  return e.code = "EEXIST", e;
}, aa = {
  mode: !0,
  symlinks: "report",
  times: !0,
  absolutePath: !0
}, _s = (n) => typeof n.opts.overwrite != "function" && n.opts.overwrite !== !0, Lc = (n, e, a) => {
  if (!zn.sync(n))
    throw Ss(n);
  if (zn.sync(e) && !a.overwrite)
    throw na(e);
}, Nc = (n) => {
  if (typeof n.opts.overwrite == "function") {
    const e = ys.sync(n.destPath, aa);
    return n.opts.overwrite(n.srcInspectData, e);
  }
  return n.opts.overwrite === !0;
}, zc = (n, e, a, i) => {
  const t = J.readFileSync(n);
  try {
    J.writeFileSync(e, t, { mode: a, flag: "wx" });
  } catch (s) {
    if (s.code === "ENOENT")
      Pc.sync(e, t, { mode: a });
    else if (s.code === "EEXIST") {
      if (Nc(i))
        J.writeFileSync(e, t, { mode: a });
      else if (_s(i))
        throw na(i.destPath);
    } else
      throw s;
  }
}, Dc = (n, e) => {
  const a = J.readlinkSync(n);
  try {
    J.symlinkSync(a, e);
  } catch (i) {
    if (i.code === "EEXIST")
      J.unlinkSync(e), J.symlinkSync(a, e);
    else
      throw i;
  }
}, Bc = (n, e, a, i) => {
  const t = { srcPath: n, destPath: a, srcInspectData: e, opts: i }, s = ws.normalizeFileMode(e.mode);
  e.type === "dir" ? bi.createSync(a, { mode: s }) : e.type === "file" ? zc(n, a, s, t) : e.type === "symlink" && Dc(n, a);
}, qc = (n, e, a) => {
  const i = ks(a, n);
  Lc(n, e, i), Es.sync(n, { inspectOptions: aa }, (t, s) => {
    const o = Ue.relative(n, t), r = Ue.resolve(e, o);
    i.allowedToCopy(t, r, s) && Bc(t, s, r, i);
  });
}, Ic = (n, e, a) => zn.async(n).then((i) => {
  if (i)
    return zn.async(e);
  throw Ss(n);
}).then((i) => {
  if (i && !a.overwrite)
    throw na(e);
}), Uc = (n) => new Promise((e, a) => {
  typeof n.opts.overwrite == "function" ? ys.async(n.destPath, aa).then((i) => {
    e(
      n.opts.overwrite(n.srcInspectData, i)
    );
  }).catch(a) : e(n.opts.overwrite === !0);
}), Ha = (n, e, a, i, t) => new Promise((s, o) => {
  const r = t || {};
  let c = "wx";
  r.overwrite && (c = "w");
  const p = J.createReadStream(n), l = J.createWriteStream(e, { mode: a, flags: c });
  p.on("error", o), l.on("error", (u) => {
    p.resume(), u.code === "ENOENT" ? bi.createAsync(Ue.dirname(e)).then(() => {
      Ha(n, e, a, i).then(
        s,
        o
      );
    }).catch(o) : u.code === "EEXIST" ? Uc(i).then((d) => {
      d ? Ha(n, e, a, i, {
        overwrite: !0
      }).then(s, o) : _s(i) ? o(na(e)) : s();
    }).catch(o) : o(u);
  }), l.on("finish", s), p.pipe(l);
}), Mc = (n, e) => J.readlink(n).then((a) => new Promise((i, t) => {
  J.symlink(a, e).then(i).catch((s) => {
    s.code === "EEXIST" ? J.unlink(e).then(() => J.symlink(a, e)).then(i, t) : t(s);
  });
})), Hc = (n, e, a, i) => {
  const t = { srcPath: n, destPath: a, srcInspectData: e, opts: i }, s = ws.normalizeFileMode(e.mode);
  return e.type === "dir" ? bi.createAsync(a, { mode: s }) : e.type === "file" ? Ha(n, a, s, t) : e.type === "symlink" ? Mc(n, a) : Promise.resolve();
}, Wc = (n, e, a) => new Promise((i, t) => {
  const s = ks(a, n);
  Ic(n, e, s).then(() => {
    let o = !1, r = 0;
    Es.async(
      n,
      { inspectOptions: aa },
      (c, p) => {
        if (p) {
          const l = Ue.relative(n, c), u = Ue.resolve(e, l);
          s.allowedToCopy(c, p, u) && (r += 1, Hc(c, p, u, s).then(() => {
            r -= 1, o && r === 0 && i();
          }).catch(t));
        }
      },
      (c) => {
        c ? t(c) : (o = !0, o && r === 0 && i());
      }
    );
  }).catch(t);
});
Xe.validateInput = Fc;
Xe.sync = qc;
Xe.async = Wc;
var Ye = {};
const Rs = F, je = X, wa = U, As = Xe, js = ne, Me = $e, Dn = Pe, Vc = (n, e, a, i) => {
  const t = `${n}(from, to, [options])`;
  wa.argument(t, "from", e, ["string"]), wa.argument(t, "to", a, ["string"]), wa.options(t, "options", i, {
    overwrite: ["boolean"]
  });
}, Ts = (n) => n || {}, Cs = (n) => {
  const e = new Error(`Destination path already exists ${n}`);
  return e.code = "EEXIST", e;
}, Os = (n) => {
  const e = new Error(`Path to move doesn't exist ${n}`);
  return e.code = "ENOENT", e;
}, Jc = (n, e, a) => {
  const i = Ts(a);
  if (Me.sync(e) !== !1 && i.overwrite !== !0)
    throw Cs(e);
  try {
    je.renameSync(n, e);
  } catch (t) {
    if (t.code === "EISDIR" || t.code === "EPERM")
      Dn.sync(e), je.renameSync(n, e);
    else if (t.code === "EXDEV")
      As.sync(n, e, { overwrite: !0 }), Dn.sync(n);
    else if (t.code === "ENOENT") {
      if (!Me.sync(n))
        throw Os(n);
      js.createSync(Rs.dirname(e)), je.renameSync(n, e);
    } else
      throw t;
  }
}, Gc = (n) => new Promise((e, a) => {
  const i = Rs.dirname(n);
  Me.async(i).then((t) => {
    t ? a() : js.createAsync(i).then(e, a);
  }).catch(a);
}), Kc = (n, e, a) => {
  const i = Ts(a);
  return new Promise((t, s) => {
    Me.async(e).then((o) => {
      o !== !1 && i.overwrite !== !0 ? s(Cs(e)) : je.rename(n, e).then(t).catch((r) => {
        r.code === "EISDIR" || r.code === "EPERM" ? Dn.async(e).then(() => je.rename(n, e)).then(t, s) : r.code === "EXDEV" ? As.async(n, e, { overwrite: !0 }).then(() => Dn.async(n)).then(t, s) : r.code === "ENOENT" ? Me.async(n).then((c) => {
          c ? Gc(e).then(() => je.rename(n, e)).then(t, s) : s(Os(n));
        }).catch(s) : s(r);
      });
    });
  });
};
Ye.validateInput = Vc;
Ye.sync = Jc;
Ye.async = Kc;
var ia = {};
const Ps = X, Ji = U, Gi = ["utf8", "buffer", "json", "jsonWithDates"], Xc = (n, e, a) => {
  const i = `${n}(path, returnAs)`;
  if (Ji.argument(i, "path", e, ["string"]), Ji.argument(i, "returnAs", a, [
    "string",
    "undefined"
  ]), a && Gi.indexOf(a) === -1)
    throw new Error(
      `Argument "returnAs" passed to ${i} must have one of values: ${Gi.join(
        ", "
      )}`
    );
}, $s = (n, e) => typeof e == "string" && /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/.exec(e) ? new Date(e) : e, Fs = (n, e) => {
  const a = new Error(
    `JSON parsing failed while reading ${n} [${e}]`
  );
  return a.originalError = e, a;
}, Yc = (n, e) => {
  const a = e || "utf8";
  let i, t = "utf8";
  a === "buffer" && (t = null);
  try {
    i = Ps.readFileSync(n, { encoding: t });
  } catch (s) {
    if (s.code === "ENOENT")
      return;
    throw s;
  }
  try {
    a === "json" ? i = JSON.parse(i) : a === "jsonWithDates" && (i = JSON.parse(i, $s));
  } catch (s) {
    throw Fs(n, s);
  }
  return i;
}, Zc = (n, e) => new Promise((a, i) => {
  const t = e || "utf8";
  let s = "utf8";
  t === "buffer" && (s = null), Ps.readFile(n, { encoding: s }).then((o) => {
    try {
      a(t === "json" ? JSON.parse(o) : t === "jsonWithDates" ? JSON.parse(o, $s) : o);
    } catch (r) {
      i(Fs(n, r));
    }
  }).catch((o) => {
    o.code === "ENOENT" ? a(void 0) : i(o);
  });
});
ia.validateInput = Xc;
ia.sync = Yc;
ia.async = Zc;
var ta = {};
const He = F, Ls = Ye, Ea = U, Qc = (n, e, a, i) => {
  const t = `${n}(path, newName, [options])`;
  if (Ea.argument(t, "path", e, ["string"]), Ea.argument(t, "newName", a, ["string"]), Ea.options(t, "options", i, {
    overwrite: ["boolean"]
  }), He.basename(a) !== a)
    throw new Error(
      `Argument "newName" passed to ${t} should be a filename, not a path. Received "${a}"`
    );
}, ep = (n, e, a) => {
  const i = He.join(He.dirname(n), e);
  Ls.sync(n, i, a);
}, np = (n, e, a) => {
  const i = He.join(He.dirname(n), e);
  return Ls.async(n, i, a);
};
ta.validateInput = Qc;
ta.sync = ep;
ta.async = np;
var sa = {};
const Ns = F, Bn = X, Ki = U, zs = ne, ap = (n, e, a) => {
  const i = `${n}(symlinkValue, path)`;
  Ki.argument(i, "symlinkValue", e, ["string"]), Ki.argument(i, "path", a, ["string"]);
}, ip = (n, e) => {
  try {
    Bn.symlinkSync(n, e);
  } catch (a) {
    if (a.code === "ENOENT")
      zs.createSync(Ns.dirname(e)), Bn.symlinkSync(n, e);
    else
      throw a;
  }
}, tp = (n, e) => new Promise((a, i) => {
  Bn.symlink(n, e).then(a).catch((t) => {
    t.code === "ENOENT" ? zs.createAsync(Ns.dirname(e)).then(() => Bn.symlink(n, e)).then(a, i) : i(t);
  });
});
sa.validateInput = ap;
sa.sync = ip;
sa.async = tp;
var gi = {};
const Ds = Ge;
gi.createWriteStream = Ds.createWriteStream;
gi.createReadStream = Ds.createReadStream;
var oa = {};
const yi = F, sp = Ft, Bs = si, qs = ne, Is = X, op = U, rp = (n, e) => {
  const a = `${n}([options])`;
  op.options(a, "options", e, {
    prefix: ["string"],
    basePath: ["string"]
  });
}, Us = (n, e) => {
  n = n || {};
  const a = {};
  return typeof n.prefix != "string" ? a.prefix = "" : a.prefix = n.prefix, typeof n.basePath == "string" ? a.basePath = yi.resolve(e, n.basePath) : a.basePath = sp.tmpdir(), a;
}, Ms = 32, cp = (n, e) => {
  const a = Us(e, n), i = Bs.randomBytes(Ms / 2).toString("hex"), t = yi.join(
    a.basePath,
    a.prefix + i
  );
  try {
    Is.mkdirSync(t);
  } catch (s) {
    if (s.code === "ENOENT")
      qs.sync(t);
    else
      throw s;
  }
  return t;
}, pp = (n, e) => new Promise((a, i) => {
  const t = Us(e, n);
  Bs.randomBytes(Ms / 2, (s, o) => {
    if (s)
      i(s);
    else {
      const r = o.toString("hex"), c = yi.join(
        t.basePath,
        t.prefix + r
      );
      Is.mkdir(c, (p) => {
        p ? p.code === "ENOENT" ? qs.async(c).then(() => {
          a(c);
        }, i) : i(p) : a(c);
      });
    }
  });
});
oa.validateInput = rp;
oa.sync = cp;
oa.async = pp;
const Xi = Se, ka = F, on = Wn, rn = ne, cn = Gn, pn = Yn, ln = oe, un = ea, dn = Xe, mn = $e, fn = Zn, xn = Ye, hn = ia, vn = Pe, bn = ta, gn = sa, Yi = gi, yn = oa, wn = _e, Hs = (n) => {
  const e = () => n || process.cwd(), a = function() {
    if (arguments.length === 0)
      return e();
    const r = Array.prototype.slice.call(arguments), c = [e()].concat(r);
    return Hs(ka.resolve.apply(null, c));
  }, i = (r) => ka.resolve(e(), r), t = function() {
    return Array.prototype.unshift.call(arguments, e()), ka.resolve.apply(null, arguments);
  }, s = (r) => {
    const c = r || {};
    return c.cwd = e(), c;
  }, o = {
    cwd: a,
    path: t,
    append: (r, c, p) => {
      on.validateInput("append", r, c, p), on.sync(i(r), c, p);
    },
    appendAsync: (r, c, p) => (on.validateInput("appendAsync", r, c, p), on.async(i(r), c, p)),
    copy: (r, c, p) => {
      dn.validateInput("copy", r, c, p), dn.sync(i(r), i(c), p);
    },
    copyAsync: (r, c, p) => (dn.validateInput("copyAsync", r, c, p), dn.async(i(r), i(c), p)),
    createWriteStream: (r, c) => Yi.createWriteStream(i(r), c),
    createReadStream: (r, c) => Yi.createReadStream(i(r), c),
    dir: (r, c) => {
      rn.validateInput("dir", r, c);
      const p = i(r);
      return rn.sync(p, c), a(p);
    },
    dirAsync: (r, c) => (rn.validateInput("dirAsync", r, c), new Promise((p, l) => {
      const u = i(r);
      rn.async(u, c).then(() => {
        p(a(u));
      }, l);
    })),
    exists: (r) => (mn.validateInput("exists", r), mn.sync(i(r))),
    existsAsync: (r) => (mn.validateInput("existsAsync", r), mn.async(i(r))),
    file: (r, c) => (cn.validateInput("file", r, c), cn.sync(i(r), c), o),
    fileAsync: (r, c) => (cn.validateInput("fileAsync", r, c), new Promise((p, l) => {
      cn.async(i(r), c).then(() => {
        p(o);
      }, l);
    })),
    find: (r, c) => (typeof c > "u" && typeof r == "object" && (c = r, r = "."), pn.validateInput("find", r, c), pn.sync(i(r), s(c))),
    findAsync: (r, c) => (typeof c > "u" && typeof r == "object" && (c = r, r = "."), pn.validateInput("findAsync", r, c), pn.async(i(r), s(c))),
    inspect: (r, c) => (ln.validateInput("inspect", r, c), ln.sync(i(r), c)),
    inspectAsync: (r, c) => (ln.validateInput("inspectAsync", r, c), ln.async(i(r), c)),
    inspectTree: (r, c) => (un.validateInput("inspectTree", r, c), un.sync(i(r), c)),
    inspectTreeAsync: (r, c) => (un.validateInput("inspectTreeAsync", r, c), un.async(i(r), c)),
    list: (r) => (fn.validateInput("list", r), fn.sync(i(r || "."))),
    listAsync: (r) => (fn.validateInput("listAsync", r), fn.async(i(r || "."))),
    move: (r, c, p) => {
      xn.validateInput("move", r, c, p), xn.sync(i(r), i(c), p);
    },
    moveAsync: (r, c, p) => (xn.validateInput("moveAsync", r, c, p), xn.async(i(r), i(c), p)),
    read: (r, c) => (hn.validateInput("read", r, c), hn.sync(i(r), c)),
    readAsync: (r, c) => (hn.validateInput("readAsync", r, c), hn.async(i(r), c)),
    remove: (r) => {
      vn.validateInput("remove", r), vn.sync(i(r || "."));
    },
    removeAsync: (r) => (vn.validateInput("removeAsync", r), vn.async(i(r || "."))),
    rename: (r, c, p) => {
      bn.validateInput("rename", r, c, p), bn.sync(i(r), c, p);
    },
    renameAsync: (r, c, p) => (bn.validateInput("renameAsync", r, c, p), bn.async(i(r), c, p)),
    symlink: (r, c) => {
      gn.validateInput("symlink", r, c), gn.sync(r, i(c));
    },
    symlinkAsync: (r, c) => (gn.validateInput("symlinkAsync", r, c), gn.async(r, i(c))),
    tmpDir: (r) => {
      yn.validateInput("tmpDir", r);
      const c = yn.sync(e(), r);
      return a(c);
    },
    tmpDirAsync: (r) => (yn.validateInput("tmpDirAsync", r), new Promise((c, p) => {
      yn.async(e(), r).then((l) => {
        c(a(l));
      }, p);
    })),
    write: (r, c, p) => {
      wn.validateInput("write", r, c, p), wn.sync(i(r), c, p);
    },
    writeAsync: (r, c, p) => (wn.validateInput("writeAsync", r, c, p), wn.async(i(r), c, p))
  };
  return Xi.inspect.custom !== void 0 && (o[Xi.inspect.custom] = () => `[fs-jetpack CWD: ${e()}]`), o;
};
var lp = Hs;
const up = lp;
var P = up();
const Ze = Te.getPath("sessionData"), dp = F.join(Ze, "playlists"), H = F.join(dp, "meta.json"), we = (n, e) => F.join(Ze, `playlists/${n}/user/${e}.json`), Ws = (n) => F.join(Ze, `playlists/${n}/vod.json`), Vs = (n) => F.join(Ze, `playlists/${n}/series.json`), Js = (n) => F.join(Ze, `playlists/${n}/live.json`);
async function Fe() {
  const n = await P.readAsync(H, "json");
  if (!n) {
    const e = { currentPlaylist: { name: "", profile: "" }, playlists: [] };
    return await P.writeAsync(H, e), e;
  }
  return n;
}
function Gs(n, e) {
  return function() {
    return n.apply(e, arguments);
  };
}
const { toString: mp } = Object.prototype, { getPrototypeOf: wi } = Object, ra = /* @__PURE__ */ ((n) => (e) => {
  const a = mp.call(e);
  return n[a] || (n[a] = a.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null)), ae = (n) => (n = n.toLowerCase(), (e) => ra(e) === n), ca = (n) => (e) => typeof e === n, { isArray: Le } = Array, We = ca("undefined");
function fp(n) {
  return n !== null && !We(n) && n.constructor !== null && !We(n.constructor) && K(n.constructor.isBuffer) && n.constructor.isBuffer(n);
}
const Ks = ae("ArrayBuffer");
function xp(n) {
  let e;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? e = ArrayBuffer.isView(n) : e = n && n.buffer && Ks(n.buffer), e;
}
const hp = ca("string"), K = ca("function"), Xs = ca("number"), pa = (n) => n !== null && typeof n == "object", vp = (n) => n === !0 || n === !1, jn = (n) => {
  if (ra(n) !== "object")
    return !1;
  const e = wi(n);
  return (e === null || e === Object.prototype || Object.getPrototypeOf(e) === null) && !(Symbol.toStringTag in n) && !(Symbol.iterator in n);
}, bp = ae("Date"), gp = ae("File"), yp = ae("Blob"), wp = ae("FileList"), Ep = (n) => pa(n) && K(n.pipe), kp = (n) => {
  let e;
  return n && (typeof FormData == "function" && n instanceof FormData || K(n.append) && ((e = ra(n)) === "formdata" || // detect form-data instance
  e === "object" && K(n.toString) && n.toString() === "[object FormData]"));
}, Sp = ae("URLSearchParams"), [_p, Rp, Ap, jp] = ["ReadableStream", "Request", "Response", "Headers"].map(ae), Tp = (n) => n.trim ? n.trim() : n.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function Qe(n, e, { allOwnKeys: a = !1 } = {}) {
  if (n === null || typeof n > "u")
    return;
  let i, t;
  if (typeof n != "object" && (n = [n]), Le(n))
    for (i = 0, t = n.length; i < t; i++)
      e.call(null, n[i], i, n);
  else {
    const s = a ? Object.getOwnPropertyNames(n) : Object.keys(n), o = s.length;
    let r;
    for (i = 0; i < o; i++)
      r = s[i], e.call(null, n[r], r, n);
  }
}
function Ys(n, e) {
  e = e.toLowerCase();
  const a = Object.keys(n);
  let i = a.length, t;
  for (; i-- > 0; )
    if (t = a[i], e === t.toLowerCase())
      return t;
  return null;
}
const be = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, Zs = (n) => !We(n) && n !== be;
function Wa() {
  const { caseless: n } = Zs(this) && this || {}, e = {}, a = (i, t) => {
    const s = n && Ys(e, t) || t;
    jn(e[s]) && jn(i) ? e[s] = Wa(e[s], i) : jn(i) ? e[s] = Wa({}, i) : Le(i) ? e[s] = i.slice() : e[s] = i;
  };
  for (let i = 0, t = arguments.length; i < t; i++)
    arguments[i] && Qe(arguments[i], a);
  return e;
}
const Cp = (n, e, a, { allOwnKeys: i } = {}) => (Qe(e, (t, s) => {
  a && K(t) ? n[s] = Gs(t, a) : n[s] = t;
}, { allOwnKeys: i }), n), Op = (n) => (n.charCodeAt(0) === 65279 && (n = n.slice(1)), n), Pp = (n, e, a, i) => {
  n.prototype = Object.create(e.prototype, i), n.prototype.constructor = n, Object.defineProperty(n, "super", {
    value: e.prototype
  }), a && Object.assign(n.prototype, a);
}, $p = (n, e, a, i) => {
  let t, s, o;
  const r = {};
  if (e = e || {}, n == null) return e;
  do {
    for (t = Object.getOwnPropertyNames(n), s = t.length; s-- > 0; )
      o = t[s], (!i || i(o, n, e)) && !r[o] && (e[o] = n[o], r[o] = !0);
    n = a !== !1 && wi(n);
  } while (n && (!a || a(n, e)) && n !== Object.prototype);
  return e;
}, Fp = (n, e, a) => {
  n = String(n), (a === void 0 || a > n.length) && (a = n.length), a -= e.length;
  const i = n.indexOf(e, a);
  return i !== -1 && i === a;
}, Lp = (n) => {
  if (!n) return null;
  if (Le(n)) return n;
  let e = n.length;
  if (!Xs(e)) return null;
  const a = new Array(e);
  for (; e-- > 0; )
    a[e] = n[e];
  return a;
}, Np = /* @__PURE__ */ ((n) => (e) => n && e instanceof n)(typeof Uint8Array < "u" && wi(Uint8Array)), zp = (n, e) => {
  const i = (n && n[Symbol.iterator]).call(n);
  let t;
  for (; (t = i.next()) && !t.done; ) {
    const s = t.value;
    e.call(n, s[0], s[1]);
  }
}, Dp = (n, e) => {
  let a;
  const i = [];
  for (; (a = n.exec(e)) !== null; )
    i.push(a);
  return i;
}, Bp = ae("HTMLFormElement"), qp = (n) => n.toLowerCase().replace(
  /[-_\s]([a-z\d])(\w*)/g,
  function(a, i, t) {
    return i.toUpperCase() + t;
  }
), Zi = (({ hasOwnProperty: n }) => (e, a) => n.call(e, a))(Object.prototype), Ip = ae("RegExp"), Qs = (n, e) => {
  const a = Object.getOwnPropertyDescriptors(n), i = {};
  Qe(a, (t, s) => {
    let o;
    (o = e(t, s, n)) !== !1 && (i[s] = o || t);
  }), Object.defineProperties(n, i);
}, Up = (n) => {
  Qs(n, (e, a) => {
    if (K(n) && ["arguments", "caller", "callee"].indexOf(a) !== -1)
      return !1;
    const i = n[a];
    if (K(i)) {
      if (e.enumerable = !1, "writable" in e) {
        e.writable = !1;
        return;
      }
      e.set || (e.set = () => {
        throw Error("Can not rewrite read-only method '" + a + "'");
      });
    }
  });
}, Mp = (n, e) => {
  const a = {}, i = (t) => {
    t.forEach((s) => {
      a[s] = !0;
    });
  };
  return Le(n) ? i(n) : i(String(n).split(e)), a;
}, Hp = () => {
}, Wp = (n, e) => n != null && Number.isFinite(n = +n) ? n : e, Sa = "abcdefghijklmnopqrstuvwxyz", Qi = "0123456789", eo = {
  DIGIT: Qi,
  ALPHA: Sa,
  ALPHA_DIGIT: Sa + Sa.toUpperCase() + Qi
}, Vp = (n = 16, e = eo.ALPHA_DIGIT) => {
  let a = "";
  const { length: i } = e;
  for (; n--; )
    a += e[Math.random() * i | 0];
  return a;
};
function Jp(n) {
  return !!(n && K(n.append) && n[Symbol.toStringTag] === "FormData" && n[Symbol.iterator]);
}
const Gp = (n) => {
  const e = new Array(10), a = (i, t) => {
    if (pa(i)) {
      if (e.indexOf(i) >= 0)
        return;
      if (!("toJSON" in i)) {
        e[t] = i;
        const s = Le(i) ? [] : {};
        return Qe(i, (o, r) => {
          const c = a(o, t + 1);
          !We(c) && (s[r] = c);
        }), e[t] = void 0, s;
      }
    }
    return i;
  };
  return a(n, 0);
}, Kp = ae("AsyncFunction"), Xp = (n) => n && (pa(n) || K(n)) && K(n.then) && K(n.catch), no = ((n, e) => n ? setImmediate : e ? ((a, i) => (be.addEventListener("message", ({ source: t, data: s }) => {
  t === be && s === a && i.length && i.shift()();
}, !1), (t) => {
  i.push(t), be.postMessage(a, "*");
}))(`axios@${Math.random()}`, []) : (a) => setTimeout(a))(
  typeof setImmediate == "function",
  K(be.postMessage)
), Yp = typeof queueMicrotask < "u" ? queueMicrotask.bind(be) : typeof process < "u" && process.nextTick || no, f = {
  isArray: Le,
  isArrayBuffer: Ks,
  isBuffer: fp,
  isFormData: kp,
  isArrayBufferView: xp,
  isString: hp,
  isNumber: Xs,
  isBoolean: vp,
  isObject: pa,
  isPlainObject: jn,
  isReadableStream: _p,
  isRequest: Rp,
  isResponse: Ap,
  isHeaders: jp,
  isUndefined: We,
  isDate: bp,
  isFile: gp,
  isBlob: yp,
  isRegExp: Ip,
  isFunction: K,
  isStream: Ep,
  isURLSearchParams: Sp,
  isTypedArray: Np,
  isFileList: wp,
  forEach: Qe,
  merge: Wa,
  extend: Cp,
  trim: Tp,
  stripBOM: Op,
  inherits: Pp,
  toFlatObject: $p,
  kindOf: ra,
  kindOfTest: ae,
  endsWith: Fp,
  toArray: Lp,
  forEachEntry: zp,
  matchAll: Dp,
  isHTMLForm: Bp,
  hasOwnProperty: Zi,
  hasOwnProp: Zi,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors: Qs,
  freezeMethods: Up,
  toObjectSet: Mp,
  toCamelCase: qp,
  noop: Hp,
  toFiniteNumber: Wp,
  findKey: Ys,
  global: be,
  isContextDefined: Zs,
  ALPHABET: eo,
  generateString: Vp,
  isSpecCompliantForm: Jp,
  toJSONObject: Gp,
  isAsyncFn: Kp,
  isThenable: Xp,
  setImmediate: no,
  asap: Yp
};
function g(n, e, a, i, t) {
  Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack, this.message = n, this.name = "AxiosError", e && (this.code = e), a && (this.config = a), i && (this.request = i), t && (this.response = t, this.status = t.status ? t.status : null);
}
f.inherits(g, Error, {
  toJSON: function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: f.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});
const ao = g.prototype, io = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((n) => {
  io[n] = { value: n };
});
Object.defineProperties(g, io);
Object.defineProperty(ao, "isAxiosError", { value: !0 });
g.from = (n, e, a, i, t, s) => {
  const o = Object.create(ao);
  return f.toFlatObject(n, o, function(c) {
    return c !== Error.prototype;
  }, (r) => r !== "isAxiosError"), g.call(o, n.message, e, a, i, t), o.cause = n, o.name = n.name, s && Object.assign(o, s), o;
};
var to = Z.Stream, Zp = Se, Qp = ie;
function ie() {
  this.source = null, this.dataSize = 0, this.maxDataSize = 1024 * 1024, this.pauseStream = !0, this._maxDataSizeExceeded = !1, this._released = !1, this._bufferedEvents = [];
}
Zp.inherits(ie, to);
ie.create = function(n, e) {
  var a = new this();
  e = e || {};
  for (var i in e)
    a[i] = e[i];
  a.source = n;
  var t = n.emit;
  return n.emit = function() {
    return a._handleEmit(arguments), t.apply(n, arguments);
  }, n.on("error", function() {
  }), a.pauseStream && n.pause(), a;
};
Object.defineProperty(ie.prototype, "readable", {
  configurable: !0,
  enumerable: !0,
  get: function() {
    return this.source.readable;
  }
});
ie.prototype.setEncoding = function() {
  return this.source.setEncoding.apply(this.source, arguments);
};
ie.prototype.resume = function() {
  this._released || this.release(), this.source.resume();
};
ie.prototype.pause = function() {
  this.source.pause();
};
ie.prototype.release = function() {
  this._released = !0, this._bufferedEvents.forEach((function(n) {
    this.emit.apply(this, n);
  }).bind(this)), this._bufferedEvents = [];
};
ie.prototype.pipe = function() {
  var n = to.prototype.pipe.apply(this, arguments);
  return this.resume(), n;
};
ie.prototype._handleEmit = function(n) {
  if (this._released) {
    this.emit.apply(this, n);
    return;
  }
  n[0] === "data" && (this.dataSize += n[1].length, this._checkIfMaxDataSizeExceeded()), this._bufferedEvents.push(n);
};
ie.prototype._checkIfMaxDataSizeExceeded = function() {
  if (!this._maxDataSizeExceeded && !(this.dataSize <= this.maxDataSize)) {
    this._maxDataSizeExceeded = !0;
    var n = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
    this.emit("error", new Error(n));
  }
};
var el = Se, so = Z.Stream, et = Qp, nl = $;
function $() {
  this.writable = !1, this.readable = !0, this.dataSize = 0, this.maxDataSize = 2 * 1024 * 1024, this.pauseStreams = !0, this._released = !1, this._streams = [], this._currentStream = null, this._insideLoop = !1, this._pendingNext = !1;
}
el.inherits($, so);
$.create = function(n) {
  var e = new this();
  n = n || {};
  for (var a in n)
    e[a] = n[a];
  return e;
};
$.isStreamLike = function(n) {
  return typeof n != "function" && typeof n != "string" && typeof n != "boolean" && typeof n != "number" && !Buffer.isBuffer(n);
};
$.prototype.append = function(n) {
  var e = $.isStreamLike(n);
  if (e) {
    if (!(n instanceof et)) {
      var a = et.create(n, {
        maxDataSize: 1 / 0,
        pauseStream: this.pauseStreams
      });
      n.on("data", this._checkDataSize.bind(this)), n = a;
    }
    this._handleErrors(n), this.pauseStreams && n.pause();
  }
  return this._streams.push(n), this;
};
$.prototype.pipe = function(n, e) {
  return so.prototype.pipe.call(this, n, e), this.resume(), n;
};
$.prototype._getNext = function() {
  if (this._currentStream = null, this._insideLoop) {
    this._pendingNext = !0;
    return;
  }
  this._insideLoop = !0;
  try {
    do
      this._pendingNext = !1, this._realGetNext();
    while (this._pendingNext);
  } finally {
    this._insideLoop = !1;
  }
};
$.prototype._realGetNext = function() {
  var n = this._streams.shift();
  if (typeof n > "u") {
    this.end();
    return;
  }
  if (typeof n != "function") {
    this._pipeNext(n);
    return;
  }
  var e = n;
  e((function(a) {
    var i = $.isStreamLike(a);
    i && (a.on("data", this._checkDataSize.bind(this)), this._handleErrors(a)), this._pipeNext(a);
  }).bind(this));
};
$.prototype._pipeNext = function(n) {
  this._currentStream = n;
  var e = $.isStreamLike(n);
  if (e) {
    n.on("end", this._getNext.bind(this)), n.pipe(this, { end: !1 });
    return;
  }
  var a = n;
  this.write(a), this._getNext();
};
$.prototype._handleErrors = function(n) {
  var e = this;
  n.on("error", function(a) {
    e._emitError(a);
  });
};
$.prototype.write = function(n) {
  this.emit("data", n);
};
$.prototype.pause = function() {
  this.pauseStreams && (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == "function" && this._currentStream.pause(), this.emit("pause"));
};
$.prototype.resume = function() {
  this._released || (this._released = !0, this.writable = !0, this._getNext()), this.pauseStreams && this._currentStream && typeof this._currentStream.resume == "function" && this._currentStream.resume(), this.emit("resume");
};
$.prototype.end = function() {
  this._reset(), this.emit("end");
};
$.prototype.destroy = function() {
  this._reset(), this.emit("close");
};
$.prototype._reset = function() {
  this.writable = !1, this._streams = [], this._currentStream = null;
};
$.prototype._checkDataSize = function() {
  if (this._updateDataSize(), !(this.dataSize <= this.maxDataSize)) {
    var n = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
    this._emitError(new Error(n));
  }
};
$.prototype._updateDataSize = function() {
  this.dataSize = 0;
  var n = this;
  this._streams.forEach(function(e) {
    e.dataSize && (n.dataSize += e.dataSize);
  }), this._currentStream && this._currentStream.dataSize && (this.dataSize += this._currentStream.dataSize);
};
$.prototype._emitError = function(n) {
  this._reset(), this.emit("error", n);
};
var oo = {};
const al = {
  "application/1d-interleaved-parityfec": {
    source: "iana"
  },
  "application/3gpdash-qoe-report+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/3gpp-ims+xml": {
    source: "iana",
    compressible: !0
  },
  "application/3gpphal+json": {
    source: "iana",
    compressible: !0
  },
  "application/3gpphalforms+json": {
    source: "iana",
    compressible: !0
  },
  "application/a2l": {
    source: "iana"
  },
  "application/ace+cbor": {
    source: "iana"
  },
  "application/activemessage": {
    source: "iana"
  },
  "application/activity+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-costmap+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-costmapfilter+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-directory+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-endpointcost+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-endpointcostparams+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-endpointprop+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-endpointpropparams+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-error+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-networkmap+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-networkmapfilter+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-updatestreamcontrol+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-updatestreamparams+json": {
    source: "iana",
    compressible: !0
  },
  "application/aml": {
    source: "iana"
  },
  "application/andrew-inset": {
    source: "iana",
    extensions: [
      "ez"
    ]
  },
  "application/applefile": {
    source: "iana"
  },
  "application/applixware": {
    source: "apache",
    extensions: [
      "aw"
    ]
  },
  "application/at+jwt": {
    source: "iana"
  },
  "application/atf": {
    source: "iana"
  },
  "application/atfx": {
    source: "iana"
  },
  "application/atom+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "atom"
    ]
  },
  "application/atomcat+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "atomcat"
    ]
  },
  "application/atomdeleted+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "atomdeleted"
    ]
  },
  "application/atomicmail": {
    source: "iana"
  },
  "application/atomsvc+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "atomsvc"
    ]
  },
  "application/atsc-dwd+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "dwd"
    ]
  },
  "application/atsc-dynamic-event-message": {
    source: "iana"
  },
  "application/atsc-held+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "held"
    ]
  },
  "application/atsc-rdt+json": {
    source: "iana",
    compressible: !0
  },
  "application/atsc-rsat+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rsat"
    ]
  },
  "application/atxml": {
    source: "iana"
  },
  "application/auth-policy+xml": {
    source: "iana",
    compressible: !0
  },
  "application/bacnet-xdd+zip": {
    source: "iana",
    compressible: !1
  },
  "application/batch-smtp": {
    source: "iana"
  },
  "application/bdoc": {
    compressible: !1,
    extensions: [
      "bdoc"
    ]
  },
  "application/beep+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/calendar+json": {
    source: "iana",
    compressible: !0
  },
  "application/calendar+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xcs"
    ]
  },
  "application/call-completion": {
    source: "iana"
  },
  "application/cals-1840": {
    source: "iana"
  },
  "application/captive+json": {
    source: "iana",
    compressible: !0
  },
  "application/cbor": {
    source: "iana"
  },
  "application/cbor-seq": {
    source: "iana"
  },
  "application/cccex": {
    source: "iana"
  },
  "application/ccmp+xml": {
    source: "iana",
    compressible: !0
  },
  "application/ccxml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "ccxml"
    ]
  },
  "application/cdfx+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "cdfx"
    ]
  },
  "application/cdmi-capability": {
    source: "iana",
    extensions: [
      "cdmia"
    ]
  },
  "application/cdmi-container": {
    source: "iana",
    extensions: [
      "cdmic"
    ]
  },
  "application/cdmi-domain": {
    source: "iana",
    extensions: [
      "cdmid"
    ]
  },
  "application/cdmi-object": {
    source: "iana",
    extensions: [
      "cdmio"
    ]
  },
  "application/cdmi-queue": {
    source: "iana",
    extensions: [
      "cdmiq"
    ]
  },
  "application/cdni": {
    source: "iana"
  },
  "application/cea": {
    source: "iana"
  },
  "application/cea-2018+xml": {
    source: "iana",
    compressible: !0
  },
  "application/cellml+xml": {
    source: "iana",
    compressible: !0
  },
  "application/cfw": {
    source: "iana"
  },
  "application/city+json": {
    source: "iana",
    compressible: !0
  },
  "application/clr": {
    source: "iana"
  },
  "application/clue+xml": {
    source: "iana",
    compressible: !0
  },
  "application/clue_info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/cms": {
    source: "iana"
  },
  "application/cnrp+xml": {
    source: "iana",
    compressible: !0
  },
  "application/coap-group+json": {
    source: "iana",
    compressible: !0
  },
  "application/coap-payload": {
    source: "iana"
  },
  "application/commonground": {
    source: "iana"
  },
  "application/conference-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/cose": {
    source: "iana"
  },
  "application/cose-key": {
    source: "iana"
  },
  "application/cose-key-set": {
    source: "iana"
  },
  "application/cpl+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "cpl"
    ]
  },
  "application/csrattrs": {
    source: "iana"
  },
  "application/csta+xml": {
    source: "iana",
    compressible: !0
  },
  "application/cstadata+xml": {
    source: "iana",
    compressible: !0
  },
  "application/csvm+json": {
    source: "iana",
    compressible: !0
  },
  "application/cu-seeme": {
    source: "apache",
    extensions: [
      "cu"
    ]
  },
  "application/cwt": {
    source: "iana"
  },
  "application/cybercash": {
    source: "iana"
  },
  "application/dart": {
    compressible: !0
  },
  "application/dash+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mpd"
    ]
  },
  "application/dash-patch+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mpp"
    ]
  },
  "application/dashdelta": {
    source: "iana"
  },
  "application/davmount+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "davmount"
    ]
  },
  "application/dca-rft": {
    source: "iana"
  },
  "application/dcd": {
    source: "iana"
  },
  "application/dec-dx": {
    source: "iana"
  },
  "application/dialog-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/dicom": {
    source: "iana"
  },
  "application/dicom+json": {
    source: "iana",
    compressible: !0
  },
  "application/dicom+xml": {
    source: "iana",
    compressible: !0
  },
  "application/dii": {
    source: "iana"
  },
  "application/dit": {
    source: "iana"
  },
  "application/dns": {
    source: "iana"
  },
  "application/dns+json": {
    source: "iana",
    compressible: !0
  },
  "application/dns-message": {
    source: "iana"
  },
  "application/docbook+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "dbk"
    ]
  },
  "application/dots+cbor": {
    source: "iana"
  },
  "application/dskpp+xml": {
    source: "iana",
    compressible: !0
  },
  "application/dssc+der": {
    source: "iana",
    extensions: [
      "dssc"
    ]
  },
  "application/dssc+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xdssc"
    ]
  },
  "application/dvcs": {
    source: "iana"
  },
  "application/ecmascript": {
    source: "iana",
    compressible: !0,
    extensions: [
      "es",
      "ecma"
    ]
  },
  "application/edi-consent": {
    source: "iana"
  },
  "application/edi-x12": {
    source: "iana",
    compressible: !1
  },
  "application/edifact": {
    source: "iana",
    compressible: !1
  },
  "application/efi": {
    source: "iana"
  },
  "application/elm+json": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/elm+xml": {
    source: "iana",
    compressible: !0
  },
  "application/emergencycalldata.cap+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/emergencycalldata.comment+xml": {
    source: "iana",
    compressible: !0
  },
  "application/emergencycalldata.control+xml": {
    source: "iana",
    compressible: !0
  },
  "application/emergencycalldata.deviceinfo+xml": {
    source: "iana",
    compressible: !0
  },
  "application/emergencycalldata.ecall.msd": {
    source: "iana"
  },
  "application/emergencycalldata.providerinfo+xml": {
    source: "iana",
    compressible: !0
  },
  "application/emergencycalldata.serviceinfo+xml": {
    source: "iana",
    compressible: !0
  },
  "application/emergencycalldata.subscriberinfo+xml": {
    source: "iana",
    compressible: !0
  },
  "application/emergencycalldata.veds+xml": {
    source: "iana",
    compressible: !0
  },
  "application/emma+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "emma"
    ]
  },
  "application/emotionml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "emotionml"
    ]
  },
  "application/encaprtp": {
    source: "iana"
  },
  "application/epp+xml": {
    source: "iana",
    compressible: !0
  },
  "application/epub+zip": {
    source: "iana",
    compressible: !1,
    extensions: [
      "epub"
    ]
  },
  "application/eshop": {
    source: "iana"
  },
  "application/exi": {
    source: "iana",
    extensions: [
      "exi"
    ]
  },
  "application/expect-ct-report+json": {
    source: "iana",
    compressible: !0
  },
  "application/express": {
    source: "iana",
    extensions: [
      "exp"
    ]
  },
  "application/fastinfoset": {
    source: "iana"
  },
  "application/fastsoap": {
    source: "iana"
  },
  "application/fdt+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "fdt"
    ]
  },
  "application/fhir+json": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/fhir+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/fido.trusted-apps+json": {
    compressible: !0
  },
  "application/fits": {
    source: "iana"
  },
  "application/flexfec": {
    source: "iana"
  },
  "application/font-sfnt": {
    source: "iana"
  },
  "application/font-tdpfr": {
    source: "iana",
    extensions: [
      "pfr"
    ]
  },
  "application/font-woff": {
    source: "iana",
    compressible: !1
  },
  "application/framework-attributes+xml": {
    source: "iana",
    compressible: !0
  },
  "application/geo+json": {
    source: "iana",
    compressible: !0,
    extensions: [
      "geojson"
    ]
  },
  "application/geo+json-seq": {
    source: "iana"
  },
  "application/geopackage+sqlite3": {
    source: "iana"
  },
  "application/geoxacml+xml": {
    source: "iana",
    compressible: !0
  },
  "application/gltf-buffer": {
    source: "iana"
  },
  "application/gml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "gml"
    ]
  },
  "application/gpx+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "gpx"
    ]
  },
  "application/gxf": {
    source: "apache",
    extensions: [
      "gxf"
    ]
  },
  "application/gzip": {
    source: "iana",
    compressible: !1,
    extensions: [
      "gz"
    ]
  },
  "application/h224": {
    source: "iana"
  },
  "application/held+xml": {
    source: "iana",
    compressible: !0
  },
  "application/hjson": {
    extensions: [
      "hjson"
    ]
  },
  "application/http": {
    source: "iana"
  },
  "application/hyperstudio": {
    source: "iana",
    extensions: [
      "stk"
    ]
  },
  "application/ibe-key-request+xml": {
    source: "iana",
    compressible: !0
  },
  "application/ibe-pkg-reply+xml": {
    source: "iana",
    compressible: !0
  },
  "application/ibe-pp-data": {
    source: "iana"
  },
  "application/iges": {
    source: "iana"
  },
  "application/im-iscomposing+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/index": {
    source: "iana"
  },
  "application/index.cmd": {
    source: "iana"
  },
  "application/index.obj": {
    source: "iana"
  },
  "application/index.response": {
    source: "iana"
  },
  "application/index.vnd": {
    source: "iana"
  },
  "application/inkml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "ink",
      "inkml"
    ]
  },
  "application/iotp": {
    source: "iana"
  },
  "application/ipfix": {
    source: "iana",
    extensions: [
      "ipfix"
    ]
  },
  "application/ipp": {
    source: "iana"
  },
  "application/isup": {
    source: "iana"
  },
  "application/its+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "its"
    ]
  },
  "application/java-archive": {
    source: "apache",
    compressible: !1,
    extensions: [
      "jar",
      "war",
      "ear"
    ]
  },
  "application/java-serialized-object": {
    source: "apache",
    compressible: !1,
    extensions: [
      "ser"
    ]
  },
  "application/java-vm": {
    source: "apache",
    compressible: !1,
    extensions: [
      "class"
    ]
  },
  "application/javascript": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "js",
      "mjs"
    ]
  },
  "application/jf2feed+json": {
    source: "iana",
    compressible: !0
  },
  "application/jose": {
    source: "iana"
  },
  "application/jose+json": {
    source: "iana",
    compressible: !0
  },
  "application/jrd+json": {
    source: "iana",
    compressible: !0
  },
  "application/jscalendar+json": {
    source: "iana",
    compressible: !0
  },
  "application/json": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "json",
      "map"
    ]
  },
  "application/json-patch+json": {
    source: "iana",
    compressible: !0
  },
  "application/json-seq": {
    source: "iana"
  },
  "application/json5": {
    extensions: [
      "json5"
    ]
  },
  "application/jsonml+json": {
    source: "apache",
    compressible: !0,
    extensions: [
      "jsonml"
    ]
  },
  "application/jwk+json": {
    source: "iana",
    compressible: !0
  },
  "application/jwk-set+json": {
    source: "iana",
    compressible: !0
  },
  "application/jwt": {
    source: "iana"
  },
  "application/kpml-request+xml": {
    source: "iana",
    compressible: !0
  },
  "application/kpml-response+xml": {
    source: "iana",
    compressible: !0
  },
  "application/ld+json": {
    source: "iana",
    compressible: !0,
    extensions: [
      "jsonld"
    ]
  },
  "application/lgr+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "lgr"
    ]
  },
  "application/link-format": {
    source: "iana"
  },
  "application/load-control+xml": {
    source: "iana",
    compressible: !0
  },
  "application/lost+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "lostxml"
    ]
  },
  "application/lostsync+xml": {
    source: "iana",
    compressible: !0
  },
  "application/lpf+zip": {
    source: "iana",
    compressible: !1
  },
  "application/lxf": {
    source: "iana"
  },
  "application/mac-binhex40": {
    source: "iana",
    extensions: [
      "hqx"
    ]
  },
  "application/mac-compactpro": {
    source: "apache",
    extensions: [
      "cpt"
    ]
  },
  "application/macwriteii": {
    source: "iana"
  },
  "application/mads+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mads"
    ]
  },
  "application/manifest+json": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "webmanifest"
    ]
  },
  "application/marc": {
    source: "iana",
    extensions: [
      "mrc"
    ]
  },
  "application/marcxml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mrcx"
    ]
  },
  "application/mathematica": {
    source: "iana",
    extensions: [
      "ma",
      "nb",
      "mb"
    ]
  },
  "application/mathml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mathml"
    ]
  },
  "application/mathml-content+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mathml-presentation+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-associated-procedure-description+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-deregister+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-envelope+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-msk+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-msk-response+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-protection-description+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-reception-report+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-register+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-register-response+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-schedule+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-user-service-description+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbox": {
    source: "iana",
    extensions: [
      "mbox"
    ]
  },
  "application/media-policy-dataset+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mpf"
    ]
  },
  "application/media_control+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mediaservercontrol+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mscml"
    ]
  },
  "application/merge-patch+json": {
    source: "iana",
    compressible: !0
  },
  "application/metalink+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "metalink"
    ]
  },
  "application/metalink4+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "meta4"
    ]
  },
  "application/mets+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mets"
    ]
  },
  "application/mf4": {
    source: "iana"
  },
  "application/mikey": {
    source: "iana"
  },
  "application/mipc": {
    source: "iana"
  },
  "application/missing-blocks+cbor-seq": {
    source: "iana"
  },
  "application/mmt-aei+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "maei"
    ]
  },
  "application/mmt-usd+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "musd"
    ]
  },
  "application/mods+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mods"
    ]
  },
  "application/moss-keys": {
    source: "iana"
  },
  "application/moss-signature": {
    source: "iana"
  },
  "application/mosskey-data": {
    source: "iana"
  },
  "application/mosskey-request": {
    source: "iana"
  },
  "application/mp21": {
    source: "iana",
    extensions: [
      "m21",
      "mp21"
    ]
  },
  "application/mp4": {
    source: "iana",
    extensions: [
      "mp4s",
      "m4p"
    ]
  },
  "application/mpeg4-generic": {
    source: "iana"
  },
  "application/mpeg4-iod": {
    source: "iana"
  },
  "application/mpeg4-iod-xmt": {
    source: "iana"
  },
  "application/mrb-consumer+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mrb-publish+xml": {
    source: "iana",
    compressible: !0
  },
  "application/msc-ivr+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/msc-mixer+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/msword": {
    source: "iana",
    compressible: !1,
    extensions: [
      "doc",
      "dot"
    ]
  },
  "application/mud+json": {
    source: "iana",
    compressible: !0
  },
  "application/multipart-core": {
    source: "iana"
  },
  "application/mxf": {
    source: "iana",
    extensions: [
      "mxf"
    ]
  },
  "application/n-quads": {
    source: "iana",
    extensions: [
      "nq"
    ]
  },
  "application/n-triples": {
    source: "iana",
    extensions: [
      "nt"
    ]
  },
  "application/nasdata": {
    source: "iana"
  },
  "application/news-checkgroups": {
    source: "iana",
    charset: "US-ASCII"
  },
  "application/news-groupinfo": {
    source: "iana",
    charset: "US-ASCII"
  },
  "application/news-transmission": {
    source: "iana"
  },
  "application/nlsml+xml": {
    source: "iana",
    compressible: !0
  },
  "application/node": {
    source: "iana",
    extensions: [
      "cjs"
    ]
  },
  "application/nss": {
    source: "iana"
  },
  "application/oauth-authz-req+jwt": {
    source: "iana"
  },
  "application/oblivious-dns-message": {
    source: "iana"
  },
  "application/ocsp-request": {
    source: "iana"
  },
  "application/ocsp-response": {
    source: "iana"
  },
  "application/octet-stream": {
    source: "iana",
    compressible: !1,
    extensions: [
      "bin",
      "dms",
      "lrf",
      "mar",
      "so",
      "dist",
      "distz",
      "pkg",
      "bpk",
      "dump",
      "elc",
      "deploy",
      "exe",
      "dll",
      "deb",
      "dmg",
      "iso",
      "img",
      "msi",
      "msp",
      "msm",
      "buffer"
    ]
  },
  "application/oda": {
    source: "iana",
    extensions: [
      "oda"
    ]
  },
  "application/odm+xml": {
    source: "iana",
    compressible: !0
  },
  "application/odx": {
    source: "iana"
  },
  "application/oebps-package+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "opf"
    ]
  },
  "application/ogg": {
    source: "iana",
    compressible: !1,
    extensions: [
      "ogx"
    ]
  },
  "application/omdoc+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "omdoc"
    ]
  },
  "application/onenote": {
    source: "apache",
    extensions: [
      "onetoc",
      "onetoc2",
      "onetmp",
      "onepkg"
    ]
  },
  "application/opc-nodeset+xml": {
    source: "iana",
    compressible: !0
  },
  "application/oscore": {
    source: "iana"
  },
  "application/oxps": {
    source: "iana",
    extensions: [
      "oxps"
    ]
  },
  "application/p21": {
    source: "iana"
  },
  "application/p21+zip": {
    source: "iana",
    compressible: !1
  },
  "application/p2p-overlay+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "relo"
    ]
  },
  "application/parityfec": {
    source: "iana"
  },
  "application/passport": {
    source: "iana"
  },
  "application/patch-ops-error+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xer"
    ]
  },
  "application/pdf": {
    source: "iana",
    compressible: !1,
    extensions: [
      "pdf"
    ]
  },
  "application/pdx": {
    source: "iana"
  },
  "application/pem-certificate-chain": {
    source: "iana"
  },
  "application/pgp-encrypted": {
    source: "iana",
    compressible: !1,
    extensions: [
      "pgp"
    ]
  },
  "application/pgp-keys": {
    source: "iana",
    extensions: [
      "asc"
    ]
  },
  "application/pgp-signature": {
    source: "iana",
    extensions: [
      "asc",
      "sig"
    ]
  },
  "application/pics-rules": {
    source: "apache",
    extensions: [
      "prf"
    ]
  },
  "application/pidf+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/pidf-diff+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/pkcs10": {
    source: "iana",
    extensions: [
      "p10"
    ]
  },
  "application/pkcs12": {
    source: "iana"
  },
  "application/pkcs7-mime": {
    source: "iana",
    extensions: [
      "p7m",
      "p7c"
    ]
  },
  "application/pkcs7-signature": {
    source: "iana",
    extensions: [
      "p7s"
    ]
  },
  "application/pkcs8": {
    source: "iana",
    extensions: [
      "p8"
    ]
  },
  "application/pkcs8-encrypted": {
    source: "iana"
  },
  "application/pkix-attr-cert": {
    source: "iana",
    extensions: [
      "ac"
    ]
  },
  "application/pkix-cert": {
    source: "iana",
    extensions: [
      "cer"
    ]
  },
  "application/pkix-crl": {
    source: "iana",
    extensions: [
      "crl"
    ]
  },
  "application/pkix-pkipath": {
    source: "iana",
    extensions: [
      "pkipath"
    ]
  },
  "application/pkixcmp": {
    source: "iana",
    extensions: [
      "pki"
    ]
  },
  "application/pls+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "pls"
    ]
  },
  "application/poc-settings+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/postscript": {
    source: "iana",
    compressible: !0,
    extensions: [
      "ai",
      "eps",
      "ps"
    ]
  },
  "application/ppsp-tracker+json": {
    source: "iana",
    compressible: !0
  },
  "application/problem+json": {
    source: "iana",
    compressible: !0
  },
  "application/problem+xml": {
    source: "iana",
    compressible: !0
  },
  "application/provenance+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "provx"
    ]
  },
  "application/prs.alvestrand.titrax-sheet": {
    source: "iana"
  },
  "application/prs.cww": {
    source: "iana",
    extensions: [
      "cww"
    ]
  },
  "application/prs.cyn": {
    source: "iana",
    charset: "7-BIT"
  },
  "application/prs.hpub+zip": {
    source: "iana",
    compressible: !1
  },
  "application/prs.nprend": {
    source: "iana"
  },
  "application/prs.plucker": {
    source: "iana"
  },
  "application/prs.rdf-xml-crypt": {
    source: "iana"
  },
  "application/prs.xsf+xml": {
    source: "iana",
    compressible: !0
  },
  "application/pskc+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "pskcxml"
    ]
  },
  "application/pvd+json": {
    source: "iana",
    compressible: !0
  },
  "application/qsig": {
    source: "iana"
  },
  "application/raml+yaml": {
    compressible: !0,
    extensions: [
      "raml"
    ]
  },
  "application/raptorfec": {
    source: "iana"
  },
  "application/rdap+json": {
    source: "iana",
    compressible: !0
  },
  "application/rdf+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rdf",
      "owl"
    ]
  },
  "application/reginfo+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rif"
    ]
  },
  "application/relax-ng-compact-syntax": {
    source: "iana",
    extensions: [
      "rnc"
    ]
  },
  "application/remote-printing": {
    source: "iana"
  },
  "application/reputon+json": {
    source: "iana",
    compressible: !0
  },
  "application/resource-lists+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rl"
    ]
  },
  "application/resource-lists-diff+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rld"
    ]
  },
  "application/rfc+xml": {
    source: "iana",
    compressible: !0
  },
  "application/riscos": {
    source: "iana"
  },
  "application/rlmi+xml": {
    source: "iana",
    compressible: !0
  },
  "application/rls-services+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rs"
    ]
  },
  "application/route-apd+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rapd"
    ]
  },
  "application/route-s-tsid+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "sls"
    ]
  },
  "application/route-usd+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rusd"
    ]
  },
  "application/rpki-ghostbusters": {
    source: "iana",
    extensions: [
      "gbr"
    ]
  },
  "application/rpki-manifest": {
    source: "iana",
    extensions: [
      "mft"
    ]
  },
  "application/rpki-publication": {
    source: "iana"
  },
  "application/rpki-roa": {
    source: "iana",
    extensions: [
      "roa"
    ]
  },
  "application/rpki-updown": {
    source: "iana"
  },
  "application/rsd+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "rsd"
    ]
  },
  "application/rss+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "rss"
    ]
  },
  "application/rtf": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rtf"
    ]
  },
  "application/rtploopback": {
    source: "iana"
  },
  "application/rtx": {
    source: "iana"
  },
  "application/samlassertion+xml": {
    source: "iana",
    compressible: !0
  },
  "application/samlmetadata+xml": {
    source: "iana",
    compressible: !0
  },
  "application/sarif+json": {
    source: "iana",
    compressible: !0
  },
  "application/sarif-external-properties+json": {
    source: "iana",
    compressible: !0
  },
  "application/sbe": {
    source: "iana"
  },
  "application/sbml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "sbml"
    ]
  },
  "application/scaip+xml": {
    source: "iana",
    compressible: !0
  },
  "application/scim+json": {
    source: "iana",
    compressible: !0
  },
  "application/scvp-cv-request": {
    source: "iana",
    extensions: [
      "scq"
    ]
  },
  "application/scvp-cv-response": {
    source: "iana",
    extensions: [
      "scs"
    ]
  },
  "application/scvp-vp-request": {
    source: "iana",
    extensions: [
      "spq"
    ]
  },
  "application/scvp-vp-response": {
    source: "iana",
    extensions: [
      "spp"
    ]
  },
  "application/sdp": {
    source: "iana",
    extensions: [
      "sdp"
    ]
  },
  "application/secevent+jwt": {
    source: "iana"
  },
  "application/senml+cbor": {
    source: "iana"
  },
  "application/senml+json": {
    source: "iana",
    compressible: !0
  },
  "application/senml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "senmlx"
    ]
  },
  "application/senml-etch+cbor": {
    source: "iana"
  },
  "application/senml-etch+json": {
    source: "iana",
    compressible: !0
  },
  "application/senml-exi": {
    source: "iana"
  },
  "application/sensml+cbor": {
    source: "iana"
  },
  "application/sensml+json": {
    source: "iana",
    compressible: !0
  },
  "application/sensml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "sensmlx"
    ]
  },
  "application/sensml-exi": {
    source: "iana"
  },
  "application/sep+xml": {
    source: "iana",
    compressible: !0
  },
  "application/sep-exi": {
    source: "iana"
  },
  "application/session-info": {
    source: "iana"
  },
  "application/set-payment": {
    source: "iana"
  },
  "application/set-payment-initiation": {
    source: "iana",
    extensions: [
      "setpay"
    ]
  },
  "application/set-registration": {
    source: "iana"
  },
  "application/set-registration-initiation": {
    source: "iana",
    extensions: [
      "setreg"
    ]
  },
  "application/sgml": {
    source: "iana"
  },
  "application/sgml-open-catalog": {
    source: "iana"
  },
  "application/shf+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "shf"
    ]
  },
  "application/sieve": {
    source: "iana",
    extensions: [
      "siv",
      "sieve"
    ]
  },
  "application/simple-filter+xml": {
    source: "iana",
    compressible: !0
  },
  "application/simple-message-summary": {
    source: "iana"
  },
  "application/simplesymbolcontainer": {
    source: "iana"
  },
  "application/sipc": {
    source: "iana"
  },
  "application/slate": {
    source: "iana"
  },
  "application/smil": {
    source: "iana"
  },
  "application/smil+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "smi",
      "smil"
    ]
  },
  "application/smpte336m": {
    source: "iana"
  },
  "application/soap+fastinfoset": {
    source: "iana"
  },
  "application/soap+xml": {
    source: "iana",
    compressible: !0
  },
  "application/sparql-query": {
    source: "iana",
    extensions: [
      "rq"
    ]
  },
  "application/sparql-results+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "srx"
    ]
  },
  "application/spdx+json": {
    source: "iana",
    compressible: !0
  },
  "application/spirits-event+xml": {
    source: "iana",
    compressible: !0
  },
  "application/sql": {
    source: "iana"
  },
  "application/srgs": {
    source: "iana",
    extensions: [
      "gram"
    ]
  },
  "application/srgs+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "grxml"
    ]
  },
  "application/sru+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "sru"
    ]
  },
  "application/ssdl+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "ssdl"
    ]
  },
  "application/ssml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "ssml"
    ]
  },
  "application/stix+json": {
    source: "iana",
    compressible: !0
  },
  "application/swid+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "swidtag"
    ]
  },
  "application/tamp-apex-update": {
    source: "iana"
  },
  "application/tamp-apex-update-confirm": {
    source: "iana"
  },
  "application/tamp-community-update": {
    source: "iana"
  },
  "application/tamp-community-update-confirm": {
    source: "iana"
  },
  "application/tamp-error": {
    source: "iana"
  },
  "application/tamp-sequence-adjust": {
    source: "iana"
  },
  "application/tamp-sequence-adjust-confirm": {
    source: "iana"
  },
  "application/tamp-status-query": {
    source: "iana"
  },
  "application/tamp-status-response": {
    source: "iana"
  },
  "application/tamp-update": {
    source: "iana"
  },
  "application/tamp-update-confirm": {
    source: "iana"
  },
  "application/tar": {
    compressible: !0
  },
  "application/taxii+json": {
    source: "iana",
    compressible: !0
  },
  "application/td+json": {
    source: "iana",
    compressible: !0
  },
  "application/tei+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "tei",
      "teicorpus"
    ]
  },
  "application/tetra_isi": {
    source: "iana"
  },
  "application/thraud+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "tfi"
    ]
  },
  "application/timestamp-query": {
    source: "iana"
  },
  "application/timestamp-reply": {
    source: "iana"
  },
  "application/timestamped-data": {
    source: "iana",
    extensions: [
      "tsd"
    ]
  },
  "application/tlsrpt+gzip": {
    source: "iana"
  },
  "application/tlsrpt+json": {
    source: "iana",
    compressible: !0
  },
  "application/tnauthlist": {
    source: "iana"
  },
  "application/token-introspection+jwt": {
    source: "iana"
  },
  "application/toml": {
    compressible: !0,
    extensions: [
      "toml"
    ]
  },
  "application/trickle-ice-sdpfrag": {
    source: "iana"
  },
  "application/trig": {
    source: "iana",
    extensions: [
      "trig"
    ]
  },
  "application/ttml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "ttml"
    ]
  },
  "application/tve-trigger": {
    source: "iana"
  },
  "application/tzif": {
    source: "iana"
  },
  "application/tzif-leap": {
    source: "iana"
  },
  "application/ubjson": {
    compressible: !1,
    extensions: [
      "ubj"
    ]
  },
  "application/ulpfec": {
    source: "iana"
  },
  "application/urc-grpsheet+xml": {
    source: "iana",
    compressible: !0
  },
  "application/urc-ressheet+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rsheet"
    ]
  },
  "application/urc-targetdesc+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "td"
    ]
  },
  "application/urc-uisocketdesc+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vcard+json": {
    source: "iana",
    compressible: !0
  },
  "application/vcard+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vemmi": {
    source: "iana"
  },
  "application/vividence.scriptfile": {
    source: "apache"
  },
  "application/vnd.1000minds.decision-model+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "1km"
    ]
  },
  "application/vnd.3gpp-prose+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp-prose-pc3ch+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp-v2x-local-service-information": {
    source: "iana"
  },
  "application/vnd.3gpp.5gnas": {
    source: "iana"
  },
  "application/vnd.3gpp.access-transfer-events+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.bsf+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.gmop+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.gtpc": {
    source: "iana"
  },
  "application/vnd.3gpp.interworking-data": {
    source: "iana"
  },
  "application/vnd.3gpp.lpp": {
    source: "iana"
  },
  "application/vnd.3gpp.mc-signalling-ear": {
    source: "iana"
  },
  "application/vnd.3gpp.mcdata-affiliation-command+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcdata-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcdata-payload": {
    source: "iana"
  },
  "application/vnd.3gpp.mcdata-service-config+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcdata-signalling": {
    source: "iana"
  },
  "application/vnd.3gpp.mcdata-ue-config+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcdata-user-profile+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-affiliation-command+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-floor-request+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-location-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-service-config+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-signed+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-ue-config+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-ue-init-config+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-user-profile+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-affiliation-command+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-affiliation-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-location-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-service-config+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-transmission-request+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-ue-config+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-user-profile+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mid-call+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.ngap": {
    source: "iana"
  },
  "application/vnd.3gpp.pfcp": {
    source: "iana"
  },
  "application/vnd.3gpp.pic-bw-large": {
    source: "iana",
    extensions: [
      "plb"
    ]
  },
  "application/vnd.3gpp.pic-bw-small": {
    source: "iana",
    extensions: [
      "psb"
    ]
  },
  "application/vnd.3gpp.pic-bw-var": {
    source: "iana",
    extensions: [
      "pvb"
    ]
  },
  "application/vnd.3gpp.s1ap": {
    source: "iana"
  },
  "application/vnd.3gpp.sms": {
    source: "iana"
  },
  "application/vnd.3gpp.sms+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.srvcc-ext+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.srvcc-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.state-and-event-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.ussd+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp2.bcmcsinfo+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp2.sms": {
    source: "iana"
  },
  "application/vnd.3gpp2.tcap": {
    source: "iana",
    extensions: [
      "tcap"
    ]
  },
  "application/vnd.3lightssoftware.imagescal": {
    source: "iana"
  },
  "application/vnd.3m.post-it-notes": {
    source: "iana",
    extensions: [
      "pwn"
    ]
  },
  "application/vnd.accpac.simply.aso": {
    source: "iana",
    extensions: [
      "aso"
    ]
  },
  "application/vnd.accpac.simply.imp": {
    source: "iana",
    extensions: [
      "imp"
    ]
  },
  "application/vnd.acucobol": {
    source: "iana",
    extensions: [
      "acu"
    ]
  },
  "application/vnd.acucorp": {
    source: "iana",
    extensions: [
      "atc",
      "acutc"
    ]
  },
  "application/vnd.adobe.air-application-installer-package+zip": {
    source: "apache",
    compressible: !1,
    extensions: [
      "air"
    ]
  },
  "application/vnd.adobe.flash.movie": {
    source: "iana"
  },
  "application/vnd.adobe.formscentral.fcdt": {
    source: "iana",
    extensions: [
      "fcdt"
    ]
  },
  "application/vnd.adobe.fxp": {
    source: "iana",
    extensions: [
      "fxp",
      "fxpl"
    ]
  },
  "application/vnd.adobe.partial-upload": {
    source: "iana"
  },
  "application/vnd.adobe.xdp+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xdp"
    ]
  },
  "application/vnd.adobe.xfdf": {
    source: "iana",
    extensions: [
      "xfdf"
    ]
  },
  "application/vnd.aether.imp": {
    source: "iana"
  },
  "application/vnd.afpc.afplinedata": {
    source: "iana"
  },
  "application/vnd.afpc.afplinedata-pagedef": {
    source: "iana"
  },
  "application/vnd.afpc.cmoca-cmresource": {
    source: "iana"
  },
  "application/vnd.afpc.foca-charset": {
    source: "iana"
  },
  "application/vnd.afpc.foca-codedfont": {
    source: "iana"
  },
  "application/vnd.afpc.foca-codepage": {
    source: "iana"
  },
  "application/vnd.afpc.modca": {
    source: "iana"
  },
  "application/vnd.afpc.modca-cmtable": {
    source: "iana"
  },
  "application/vnd.afpc.modca-formdef": {
    source: "iana"
  },
  "application/vnd.afpc.modca-mediummap": {
    source: "iana"
  },
  "application/vnd.afpc.modca-objectcontainer": {
    source: "iana"
  },
  "application/vnd.afpc.modca-overlay": {
    source: "iana"
  },
  "application/vnd.afpc.modca-pagesegment": {
    source: "iana"
  },
  "application/vnd.age": {
    source: "iana",
    extensions: [
      "age"
    ]
  },
  "application/vnd.ah-barcode": {
    source: "iana"
  },
  "application/vnd.ahead.space": {
    source: "iana",
    extensions: [
      "ahead"
    ]
  },
  "application/vnd.airzip.filesecure.azf": {
    source: "iana",
    extensions: [
      "azf"
    ]
  },
  "application/vnd.airzip.filesecure.azs": {
    source: "iana",
    extensions: [
      "azs"
    ]
  },
  "application/vnd.amadeus+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.amazon.ebook": {
    source: "apache",
    extensions: [
      "azw"
    ]
  },
  "application/vnd.amazon.mobi8-ebook": {
    source: "iana"
  },
  "application/vnd.americandynamics.acc": {
    source: "iana",
    extensions: [
      "acc"
    ]
  },
  "application/vnd.amiga.ami": {
    source: "iana",
    extensions: [
      "ami"
    ]
  },
  "application/vnd.amundsen.maze+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.android.ota": {
    source: "iana"
  },
  "application/vnd.android.package-archive": {
    source: "apache",
    compressible: !1,
    extensions: [
      "apk"
    ]
  },
  "application/vnd.anki": {
    source: "iana"
  },
  "application/vnd.anser-web-certificate-issue-initiation": {
    source: "iana",
    extensions: [
      "cii"
    ]
  },
  "application/vnd.anser-web-funds-transfer-initiation": {
    source: "apache",
    extensions: [
      "fti"
    ]
  },
  "application/vnd.antix.game-component": {
    source: "iana",
    extensions: [
      "atx"
    ]
  },
  "application/vnd.apache.arrow.file": {
    source: "iana"
  },
  "application/vnd.apache.arrow.stream": {
    source: "iana"
  },
  "application/vnd.apache.thrift.binary": {
    source: "iana"
  },
  "application/vnd.apache.thrift.compact": {
    source: "iana"
  },
  "application/vnd.apache.thrift.json": {
    source: "iana"
  },
  "application/vnd.api+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.aplextor.warrp+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.apothekende.reservation+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.apple.installer+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mpkg"
    ]
  },
  "application/vnd.apple.keynote": {
    source: "iana",
    extensions: [
      "key"
    ]
  },
  "application/vnd.apple.mpegurl": {
    source: "iana",
    extensions: [
      "m3u8"
    ]
  },
  "application/vnd.apple.numbers": {
    source: "iana",
    extensions: [
      "numbers"
    ]
  },
  "application/vnd.apple.pages": {
    source: "iana",
    extensions: [
      "pages"
    ]
  },
  "application/vnd.apple.pkpass": {
    compressible: !1,
    extensions: [
      "pkpass"
    ]
  },
  "application/vnd.arastra.swi": {
    source: "iana"
  },
  "application/vnd.aristanetworks.swi": {
    source: "iana",
    extensions: [
      "swi"
    ]
  },
  "application/vnd.artisan+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.artsquare": {
    source: "iana"
  },
  "application/vnd.astraea-software.iota": {
    source: "iana",
    extensions: [
      "iota"
    ]
  },
  "application/vnd.audiograph": {
    source: "iana",
    extensions: [
      "aep"
    ]
  },
  "application/vnd.autopackage": {
    source: "iana"
  },
  "application/vnd.avalon+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.avistar+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.balsamiq.bmml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "bmml"
    ]
  },
  "application/vnd.balsamiq.bmpr": {
    source: "iana"
  },
  "application/vnd.banana-accounting": {
    source: "iana"
  },
  "application/vnd.bbf.usp.error": {
    source: "iana"
  },
  "application/vnd.bbf.usp.msg": {
    source: "iana"
  },
  "application/vnd.bbf.usp.msg+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.bekitzur-stech+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.bint.med-content": {
    source: "iana"
  },
  "application/vnd.biopax.rdf+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.blink-idb-value-wrapper": {
    source: "iana"
  },
  "application/vnd.blueice.multipass": {
    source: "iana",
    extensions: [
      "mpm"
    ]
  },
  "application/vnd.bluetooth.ep.oob": {
    source: "iana"
  },
  "application/vnd.bluetooth.le.oob": {
    source: "iana"
  },
  "application/vnd.bmi": {
    source: "iana",
    extensions: [
      "bmi"
    ]
  },
  "application/vnd.bpf": {
    source: "iana"
  },
  "application/vnd.bpf3": {
    source: "iana"
  },
  "application/vnd.businessobjects": {
    source: "iana",
    extensions: [
      "rep"
    ]
  },
  "application/vnd.byu.uapi+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.cab-jscript": {
    source: "iana"
  },
  "application/vnd.canon-cpdl": {
    source: "iana"
  },
  "application/vnd.canon-lips": {
    source: "iana"
  },
  "application/vnd.capasystems-pg+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.cendio.thinlinc.clientconf": {
    source: "iana"
  },
  "application/vnd.century-systems.tcp_stream": {
    source: "iana"
  },
  "application/vnd.chemdraw+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "cdxml"
    ]
  },
  "application/vnd.chess-pgn": {
    source: "iana"
  },
  "application/vnd.chipnuts.karaoke-mmd": {
    source: "iana",
    extensions: [
      "mmd"
    ]
  },
  "application/vnd.ciedi": {
    source: "iana"
  },
  "application/vnd.cinderella": {
    source: "iana",
    extensions: [
      "cdy"
    ]
  },
  "application/vnd.cirpack.isdn-ext": {
    source: "iana"
  },
  "application/vnd.citationstyles.style+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "csl"
    ]
  },
  "application/vnd.claymore": {
    source: "iana",
    extensions: [
      "cla"
    ]
  },
  "application/vnd.cloanto.rp9": {
    source: "iana",
    extensions: [
      "rp9"
    ]
  },
  "application/vnd.clonk.c4group": {
    source: "iana",
    extensions: [
      "c4g",
      "c4d",
      "c4f",
      "c4p",
      "c4u"
    ]
  },
  "application/vnd.cluetrust.cartomobile-config": {
    source: "iana",
    extensions: [
      "c11amc"
    ]
  },
  "application/vnd.cluetrust.cartomobile-config-pkg": {
    source: "iana",
    extensions: [
      "c11amz"
    ]
  },
  "application/vnd.coffeescript": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.document": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.document-template": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.presentation": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.presentation-template": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.spreadsheet": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.spreadsheet-template": {
    source: "iana"
  },
  "application/vnd.collection+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.collection.doc+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.collection.next+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.comicbook+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.comicbook-rar": {
    source: "iana"
  },
  "application/vnd.commerce-battelle": {
    source: "iana"
  },
  "application/vnd.commonspace": {
    source: "iana",
    extensions: [
      "csp"
    ]
  },
  "application/vnd.contact.cmsg": {
    source: "iana",
    extensions: [
      "cdbcmsg"
    ]
  },
  "application/vnd.coreos.ignition+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.cosmocaller": {
    source: "iana",
    extensions: [
      "cmc"
    ]
  },
  "application/vnd.crick.clicker": {
    source: "iana",
    extensions: [
      "clkx"
    ]
  },
  "application/vnd.crick.clicker.keyboard": {
    source: "iana",
    extensions: [
      "clkk"
    ]
  },
  "application/vnd.crick.clicker.palette": {
    source: "iana",
    extensions: [
      "clkp"
    ]
  },
  "application/vnd.crick.clicker.template": {
    source: "iana",
    extensions: [
      "clkt"
    ]
  },
  "application/vnd.crick.clicker.wordbank": {
    source: "iana",
    extensions: [
      "clkw"
    ]
  },
  "application/vnd.criticaltools.wbs+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "wbs"
    ]
  },
  "application/vnd.cryptii.pipe+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.crypto-shade-file": {
    source: "iana"
  },
  "application/vnd.cryptomator.encrypted": {
    source: "iana"
  },
  "application/vnd.cryptomator.vault": {
    source: "iana"
  },
  "application/vnd.ctc-posml": {
    source: "iana",
    extensions: [
      "pml"
    ]
  },
  "application/vnd.ctct.ws+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.cups-pdf": {
    source: "iana"
  },
  "application/vnd.cups-postscript": {
    source: "iana"
  },
  "application/vnd.cups-ppd": {
    source: "iana",
    extensions: [
      "ppd"
    ]
  },
  "application/vnd.cups-raster": {
    source: "iana"
  },
  "application/vnd.cups-raw": {
    source: "iana"
  },
  "application/vnd.curl": {
    source: "iana"
  },
  "application/vnd.curl.car": {
    source: "apache",
    extensions: [
      "car"
    ]
  },
  "application/vnd.curl.pcurl": {
    source: "apache",
    extensions: [
      "pcurl"
    ]
  },
  "application/vnd.cyan.dean.root+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.cybank": {
    source: "iana"
  },
  "application/vnd.cyclonedx+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.cyclonedx+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.d2l.coursepackage1p0+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.d3m-dataset": {
    source: "iana"
  },
  "application/vnd.d3m-problem": {
    source: "iana"
  },
  "application/vnd.dart": {
    source: "iana",
    compressible: !0,
    extensions: [
      "dart"
    ]
  },
  "application/vnd.data-vision.rdz": {
    source: "iana",
    extensions: [
      "rdz"
    ]
  },
  "application/vnd.datapackage+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dataresource+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dbf": {
    source: "iana",
    extensions: [
      "dbf"
    ]
  },
  "application/vnd.debian.binary-package": {
    source: "iana"
  },
  "application/vnd.dece.data": {
    source: "iana",
    extensions: [
      "uvf",
      "uvvf",
      "uvd",
      "uvvd"
    ]
  },
  "application/vnd.dece.ttml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "uvt",
      "uvvt"
    ]
  },
  "application/vnd.dece.unspecified": {
    source: "iana",
    extensions: [
      "uvx",
      "uvvx"
    ]
  },
  "application/vnd.dece.zip": {
    source: "iana",
    extensions: [
      "uvz",
      "uvvz"
    ]
  },
  "application/vnd.denovo.fcselayout-link": {
    source: "iana",
    extensions: [
      "fe_launch"
    ]
  },
  "application/vnd.desmume.movie": {
    source: "iana"
  },
  "application/vnd.dir-bi.plate-dl-nosuffix": {
    source: "iana"
  },
  "application/vnd.dm.delegation+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dna": {
    source: "iana",
    extensions: [
      "dna"
    ]
  },
  "application/vnd.document+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dolby.mlp": {
    source: "apache",
    extensions: [
      "mlp"
    ]
  },
  "application/vnd.dolby.mobile.1": {
    source: "iana"
  },
  "application/vnd.dolby.mobile.2": {
    source: "iana"
  },
  "application/vnd.doremir.scorecloud-binary-document": {
    source: "iana"
  },
  "application/vnd.dpgraph": {
    source: "iana",
    extensions: [
      "dpg"
    ]
  },
  "application/vnd.dreamfactory": {
    source: "iana",
    extensions: [
      "dfac"
    ]
  },
  "application/vnd.drive+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ds-keypoint": {
    source: "apache",
    extensions: [
      "kpxx"
    ]
  },
  "application/vnd.dtg.local": {
    source: "iana"
  },
  "application/vnd.dtg.local.flash": {
    source: "iana"
  },
  "application/vnd.dtg.local.html": {
    source: "iana"
  },
  "application/vnd.dvb.ait": {
    source: "iana",
    extensions: [
      "ait"
    ]
  },
  "application/vnd.dvb.dvbisl+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dvb.dvbj": {
    source: "iana"
  },
  "application/vnd.dvb.esgcontainer": {
    source: "iana"
  },
  "application/vnd.dvb.ipdcdftnotifaccess": {
    source: "iana"
  },
  "application/vnd.dvb.ipdcesgaccess": {
    source: "iana"
  },
  "application/vnd.dvb.ipdcesgaccess2": {
    source: "iana"
  },
  "application/vnd.dvb.ipdcesgpdd": {
    source: "iana"
  },
  "application/vnd.dvb.ipdcroaming": {
    source: "iana"
  },
  "application/vnd.dvb.iptv.alfec-base": {
    source: "iana"
  },
  "application/vnd.dvb.iptv.alfec-enhancement": {
    source: "iana"
  },
  "application/vnd.dvb.notif-aggregate-root+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dvb.notif-container+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dvb.notif-generic+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dvb.notif-ia-msglist+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dvb.notif-ia-registration-request+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dvb.notif-ia-registration-response+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dvb.notif-init+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dvb.pfr": {
    source: "iana"
  },
  "application/vnd.dvb.service": {
    source: "iana",
    extensions: [
      "svc"
    ]
  },
  "application/vnd.dxr": {
    source: "iana"
  },
  "application/vnd.dynageo": {
    source: "iana",
    extensions: [
      "geo"
    ]
  },
  "application/vnd.dzr": {
    source: "iana"
  },
  "application/vnd.easykaraoke.cdgdownload": {
    source: "iana"
  },
  "application/vnd.ecdis-update": {
    source: "iana"
  },
  "application/vnd.ecip.rlp": {
    source: "iana"
  },
  "application/vnd.eclipse.ditto+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ecowin.chart": {
    source: "iana",
    extensions: [
      "mag"
    ]
  },
  "application/vnd.ecowin.filerequest": {
    source: "iana"
  },
  "application/vnd.ecowin.fileupdate": {
    source: "iana"
  },
  "application/vnd.ecowin.series": {
    source: "iana"
  },
  "application/vnd.ecowin.seriesrequest": {
    source: "iana"
  },
  "application/vnd.ecowin.seriesupdate": {
    source: "iana"
  },
  "application/vnd.efi.img": {
    source: "iana"
  },
  "application/vnd.efi.iso": {
    source: "iana"
  },
  "application/vnd.emclient.accessrequest+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.enliven": {
    source: "iana",
    extensions: [
      "nml"
    ]
  },
  "application/vnd.enphase.envoy": {
    source: "iana"
  },
  "application/vnd.eprints.data+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.epson.esf": {
    source: "iana",
    extensions: [
      "esf"
    ]
  },
  "application/vnd.epson.msf": {
    source: "iana",
    extensions: [
      "msf"
    ]
  },
  "application/vnd.epson.quickanime": {
    source: "iana",
    extensions: [
      "qam"
    ]
  },
  "application/vnd.epson.salt": {
    source: "iana",
    extensions: [
      "slt"
    ]
  },
  "application/vnd.epson.ssf": {
    source: "iana",
    extensions: [
      "ssf"
    ]
  },
  "application/vnd.ericsson.quickcall": {
    source: "iana"
  },
  "application/vnd.espass-espass+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.eszigno3+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "es3",
      "et3"
    ]
  },
  "application/vnd.etsi.aoc+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.asic-e+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.etsi.asic-s+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.etsi.cug+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvcommand+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvdiscovery+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvprofile+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvsad-bc+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvsad-cod+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvsad-npvr+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvservice+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvsync+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvueprofile+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.mcid+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.mheg5": {
    source: "iana"
  },
  "application/vnd.etsi.overload-control-policy-dataset+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.pstn+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.sci+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.simservs+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.timestamp-token": {
    source: "iana"
  },
  "application/vnd.etsi.tsl+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.tsl.der": {
    source: "iana"
  },
  "application/vnd.eu.kasparian.car+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.eudora.data": {
    source: "iana"
  },
  "application/vnd.evolv.ecig.profile": {
    source: "iana"
  },
  "application/vnd.evolv.ecig.settings": {
    source: "iana"
  },
  "application/vnd.evolv.ecig.theme": {
    source: "iana"
  },
  "application/vnd.exstream-empower+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.exstream-package": {
    source: "iana"
  },
  "application/vnd.ezpix-album": {
    source: "iana",
    extensions: [
      "ez2"
    ]
  },
  "application/vnd.ezpix-package": {
    source: "iana",
    extensions: [
      "ez3"
    ]
  },
  "application/vnd.f-secure.mobile": {
    source: "iana"
  },
  "application/vnd.familysearch.gedcom+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.fastcopy-disk-image": {
    source: "iana"
  },
  "application/vnd.fdf": {
    source: "iana",
    extensions: [
      "fdf"
    ]
  },
  "application/vnd.fdsn.mseed": {
    source: "iana",
    extensions: [
      "mseed"
    ]
  },
  "application/vnd.fdsn.seed": {
    source: "iana",
    extensions: [
      "seed",
      "dataless"
    ]
  },
  "application/vnd.ffsns": {
    source: "iana"
  },
  "application/vnd.ficlab.flb+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.filmit.zfc": {
    source: "iana"
  },
  "application/vnd.fints": {
    source: "iana"
  },
  "application/vnd.firemonkeys.cloudcell": {
    source: "iana"
  },
  "application/vnd.flographit": {
    source: "iana",
    extensions: [
      "gph"
    ]
  },
  "application/vnd.fluxtime.clip": {
    source: "iana",
    extensions: [
      "ftc"
    ]
  },
  "application/vnd.font-fontforge-sfd": {
    source: "iana"
  },
  "application/vnd.framemaker": {
    source: "iana",
    extensions: [
      "fm",
      "frame",
      "maker",
      "book"
    ]
  },
  "application/vnd.frogans.fnc": {
    source: "iana",
    extensions: [
      "fnc"
    ]
  },
  "application/vnd.frogans.ltf": {
    source: "iana",
    extensions: [
      "ltf"
    ]
  },
  "application/vnd.fsc.weblaunch": {
    source: "iana",
    extensions: [
      "fsc"
    ]
  },
  "application/vnd.fujifilm.fb.docuworks": {
    source: "iana"
  },
  "application/vnd.fujifilm.fb.docuworks.binder": {
    source: "iana"
  },
  "application/vnd.fujifilm.fb.docuworks.container": {
    source: "iana"
  },
  "application/vnd.fujifilm.fb.jfi+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.fujitsu.oasys": {
    source: "iana",
    extensions: [
      "oas"
    ]
  },
  "application/vnd.fujitsu.oasys2": {
    source: "iana",
    extensions: [
      "oa2"
    ]
  },
  "application/vnd.fujitsu.oasys3": {
    source: "iana",
    extensions: [
      "oa3"
    ]
  },
  "application/vnd.fujitsu.oasysgp": {
    source: "iana",
    extensions: [
      "fg5"
    ]
  },
  "application/vnd.fujitsu.oasysprs": {
    source: "iana",
    extensions: [
      "bh2"
    ]
  },
  "application/vnd.fujixerox.art-ex": {
    source: "iana"
  },
  "application/vnd.fujixerox.art4": {
    source: "iana"
  },
  "application/vnd.fujixerox.ddd": {
    source: "iana",
    extensions: [
      "ddd"
    ]
  },
  "application/vnd.fujixerox.docuworks": {
    source: "iana",
    extensions: [
      "xdw"
    ]
  },
  "application/vnd.fujixerox.docuworks.binder": {
    source: "iana",
    extensions: [
      "xbd"
    ]
  },
  "application/vnd.fujixerox.docuworks.container": {
    source: "iana"
  },
  "application/vnd.fujixerox.hbpl": {
    source: "iana"
  },
  "application/vnd.fut-misnet": {
    source: "iana"
  },
  "application/vnd.futoin+cbor": {
    source: "iana"
  },
  "application/vnd.futoin+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.fuzzysheet": {
    source: "iana",
    extensions: [
      "fzs"
    ]
  },
  "application/vnd.genomatix.tuxedo": {
    source: "iana",
    extensions: [
      "txd"
    ]
  },
  "application/vnd.gentics.grd+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.geo+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.geocube+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.geogebra.file": {
    source: "iana",
    extensions: [
      "ggb"
    ]
  },
  "application/vnd.geogebra.slides": {
    source: "iana"
  },
  "application/vnd.geogebra.tool": {
    source: "iana",
    extensions: [
      "ggt"
    ]
  },
  "application/vnd.geometry-explorer": {
    source: "iana",
    extensions: [
      "gex",
      "gre"
    ]
  },
  "application/vnd.geonext": {
    source: "iana",
    extensions: [
      "gxt"
    ]
  },
  "application/vnd.geoplan": {
    source: "iana",
    extensions: [
      "g2w"
    ]
  },
  "application/vnd.geospace": {
    source: "iana",
    extensions: [
      "g3w"
    ]
  },
  "application/vnd.gerber": {
    source: "iana"
  },
  "application/vnd.globalplatform.card-content-mgt": {
    source: "iana"
  },
  "application/vnd.globalplatform.card-content-mgt-response": {
    source: "iana"
  },
  "application/vnd.gmx": {
    source: "iana",
    extensions: [
      "gmx"
    ]
  },
  "application/vnd.google-apps.document": {
    compressible: !1,
    extensions: [
      "gdoc"
    ]
  },
  "application/vnd.google-apps.presentation": {
    compressible: !1,
    extensions: [
      "gslides"
    ]
  },
  "application/vnd.google-apps.spreadsheet": {
    compressible: !1,
    extensions: [
      "gsheet"
    ]
  },
  "application/vnd.google-earth.kml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "kml"
    ]
  },
  "application/vnd.google-earth.kmz": {
    source: "iana",
    compressible: !1,
    extensions: [
      "kmz"
    ]
  },
  "application/vnd.gov.sk.e-form+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.gov.sk.e-form+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.gov.sk.xmldatacontainer+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.grafeq": {
    source: "iana",
    extensions: [
      "gqf",
      "gqs"
    ]
  },
  "application/vnd.gridmp": {
    source: "iana"
  },
  "application/vnd.groove-account": {
    source: "iana",
    extensions: [
      "gac"
    ]
  },
  "application/vnd.groove-help": {
    source: "iana",
    extensions: [
      "ghf"
    ]
  },
  "application/vnd.groove-identity-message": {
    source: "iana",
    extensions: [
      "gim"
    ]
  },
  "application/vnd.groove-injector": {
    source: "iana",
    extensions: [
      "grv"
    ]
  },
  "application/vnd.groove-tool-message": {
    source: "iana",
    extensions: [
      "gtm"
    ]
  },
  "application/vnd.groove-tool-template": {
    source: "iana",
    extensions: [
      "tpl"
    ]
  },
  "application/vnd.groove-vcard": {
    source: "iana",
    extensions: [
      "vcg"
    ]
  },
  "application/vnd.hal+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.hal+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "hal"
    ]
  },
  "application/vnd.handheld-entertainment+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "zmm"
    ]
  },
  "application/vnd.hbci": {
    source: "iana",
    extensions: [
      "hbci"
    ]
  },
  "application/vnd.hc+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.hcl-bireports": {
    source: "iana"
  },
  "application/vnd.hdt": {
    source: "iana"
  },
  "application/vnd.heroku+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.hhe.lesson-player": {
    source: "iana",
    extensions: [
      "les"
    ]
  },
  "application/vnd.hl7cda+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/vnd.hl7v2+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/vnd.hp-hpgl": {
    source: "iana",
    extensions: [
      "hpgl"
    ]
  },
  "application/vnd.hp-hpid": {
    source: "iana",
    extensions: [
      "hpid"
    ]
  },
  "application/vnd.hp-hps": {
    source: "iana",
    extensions: [
      "hps"
    ]
  },
  "application/vnd.hp-jlyt": {
    source: "iana",
    extensions: [
      "jlt"
    ]
  },
  "application/vnd.hp-pcl": {
    source: "iana",
    extensions: [
      "pcl"
    ]
  },
  "application/vnd.hp-pclxl": {
    source: "iana",
    extensions: [
      "pclxl"
    ]
  },
  "application/vnd.httphone": {
    source: "iana"
  },
  "application/vnd.hydrostatix.sof-data": {
    source: "iana",
    extensions: [
      "sfd-hdstx"
    ]
  },
  "application/vnd.hyper+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.hyper-item+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.hyperdrive+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.hzn-3d-crossword": {
    source: "iana"
  },
  "application/vnd.ibm.afplinedata": {
    source: "iana"
  },
  "application/vnd.ibm.electronic-media": {
    source: "iana"
  },
  "application/vnd.ibm.minipay": {
    source: "iana",
    extensions: [
      "mpy"
    ]
  },
  "application/vnd.ibm.modcap": {
    source: "iana",
    extensions: [
      "afp",
      "listafp",
      "list3820"
    ]
  },
  "application/vnd.ibm.rights-management": {
    source: "iana",
    extensions: [
      "irm"
    ]
  },
  "application/vnd.ibm.secure-container": {
    source: "iana",
    extensions: [
      "sc"
    ]
  },
  "application/vnd.iccprofile": {
    source: "iana",
    extensions: [
      "icc",
      "icm"
    ]
  },
  "application/vnd.ieee.1905": {
    source: "iana"
  },
  "application/vnd.igloader": {
    source: "iana",
    extensions: [
      "igl"
    ]
  },
  "application/vnd.imagemeter.folder+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.imagemeter.image+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.immervision-ivp": {
    source: "iana",
    extensions: [
      "ivp"
    ]
  },
  "application/vnd.immervision-ivu": {
    source: "iana",
    extensions: [
      "ivu"
    ]
  },
  "application/vnd.ims.imsccv1p1": {
    source: "iana"
  },
  "application/vnd.ims.imsccv1p2": {
    source: "iana"
  },
  "application/vnd.ims.imsccv1p3": {
    source: "iana"
  },
  "application/vnd.ims.lis.v2.result+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ims.lti.v2.toolconsumerprofile+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ims.lti.v2.toolproxy+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ims.lti.v2.toolproxy.id+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ims.lti.v2.toolsettings+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ims.lti.v2.toolsettings.simple+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.informedcontrol.rms+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.informix-visionary": {
    source: "iana"
  },
  "application/vnd.infotech.project": {
    source: "iana"
  },
  "application/vnd.infotech.project+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.innopath.wamp.notification": {
    source: "iana"
  },
  "application/vnd.insors.igm": {
    source: "iana",
    extensions: [
      "igm"
    ]
  },
  "application/vnd.intercon.formnet": {
    source: "iana",
    extensions: [
      "xpw",
      "xpx"
    ]
  },
  "application/vnd.intergeo": {
    source: "iana",
    extensions: [
      "i2g"
    ]
  },
  "application/vnd.intertrust.digibox": {
    source: "iana"
  },
  "application/vnd.intertrust.nncp": {
    source: "iana"
  },
  "application/vnd.intu.qbo": {
    source: "iana",
    extensions: [
      "qbo"
    ]
  },
  "application/vnd.intu.qfx": {
    source: "iana",
    extensions: [
      "qfx"
    ]
  },
  "application/vnd.iptc.g2.catalogitem+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.iptc.g2.conceptitem+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.iptc.g2.knowledgeitem+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.iptc.g2.newsitem+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.iptc.g2.newsmessage+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.iptc.g2.packageitem+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.iptc.g2.planningitem+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ipunplugged.rcprofile": {
    source: "iana",
    extensions: [
      "rcprofile"
    ]
  },
  "application/vnd.irepository.package+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "irp"
    ]
  },
  "application/vnd.is-xpr": {
    source: "iana",
    extensions: [
      "xpr"
    ]
  },
  "application/vnd.isac.fcs": {
    source: "iana",
    extensions: [
      "fcs"
    ]
  },
  "application/vnd.iso11783-10+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.jam": {
    source: "iana",
    extensions: [
      "jam"
    ]
  },
  "application/vnd.japannet-directory-service": {
    source: "iana"
  },
  "application/vnd.japannet-jpnstore-wakeup": {
    source: "iana"
  },
  "application/vnd.japannet-payment-wakeup": {
    source: "iana"
  },
  "application/vnd.japannet-registration": {
    source: "iana"
  },
  "application/vnd.japannet-registration-wakeup": {
    source: "iana"
  },
  "application/vnd.japannet-setstore-wakeup": {
    source: "iana"
  },
  "application/vnd.japannet-verification": {
    source: "iana"
  },
  "application/vnd.japannet-verification-wakeup": {
    source: "iana"
  },
  "application/vnd.jcp.javame.midlet-rms": {
    source: "iana",
    extensions: [
      "rms"
    ]
  },
  "application/vnd.jisp": {
    source: "iana",
    extensions: [
      "jisp"
    ]
  },
  "application/vnd.joost.joda-archive": {
    source: "iana",
    extensions: [
      "joda"
    ]
  },
  "application/vnd.jsk.isdn-ngn": {
    source: "iana"
  },
  "application/vnd.kahootz": {
    source: "iana",
    extensions: [
      "ktz",
      "ktr"
    ]
  },
  "application/vnd.kde.karbon": {
    source: "iana",
    extensions: [
      "karbon"
    ]
  },
  "application/vnd.kde.kchart": {
    source: "iana",
    extensions: [
      "chrt"
    ]
  },
  "application/vnd.kde.kformula": {
    source: "iana",
    extensions: [
      "kfo"
    ]
  },
  "application/vnd.kde.kivio": {
    source: "iana",
    extensions: [
      "flw"
    ]
  },
  "application/vnd.kde.kontour": {
    source: "iana",
    extensions: [
      "kon"
    ]
  },
  "application/vnd.kde.kpresenter": {
    source: "iana",
    extensions: [
      "kpr",
      "kpt"
    ]
  },
  "application/vnd.kde.kspread": {
    source: "iana",
    extensions: [
      "ksp"
    ]
  },
  "application/vnd.kde.kword": {
    source: "iana",
    extensions: [
      "kwd",
      "kwt"
    ]
  },
  "application/vnd.kenameaapp": {
    source: "iana",
    extensions: [
      "htke"
    ]
  },
  "application/vnd.kidspiration": {
    source: "iana",
    extensions: [
      "kia"
    ]
  },
  "application/vnd.kinar": {
    source: "iana",
    extensions: [
      "kne",
      "knp"
    ]
  },
  "application/vnd.koan": {
    source: "iana",
    extensions: [
      "skp",
      "skd",
      "skt",
      "skm"
    ]
  },
  "application/vnd.kodak-descriptor": {
    source: "iana",
    extensions: [
      "sse"
    ]
  },
  "application/vnd.las": {
    source: "iana"
  },
  "application/vnd.las.las+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.las.las+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "lasxml"
    ]
  },
  "application/vnd.laszip": {
    source: "iana"
  },
  "application/vnd.leap+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.liberty-request+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.llamagraphics.life-balance.desktop": {
    source: "iana",
    extensions: [
      "lbd"
    ]
  },
  "application/vnd.llamagraphics.life-balance.exchange+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "lbe"
    ]
  },
  "application/vnd.logipipe.circuit+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.loom": {
    source: "iana"
  },
  "application/vnd.lotus-1-2-3": {
    source: "iana",
    extensions: [
      "123"
    ]
  },
  "application/vnd.lotus-approach": {
    source: "iana",
    extensions: [
      "apr"
    ]
  },
  "application/vnd.lotus-freelance": {
    source: "iana",
    extensions: [
      "pre"
    ]
  },
  "application/vnd.lotus-notes": {
    source: "iana",
    extensions: [
      "nsf"
    ]
  },
  "application/vnd.lotus-organizer": {
    source: "iana",
    extensions: [
      "org"
    ]
  },
  "application/vnd.lotus-screencam": {
    source: "iana",
    extensions: [
      "scm"
    ]
  },
  "application/vnd.lotus-wordpro": {
    source: "iana",
    extensions: [
      "lwp"
    ]
  },
  "application/vnd.macports.portpkg": {
    source: "iana",
    extensions: [
      "portpkg"
    ]
  },
  "application/vnd.mapbox-vector-tile": {
    source: "iana",
    extensions: [
      "mvt"
    ]
  },
  "application/vnd.marlin.drm.actiontoken+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.marlin.drm.conftoken+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.marlin.drm.license+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.marlin.drm.mdcf": {
    source: "iana"
  },
  "application/vnd.mason+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.maxar.archive.3tz+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.maxmind.maxmind-db": {
    source: "iana"
  },
  "application/vnd.mcd": {
    source: "iana",
    extensions: [
      "mcd"
    ]
  },
  "application/vnd.medcalcdata": {
    source: "iana",
    extensions: [
      "mc1"
    ]
  },
  "application/vnd.mediastation.cdkey": {
    source: "iana",
    extensions: [
      "cdkey"
    ]
  },
  "application/vnd.meridian-slingshot": {
    source: "iana"
  },
  "application/vnd.mfer": {
    source: "iana",
    extensions: [
      "mwf"
    ]
  },
  "application/vnd.mfmp": {
    source: "iana",
    extensions: [
      "mfm"
    ]
  },
  "application/vnd.micro+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.micrografx.flo": {
    source: "iana",
    extensions: [
      "flo"
    ]
  },
  "application/vnd.micrografx.igx": {
    source: "iana",
    extensions: [
      "igx"
    ]
  },
  "application/vnd.microsoft.portable-executable": {
    source: "iana"
  },
  "application/vnd.microsoft.windows.thumbnail-cache": {
    source: "iana"
  },
  "application/vnd.miele+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.mif": {
    source: "iana",
    extensions: [
      "mif"
    ]
  },
  "application/vnd.minisoft-hp3000-save": {
    source: "iana"
  },
  "application/vnd.mitsubishi.misty-guard.trustweb": {
    source: "iana"
  },
  "application/vnd.mobius.daf": {
    source: "iana",
    extensions: [
      "daf"
    ]
  },
  "application/vnd.mobius.dis": {
    source: "iana",
    extensions: [
      "dis"
    ]
  },
  "application/vnd.mobius.mbk": {
    source: "iana",
    extensions: [
      "mbk"
    ]
  },
  "application/vnd.mobius.mqy": {
    source: "iana",
    extensions: [
      "mqy"
    ]
  },
  "application/vnd.mobius.msl": {
    source: "iana",
    extensions: [
      "msl"
    ]
  },
  "application/vnd.mobius.plc": {
    source: "iana",
    extensions: [
      "plc"
    ]
  },
  "application/vnd.mobius.txf": {
    source: "iana",
    extensions: [
      "txf"
    ]
  },
  "application/vnd.mophun.application": {
    source: "iana",
    extensions: [
      "mpn"
    ]
  },
  "application/vnd.mophun.certificate": {
    source: "iana",
    extensions: [
      "mpc"
    ]
  },
  "application/vnd.motorola.flexsuite": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.adsi": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.fis": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.gotap": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.kmr": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.ttc": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.wem": {
    source: "iana"
  },
  "application/vnd.motorola.iprm": {
    source: "iana"
  },
  "application/vnd.mozilla.xul+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xul"
    ]
  },
  "application/vnd.ms-3mfdocument": {
    source: "iana"
  },
  "application/vnd.ms-artgalry": {
    source: "iana",
    extensions: [
      "cil"
    ]
  },
  "application/vnd.ms-asf": {
    source: "iana"
  },
  "application/vnd.ms-cab-compressed": {
    source: "iana",
    extensions: [
      "cab"
    ]
  },
  "application/vnd.ms-color.iccprofile": {
    source: "apache"
  },
  "application/vnd.ms-excel": {
    source: "iana",
    compressible: !1,
    extensions: [
      "xls",
      "xlm",
      "xla",
      "xlc",
      "xlt",
      "xlw"
    ]
  },
  "application/vnd.ms-excel.addin.macroenabled.12": {
    source: "iana",
    extensions: [
      "xlam"
    ]
  },
  "application/vnd.ms-excel.sheet.binary.macroenabled.12": {
    source: "iana",
    extensions: [
      "xlsb"
    ]
  },
  "application/vnd.ms-excel.sheet.macroenabled.12": {
    source: "iana",
    extensions: [
      "xlsm"
    ]
  },
  "application/vnd.ms-excel.template.macroenabled.12": {
    source: "iana",
    extensions: [
      "xltm"
    ]
  },
  "application/vnd.ms-fontobject": {
    source: "iana",
    compressible: !0,
    extensions: [
      "eot"
    ]
  },
  "application/vnd.ms-htmlhelp": {
    source: "iana",
    extensions: [
      "chm"
    ]
  },
  "application/vnd.ms-ims": {
    source: "iana",
    extensions: [
      "ims"
    ]
  },
  "application/vnd.ms-lrm": {
    source: "iana",
    extensions: [
      "lrm"
    ]
  },
  "application/vnd.ms-office.activex+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ms-officetheme": {
    source: "iana",
    extensions: [
      "thmx"
    ]
  },
  "application/vnd.ms-opentype": {
    source: "apache",
    compressible: !0
  },
  "application/vnd.ms-outlook": {
    compressible: !1,
    extensions: [
      "msg"
    ]
  },
  "application/vnd.ms-package.obfuscated-opentype": {
    source: "apache"
  },
  "application/vnd.ms-pki.seccat": {
    source: "apache",
    extensions: [
      "cat"
    ]
  },
  "application/vnd.ms-pki.stl": {
    source: "apache",
    extensions: [
      "stl"
    ]
  },
  "application/vnd.ms-playready.initiator+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ms-powerpoint": {
    source: "iana",
    compressible: !1,
    extensions: [
      "ppt",
      "pps",
      "pot"
    ]
  },
  "application/vnd.ms-powerpoint.addin.macroenabled.12": {
    source: "iana",
    extensions: [
      "ppam"
    ]
  },
  "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
    source: "iana",
    extensions: [
      "pptm"
    ]
  },
  "application/vnd.ms-powerpoint.slide.macroenabled.12": {
    source: "iana",
    extensions: [
      "sldm"
    ]
  },
  "application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
    source: "iana",
    extensions: [
      "ppsm"
    ]
  },
  "application/vnd.ms-powerpoint.template.macroenabled.12": {
    source: "iana",
    extensions: [
      "potm"
    ]
  },
  "application/vnd.ms-printdevicecapabilities+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ms-printing.printticket+xml": {
    source: "apache",
    compressible: !0
  },
  "application/vnd.ms-printschematicket+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ms-project": {
    source: "iana",
    extensions: [
      "mpp",
      "mpt"
    ]
  },
  "application/vnd.ms-tnef": {
    source: "iana"
  },
  "application/vnd.ms-windows.devicepairing": {
    source: "iana"
  },
  "application/vnd.ms-windows.nwprinting.oob": {
    source: "iana"
  },
  "application/vnd.ms-windows.printerpairing": {
    source: "iana"
  },
  "application/vnd.ms-windows.wsd.oob": {
    source: "iana"
  },
  "application/vnd.ms-wmdrm.lic-chlg-req": {
    source: "iana"
  },
  "application/vnd.ms-wmdrm.lic-resp": {
    source: "iana"
  },
  "application/vnd.ms-wmdrm.meter-chlg-req": {
    source: "iana"
  },
  "application/vnd.ms-wmdrm.meter-resp": {
    source: "iana"
  },
  "application/vnd.ms-word.document.macroenabled.12": {
    source: "iana",
    extensions: [
      "docm"
    ]
  },
  "application/vnd.ms-word.template.macroenabled.12": {
    source: "iana",
    extensions: [
      "dotm"
    ]
  },
  "application/vnd.ms-works": {
    source: "iana",
    extensions: [
      "wps",
      "wks",
      "wcm",
      "wdb"
    ]
  },
  "application/vnd.ms-wpl": {
    source: "iana",
    extensions: [
      "wpl"
    ]
  },
  "application/vnd.ms-xpsdocument": {
    source: "iana",
    compressible: !1,
    extensions: [
      "xps"
    ]
  },
  "application/vnd.msa-disk-image": {
    source: "iana"
  },
  "application/vnd.mseq": {
    source: "iana",
    extensions: [
      "mseq"
    ]
  },
  "application/vnd.msign": {
    source: "iana"
  },
  "application/vnd.multiad.creator": {
    source: "iana"
  },
  "application/vnd.multiad.creator.cif": {
    source: "iana"
  },
  "application/vnd.music-niff": {
    source: "iana"
  },
  "application/vnd.musician": {
    source: "iana",
    extensions: [
      "mus"
    ]
  },
  "application/vnd.muvee.style": {
    source: "iana",
    extensions: [
      "msty"
    ]
  },
  "application/vnd.mynfc": {
    source: "iana",
    extensions: [
      "taglet"
    ]
  },
  "application/vnd.nacamar.ybrid+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ncd.control": {
    source: "iana"
  },
  "application/vnd.ncd.reference": {
    source: "iana"
  },
  "application/vnd.nearst.inv+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.nebumind.line": {
    source: "iana"
  },
  "application/vnd.nervana": {
    source: "iana"
  },
  "application/vnd.netfpx": {
    source: "iana"
  },
  "application/vnd.neurolanguage.nlu": {
    source: "iana",
    extensions: [
      "nlu"
    ]
  },
  "application/vnd.nimn": {
    source: "iana"
  },
  "application/vnd.nintendo.nitro.rom": {
    source: "iana"
  },
  "application/vnd.nintendo.snes.rom": {
    source: "iana"
  },
  "application/vnd.nitf": {
    source: "iana",
    extensions: [
      "ntf",
      "nitf"
    ]
  },
  "application/vnd.noblenet-directory": {
    source: "iana",
    extensions: [
      "nnd"
    ]
  },
  "application/vnd.noblenet-sealer": {
    source: "iana",
    extensions: [
      "nns"
    ]
  },
  "application/vnd.noblenet-web": {
    source: "iana",
    extensions: [
      "nnw"
    ]
  },
  "application/vnd.nokia.catalogs": {
    source: "iana"
  },
  "application/vnd.nokia.conml+wbxml": {
    source: "iana"
  },
  "application/vnd.nokia.conml+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.nokia.iptv.config+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.nokia.isds-radio-presets": {
    source: "iana"
  },
  "application/vnd.nokia.landmark+wbxml": {
    source: "iana"
  },
  "application/vnd.nokia.landmark+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.nokia.landmarkcollection+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.nokia.n-gage.ac+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "ac"
    ]
  },
  "application/vnd.nokia.n-gage.data": {
    source: "iana",
    extensions: [
      "ngdat"
    ]
  },
  "application/vnd.nokia.n-gage.symbian.install": {
    source: "iana",
    extensions: [
      "n-gage"
    ]
  },
  "application/vnd.nokia.ncd": {
    source: "iana"
  },
  "application/vnd.nokia.pcd+wbxml": {
    source: "iana"
  },
  "application/vnd.nokia.pcd+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.nokia.radio-preset": {
    source: "iana",
    extensions: [
      "rpst"
    ]
  },
  "application/vnd.nokia.radio-presets": {
    source: "iana",
    extensions: [
      "rpss"
    ]
  },
  "application/vnd.novadigm.edm": {
    source: "iana",
    extensions: [
      "edm"
    ]
  },
  "application/vnd.novadigm.edx": {
    source: "iana",
    extensions: [
      "edx"
    ]
  },
  "application/vnd.novadigm.ext": {
    source: "iana",
    extensions: [
      "ext"
    ]
  },
  "application/vnd.ntt-local.content-share": {
    source: "iana"
  },
  "application/vnd.ntt-local.file-transfer": {
    source: "iana"
  },
  "application/vnd.ntt-local.ogw_remote-access": {
    source: "iana"
  },
  "application/vnd.ntt-local.sip-ta_remote": {
    source: "iana"
  },
  "application/vnd.ntt-local.sip-ta_tcp_stream": {
    source: "iana"
  },
  "application/vnd.oasis.opendocument.chart": {
    source: "iana",
    extensions: [
      "odc"
    ]
  },
  "application/vnd.oasis.opendocument.chart-template": {
    source: "iana",
    extensions: [
      "otc"
    ]
  },
  "application/vnd.oasis.opendocument.database": {
    source: "iana",
    extensions: [
      "odb"
    ]
  },
  "application/vnd.oasis.opendocument.formula": {
    source: "iana",
    extensions: [
      "odf"
    ]
  },
  "application/vnd.oasis.opendocument.formula-template": {
    source: "iana",
    extensions: [
      "odft"
    ]
  },
  "application/vnd.oasis.opendocument.graphics": {
    source: "iana",
    compressible: !1,
    extensions: [
      "odg"
    ]
  },
  "application/vnd.oasis.opendocument.graphics-template": {
    source: "iana",
    extensions: [
      "otg"
    ]
  },
  "application/vnd.oasis.opendocument.image": {
    source: "iana",
    extensions: [
      "odi"
    ]
  },
  "application/vnd.oasis.opendocument.image-template": {
    source: "iana",
    extensions: [
      "oti"
    ]
  },
  "application/vnd.oasis.opendocument.presentation": {
    source: "iana",
    compressible: !1,
    extensions: [
      "odp"
    ]
  },
  "application/vnd.oasis.opendocument.presentation-template": {
    source: "iana",
    extensions: [
      "otp"
    ]
  },
  "application/vnd.oasis.opendocument.spreadsheet": {
    source: "iana",
    compressible: !1,
    extensions: [
      "ods"
    ]
  },
  "application/vnd.oasis.opendocument.spreadsheet-template": {
    source: "iana",
    extensions: [
      "ots"
    ]
  },
  "application/vnd.oasis.opendocument.text": {
    source: "iana",
    compressible: !1,
    extensions: [
      "odt"
    ]
  },
  "application/vnd.oasis.opendocument.text-master": {
    source: "iana",
    extensions: [
      "odm"
    ]
  },
  "application/vnd.oasis.opendocument.text-template": {
    source: "iana",
    extensions: [
      "ott"
    ]
  },
  "application/vnd.oasis.opendocument.text-web": {
    source: "iana",
    extensions: [
      "oth"
    ]
  },
  "application/vnd.obn": {
    source: "iana"
  },
  "application/vnd.ocf+cbor": {
    source: "iana"
  },
  "application/vnd.oci.image.manifest.v1+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oftn.l10n+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.contentaccessdownload+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.contentaccessstreaming+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.cspg-hexbinary": {
    source: "iana"
  },
  "application/vnd.oipf.dae.svg+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.dae.xhtml+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.mippvcontrolmessage+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.pae.gem": {
    source: "iana"
  },
  "application/vnd.oipf.spdiscovery+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.spdlist+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.ueprofile+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.userprofile+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.olpc-sugar": {
    source: "iana",
    extensions: [
      "xo"
    ]
  },
  "application/vnd.oma-scws-config": {
    source: "iana"
  },
  "application/vnd.oma-scws-http-request": {
    source: "iana"
  },
  "application/vnd.oma-scws-http-response": {
    source: "iana"
  },
  "application/vnd.oma.bcast.associated-procedure-parameter+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.bcast.drm-trigger+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.bcast.imd+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.bcast.ltkm": {
    source: "iana"
  },
  "application/vnd.oma.bcast.notification+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.bcast.provisioningtrigger": {
    source: "iana"
  },
  "application/vnd.oma.bcast.sgboot": {
    source: "iana"
  },
  "application/vnd.oma.bcast.sgdd+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.bcast.sgdu": {
    source: "iana"
  },
  "application/vnd.oma.bcast.simple-symbol-container": {
    source: "iana"
  },
  "application/vnd.oma.bcast.smartcard-trigger+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.bcast.sprov+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.bcast.stkm": {
    source: "iana"
  },
  "application/vnd.oma.cab-address-book+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.cab-feature-handler+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.cab-pcc+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.cab-subs-invite+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.cab-user-prefs+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.dcd": {
    source: "iana"
  },
  "application/vnd.oma.dcdc": {
    source: "iana"
  },
  "application/vnd.oma.dd2+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "dd2"
    ]
  },
  "application/vnd.oma.drm.risd+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.group-usage-list+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.lwm2m+cbor": {
    source: "iana"
  },
  "application/vnd.oma.lwm2m+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.lwm2m+tlv": {
    source: "iana"
  },
  "application/vnd.oma.pal+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.poc.detailed-progress-report+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.poc.final-report+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.poc.groups+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.poc.invocation-descriptor+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.poc.optimized-progress-report+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.push": {
    source: "iana"
  },
  "application/vnd.oma.scidm.messages+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.xcap-directory+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.omads-email+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/vnd.omads-file+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/vnd.omads-folder+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/vnd.omaloc-supl-init": {
    source: "iana"
  },
  "application/vnd.onepager": {
    source: "iana"
  },
  "application/vnd.onepagertamp": {
    source: "iana"
  },
  "application/vnd.onepagertamx": {
    source: "iana"
  },
  "application/vnd.onepagertat": {
    source: "iana"
  },
  "application/vnd.onepagertatp": {
    source: "iana"
  },
  "application/vnd.onepagertatx": {
    source: "iana"
  },
  "application/vnd.openblox.game+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "obgx"
    ]
  },
  "application/vnd.openblox.game-binary": {
    source: "iana"
  },
  "application/vnd.openeye.oeb": {
    source: "iana"
  },
  "application/vnd.openofficeorg.extension": {
    source: "apache",
    extensions: [
      "oxt"
    ]
  },
  "application/vnd.openstreetmap.data+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "osm"
    ]
  },
  "application/vnd.opentimestamps.ots": {
    source: "iana"
  },
  "application/vnd.openxmlformats-officedocument.custom-properties+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.drawing+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.extended-properties+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
    source: "iana",
    compressible: !1,
    extensions: [
      "pptx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slide": {
    source: "iana",
    extensions: [
      "sldx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
    source: "iana",
    extensions: [
      "ppsx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.template": {
    source: "iana",
    extensions: [
      "potx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
    source: "iana",
    compressible: !1,
    extensions: [
      "xlsx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
    source: "iana",
    extensions: [
      "xltx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.theme+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.themeoverride+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.vmldrawing": {
    source: "iana"
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    source: "iana",
    compressible: !1,
    extensions: [
      "docx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
    source: "iana",
    extensions: [
      "dotx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-package.core-properties+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-package.relationships+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oracle.resource+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.orange.indata": {
    source: "iana"
  },
  "application/vnd.osa.netdeploy": {
    source: "iana"
  },
  "application/vnd.osgeo.mapguide.package": {
    source: "iana",
    extensions: [
      "mgp"
    ]
  },
  "application/vnd.osgi.bundle": {
    source: "iana"
  },
  "application/vnd.osgi.dp": {
    source: "iana",
    extensions: [
      "dp"
    ]
  },
  "application/vnd.osgi.subsystem": {
    source: "iana",
    extensions: [
      "esa"
    ]
  },
  "application/vnd.otps.ct-kip+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oxli.countgraph": {
    source: "iana"
  },
  "application/vnd.pagerduty+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.palm": {
    source: "iana",
    extensions: [
      "pdb",
      "pqa",
      "oprc"
    ]
  },
  "application/vnd.panoply": {
    source: "iana"
  },
  "application/vnd.paos.xml": {
    source: "iana"
  },
  "application/vnd.patentdive": {
    source: "iana"
  },
  "application/vnd.patientecommsdoc": {
    source: "iana"
  },
  "application/vnd.pawaafile": {
    source: "iana",
    extensions: [
      "paw"
    ]
  },
  "application/vnd.pcos": {
    source: "iana"
  },
  "application/vnd.pg.format": {
    source: "iana",
    extensions: [
      "str"
    ]
  },
  "application/vnd.pg.osasli": {
    source: "iana",
    extensions: [
      "ei6"
    ]
  },
  "application/vnd.piaccess.application-licence": {
    source: "iana"
  },
  "application/vnd.picsel": {
    source: "iana",
    extensions: [
      "efif"
    ]
  },
  "application/vnd.pmi.widget": {
    source: "iana",
    extensions: [
      "wg"
    ]
  },
  "application/vnd.poc.group-advertisement+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.pocketlearn": {
    source: "iana",
    extensions: [
      "plf"
    ]
  },
  "application/vnd.powerbuilder6": {
    source: "iana",
    extensions: [
      "pbd"
    ]
  },
  "application/vnd.powerbuilder6-s": {
    source: "iana"
  },
  "application/vnd.powerbuilder7": {
    source: "iana"
  },
  "application/vnd.powerbuilder7-s": {
    source: "iana"
  },
  "application/vnd.powerbuilder75": {
    source: "iana"
  },
  "application/vnd.powerbuilder75-s": {
    source: "iana"
  },
  "application/vnd.preminet": {
    source: "iana"
  },
  "application/vnd.previewsystems.box": {
    source: "iana",
    extensions: [
      "box"
    ]
  },
  "application/vnd.proteus.magazine": {
    source: "iana",
    extensions: [
      "mgz"
    ]
  },
  "application/vnd.psfs": {
    source: "iana"
  },
  "application/vnd.publishare-delta-tree": {
    source: "iana",
    extensions: [
      "qps"
    ]
  },
  "application/vnd.pvi.ptid1": {
    source: "iana",
    extensions: [
      "ptid"
    ]
  },
  "application/vnd.pwg-multiplexed": {
    source: "iana"
  },
  "application/vnd.pwg-xhtml-print+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.qualcomm.brew-app-res": {
    source: "iana"
  },
  "application/vnd.quarantainenet": {
    source: "iana"
  },
  "application/vnd.quark.quarkxpress": {
    source: "iana",
    extensions: [
      "qxd",
      "qxt",
      "qwd",
      "qwt",
      "qxl",
      "qxb"
    ]
  },
  "application/vnd.quobject-quoxdocument": {
    source: "iana"
  },
  "application/vnd.radisys.moml+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-audit+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-audit-conf+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-audit-conn+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-audit-dialog+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-audit-stream+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-conf+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-dialog+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-dialog-base+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-dialog-fax-detect+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-dialog-group+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-dialog-speech+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-dialog-transform+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.rainstor.data": {
    source: "iana"
  },
  "application/vnd.rapid": {
    source: "iana"
  },
  "application/vnd.rar": {
    source: "iana",
    extensions: [
      "rar"
    ]
  },
  "application/vnd.realvnc.bed": {
    source: "iana",
    extensions: [
      "bed"
    ]
  },
  "application/vnd.recordare.musicxml": {
    source: "iana",
    extensions: [
      "mxl"
    ]
  },
  "application/vnd.recordare.musicxml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "musicxml"
    ]
  },
  "application/vnd.renlearn.rlprint": {
    source: "iana"
  },
  "application/vnd.resilient.logic": {
    source: "iana"
  },
  "application/vnd.restful+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.rig.cryptonote": {
    source: "iana",
    extensions: [
      "cryptonote"
    ]
  },
  "application/vnd.rim.cod": {
    source: "apache",
    extensions: [
      "cod"
    ]
  },
  "application/vnd.rn-realmedia": {
    source: "apache",
    extensions: [
      "rm"
    ]
  },
  "application/vnd.rn-realmedia-vbr": {
    source: "apache",
    extensions: [
      "rmvb"
    ]
  },
  "application/vnd.route66.link66+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "link66"
    ]
  },
  "application/vnd.rs-274x": {
    source: "iana"
  },
  "application/vnd.ruckus.download": {
    source: "iana"
  },
  "application/vnd.s3sms": {
    source: "iana"
  },
  "application/vnd.sailingtracker.track": {
    source: "iana",
    extensions: [
      "st"
    ]
  },
  "application/vnd.sar": {
    source: "iana"
  },
  "application/vnd.sbm.cid": {
    source: "iana"
  },
  "application/vnd.sbm.mid2": {
    source: "iana"
  },
  "application/vnd.scribus": {
    source: "iana"
  },
  "application/vnd.sealed.3df": {
    source: "iana"
  },
  "application/vnd.sealed.csf": {
    source: "iana"
  },
  "application/vnd.sealed.doc": {
    source: "iana"
  },
  "application/vnd.sealed.eml": {
    source: "iana"
  },
  "application/vnd.sealed.mht": {
    source: "iana"
  },
  "application/vnd.sealed.net": {
    source: "iana"
  },
  "application/vnd.sealed.ppt": {
    source: "iana"
  },
  "application/vnd.sealed.tiff": {
    source: "iana"
  },
  "application/vnd.sealed.xls": {
    source: "iana"
  },
  "application/vnd.sealedmedia.softseal.html": {
    source: "iana"
  },
  "application/vnd.sealedmedia.softseal.pdf": {
    source: "iana"
  },
  "application/vnd.seemail": {
    source: "iana",
    extensions: [
      "see"
    ]
  },
  "application/vnd.seis+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.sema": {
    source: "iana",
    extensions: [
      "sema"
    ]
  },
  "application/vnd.semd": {
    source: "iana",
    extensions: [
      "semd"
    ]
  },
  "application/vnd.semf": {
    source: "iana",
    extensions: [
      "semf"
    ]
  },
  "application/vnd.shade-save-file": {
    source: "iana"
  },
  "application/vnd.shana.informed.formdata": {
    source: "iana",
    extensions: [
      "ifm"
    ]
  },
  "application/vnd.shana.informed.formtemplate": {
    source: "iana",
    extensions: [
      "itp"
    ]
  },
  "application/vnd.shana.informed.interchange": {
    source: "iana",
    extensions: [
      "iif"
    ]
  },
  "application/vnd.shana.informed.package": {
    source: "iana",
    extensions: [
      "ipk"
    ]
  },
  "application/vnd.shootproof+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.shopkick+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.shp": {
    source: "iana"
  },
  "application/vnd.shx": {
    source: "iana"
  },
  "application/vnd.sigrok.session": {
    source: "iana"
  },
  "application/vnd.simtech-mindmapper": {
    source: "iana",
    extensions: [
      "twd",
      "twds"
    ]
  },
  "application/vnd.siren+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.smaf": {
    source: "iana",
    extensions: [
      "mmf"
    ]
  },
  "application/vnd.smart.notebook": {
    source: "iana"
  },
  "application/vnd.smart.teacher": {
    source: "iana",
    extensions: [
      "teacher"
    ]
  },
  "application/vnd.snesdev-page-table": {
    source: "iana"
  },
  "application/vnd.software602.filler.form+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "fo"
    ]
  },
  "application/vnd.software602.filler.form-xml-zip": {
    source: "iana"
  },
  "application/vnd.solent.sdkm+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "sdkm",
      "sdkd"
    ]
  },
  "application/vnd.spotfire.dxp": {
    source: "iana",
    extensions: [
      "dxp"
    ]
  },
  "application/vnd.spotfire.sfs": {
    source: "iana",
    extensions: [
      "sfs"
    ]
  },
  "application/vnd.sqlite3": {
    source: "iana"
  },
  "application/vnd.sss-cod": {
    source: "iana"
  },
  "application/vnd.sss-dtf": {
    source: "iana"
  },
  "application/vnd.sss-ntf": {
    source: "iana"
  },
  "application/vnd.stardivision.calc": {
    source: "apache",
    extensions: [
      "sdc"
    ]
  },
  "application/vnd.stardivision.draw": {
    source: "apache",
    extensions: [
      "sda"
    ]
  },
  "application/vnd.stardivision.impress": {
    source: "apache",
    extensions: [
      "sdd"
    ]
  },
  "application/vnd.stardivision.math": {
    source: "apache",
    extensions: [
      "smf"
    ]
  },
  "application/vnd.stardivision.writer": {
    source: "apache",
    extensions: [
      "sdw",
      "vor"
    ]
  },
  "application/vnd.stardivision.writer-global": {
    source: "apache",
    extensions: [
      "sgl"
    ]
  },
  "application/vnd.stepmania.package": {
    source: "iana",
    extensions: [
      "smzip"
    ]
  },
  "application/vnd.stepmania.stepchart": {
    source: "iana",
    extensions: [
      "sm"
    ]
  },
  "application/vnd.street-stream": {
    source: "iana"
  },
  "application/vnd.sun.wadl+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "wadl"
    ]
  },
  "application/vnd.sun.xml.calc": {
    source: "apache",
    extensions: [
      "sxc"
    ]
  },
  "application/vnd.sun.xml.calc.template": {
    source: "apache",
    extensions: [
      "stc"
    ]
  },
  "application/vnd.sun.xml.draw": {
    source: "apache",
    extensions: [
      "sxd"
    ]
  },
  "application/vnd.sun.xml.draw.template": {
    source: "apache",
    extensions: [
      "std"
    ]
  },
  "application/vnd.sun.xml.impress": {
    source: "apache",
    extensions: [
      "sxi"
    ]
  },
  "application/vnd.sun.xml.impress.template": {
    source: "apache",
    extensions: [
      "sti"
    ]
  },
  "application/vnd.sun.xml.math": {
    source: "apache",
    extensions: [
      "sxm"
    ]
  },
  "application/vnd.sun.xml.writer": {
    source: "apache",
    extensions: [
      "sxw"
    ]
  },
  "application/vnd.sun.xml.writer.global": {
    source: "apache",
    extensions: [
      "sxg"
    ]
  },
  "application/vnd.sun.xml.writer.template": {
    source: "apache",
    extensions: [
      "stw"
    ]
  },
  "application/vnd.sus-calendar": {
    source: "iana",
    extensions: [
      "sus",
      "susp"
    ]
  },
  "application/vnd.svd": {
    source: "iana",
    extensions: [
      "svd"
    ]
  },
  "application/vnd.swiftview-ics": {
    source: "iana"
  },
  "application/vnd.sycle+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.syft+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.symbian.install": {
    source: "apache",
    extensions: [
      "sis",
      "sisx"
    ]
  },
  "application/vnd.syncml+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "xsm"
    ]
  },
  "application/vnd.syncml.dm+wbxml": {
    source: "iana",
    charset: "UTF-8",
    extensions: [
      "bdm"
    ]
  },
  "application/vnd.syncml.dm+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "xdm"
    ]
  },
  "application/vnd.syncml.dm.notification": {
    source: "iana"
  },
  "application/vnd.syncml.dmddf+wbxml": {
    source: "iana"
  },
  "application/vnd.syncml.dmddf+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "ddf"
    ]
  },
  "application/vnd.syncml.dmtnds+wbxml": {
    source: "iana"
  },
  "application/vnd.syncml.dmtnds+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/vnd.syncml.ds.notification": {
    source: "iana"
  },
  "application/vnd.tableschema+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.tao.intent-module-archive": {
    source: "iana",
    extensions: [
      "tao"
    ]
  },
  "application/vnd.tcpdump.pcap": {
    source: "iana",
    extensions: [
      "pcap",
      "cap",
      "dmp"
    ]
  },
  "application/vnd.think-cell.ppttc+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.tmd.mediaflex.api+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.tml": {
    source: "iana"
  },
  "application/vnd.tmobile-livetv": {
    source: "iana",
    extensions: [
      "tmo"
    ]
  },
  "application/vnd.tri.onesource": {
    source: "iana"
  },
  "application/vnd.trid.tpt": {
    source: "iana",
    extensions: [
      "tpt"
    ]
  },
  "application/vnd.triscape.mxs": {
    source: "iana",
    extensions: [
      "mxs"
    ]
  },
  "application/vnd.trueapp": {
    source: "iana",
    extensions: [
      "tra"
    ]
  },
  "application/vnd.truedoc": {
    source: "iana"
  },
  "application/vnd.ubisoft.webplayer": {
    source: "iana"
  },
  "application/vnd.ufdl": {
    source: "iana",
    extensions: [
      "ufd",
      "ufdl"
    ]
  },
  "application/vnd.uiq.theme": {
    source: "iana",
    extensions: [
      "utz"
    ]
  },
  "application/vnd.umajin": {
    source: "iana",
    extensions: [
      "umj"
    ]
  },
  "application/vnd.unity": {
    source: "iana",
    extensions: [
      "unityweb"
    ]
  },
  "application/vnd.uoml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "uoml"
    ]
  },
  "application/vnd.uplanet.alert": {
    source: "iana"
  },
  "application/vnd.uplanet.alert-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.bearer-choice": {
    source: "iana"
  },
  "application/vnd.uplanet.bearer-choice-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.cacheop": {
    source: "iana"
  },
  "application/vnd.uplanet.cacheop-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.channel": {
    source: "iana"
  },
  "application/vnd.uplanet.channel-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.list": {
    source: "iana"
  },
  "application/vnd.uplanet.list-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.listcmd": {
    source: "iana"
  },
  "application/vnd.uplanet.listcmd-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.signal": {
    source: "iana"
  },
  "application/vnd.uri-map": {
    source: "iana"
  },
  "application/vnd.valve.source.material": {
    source: "iana"
  },
  "application/vnd.vcx": {
    source: "iana",
    extensions: [
      "vcx"
    ]
  },
  "application/vnd.vd-study": {
    source: "iana"
  },
  "application/vnd.vectorworks": {
    source: "iana"
  },
  "application/vnd.vel+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.verimatrix.vcas": {
    source: "iana"
  },
  "application/vnd.veritone.aion+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.veryant.thin": {
    source: "iana"
  },
  "application/vnd.ves.encrypted": {
    source: "iana"
  },
  "application/vnd.vidsoft.vidconference": {
    source: "iana"
  },
  "application/vnd.visio": {
    source: "iana",
    extensions: [
      "vsd",
      "vst",
      "vss",
      "vsw"
    ]
  },
  "application/vnd.visionary": {
    source: "iana",
    extensions: [
      "vis"
    ]
  },
  "application/vnd.vividence.scriptfile": {
    source: "iana"
  },
  "application/vnd.vsf": {
    source: "iana",
    extensions: [
      "vsf"
    ]
  },
  "application/vnd.wap.sic": {
    source: "iana"
  },
  "application/vnd.wap.slc": {
    source: "iana"
  },
  "application/vnd.wap.wbxml": {
    source: "iana",
    charset: "UTF-8",
    extensions: [
      "wbxml"
    ]
  },
  "application/vnd.wap.wmlc": {
    source: "iana",
    extensions: [
      "wmlc"
    ]
  },
  "application/vnd.wap.wmlscriptc": {
    source: "iana",
    extensions: [
      "wmlsc"
    ]
  },
  "application/vnd.webturbo": {
    source: "iana",
    extensions: [
      "wtb"
    ]
  },
  "application/vnd.wfa.dpp": {
    source: "iana"
  },
  "application/vnd.wfa.p2p": {
    source: "iana"
  },
  "application/vnd.wfa.wsc": {
    source: "iana"
  },
  "application/vnd.windows.devicepairing": {
    source: "iana"
  },
  "application/vnd.wmc": {
    source: "iana"
  },
  "application/vnd.wmf.bootstrap": {
    source: "iana"
  },
  "application/vnd.wolfram.mathematica": {
    source: "iana"
  },
  "application/vnd.wolfram.mathematica.package": {
    source: "iana"
  },
  "application/vnd.wolfram.player": {
    source: "iana",
    extensions: [
      "nbp"
    ]
  },
  "application/vnd.wordperfect": {
    source: "iana",
    extensions: [
      "wpd"
    ]
  },
  "application/vnd.wqd": {
    source: "iana",
    extensions: [
      "wqd"
    ]
  },
  "application/vnd.wrq-hp3000-labelled": {
    source: "iana"
  },
  "application/vnd.wt.stf": {
    source: "iana",
    extensions: [
      "stf"
    ]
  },
  "application/vnd.wv.csp+wbxml": {
    source: "iana"
  },
  "application/vnd.wv.csp+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.wv.ssp+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.xacml+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.xara": {
    source: "iana",
    extensions: [
      "xar"
    ]
  },
  "application/vnd.xfdl": {
    source: "iana",
    extensions: [
      "xfdl"
    ]
  },
  "application/vnd.xfdl.webform": {
    source: "iana"
  },
  "application/vnd.xmi+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.xmpie.cpkg": {
    source: "iana"
  },
  "application/vnd.xmpie.dpkg": {
    source: "iana"
  },
  "application/vnd.xmpie.plan": {
    source: "iana"
  },
  "application/vnd.xmpie.ppkg": {
    source: "iana"
  },
  "application/vnd.xmpie.xlim": {
    source: "iana"
  },
  "application/vnd.yamaha.hv-dic": {
    source: "iana",
    extensions: [
      "hvd"
    ]
  },
  "application/vnd.yamaha.hv-script": {
    source: "iana",
    extensions: [
      "hvs"
    ]
  },
  "application/vnd.yamaha.hv-voice": {
    source: "iana",
    extensions: [
      "hvp"
    ]
  },
  "application/vnd.yamaha.openscoreformat": {
    source: "iana",
    extensions: [
      "osf"
    ]
  },
  "application/vnd.yamaha.openscoreformat.osfpvg+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "osfpvg"
    ]
  },
  "application/vnd.yamaha.remote-setup": {
    source: "iana"
  },
  "application/vnd.yamaha.smaf-audio": {
    source: "iana",
    extensions: [
      "saf"
    ]
  },
  "application/vnd.yamaha.smaf-phrase": {
    source: "iana",
    extensions: [
      "spf"
    ]
  },
  "application/vnd.yamaha.through-ngn": {
    source: "iana"
  },
  "application/vnd.yamaha.tunnel-udpencap": {
    source: "iana"
  },
  "application/vnd.yaoweme": {
    source: "iana"
  },
  "application/vnd.yellowriver-custom-menu": {
    source: "iana",
    extensions: [
      "cmp"
    ]
  },
  "application/vnd.youtube.yt": {
    source: "iana"
  },
  "application/vnd.zul": {
    source: "iana",
    extensions: [
      "zir",
      "zirz"
    ]
  },
  "application/vnd.zzazz.deck+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "zaz"
    ]
  },
  "application/voicexml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "vxml"
    ]
  },
  "application/voucher-cms+json": {
    source: "iana",
    compressible: !0
  },
  "application/vq-rtcpxr": {
    source: "iana"
  },
  "application/wasm": {
    source: "iana",
    compressible: !0,
    extensions: [
      "wasm"
    ]
  },
  "application/watcherinfo+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "wif"
    ]
  },
  "application/webpush-options+json": {
    source: "iana",
    compressible: !0
  },
  "application/whoispp-query": {
    source: "iana"
  },
  "application/whoispp-response": {
    source: "iana"
  },
  "application/widget": {
    source: "iana",
    extensions: [
      "wgt"
    ]
  },
  "application/winhlp": {
    source: "apache",
    extensions: [
      "hlp"
    ]
  },
  "application/wita": {
    source: "iana"
  },
  "application/wordperfect5.1": {
    source: "iana"
  },
  "application/wsdl+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "wsdl"
    ]
  },
  "application/wspolicy+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "wspolicy"
    ]
  },
  "application/x-7z-compressed": {
    source: "apache",
    compressible: !1,
    extensions: [
      "7z"
    ]
  },
  "application/x-abiword": {
    source: "apache",
    extensions: [
      "abw"
    ]
  },
  "application/x-ace-compressed": {
    source: "apache",
    extensions: [
      "ace"
    ]
  },
  "application/x-amf": {
    source: "apache"
  },
  "application/x-apple-diskimage": {
    source: "apache",
    extensions: [
      "dmg"
    ]
  },
  "application/x-arj": {
    compressible: !1,
    extensions: [
      "arj"
    ]
  },
  "application/x-authorware-bin": {
    source: "apache",
    extensions: [
      "aab",
      "x32",
      "u32",
      "vox"
    ]
  },
  "application/x-authorware-map": {
    source: "apache",
    extensions: [
      "aam"
    ]
  },
  "application/x-authorware-seg": {
    source: "apache",
    extensions: [
      "aas"
    ]
  },
  "application/x-bcpio": {
    source: "apache",
    extensions: [
      "bcpio"
    ]
  },
  "application/x-bdoc": {
    compressible: !1,
    extensions: [
      "bdoc"
    ]
  },
  "application/x-bittorrent": {
    source: "apache",
    extensions: [
      "torrent"
    ]
  },
  "application/x-blorb": {
    source: "apache",
    extensions: [
      "blb",
      "blorb"
    ]
  },
  "application/x-bzip": {
    source: "apache",
    compressible: !1,
    extensions: [
      "bz"
    ]
  },
  "application/x-bzip2": {
    source: "apache",
    compressible: !1,
    extensions: [
      "bz2",
      "boz"
    ]
  },
  "application/x-cbr": {
    source: "apache",
    extensions: [
      "cbr",
      "cba",
      "cbt",
      "cbz",
      "cb7"
    ]
  },
  "application/x-cdlink": {
    source: "apache",
    extensions: [
      "vcd"
    ]
  },
  "application/x-cfs-compressed": {
    source: "apache",
    extensions: [
      "cfs"
    ]
  },
  "application/x-chat": {
    source: "apache",
    extensions: [
      "chat"
    ]
  },
  "application/x-chess-pgn": {
    source: "apache",
    extensions: [
      "pgn"
    ]
  },
  "application/x-chrome-extension": {
    extensions: [
      "crx"
    ]
  },
  "application/x-cocoa": {
    source: "nginx",
    extensions: [
      "cco"
    ]
  },
  "application/x-compress": {
    source: "apache"
  },
  "application/x-conference": {
    source: "apache",
    extensions: [
      "nsc"
    ]
  },
  "application/x-cpio": {
    source: "apache",
    extensions: [
      "cpio"
    ]
  },
  "application/x-csh": {
    source: "apache",
    extensions: [
      "csh"
    ]
  },
  "application/x-deb": {
    compressible: !1
  },
  "application/x-debian-package": {
    source: "apache",
    extensions: [
      "deb",
      "udeb"
    ]
  },
  "application/x-dgc-compressed": {
    source: "apache",
    extensions: [
      "dgc"
    ]
  },
  "application/x-director": {
    source: "apache",
    extensions: [
      "dir",
      "dcr",
      "dxr",
      "cst",
      "cct",
      "cxt",
      "w3d",
      "fgd",
      "swa"
    ]
  },
  "application/x-doom": {
    source: "apache",
    extensions: [
      "wad"
    ]
  },
  "application/x-dtbncx+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "ncx"
    ]
  },
  "application/x-dtbook+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "dtb"
    ]
  },
  "application/x-dtbresource+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "res"
    ]
  },
  "application/x-dvi": {
    source: "apache",
    compressible: !1,
    extensions: [
      "dvi"
    ]
  },
  "application/x-envoy": {
    source: "apache",
    extensions: [
      "evy"
    ]
  },
  "application/x-eva": {
    source: "apache",
    extensions: [
      "eva"
    ]
  },
  "application/x-font-bdf": {
    source: "apache",
    extensions: [
      "bdf"
    ]
  },
  "application/x-font-dos": {
    source: "apache"
  },
  "application/x-font-framemaker": {
    source: "apache"
  },
  "application/x-font-ghostscript": {
    source: "apache",
    extensions: [
      "gsf"
    ]
  },
  "application/x-font-libgrx": {
    source: "apache"
  },
  "application/x-font-linux-psf": {
    source: "apache",
    extensions: [
      "psf"
    ]
  },
  "application/x-font-pcf": {
    source: "apache",
    extensions: [
      "pcf"
    ]
  },
  "application/x-font-snf": {
    source: "apache",
    extensions: [
      "snf"
    ]
  },
  "application/x-font-speedo": {
    source: "apache"
  },
  "application/x-font-sunos-news": {
    source: "apache"
  },
  "application/x-font-type1": {
    source: "apache",
    extensions: [
      "pfa",
      "pfb",
      "pfm",
      "afm"
    ]
  },
  "application/x-font-vfont": {
    source: "apache"
  },
  "application/x-freearc": {
    source: "apache",
    extensions: [
      "arc"
    ]
  },
  "application/x-futuresplash": {
    source: "apache",
    extensions: [
      "spl"
    ]
  },
  "application/x-gca-compressed": {
    source: "apache",
    extensions: [
      "gca"
    ]
  },
  "application/x-glulx": {
    source: "apache",
    extensions: [
      "ulx"
    ]
  },
  "application/x-gnumeric": {
    source: "apache",
    extensions: [
      "gnumeric"
    ]
  },
  "application/x-gramps-xml": {
    source: "apache",
    extensions: [
      "gramps"
    ]
  },
  "application/x-gtar": {
    source: "apache",
    extensions: [
      "gtar"
    ]
  },
  "application/x-gzip": {
    source: "apache"
  },
  "application/x-hdf": {
    source: "apache",
    extensions: [
      "hdf"
    ]
  },
  "application/x-httpd-php": {
    compressible: !0,
    extensions: [
      "php"
    ]
  },
  "application/x-install-instructions": {
    source: "apache",
    extensions: [
      "install"
    ]
  },
  "application/x-iso9660-image": {
    source: "apache",
    extensions: [
      "iso"
    ]
  },
  "application/x-iwork-keynote-sffkey": {
    extensions: [
      "key"
    ]
  },
  "application/x-iwork-numbers-sffnumbers": {
    extensions: [
      "numbers"
    ]
  },
  "application/x-iwork-pages-sffpages": {
    extensions: [
      "pages"
    ]
  },
  "application/x-java-archive-diff": {
    source: "nginx",
    extensions: [
      "jardiff"
    ]
  },
  "application/x-java-jnlp-file": {
    source: "apache",
    compressible: !1,
    extensions: [
      "jnlp"
    ]
  },
  "application/x-javascript": {
    compressible: !0
  },
  "application/x-keepass2": {
    extensions: [
      "kdbx"
    ]
  },
  "application/x-latex": {
    source: "apache",
    compressible: !1,
    extensions: [
      "latex"
    ]
  },
  "application/x-lua-bytecode": {
    extensions: [
      "luac"
    ]
  },
  "application/x-lzh-compressed": {
    source: "apache",
    extensions: [
      "lzh",
      "lha"
    ]
  },
  "application/x-makeself": {
    source: "nginx",
    extensions: [
      "run"
    ]
  },
  "application/x-mie": {
    source: "apache",
    extensions: [
      "mie"
    ]
  },
  "application/x-mobipocket-ebook": {
    source: "apache",
    extensions: [
      "prc",
      "mobi"
    ]
  },
  "application/x-mpegurl": {
    compressible: !1
  },
  "application/x-ms-application": {
    source: "apache",
    extensions: [
      "application"
    ]
  },
  "application/x-ms-shortcut": {
    source: "apache",
    extensions: [
      "lnk"
    ]
  },
  "application/x-ms-wmd": {
    source: "apache",
    extensions: [
      "wmd"
    ]
  },
  "application/x-ms-wmz": {
    source: "apache",
    extensions: [
      "wmz"
    ]
  },
  "application/x-ms-xbap": {
    source: "apache",
    extensions: [
      "xbap"
    ]
  },
  "application/x-msaccess": {
    source: "apache",
    extensions: [
      "mdb"
    ]
  },
  "application/x-msbinder": {
    source: "apache",
    extensions: [
      "obd"
    ]
  },
  "application/x-mscardfile": {
    source: "apache",
    extensions: [
      "crd"
    ]
  },
  "application/x-msclip": {
    source: "apache",
    extensions: [
      "clp"
    ]
  },
  "application/x-msdos-program": {
    extensions: [
      "exe"
    ]
  },
  "application/x-msdownload": {
    source: "apache",
    extensions: [
      "exe",
      "dll",
      "com",
      "bat",
      "msi"
    ]
  },
  "application/x-msmediaview": {
    source: "apache",
    extensions: [
      "mvb",
      "m13",
      "m14"
    ]
  },
  "application/x-msmetafile": {
    source: "apache",
    extensions: [
      "wmf",
      "wmz",
      "emf",
      "emz"
    ]
  },
  "application/x-msmoney": {
    source: "apache",
    extensions: [
      "mny"
    ]
  },
  "application/x-mspublisher": {
    source: "apache",
    extensions: [
      "pub"
    ]
  },
  "application/x-msschedule": {
    source: "apache",
    extensions: [
      "scd"
    ]
  },
  "application/x-msterminal": {
    source: "apache",
    extensions: [
      "trm"
    ]
  },
  "application/x-mswrite": {
    source: "apache",
    extensions: [
      "wri"
    ]
  },
  "application/x-netcdf": {
    source: "apache",
    extensions: [
      "nc",
      "cdf"
    ]
  },
  "application/x-ns-proxy-autoconfig": {
    compressible: !0,
    extensions: [
      "pac"
    ]
  },
  "application/x-nzb": {
    source: "apache",
    extensions: [
      "nzb"
    ]
  },
  "application/x-perl": {
    source: "nginx",
    extensions: [
      "pl",
      "pm"
    ]
  },
  "application/x-pilot": {
    source: "nginx",
    extensions: [
      "prc",
      "pdb"
    ]
  },
  "application/x-pkcs12": {
    source: "apache",
    compressible: !1,
    extensions: [
      "p12",
      "pfx"
    ]
  },
  "application/x-pkcs7-certificates": {
    source: "apache",
    extensions: [
      "p7b",
      "spc"
    ]
  },
  "application/x-pkcs7-certreqresp": {
    source: "apache",
    extensions: [
      "p7r"
    ]
  },
  "application/x-pki-message": {
    source: "iana"
  },
  "application/x-rar-compressed": {
    source: "apache",
    compressible: !1,
    extensions: [
      "rar"
    ]
  },
  "application/x-redhat-package-manager": {
    source: "nginx",
    extensions: [
      "rpm"
    ]
  },
  "application/x-research-info-systems": {
    source: "apache",
    extensions: [
      "ris"
    ]
  },
  "application/x-sea": {
    source: "nginx",
    extensions: [
      "sea"
    ]
  },
  "application/x-sh": {
    source: "apache",
    compressible: !0,
    extensions: [
      "sh"
    ]
  },
  "application/x-shar": {
    source: "apache",
    extensions: [
      "shar"
    ]
  },
  "application/x-shockwave-flash": {
    source: "apache",
    compressible: !1,
    extensions: [
      "swf"
    ]
  },
  "application/x-silverlight-app": {
    source: "apache",
    extensions: [
      "xap"
    ]
  },
  "application/x-sql": {
    source: "apache",
    extensions: [
      "sql"
    ]
  },
  "application/x-stuffit": {
    source: "apache",
    compressible: !1,
    extensions: [
      "sit"
    ]
  },
  "application/x-stuffitx": {
    source: "apache",
    extensions: [
      "sitx"
    ]
  },
  "application/x-subrip": {
    source: "apache",
    extensions: [
      "srt"
    ]
  },
  "application/x-sv4cpio": {
    source: "apache",
    extensions: [
      "sv4cpio"
    ]
  },
  "application/x-sv4crc": {
    source: "apache",
    extensions: [
      "sv4crc"
    ]
  },
  "application/x-t3vm-image": {
    source: "apache",
    extensions: [
      "t3"
    ]
  },
  "application/x-tads": {
    source: "apache",
    extensions: [
      "gam"
    ]
  },
  "application/x-tar": {
    source: "apache",
    compressible: !0,
    extensions: [
      "tar"
    ]
  },
  "application/x-tcl": {
    source: "apache",
    extensions: [
      "tcl",
      "tk"
    ]
  },
  "application/x-tex": {
    source: "apache",
    extensions: [
      "tex"
    ]
  },
  "application/x-tex-tfm": {
    source: "apache",
    extensions: [
      "tfm"
    ]
  },
  "application/x-texinfo": {
    source: "apache",
    extensions: [
      "texinfo",
      "texi"
    ]
  },
  "application/x-tgif": {
    source: "apache",
    extensions: [
      "obj"
    ]
  },
  "application/x-ustar": {
    source: "apache",
    extensions: [
      "ustar"
    ]
  },
  "application/x-virtualbox-hdd": {
    compressible: !0,
    extensions: [
      "hdd"
    ]
  },
  "application/x-virtualbox-ova": {
    compressible: !0,
    extensions: [
      "ova"
    ]
  },
  "application/x-virtualbox-ovf": {
    compressible: !0,
    extensions: [
      "ovf"
    ]
  },
  "application/x-virtualbox-vbox": {
    compressible: !0,
    extensions: [
      "vbox"
    ]
  },
  "application/x-virtualbox-vbox-extpack": {
    compressible: !1,
    extensions: [
      "vbox-extpack"
    ]
  },
  "application/x-virtualbox-vdi": {
    compressible: !0,
    extensions: [
      "vdi"
    ]
  },
  "application/x-virtualbox-vhd": {
    compressible: !0,
    extensions: [
      "vhd"
    ]
  },
  "application/x-virtualbox-vmdk": {
    compressible: !0,
    extensions: [
      "vmdk"
    ]
  },
  "application/x-wais-source": {
    source: "apache",
    extensions: [
      "src"
    ]
  },
  "application/x-web-app-manifest+json": {
    compressible: !0,
    extensions: [
      "webapp"
    ]
  },
  "application/x-www-form-urlencoded": {
    source: "iana",
    compressible: !0
  },
  "application/x-x509-ca-cert": {
    source: "iana",
    extensions: [
      "der",
      "crt",
      "pem"
    ]
  },
  "application/x-x509-ca-ra-cert": {
    source: "iana"
  },
  "application/x-x509-next-ca-cert": {
    source: "iana"
  },
  "application/x-xfig": {
    source: "apache",
    extensions: [
      "fig"
    ]
  },
  "application/x-xliff+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "xlf"
    ]
  },
  "application/x-xpinstall": {
    source: "apache",
    compressible: !1,
    extensions: [
      "xpi"
    ]
  },
  "application/x-xz": {
    source: "apache",
    extensions: [
      "xz"
    ]
  },
  "application/x-zmachine": {
    source: "apache",
    extensions: [
      "z1",
      "z2",
      "z3",
      "z4",
      "z5",
      "z6",
      "z7",
      "z8"
    ]
  },
  "application/x400-bp": {
    source: "iana"
  },
  "application/xacml+xml": {
    source: "iana",
    compressible: !0
  },
  "application/xaml+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "xaml"
    ]
  },
  "application/xcap-att+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xav"
    ]
  },
  "application/xcap-caps+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xca"
    ]
  },
  "application/xcap-diff+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xdf"
    ]
  },
  "application/xcap-el+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xel"
    ]
  },
  "application/xcap-error+xml": {
    source: "iana",
    compressible: !0
  },
  "application/xcap-ns+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xns"
    ]
  },
  "application/xcon-conference-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/xcon-conference-info-diff+xml": {
    source: "iana",
    compressible: !0
  },
  "application/xenc+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xenc"
    ]
  },
  "application/xhtml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xhtml",
      "xht"
    ]
  },
  "application/xhtml-voice+xml": {
    source: "apache",
    compressible: !0
  },
  "application/xliff+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xlf"
    ]
  },
  "application/xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xml",
      "xsl",
      "xsd",
      "rng"
    ]
  },
  "application/xml-dtd": {
    source: "iana",
    compressible: !0,
    extensions: [
      "dtd"
    ]
  },
  "application/xml-external-parsed-entity": {
    source: "iana"
  },
  "application/xml-patch+xml": {
    source: "iana",
    compressible: !0
  },
  "application/xmpp+xml": {
    source: "iana",
    compressible: !0
  },
  "application/xop+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xop"
    ]
  },
  "application/xproc+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "xpl"
    ]
  },
  "application/xslt+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xsl",
      "xslt"
    ]
  },
  "application/xspf+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "xspf"
    ]
  },
  "application/xv+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mxml",
      "xhvml",
      "xvml",
      "xvm"
    ]
  },
  "application/yang": {
    source: "iana",
    extensions: [
      "yang"
    ]
  },
  "application/yang-data+json": {
    source: "iana",
    compressible: !0
  },
  "application/yang-data+xml": {
    source: "iana",
    compressible: !0
  },
  "application/yang-patch+json": {
    source: "iana",
    compressible: !0
  },
  "application/yang-patch+xml": {
    source: "iana",
    compressible: !0
  },
  "application/yin+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "yin"
    ]
  },
  "application/zip": {
    source: "iana",
    compressible: !1,
    extensions: [
      "zip"
    ]
  },
  "application/zlib": {
    source: "iana"
  },
  "application/zstd": {
    source: "iana"
  },
  "audio/1d-interleaved-parityfec": {
    source: "iana"
  },
  "audio/32kadpcm": {
    source: "iana"
  },
  "audio/3gpp": {
    source: "iana",
    compressible: !1,
    extensions: [
      "3gpp"
    ]
  },
  "audio/3gpp2": {
    source: "iana"
  },
  "audio/aac": {
    source: "iana"
  },
  "audio/ac3": {
    source: "iana"
  },
  "audio/adpcm": {
    source: "apache",
    extensions: [
      "adp"
    ]
  },
  "audio/amr": {
    source: "iana",
    extensions: [
      "amr"
    ]
  },
  "audio/amr-wb": {
    source: "iana"
  },
  "audio/amr-wb+": {
    source: "iana"
  },
  "audio/aptx": {
    source: "iana"
  },
  "audio/asc": {
    source: "iana"
  },
  "audio/atrac-advanced-lossless": {
    source: "iana"
  },
  "audio/atrac-x": {
    source: "iana"
  },
  "audio/atrac3": {
    source: "iana"
  },
  "audio/basic": {
    source: "iana",
    compressible: !1,
    extensions: [
      "au",
      "snd"
    ]
  },
  "audio/bv16": {
    source: "iana"
  },
  "audio/bv32": {
    source: "iana"
  },
  "audio/clearmode": {
    source: "iana"
  },
  "audio/cn": {
    source: "iana"
  },
  "audio/dat12": {
    source: "iana"
  },
  "audio/dls": {
    source: "iana"
  },
  "audio/dsr-es201108": {
    source: "iana"
  },
  "audio/dsr-es202050": {
    source: "iana"
  },
  "audio/dsr-es202211": {
    source: "iana"
  },
  "audio/dsr-es202212": {
    source: "iana"
  },
  "audio/dv": {
    source: "iana"
  },
  "audio/dvi4": {
    source: "iana"
  },
  "audio/eac3": {
    source: "iana"
  },
  "audio/encaprtp": {
    source: "iana"
  },
  "audio/evrc": {
    source: "iana"
  },
  "audio/evrc-qcp": {
    source: "iana"
  },
  "audio/evrc0": {
    source: "iana"
  },
  "audio/evrc1": {
    source: "iana"
  },
  "audio/evrcb": {
    source: "iana"
  },
  "audio/evrcb0": {
    source: "iana"
  },
  "audio/evrcb1": {
    source: "iana"
  },
  "audio/evrcnw": {
    source: "iana"
  },
  "audio/evrcnw0": {
    source: "iana"
  },
  "audio/evrcnw1": {
    source: "iana"
  },
  "audio/evrcwb": {
    source: "iana"
  },
  "audio/evrcwb0": {
    source: "iana"
  },
  "audio/evrcwb1": {
    source: "iana"
  },
  "audio/evs": {
    source: "iana"
  },
  "audio/flexfec": {
    source: "iana"
  },
  "audio/fwdred": {
    source: "iana"
  },
  "audio/g711-0": {
    source: "iana"
  },
  "audio/g719": {
    source: "iana"
  },
  "audio/g722": {
    source: "iana"
  },
  "audio/g7221": {
    source: "iana"
  },
  "audio/g723": {
    source: "iana"
  },
  "audio/g726-16": {
    source: "iana"
  },
  "audio/g726-24": {
    source: "iana"
  },
  "audio/g726-32": {
    source: "iana"
  },
  "audio/g726-40": {
    source: "iana"
  },
  "audio/g728": {
    source: "iana"
  },
  "audio/g729": {
    source: "iana"
  },
  "audio/g7291": {
    source: "iana"
  },
  "audio/g729d": {
    source: "iana"
  },
  "audio/g729e": {
    source: "iana"
  },
  "audio/gsm": {
    source: "iana"
  },
  "audio/gsm-efr": {
    source: "iana"
  },
  "audio/gsm-hr-08": {
    source: "iana"
  },
  "audio/ilbc": {
    source: "iana"
  },
  "audio/ip-mr_v2.5": {
    source: "iana"
  },
  "audio/isac": {
    source: "apache"
  },
  "audio/l16": {
    source: "iana"
  },
  "audio/l20": {
    source: "iana"
  },
  "audio/l24": {
    source: "iana",
    compressible: !1
  },
  "audio/l8": {
    source: "iana"
  },
  "audio/lpc": {
    source: "iana"
  },
  "audio/melp": {
    source: "iana"
  },
  "audio/melp1200": {
    source: "iana"
  },
  "audio/melp2400": {
    source: "iana"
  },
  "audio/melp600": {
    source: "iana"
  },
  "audio/mhas": {
    source: "iana"
  },
  "audio/midi": {
    source: "apache",
    extensions: [
      "mid",
      "midi",
      "kar",
      "rmi"
    ]
  },
  "audio/mobile-xmf": {
    source: "iana",
    extensions: [
      "mxmf"
    ]
  },
  "audio/mp3": {
    compressible: !1,
    extensions: [
      "mp3"
    ]
  },
  "audio/mp4": {
    source: "iana",
    compressible: !1,
    extensions: [
      "m4a",
      "mp4a"
    ]
  },
  "audio/mp4a-latm": {
    source: "iana"
  },
  "audio/mpa": {
    source: "iana"
  },
  "audio/mpa-robust": {
    source: "iana"
  },
  "audio/mpeg": {
    source: "iana",
    compressible: !1,
    extensions: [
      "mpga",
      "mp2",
      "mp2a",
      "mp3",
      "m2a",
      "m3a"
    ]
  },
  "audio/mpeg4-generic": {
    source: "iana"
  },
  "audio/musepack": {
    source: "apache"
  },
  "audio/ogg": {
    source: "iana",
    compressible: !1,
    extensions: [
      "oga",
      "ogg",
      "spx",
      "opus"
    ]
  },
  "audio/opus": {
    source: "iana"
  },
  "audio/parityfec": {
    source: "iana"
  },
  "audio/pcma": {
    source: "iana"
  },
  "audio/pcma-wb": {
    source: "iana"
  },
  "audio/pcmu": {
    source: "iana"
  },
  "audio/pcmu-wb": {
    source: "iana"
  },
  "audio/prs.sid": {
    source: "iana"
  },
  "audio/qcelp": {
    source: "iana"
  },
  "audio/raptorfec": {
    source: "iana"
  },
  "audio/red": {
    source: "iana"
  },
  "audio/rtp-enc-aescm128": {
    source: "iana"
  },
  "audio/rtp-midi": {
    source: "iana"
  },
  "audio/rtploopback": {
    source: "iana"
  },
  "audio/rtx": {
    source: "iana"
  },
  "audio/s3m": {
    source: "apache",
    extensions: [
      "s3m"
    ]
  },
  "audio/scip": {
    source: "iana"
  },
  "audio/silk": {
    source: "apache",
    extensions: [
      "sil"
    ]
  },
  "audio/smv": {
    source: "iana"
  },
  "audio/smv-qcp": {
    source: "iana"
  },
  "audio/smv0": {
    source: "iana"
  },
  "audio/sofa": {
    source: "iana"
  },
  "audio/sp-midi": {
    source: "iana"
  },
  "audio/speex": {
    source: "iana"
  },
  "audio/t140c": {
    source: "iana"
  },
  "audio/t38": {
    source: "iana"
  },
  "audio/telephone-event": {
    source: "iana"
  },
  "audio/tetra_acelp": {
    source: "iana"
  },
  "audio/tetra_acelp_bb": {
    source: "iana"
  },
  "audio/tone": {
    source: "iana"
  },
  "audio/tsvcis": {
    source: "iana"
  },
  "audio/uemclip": {
    source: "iana"
  },
  "audio/ulpfec": {
    source: "iana"
  },
  "audio/usac": {
    source: "iana"
  },
  "audio/vdvi": {
    source: "iana"
  },
  "audio/vmr-wb": {
    source: "iana"
  },
  "audio/vnd.3gpp.iufp": {
    source: "iana"
  },
  "audio/vnd.4sb": {
    source: "iana"
  },
  "audio/vnd.audiokoz": {
    source: "iana"
  },
  "audio/vnd.celp": {
    source: "iana"
  },
  "audio/vnd.cisco.nse": {
    source: "iana"
  },
  "audio/vnd.cmles.radio-events": {
    source: "iana"
  },
  "audio/vnd.cns.anp1": {
    source: "iana"
  },
  "audio/vnd.cns.inf1": {
    source: "iana"
  },
  "audio/vnd.dece.audio": {
    source: "iana",
    extensions: [
      "uva",
      "uvva"
    ]
  },
  "audio/vnd.digital-winds": {
    source: "iana",
    extensions: [
      "eol"
    ]
  },
  "audio/vnd.dlna.adts": {
    source: "iana"
  },
  "audio/vnd.dolby.heaac.1": {
    source: "iana"
  },
  "audio/vnd.dolby.heaac.2": {
    source: "iana"
  },
  "audio/vnd.dolby.mlp": {
    source: "iana"
  },
  "audio/vnd.dolby.mps": {
    source: "iana"
  },
  "audio/vnd.dolby.pl2": {
    source: "iana"
  },
  "audio/vnd.dolby.pl2x": {
    source: "iana"
  },
  "audio/vnd.dolby.pl2z": {
    source: "iana"
  },
  "audio/vnd.dolby.pulse.1": {
    source: "iana"
  },
  "audio/vnd.dra": {
    source: "iana",
    extensions: [
      "dra"
    ]
  },
  "audio/vnd.dts": {
    source: "iana",
    extensions: [
      "dts"
    ]
  },
  "audio/vnd.dts.hd": {
    source: "iana",
    extensions: [
      "dtshd"
    ]
  },
  "audio/vnd.dts.uhd": {
    source: "iana"
  },
  "audio/vnd.dvb.file": {
    source: "iana"
  },
  "audio/vnd.everad.plj": {
    source: "iana"
  },
  "audio/vnd.hns.audio": {
    source: "iana"
  },
  "audio/vnd.lucent.voice": {
    source: "iana",
    extensions: [
      "lvp"
    ]
  },
  "audio/vnd.ms-playready.media.pya": {
    source: "iana",
    extensions: [
      "pya"
    ]
  },
  "audio/vnd.nokia.mobile-xmf": {
    source: "iana"
  },
  "audio/vnd.nortel.vbk": {
    source: "iana"
  },
  "audio/vnd.nuera.ecelp4800": {
    source: "iana",
    extensions: [
      "ecelp4800"
    ]
  },
  "audio/vnd.nuera.ecelp7470": {
    source: "iana",
    extensions: [
      "ecelp7470"
    ]
  },
  "audio/vnd.nuera.ecelp9600": {
    source: "iana",
    extensions: [
      "ecelp9600"
    ]
  },
  "audio/vnd.octel.sbc": {
    source: "iana"
  },
  "audio/vnd.presonus.multitrack": {
    source: "iana"
  },
  "audio/vnd.qcelp": {
    source: "iana"
  },
  "audio/vnd.rhetorex.32kadpcm": {
    source: "iana"
  },
  "audio/vnd.rip": {
    source: "iana",
    extensions: [
      "rip"
    ]
  },
  "audio/vnd.rn-realaudio": {
    compressible: !1
  },
  "audio/vnd.sealedmedia.softseal.mpeg": {
    source: "iana"
  },
  "audio/vnd.vmx.cvsd": {
    source: "iana"
  },
  "audio/vnd.wave": {
    compressible: !1
  },
  "audio/vorbis": {
    source: "iana",
    compressible: !1
  },
  "audio/vorbis-config": {
    source: "iana"
  },
  "audio/wav": {
    compressible: !1,
    extensions: [
      "wav"
    ]
  },
  "audio/wave": {
    compressible: !1,
    extensions: [
      "wav"
    ]
  },
  "audio/webm": {
    source: "apache",
    compressible: !1,
    extensions: [
      "weba"
    ]
  },
  "audio/x-aac": {
    source: "apache",
    compressible: !1,
    extensions: [
      "aac"
    ]
  },
  "audio/x-aiff": {
    source: "apache",
    extensions: [
      "aif",
      "aiff",
      "aifc"
    ]
  },
  "audio/x-caf": {
    source: "apache",
    compressible: !1,
    extensions: [
      "caf"
    ]
  },
  "audio/x-flac": {
    source: "apache",
    extensions: [
      "flac"
    ]
  },
  "audio/x-m4a": {
    source: "nginx",
    extensions: [
      "m4a"
    ]
  },
  "audio/x-matroska": {
    source: "apache",
    extensions: [
      "mka"
    ]
  },
  "audio/x-mpegurl": {
    source: "apache",
    extensions: [
      "m3u"
    ]
  },
  "audio/x-ms-wax": {
    source: "apache",
    extensions: [
      "wax"
    ]
  },
  "audio/x-ms-wma": {
    source: "apache",
    extensions: [
      "wma"
    ]
  },
  "audio/x-pn-realaudio": {
    source: "apache",
    extensions: [
      "ram",
      "ra"
    ]
  },
  "audio/x-pn-realaudio-plugin": {
    source: "apache",
    extensions: [
      "rmp"
    ]
  },
  "audio/x-realaudio": {
    source: "nginx",
    extensions: [
      "ra"
    ]
  },
  "audio/x-tta": {
    source: "apache"
  },
  "audio/x-wav": {
    source: "apache",
    extensions: [
      "wav"
    ]
  },
  "audio/xm": {
    source: "apache",
    extensions: [
      "xm"
    ]
  },
  "chemical/x-cdx": {
    source: "apache",
    extensions: [
      "cdx"
    ]
  },
  "chemical/x-cif": {
    source: "apache",
    extensions: [
      "cif"
    ]
  },
  "chemical/x-cmdf": {
    source: "apache",
    extensions: [
      "cmdf"
    ]
  },
  "chemical/x-cml": {
    source: "apache",
    extensions: [
      "cml"
    ]
  },
  "chemical/x-csml": {
    source: "apache",
    extensions: [
      "csml"
    ]
  },
  "chemical/x-pdb": {
    source: "apache"
  },
  "chemical/x-xyz": {
    source: "apache",
    extensions: [
      "xyz"
    ]
  },
  "font/collection": {
    source: "iana",
    extensions: [
      "ttc"
    ]
  },
  "font/otf": {
    source: "iana",
    compressible: !0,
    extensions: [
      "otf"
    ]
  },
  "font/sfnt": {
    source: "iana"
  },
  "font/ttf": {
    source: "iana",
    compressible: !0,
    extensions: [
      "ttf"
    ]
  },
  "font/woff": {
    source: "iana",
    extensions: [
      "woff"
    ]
  },
  "font/woff2": {
    source: "iana",
    extensions: [
      "woff2"
    ]
  },
  "image/aces": {
    source: "iana",
    extensions: [
      "exr"
    ]
  },
  "image/apng": {
    compressible: !1,
    extensions: [
      "apng"
    ]
  },
  "image/avci": {
    source: "iana",
    extensions: [
      "avci"
    ]
  },
  "image/avcs": {
    source: "iana",
    extensions: [
      "avcs"
    ]
  },
  "image/avif": {
    source: "iana",
    compressible: !1,
    extensions: [
      "avif"
    ]
  },
  "image/bmp": {
    source: "iana",
    compressible: !0,
    extensions: [
      "bmp"
    ]
  },
  "image/cgm": {
    source: "iana",
    extensions: [
      "cgm"
    ]
  },
  "image/dicom-rle": {
    source: "iana",
    extensions: [
      "drle"
    ]
  },
  "image/emf": {
    source: "iana",
    extensions: [
      "emf"
    ]
  },
  "image/fits": {
    source: "iana",
    extensions: [
      "fits"
    ]
  },
  "image/g3fax": {
    source: "iana",
    extensions: [
      "g3"
    ]
  },
  "image/gif": {
    source: "iana",
    compressible: !1,
    extensions: [
      "gif"
    ]
  },
  "image/heic": {
    source: "iana",
    extensions: [
      "heic"
    ]
  },
  "image/heic-sequence": {
    source: "iana",
    extensions: [
      "heics"
    ]
  },
  "image/heif": {
    source: "iana",
    extensions: [
      "heif"
    ]
  },
  "image/heif-sequence": {
    source: "iana",
    extensions: [
      "heifs"
    ]
  },
  "image/hej2k": {
    source: "iana",
    extensions: [
      "hej2"
    ]
  },
  "image/hsj2": {
    source: "iana",
    extensions: [
      "hsj2"
    ]
  },
  "image/ief": {
    source: "iana",
    extensions: [
      "ief"
    ]
  },
  "image/jls": {
    source: "iana",
    extensions: [
      "jls"
    ]
  },
  "image/jp2": {
    source: "iana",
    compressible: !1,
    extensions: [
      "jp2",
      "jpg2"
    ]
  },
  "image/jpeg": {
    source: "iana",
    compressible: !1,
    extensions: [
      "jpeg",
      "jpg",
      "jpe"
    ]
  },
  "image/jph": {
    source: "iana",
    extensions: [
      "jph"
    ]
  },
  "image/jphc": {
    source: "iana",
    extensions: [
      "jhc"
    ]
  },
  "image/jpm": {
    source: "iana",
    compressible: !1,
    extensions: [
      "jpm"
    ]
  },
  "image/jpx": {
    source: "iana",
    compressible: !1,
    extensions: [
      "jpx",
      "jpf"
    ]
  },
  "image/jxr": {
    source: "iana",
    extensions: [
      "jxr"
    ]
  },
  "image/jxra": {
    source: "iana",
    extensions: [
      "jxra"
    ]
  },
  "image/jxrs": {
    source: "iana",
    extensions: [
      "jxrs"
    ]
  },
  "image/jxs": {
    source: "iana",
    extensions: [
      "jxs"
    ]
  },
  "image/jxsc": {
    source: "iana",
    extensions: [
      "jxsc"
    ]
  },
  "image/jxsi": {
    source: "iana",
    extensions: [
      "jxsi"
    ]
  },
  "image/jxss": {
    source: "iana",
    extensions: [
      "jxss"
    ]
  },
  "image/ktx": {
    source: "iana",
    extensions: [
      "ktx"
    ]
  },
  "image/ktx2": {
    source: "iana",
    extensions: [
      "ktx2"
    ]
  },
  "image/naplps": {
    source: "iana"
  },
  "image/pjpeg": {
    compressible: !1
  },
  "image/png": {
    source: "iana",
    compressible: !1,
    extensions: [
      "png"
    ]
  },
  "image/prs.btif": {
    source: "iana",
    extensions: [
      "btif"
    ]
  },
  "image/prs.pti": {
    source: "iana",
    extensions: [
      "pti"
    ]
  },
  "image/pwg-raster": {
    source: "iana"
  },
  "image/sgi": {
    source: "apache",
    extensions: [
      "sgi"
    ]
  },
  "image/svg+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "svg",
      "svgz"
    ]
  },
  "image/t38": {
    source: "iana",
    extensions: [
      "t38"
    ]
  },
  "image/tiff": {
    source: "iana",
    compressible: !1,
    extensions: [
      "tif",
      "tiff"
    ]
  },
  "image/tiff-fx": {
    source: "iana",
    extensions: [
      "tfx"
    ]
  },
  "image/vnd.adobe.photoshop": {
    source: "iana",
    compressible: !0,
    extensions: [
      "psd"
    ]
  },
  "image/vnd.airzip.accelerator.azv": {
    source: "iana",
    extensions: [
      "azv"
    ]
  },
  "image/vnd.cns.inf2": {
    source: "iana"
  },
  "image/vnd.dece.graphic": {
    source: "iana",
    extensions: [
      "uvi",
      "uvvi",
      "uvg",
      "uvvg"
    ]
  },
  "image/vnd.djvu": {
    source: "iana",
    extensions: [
      "djvu",
      "djv"
    ]
  },
  "image/vnd.dvb.subtitle": {
    source: "iana",
    extensions: [
      "sub"
    ]
  },
  "image/vnd.dwg": {
    source: "iana",
    extensions: [
      "dwg"
    ]
  },
  "image/vnd.dxf": {
    source: "iana",
    extensions: [
      "dxf"
    ]
  },
  "image/vnd.fastbidsheet": {
    source: "iana",
    extensions: [
      "fbs"
    ]
  },
  "image/vnd.fpx": {
    source: "iana",
    extensions: [
      "fpx"
    ]
  },
  "image/vnd.fst": {
    source: "iana",
    extensions: [
      "fst"
    ]
  },
  "image/vnd.fujixerox.edmics-mmr": {
    source: "iana",
    extensions: [
      "mmr"
    ]
  },
  "image/vnd.fujixerox.edmics-rlc": {
    source: "iana",
    extensions: [
      "rlc"
    ]
  },
  "image/vnd.globalgraphics.pgb": {
    source: "iana"
  },
  "image/vnd.microsoft.icon": {
    source: "iana",
    compressible: !0,
    extensions: [
      "ico"
    ]
  },
  "image/vnd.mix": {
    source: "iana"
  },
  "image/vnd.mozilla.apng": {
    source: "iana"
  },
  "image/vnd.ms-dds": {
    compressible: !0,
    extensions: [
      "dds"
    ]
  },
  "image/vnd.ms-modi": {
    source: "iana",
    extensions: [
      "mdi"
    ]
  },
  "image/vnd.ms-photo": {
    source: "apache",
    extensions: [
      "wdp"
    ]
  },
  "image/vnd.net-fpx": {
    source: "iana",
    extensions: [
      "npx"
    ]
  },
  "image/vnd.pco.b16": {
    source: "iana",
    extensions: [
      "b16"
    ]
  },
  "image/vnd.radiance": {
    source: "iana"
  },
  "image/vnd.sealed.png": {
    source: "iana"
  },
  "image/vnd.sealedmedia.softseal.gif": {
    source: "iana"
  },
  "image/vnd.sealedmedia.softseal.jpg": {
    source: "iana"
  },
  "image/vnd.svf": {
    source: "iana"
  },
  "image/vnd.tencent.tap": {
    source: "iana",
    extensions: [
      "tap"
    ]
  },
  "image/vnd.valve.source.texture": {
    source: "iana",
    extensions: [
      "vtf"
    ]
  },
  "image/vnd.wap.wbmp": {
    source: "iana",
    extensions: [
      "wbmp"
    ]
  },
  "image/vnd.xiff": {
    source: "iana",
    extensions: [
      "xif"
    ]
  },
  "image/vnd.zbrush.pcx": {
    source: "iana",
    extensions: [
      "pcx"
    ]
  },
  "image/webp": {
    source: "apache",
    extensions: [
      "webp"
    ]
  },
  "image/wmf": {
    source: "iana",
    extensions: [
      "wmf"
    ]
  },
  "image/x-3ds": {
    source: "apache",
    extensions: [
      "3ds"
    ]
  },
  "image/x-cmu-raster": {
    source: "apache",
    extensions: [
      "ras"
    ]
  },
  "image/x-cmx": {
    source: "apache",
    extensions: [
      "cmx"
    ]
  },
  "image/x-freehand": {
    source: "apache",
    extensions: [
      "fh",
      "fhc",
      "fh4",
      "fh5",
      "fh7"
    ]
  },
  "image/x-icon": {
    source: "apache",
    compressible: !0,
    extensions: [
      "ico"
    ]
  },
  "image/x-jng": {
    source: "nginx",
    extensions: [
      "jng"
    ]
  },
  "image/x-mrsid-image": {
    source: "apache",
    extensions: [
      "sid"
    ]
  },
  "image/x-ms-bmp": {
    source: "nginx",
    compressible: !0,
    extensions: [
      "bmp"
    ]
  },
  "image/x-pcx": {
    source: "apache",
    extensions: [
      "pcx"
    ]
  },
  "image/x-pict": {
    source: "apache",
    extensions: [
      "pic",
      "pct"
    ]
  },
  "image/x-portable-anymap": {
    source: "apache",
    extensions: [
      "pnm"
    ]
  },
  "image/x-portable-bitmap": {
    source: "apache",
    extensions: [
      "pbm"
    ]
  },
  "image/x-portable-graymap": {
    source: "apache",
    extensions: [
      "pgm"
    ]
  },
  "image/x-portable-pixmap": {
    source: "apache",
    extensions: [
      "ppm"
    ]
  },
  "image/x-rgb": {
    source: "apache",
    extensions: [
      "rgb"
    ]
  },
  "image/x-tga": {
    source: "apache",
    extensions: [
      "tga"
    ]
  },
  "image/x-xbitmap": {
    source: "apache",
    extensions: [
      "xbm"
    ]
  },
  "image/x-xcf": {
    compressible: !1
  },
  "image/x-xpixmap": {
    source: "apache",
    extensions: [
      "xpm"
    ]
  },
  "image/x-xwindowdump": {
    source: "apache",
    extensions: [
      "xwd"
    ]
  },
  "message/cpim": {
    source: "iana"
  },
  "message/delivery-status": {
    source: "iana"
  },
  "message/disposition-notification": {
    source: "iana",
    extensions: [
      "disposition-notification"
    ]
  },
  "message/external-body": {
    source: "iana"
  },
  "message/feedback-report": {
    source: "iana"
  },
  "message/global": {
    source: "iana",
    extensions: [
      "u8msg"
    ]
  },
  "message/global-delivery-status": {
    source: "iana",
    extensions: [
      "u8dsn"
    ]
  },
  "message/global-disposition-notification": {
    source: "iana",
    extensions: [
      "u8mdn"
    ]
  },
  "message/global-headers": {
    source: "iana",
    extensions: [
      "u8hdr"
    ]
  },
  "message/http": {
    source: "iana",
    compressible: !1
  },
  "message/imdn+xml": {
    source: "iana",
    compressible: !0
  },
  "message/news": {
    source: "iana"
  },
  "message/partial": {
    source: "iana",
    compressible: !1
  },
  "message/rfc822": {
    source: "iana",
    compressible: !0,
    extensions: [
      "eml",
      "mime"
    ]
  },
  "message/s-http": {
    source: "iana"
  },
  "message/sip": {
    source: "iana"
  },
  "message/sipfrag": {
    source: "iana"
  },
  "message/tracking-status": {
    source: "iana"
  },
  "message/vnd.si.simp": {
    source: "iana"
  },
  "message/vnd.wfa.wsc": {
    source: "iana",
    extensions: [
      "wsc"
    ]
  },
  "model/3mf": {
    source: "iana",
    extensions: [
      "3mf"
    ]
  },
  "model/e57": {
    source: "iana"
  },
  "model/gltf+json": {
    source: "iana",
    compressible: !0,
    extensions: [
      "gltf"
    ]
  },
  "model/gltf-binary": {
    source: "iana",
    compressible: !0,
    extensions: [
      "glb"
    ]
  },
  "model/iges": {
    source: "iana",
    compressible: !1,
    extensions: [
      "igs",
      "iges"
    ]
  },
  "model/mesh": {
    source: "iana",
    compressible: !1,
    extensions: [
      "msh",
      "mesh",
      "silo"
    ]
  },
  "model/mtl": {
    source: "iana",
    extensions: [
      "mtl"
    ]
  },
  "model/obj": {
    source: "iana",
    extensions: [
      "obj"
    ]
  },
  "model/step": {
    source: "iana"
  },
  "model/step+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "stpx"
    ]
  },
  "model/step+zip": {
    source: "iana",
    compressible: !1,
    extensions: [
      "stpz"
    ]
  },
  "model/step-xml+zip": {
    source: "iana",
    compressible: !1,
    extensions: [
      "stpxz"
    ]
  },
  "model/stl": {
    source: "iana",
    extensions: [
      "stl"
    ]
  },
  "model/vnd.collada+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "dae"
    ]
  },
  "model/vnd.dwf": {
    source: "iana",
    extensions: [
      "dwf"
    ]
  },
  "model/vnd.flatland.3dml": {
    source: "iana"
  },
  "model/vnd.gdl": {
    source: "iana",
    extensions: [
      "gdl"
    ]
  },
  "model/vnd.gs-gdl": {
    source: "apache"
  },
  "model/vnd.gs.gdl": {
    source: "iana"
  },
  "model/vnd.gtw": {
    source: "iana",
    extensions: [
      "gtw"
    ]
  },
  "model/vnd.moml+xml": {
    source: "iana",
    compressible: !0
  },
  "model/vnd.mts": {
    source: "iana",
    extensions: [
      "mts"
    ]
  },
  "model/vnd.opengex": {
    source: "iana",
    extensions: [
      "ogex"
    ]
  },
  "model/vnd.parasolid.transmit.binary": {
    source: "iana",
    extensions: [
      "x_b"
    ]
  },
  "model/vnd.parasolid.transmit.text": {
    source: "iana",
    extensions: [
      "x_t"
    ]
  },
  "model/vnd.pytha.pyox": {
    source: "iana"
  },
  "model/vnd.rosette.annotated-data-model": {
    source: "iana"
  },
  "model/vnd.sap.vds": {
    source: "iana",
    extensions: [
      "vds"
    ]
  },
  "model/vnd.usdz+zip": {
    source: "iana",
    compressible: !1,
    extensions: [
      "usdz"
    ]
  },
  "model/vnd.valve.source.compiled-map": {
    source: "iana",
    extensions: [
      "bsp"
    ]
  },
  "model/vnd.vtu": {
    source: "iana",
    extensions: [
      "vtu"
    ]
  },
  "model/vrml": {
    source: "iana",
    compressible: !1,
    extensions: [
      "wrl",
      "vrml"
    ]
  },
  "model/x3d+binary": {
    source: "apache",
    compressible: !1,
    extensions: [
      "x3db",
      "x3dbz"
    ]
  },
  "model/x3d+fastinfoset": {
    source: "iana",
    extensions: [
      "x3db"
    ]
  },
  "model/x3d+vrml": {
    source: "apache",
    compressible: !1,
    extensions: [
      "x3dv",
      "x3dvz"
    ]
  },
  "model/x3d+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "x3d",
      "x3dz"
    ]
  },
  "model/x3d-vrml": {
    source: "iana",
    extensions: [
      "x3dv"
    ]
  },
  "multipart/alternative": {
    source: "iana",
    compressible: !1
  },
  "multipart/appledouble": {
    source: "iana"
  },
  "multipart/byteranges": {
    source: "iana"
  },
  "multipart/digest": {
    source: "iana"
  },
  "multipart/encrypted": {
    source: "iana",
    compressible: !1
  },
  "multipart/form-data": {
    source: "iana",
    compressible: !1
  },
  "multipart/header-set": {
    source: "iana"
  },
  "multipart/mixed": {
    source: "iana"
  },
  "multipart/multilingual": {
    source: "iana"
  },
  "multipart/parallel": {
    source: "iana"
  },
  "multipart/related": {
    source: "iana",
    compressible: !1
  },
  "multipart/report": {
    source: "iana"
  },
  "multipart/signed": {
    source: "iana",
    compressible: !1
  },
  "multipart/vnd.bint.med-plus": {
    source: "iana"
  },
  "multipart/voice-message": {
    source: "iana"
  },
  "multipart/x-mixed-replace": {
    source: "iana"
  },
  "text/1d-interleaved-parityfec": {
    source: "iana"
  },
  "text/cache-manifest": {
    source: "iana",
    compressible: !0,
    extensions: [
      "appcache",
      "manifest"
    ]
  },
  "text/calendar": {
    source: "iana",
    extensions: [
      "ics",
      "ifb"
    ]
  },
  "text/calender": {
    compressible: !0
  },
  "text/cmd": {
    compressible: !0
  },
  "text/coffeescript": {
    extensions: [
      "coffee",
      "litcoffee"
    ]
  },
  "text/cql": {
    source: "iana"
  },
  "text/cql-expression": {
    source: "iana"
  },
  "text/cql-identifier": {
    source: "iana"
  },
  "text/css": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "css"
    ]
  },
  "text/csv": {
    source: "iana",
    compressible: !0,
    extensions: [
      "csv"
    ]
  },
  "text/csv-schema": {
    source: "iana"
  },
  "text/directory": {
    source: "iana"
  },
  "text/dns": {
    source: "iana"
  },
  "text/ecmascript": {
    source: "iana"
  },
  "text/encaprtp": {
    source: "iana"
  },
  "text/enriched": {
    source: "iana"
  },
  "text/fhirpath": {
    source: "iana"
  },
  "text/flexfec": {
    source: "iana"
  },
  "text/fwdred": {
    source: "iana"
  },
  "text/gff3": {
    source: "iana"
  },
  "text/grammar-ref-list": {
    source: "iana"
  },
  "text/html": {
    source: "iana",
    compressible: !0,
    extensions: [
      "html",
      "htm",
      "shtml"
    ]
  },
  "text/jade": {
    extensions: [
      "jade"
    ]
  },
  "text/javascript": {
    source: "iana",
    compressible: !0
  },
  "text/jcr-cnd": {
    source: "iana"
  },
  "text/jsx": {
    compressible: !0,
    extensions: [
      "jsx"
    ]
  },
  "text/less": {
    compressible: !0,
    extensions: [
      "less"
    ]
  },
  "text/markdown": {
    source: "iana",
    compressible: !0,
    extensions: [
      "markdown",
      "md"
    ]
  },
  "text/mathml": {
    source: "nginx",
    extensions: [
      "mml"
    ]
  },
  "text/mdx": {
    compressible: !0,
    extensions: [
      "mdx"
    ]
  },
  "text/mizar": {
    source: "iana"
  },
  "text/n3": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "n3"
    ]
  },
  "text/parameters": {
    source: "iana",
    charset: "UTF-8"
  },
  "text/parityfec": {
    source: "iana"
  },
  "text/plain": {
    source: "iana",
    compressible: !0,
    extensions: [
      "txt",
      "text",
      "conf",
      "def",
      "list",
      "log",
      "in",
      "ini"
    ]
  },
  "text/provenance-notation": {
    source: "iana",
    charset: "UTF-8"
  },
  "text/prs.fallenstein.rst": {
    source: "iana"
  },
  "text/prs.lines.tag": {
    source: "iana",
    extensions: [
      "dsc"
    ]
  },
  "text/prs.prop.logic": {
    source: "iana"
  },
  "text/raptorfec": {
    source: "iana"
  },
  "text/red": {
    source: "iana"
  },
  "text/rfc822-headers": {
    source: "iana"
  },
  "text/richtext": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rtx"
    ]
  },
  "text/rtf": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rtf"
    ]
  },
  "text/rtp-enc-aescm128": {
    source: "iana"
  },
  "text/rtploopback": {
    source: "iana"
  },
  "text/rtx": {
    source: "iana"
  },
  "text/sgml": {
    source: "iana",
    extensions: [
      "sgml",
      "sgm"
    ]
  },
  "text/shaclc": {
    source: "iana"
  },
  "text/shex": {
    source: "iana",
    extensions: [
      "shex"
    ]
  },
  "text/slim": {
    extensions: [
      "slim",
      "slm"
    ]
  },
  "text/spdx": {
    source: "iana",
    extensions: [
      "spdx"
    ]
  },
  "text/strings": {
    source: "iana"
  },
  "text/stylus": {
    extensions: [
      "stylus",
      "styl"
    ]
  },
  "text/t140": {
    source: "iana"
  },
  "text/tab-separated-values": {
    source: "iana",
    compressible: !0,
    extensions: [
      "tsv"
    ]
  },
  "text/troff": {
    source: "iana",
    extensions: [
      "t",
      "tr",
      "roff",
      "man",
      "me",
      "ms"
    ]
  },
  "text/turtle": {
    source: "iana",
    charset: "UTF-8",
    extensions: [
      "ttl"
    ]
  },
  "text/ulpfec": {
    source: "iana"
  },
  "text/uri-list": {
    source: "iana",
    compressible: !0,
    extensions: [
      "uri",
      "uris",
      "urls"
    ]
  },
  "text/vcard": {
    source: "iana",
    compressible: !0,
    extensions: [
      "vcard"
    ]
  },
  "text/vnd.a": {
    source: "iana"
  },
  "text/vnd.abc": {
    source: "iana"
  },
  "text/vnd.ascii-art": {
    source: "iana"
  },
  "text/vnd.curl": {
    source: "iana",
    extensions: [
      "curl"
    ]
  },
  "text/vnd.curl.dcurl": {
    source: "apache",
    extensions: [
      "dcurl"
    ]
  },
  "text/vnd.curl.mcurl": {
    source: "apache",
    extensions: [
      "mcurl"
    ]
  },
  "text/vnd.curl.scurl": {
    source: "apache",
    extensions: [
      "scurl"
    ]
  },
  "text/vnd.debian.copyright": {
    source: "iana",
    charset: "UTF-8"
  },
  "text/vnd.dmclientscript": {
    source: "iana"
  },
  "text/vnd.dvb.subtitle": {
    source: "iana",
    extensions: [
      "sub"
    ]
  },
  "text/vnd.esmertec.theme-descriptor": {
    source: "iana",
    charset: "UTF-8"
  },
  "text/vnd.familysearch.gedcom": {
    source: "iana",
    extensions: [
      "ged"
    ]
  },
  "text/vnd.ficlab.flt": {
    source: "iana"
  },
  "text/vnd.fly": {
    source: "iana",
    extensions: [
      "fly"
    ]
  },
  "text/vnd.fmi.flexstor": {
    source: "iana",
    extensions: [
      "flx"
    ]
  },
  "text/vnd.gml": {
    source: "iana"
  },
  "text/vnd.graphviz": {
    source: "iana",
    extensions: [
      "gv"
    ]
  },
  "text/vnd.hans": {
    source: "iana"
  },
  "text/vnd.hgl": {
    source: "iana"
  },
  "text/vnd.in3d.3dml": {
    source: "iana",
    extensions: [
      "3dml"
    ]
  },
  "text/vnd.in3d.spot": {
    source: "iana",
    extensions: [
      "spot"
    ]
  },
  "text/vnd.iptc.newsml": {
    source: "iana"
  },
  "text/vnd.iptc.nitf": {
    source: "iana"
  },
  "text/vnd.latex-z": {
    source: "iana"
  },
  "text/vnd.motorola.reflex": {
    source: "iana"
  },
  "text/vnd.ms-mediapackage": {
    source: "iana"
  },
  "text/vnd.net2phone.commcenter.command": {
    source: "iana"
  },
  "text/vnd.radisys.msml-basic-layout": {
    source: "iana"
  },
  "text/vnd.senx.warpscript": {
    source: "iana"
  },
  "text/vnd.si.uricatalogue": {
    source: "iana"
  },
  "text/vnd.sosi": {
    source: "iana"
  },
  "text/vnd.sun.j2me.app-descriptor": {
    source: "iana",
    charset: "UTF-8",
    extensions: [
      "jad"
    ]
  },
  "text/vnd.trolltech.linguist": {
    source: "iana",
    charset: "UTF-8"
  },
  "text/vnd.wap.si": {
    source: "iana"
  },
  "text/vnd.wap.sl": {
    source: "iana"
  },
  "text/vnd.wap.wml": {
    source: "iana",
    extensions: [
      "wml"
    ]
  },
  "text/vnd.wap.wmlscript": {
    source: "iana",
    extensions: [
      "wmls"
    ]
  },
  "text/vtt": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "vtt"
    ]
  },
  "text/x-asm": {
    source: "apache",
    extensions: [
      "s",
      "asm"
    ]
  },
  "text/x-c": {
    source: "apache",
    extensions: [
      "c",
      "cc",
      "cxx",
      "cpp",
      "h",
      "hh",
      "dic"
    ]
  },
  "text/x-component": {
    source: "nginx",
    extensions: [
      "htc"
    ]
  },
  "text/x-fortran": {
    source: "apache",
    extensions: [
      "f",
      "for",
      "f77",
      "f90"
    ]
  },
  "text/x-gwt-rpc": {
    compressible: !0
  },
  "text/x-handlebars-template": {
    extensions: [
      "hbs"
    ]
  },
  "text/x-java-source": {
    source: "apache",
    extensions: [
      "java"
    ]
  },
  "text/x-jquery-tmpl": {
    compressible: !0
  },
  "text/x-lua": {
    extensions: [
      "lua"
    ]
  },
  "text/x-markdown": {
    compressible: !0,
    extensions: [
      "mkd"
    ]
  },
  "text/x-nfo": {
    source: "apache",
    extensions: [
      "nfo"
    ]
  },
  "text/x-opml": {
    source: "apache",
    extensions: [
      "opml"
    ]
  },
  "text/x-org": {
    compressible: !0,
    extensions: [
      "org"
    ]
  },
  "text/x-pascal": {
    source: "apache",
    extensions: [
      "p",
      "pas"
    ]
  },
  "text/x-processing": {
    compressible: !0,
    extensions: [
      "pde"
    ]
  },
  "text/x-sass": {
    extensions: [
      "sass"
    ]
  },
  "text/x-scss": {
    extensions: [
      "scss"
    ]
  },
  "text/x-setext": {
    source: "apache",
    extensions: [
      "etx"
    ]
  },
  "text/x-sfv": {
    source: "apache",
    extensions: [
      "sfv"
    ]
  },
  "text/x-suse-ymp": {
    compressible: !0,
    extensions: [
      "ymp"
    ]
  },
  "text/x-uuencode": {
    source: "apache",
    extensions: [
      "uu"
    ]
  },
  "text/x-vcalendar": {
    source: "apache",
    extensions: [
      "vcs"
    ]
  },
  "text/x-vcard": {
    source: "apache",
    extensions: [
      "vcf"
    ]
  },
  "text/xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xml"
    ]
  },
  "text/xml-external-parsed-entity": {
    source: "iana"
  },
  "text/yaml": {
    compressible: !0,
    extensions: [
      "yaml",
      "yml"
    ]
  },
  "video/1d-interleaved-parityfec": {
    source: "iana"
  },
  "video/3gpp": {
    source: "iana",
    extensions: [
      "3gp",
      "3gpp"
    ]
  },
  "video/3gpp-tt": {
    source: "iana"
  },
  "video/3gpp2": {
    source: "iana",
    extensions: [
      "3g2"
    ]
  },
  "video/av1": {
    source: "iana"
  },
  "video/bmpeg": {
    source: "iana"
  },
  "video/bt656": {
    source: "iana"
  },
  "video/celb": {
    source: "iana"
  },
  "video/dv": {
    source: "iana"
  },
  "video/encaprtp": {
    source: "iana"
  },
  "video/ffv1": {
    source: "iana"
  },
  "video/flexfec": {
    source: "iana"
  },
  "video/h261": {
    source: "iana",
    extensions: [
      "h261"
    ]
  },
  "video/h263": {
    source: "iana",
    extensions: [
      "h263"
    ]
  },
  "video/h263-1998": {
    source: "iana"
  },
  "video/h263-2000": {
    source: "iana"
  },
  "video/h264": {
    source: "iana",
    extensions: [
      "h264"
    ]
  },
  "video/h264-rcdo": {
    source: "iana"
  },
  "video/h264-svc": {
    source: "iana"
  },
  "video/h265": {
    source: "iana"
  },
  "video/iso.segment": {
    source: "iana",
    extensions: [
      "m4s"
    ]
  },
  "video/jpeg": {
    source: "iana",
    extensions: [
      "jpgv"
    ]
  },
  "video/jpeg2000": {
    source: "iana"
  },
  "video/jpm": {
    source: "apache",
    extensions: [
      "jpm",
      "jpgm"
    ]
  },
  "video/jxsv": {
    source: "iana"
  },
  "video/mj2": {
    source: "iana",
    extensions: [
      "mj2",
      "mjp2"
    ]
  },
  "video/mp1s": {
    source: "iana"
  },
  "video/mp2p": {
    source: "iana"
  },
  "video/mp2t": {
    source: "iana",
    extensions: [
      "ts"
    ]
  },
  "video/mp4": {
    source: "iana",
    compressible: !1,
    extensions: [
      "mp4",
      "mp4v",
      "mpg4"
    ]
  },
  "video/mp4v-es": {
    source: "iana"
  },
  "video/mpeg": {
    source: "iana",
    compressible: !1,
    extensions: [
      "mpeg",
      "mpg",
      "mpe",
      "m1v",
      "m2v"
    ]
  },
  "video/mpeg4-generic": {
    source: "iana"
  },
  "video/mpv": {
    source: "iana"
  },
  "video/nv": {
    source: "iana"
  },
  "video/ogg": {
    source: "iana",
    compressible: !1,
    extensions: [
      "ogv"
    ]
  },
  "video/parityfec": {
    source: "iana"
  },
  "video/pointer": {
    source: "iana"
  },
  "video/quicktime": {
    source: "iana",
    compressible: !1,
    extensions: [
      "qt",
      "mov"
    ]
  },
  "video/raptorfec": {
    source: "iana"
  },
  "video/raw": {
    source: "iana"
  },
  "video/rtp-enc-aescm128": {
    source: "iana"
  },
  "video/rtploopback": {
    source: "iana"
  },
  "video/rtx": {
    source: "iana"
  },
  "video/scip": {
    source: "iana"
  },
  "video/smpte291": {
    source: "iana"
  },
  "video/smpte292m": {
    source: "iana"
  },
  "video/ulpfec": {
    source: "iana"
  },
  "video/vc1": {
    source: "iana"
  },
  "video/vc2": {
    source: "iana"
  },
  "video/vnd.cctv": {
    source: "iana"
  },
  "video/vnd.dece.hd": {
    source: "iana",
    extensions: [
      "uvh",
      "uvvh"
    ]
  },
  "video/vnd.dece.mobile": {
    source: "iana",
    extensions: [
      "uvm",
      "uvvm"
    ]
  },
  "video/vnd.dece.mp4": {
    source: "iana"
  },
  "video/vnd.dece.pd": {
    source: "iana",
    extensions: [
      "uvp",
      "uvvp"
    ]
  },
  "video/vnd.dece.sd": {
    source: "iana",
    extensions: [
      "uvs",
      "uvvs"
    ]
  },
  "video/vnd.dece.video": {
    source: "iana",
    extensions: [
      "uvv",
      "uvvv"
    ]
  },
  "video/vnd.directv.mpeg": {
    source: "iana"
  },
  "video/vnd.directv.mpeg-tts": {
    source: "iana"
  },
  "video/vnd.dlna.mpeg-tts": {
    source: "iana"
  },
  "video/vnd.dvb.file": {
    source: "iana",
    extensions: [
      "dvb"
    ]
  },
  "video/vnd.fvt": {
    source: "iana",
    extensions: [
      "fvt"
    ]
  },
  "video/vnd.hns.video": {
    source: "iana"
  },
  "video/vnd.iptvforum.1dparityfec-1010": {
    source: "iana"
  },
  "video/vnd.iptvforum.1dparityfec-2005": {
    source: "iana"
  },
  "video/vnd.iptvforum.2dparityfec-1010": {
    source: "iana"
  },
  "video/vnd.iptvforum.2dparityfec-2005": {
    source: "iana"
  },
  "video/vnd.iptvforum.ttsavc": {
    source: "iana"
  },
  "video/vnd.iptvforum.ttsmpeg2": {
    source: "iana"
  },
  "video/vnd.motorola.video": {
    source: "iana"
  },
  "video/vnd.motorola.videop": {
    source: "iana"
  },
  "video/vnd.mpegurl": {
    source: "iana",
    extensions: [
      "mxu",
      "m4u"
    ]
  },
  "video/vnd.ms-playready.media.pyv": {
    source: "iana",
    extensions: [
      "pyv"
    ]
  },
  "video/vnd.nokia.interleaved-multimedia": {
    source: "iana"
  },
  "video/vnd.nokia.mp4vr": {
    source: "iana"
  },
  "video/vnd.nokia.videovoip": {
    source: "iana"
  },
  "video/vnd.objectvideo": {
    source: "iana"
  },
  "video/vnd.radgamettools.bink": {
    source: "iana"
  },
  "video/vnd.radgamettools.smacker": {
    source: "iana"
  },
  "video/vnd.sealed.mpeg1": {
    source: "iana"
  },
  "video/vnd.sealed.mpeg4": {
    source: "iana"
  },
  "video/vnd.sealed.swf": {
    source: "iana"
  },
  "video/vnd.sealedmedia.softseal.mov": {
    source: "iana"
  },
  "video/vnd.uvvu.mp4": {
    source: "iana",
    extensions: [
      "uvu",
      "uvvu"
    ]
  },
  "video/vnd.vivo": {
    source: "iana",
    extensions: [
      "viv"
    ]
  },
  "video/vnd.youtube.yt": {
    source: "iana"
  },
  "video/vp8": {
    source: "iana"
  },
  "video/vp9": {
    source: "iana"
  },
  "video/webm": {
    source: "apache",
    compressible: !1,
    extensions: [
      "webm"
    ]
  },
  "video/x-f4v": {
    source: "apache",
    extensions: [
      "f4v"
    ]
  },
  "video/x-fli": {
    source: "apache",
    extensions: [
      "fli"
    ]
  },
  "video/x-flv": {
    source: "apache",
    compressible: !1,
    extensions: [
      "flv"
    ]
  },
  "video/x-m4v": {
    source: "apache",
    extensions: [
      "m4v"
    ]
  },
  "video/x-matroska": {
    source: "apache",
    compressible: !1,
    extensions: [
      "mkv",
      "mk3d",
      "mks"
    ]
  },
  "video/x-mng": {
    source: "apache",
    extensions: [
      "mng"
    ]
  },
  "video/x-ms-asf": {
    source: "apache",
    extensions: [
      "asf",
      "asx"
    ]
  },
  "video/x-ms-vob": {
    source: "apache",
    extensions: [
      "vob"
    ]
  },
  "video/x-ms-wm": {
    source: "apache",
    extensions: [
      "wm"
    ]
  },
  "video/x-ms-wmv": {
    source: "apache",
    compressible: !1,
    extensions: [
      "wmv"
    ]
  },
  "video/x-ms-wmx": {
    source: "apache",
    extensions: [
      "wmx"
    ]
  },
  "video/x-ms-wvx": {
    source: "apache",
    extensions: [
      "wvx"
    ]
  },
  "video/x-msvideo": {
    source: "apache",
    extensions: [
      "avi"
    ]
  },
  "video/x-sgi-movie": {
    source: "apache",
    extensions: [
      "movie"
    ]
  },
  "video/x-smv": {
    source: "apache",
    extensions: [
      "smv"
    ]
  },
  "x-conference/x-cooltalk": {
    source: "apache",
    extensions: [
      "ice"
    ]
  },
  "x-shader/x-fragment": {
    compressible: !0
  },
  "x-shader/x-vertex": {
    compressible: !0
  }
};
/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2022 Douglas Christopher Wilson
 * MIT Licensed
 */
var il = al;
/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
(function(n) {
  var e = il, a = F.extname, i = /^\s*([^;\s]*)(?:;|\s|$)/, t = /^text\//i;
  n.charset = s, n.charsets = { lookup: s }, n.contentType = o, n.extension = r, n.extensions = /* @__PURE__ */ Object.create(null), n.lookup = c, n.types = /* @__PURE__ */ Object.create(null), p(n.extensions, n.types);
  function s(l) {
    if (!l || typeof l != "string")
      return !1;
    var u = i.exec(l), d = u && e[u[1].toLowerCase()];
    return d && d.charset ? d.charset : u && t.test(u[1]) ? "UTF-8" : !1;
  }
  function o(l) {
    if (!l || typeof l != "string")
      return !1;
    var u = l.indexOf("/") === -1 ? n.lookup(l) : l;
    if (!u)
      return !1;
    if (u.indexOf("charset") === -1) {
      var d = n.charset(u);
      d && (u += "; charset=" + d.toLowerCase());
    }
    return u;
  }
  function r(l) {
    if (!l || typeof l != "string")
      return !1;
    var u = i.exec(l), d = u && n.extensions[u[1].toLowerCase()];
    return !d || !d.length ? !1 : d[0];
  }
  function c(l) {
    if (!l || typeof l != "string")
      return !1;
    var u = a("x." + l).toLowerCase().substr(1);
    return u && n.types[u] || !1;
  }
  function p(l, u) {
    var d = ["nginx", "apache", void 0, "iana"];
    Object.keys(e).forEach(function(m) {
      var v = e[m], h = v.extensions;
      if (!(!h || !h.length)) {
        l[m] = h;
        for (var b = 0; b < h.length; b++) {
          var y = h[b];
          if (u[y]) {
            var w = d.indexOf(e[u[y]].source), _ = d.indexOf(v.source);
            if (u[y] !== "application/octet-stream" && (w > _ || w === _ && u[y].substr(0, 12) === "application/"))
              continue;
          }
          u[y] = m;
        }
      }
    });
  }
})(oo);
var tl = sl;
function sl(n) {
  var e = typeof setImmediate == "function" ? setImmediate : typeof process == "object" && typeof process.nextTick == "function" ? process.nextTick : null;
  e ? e(n) : setTimeout(n, 0);
}
var nt = tl, ro = ol;
function ol(n) {
  var e = !1;
  return nt(function() {
    e = !0;
  }), function(i, t) {
    e ? n(i, t) : nt(function() {
      n(i, t);
    });
  };
}
var co = rl;
function rl(n) {
  Object.keys(n.jobs).forEach(cl.bind(n)), n.jobs = {};
}
function cl(n) {
  typeof this.jobs[n] == "function" && this.jobs[n]();
}
var at = ro, pl = co, po = ll;
function ll(n, e, a, i) {
  var t = a.keyedList ? a.keyedList[a.index] : a.index;
  a.jobs[t] = ul(e, t, n[t], function(s, o) {
    t in a.jobs && (delete a.jobs[t], s ? pl(a) : a.results[t] = o, i(s, a.results));
  });
}
function ul(n, e, a, i) {
  var t;
  return n.length == 2 ? t = n(a, at(i)) : t = n(a, e, at(i)), t;
}
var lo = dl;
function dl(n, e) {
  var a = !Array.isArray(n), i = {
    index: 0,
    keyedList: a || e ? Object.keys(n) : null,
    jobs: {},
    results: a ? {} : [],
    size: a ? Object.keys(n).length : n.length
  };
  return e && i.keyedList.sort(a ? e : function(t, s) {
    return e(n[t], n[s]);
  }), i;
}
var ml = co, fl = ro, uo = xl;
function xl(n) {
  Object.keys(this.jobs).length && (this.index = this.size, ml(this), fl(n)(null, this.results));
}
var hl = po, vl = lo, bl = uo, gl = yl;
function yl(n, e, a) {
  for (var i = vl(n); i.index < (i.keyedList || n).length; )
    hl(n, e, i, function(t, s) {
      if (t) {
        a(t, s);
        return;
      }
      if (Object.keys(i.jobs).length === 0) {
        a(null, i.results);
        return;
      }
    }), i.index++;
  return bl.bind(i, a);
}
var la = { exports: {} }, it = po, wl = lo, El = uo;
la.exports = kl;
la.exports.ascending = mo;
la.exports.descending = Sl;
function kl(n, e, a, i) {
  var t = wl(n, a);
  return it(n, e, t, function s(o, r) {
    if (o) {
      i(o, r);
      return;
    }
    if (t.index++, t.index < (t.keyedList || n).length) {
      it(n, e, t, s);
      return;
    }
    i(null, t.results);
  }), El.bind(t, i);
}
function mo(n, e) {
  return n < e ? -1 : n > e ? 1 : 0;
}
function Sl(n, e) {
  return -1 * mo(n, e);
}
var fo = la.exports, _l = fo, Rl = Al;
function Al(n, e, a) {
  return _l(n, e, null, a);
}
var jl = {
  parallel: gl,
  serial: Rl,
  serialOrdered: fo
}, Tl = function(n, e) {
  return Object.keys(e).forEach(function(a) {
    n[a] = n[a] || e[a];
  }), n;
}, Ei = nl, Cl = Se, _a = F, Ol = oi, Pl = ri, $l = Hn.parse, Fl = Ge, Ll = Z.Stream, Ra = oo, Nl = jl, Va = Tl, zl = T;
Cl.inherits(T, Ei);
function T(n) {
  if (!(this instanceof T))
    return new T(n);
  this._overheadLength = 0, this._valueLength = 0, this._valuesToMeasure = [], Ei.call(this), n = n || {};
  for (var e in n)
    this[e] = n[e];
}
T.LINE_BREAK = `\r
`;
T.DEFAULT_CONTENT_TYPE = "application/octet-stream";
T.prototype.append = function(n, e, a) {
  a = a || {}, typeof a == "string" && (a = { filename: a });
  var i = Ei.prototype.append.bind(this);
  if (typeof e == "number" && (e = "" + e), Array.isArray(e)) {
    this._error(new Error("Arrays are not supported."));
    return;
  }
  var t = this._multiPartHeader(n, e, a), s = this._multiPartFooter();
  i(t), i(e), i(s), this._trackLength(t, e, a);
};
T.prototype._trackLength = function(n, e, a) {
  var i = 0;
  a.knownLength != null ? i += +a.knownLength : Buffer.isBuffer(e) ? i = e.length : typeof e == "string" && (i = Buffer.byteLength(e)), this._valueLength += i, this._overheadLength += Buffer.byteLength(n) + T.LINE_BREAK.length, !(!e || !e.path && !(e.readable && e.hasOwnProperty("httpVersion")) && !(e instanceof Ll)) && (a.knownLength || this._valuesToMeasure.push(e));
};
T.prototype._lengthRetriever = function(n, e) {
  n.hasOwnProperty("fd") ? n.end != null && n.end != 1 / 0 && n.start != null ? e(null, n.end + 1 - (n.start ? n.start : 0)) : Fl.stat(n.path, function(a, i) {
    var t;
    if (a) {
      e(a);
      return;
    }
    t = i.size - (n.start ? n.start : 0), e(null, t);
  }) : n.hasOwnProperty("httpVersion") ? e(null, +n.headers["content-length"]) : n.hasOwnProperty("httpModule") ? (n.on("response", function(a) {
    n.pause(), e(null, +a.headers["content-length"]);
  }), n.resume()) : e("Unknown stream");
};
T.prototype._multiPartHeader = function(n, e, a) {
  if (typeof a.header == "string")
    return a.header;
  var i = this._getContentDisposition(e, a), t = this._getContentType(e, a), s = "", o = {
    // add custom disposition as third element or keep it two elements if not
    "Content-Disposition": ["form-data", 'name="' + n + '"'].concat(i || []),
    // if no content type. allow it to be empty array
    "Content-Type": [].concat(t || [])
  };
  typeof a.header == "object" && Va(o, a.header);
  var r;
  for (var c in o)
    o.hasOwnProperty(c) && (r = o[c], r != null && (Array.isArray(r) || (r = [r]), r.length && (s += c + ": " + r.join("; ") + T.LINE_BREAK)));
  return "--" + this.getBoundary() + T.LINE_BREAK + s + T.LINE_BREAK;
};
T.prototype._getContentDisposition = function(n, e) {
  var a, i;
  return typeof e.filepath == "string" ? a = _a.normalize(e.filepath).replace(/\\/g, "/") : e.filename || n.name || n.path ? a = _a.basename(e.filename || n.name || n.path) : n.readable && n.hasOwnProperty("httpVersion") && (a = _a.basename(n.client._httpMessage.path || "")), a && (i = 'filename="' + a + '"'), i;
};
T.prototype._getContentType = function(n, e) {
  var a = e.contentType;
  return !a && n.name && (a = Ra.lookup(n.name)), !a && n.path && (a = Ra.lookup(n.path)), !a && n.readable && n.hasOwnProperty("httpVersion") && (a = n.headers["content-type"]), !a && (e.filepath || e.filename) && (a = Ra.lookup(e.filepath || e.filename)), !a && typeof n == "object" && (a = T.DEFAULT_CONTENT_TYPE), a;
};
T.prototype._multiPartFooter = function() {
  return (function(n) {
    var e = T.LINE_BREAK, a = this._streams.length === 0;
    a && (e += this._lastBoundary()), n(e);
  }).bind(this);
};
T.prototype._lastBoundary = function() {
  return "--" + this.getBoundary() + "--" + T.LINE_BREAK;
};
T.prototype.getHeaders = function(n) {
  var e, a = {
    "content-type": "multipart/form-data; boundary=" + this.getBoundary()
  };
  for (e in n)
    n.hasOwnProperty(e) && (a[e.toLowerCase()] = n[e]);
  return a;
};
T.prototype.setBoundary = function(n) {
  this._boundary = n;
};
T.prototype.getBoundary = function() {
  return this._boundary || this._generateBoundary(), this._boundary;
};
T.prototype.getBuffer = function() {
  for (var n = new Buffer.alloc(0), e = this.getBoundary(), a = 0, i = this._streams.length; a < i; a++)
    typeof this._streams[a] != "function" && (Buffer.isBuffer(this._streams[a]) ? n = Buffer.concat([n, this._streams[a]]) : n = Buffer.concat([n, Buffer.from(this._streams[a])]), (typeof this._streams[a] != "string" || this._streams[a].substring(2, e.length + 2) !== e) && (n = Buffer.concat([n, Buffer.from(T.LINE_BREAK)])));
  return Buffer.concat([n, Buffer.from(this._lastBoundary())]);
};
T.prototype._generateBoundary = function() {
  for (var n = "--------------------------", e = 0; e < 24; e++)
    n += Math.floor(Math.random() * 10).toString(16);
  this._boundary = n;
};
T.prototype.getLengthSync = function() {
  var n = this._overheadLength + this._valueLength;
  return this._streams.length && (n += this._lastBoundary().length), this.hasKnownLength() || this._error(new Error("Cannot calculate proper length in synchronous way.")), n;
};
T.prototype.hasKnownLength = function() {
  var n = !0;
  return this._valuesToMeasure.length && (n = !1), n;
};
T.prototype.getLength = function(n) {
  var e = this._overheadLength + this._valueLength;
  if (this._streams.length && (e += this._lastBoundary().length), !this._valuesToMeasure.length) {
    process.nextTick(n.bind(this, null, e));
    return;
  }
  Nl.parallel(this._valuesToMeasure, this._lengthRetriever, function(a, i) {
    if (a) {
      n(a);
      return;
    }
    i.forEach(function(t) {
      e += t;
    }), n(null, e);
  });
};
T.prototype.submit = function(n, e) {
  var a, i, t = { method: "post" };
  return typeof n == "string" ? (n = $l(n), i = Va({
    port: n.port,
    path: n.pathname,
    host: n.hostname,
    protocol: n.protocol
  }, t)) : (i = Va(n, t), i.port || (i.port = i.protocol == "https:" ? 443 : 80)), i.headers = this.getHeaders(n.headers), i.protocol == "https:" ? a = Pl.request(i) : a = Ol.request(i), this.getLength((function(s, o) {
    if (s && s !== "Unknown stream") {
      this._error(s);
      return;
    }
    if (o && a.setHeader("Content-Length", o), this.pipe(a), e) {
      var r, c = function(p, l) {
        return a.removeListener("error", c), a.removeListener("response", r), e.call(this, p, l);
      };
      r = c.bind(this, null), a.on("error", c), a.on("response", r);
    }
  }).bind(this)), a;
};
T.prototype._error = function(n) {
  this.error || (this.error = n, this.pause(), this.emit("error", n));
};
T.prototype.toString = function() {
  return "[object FormData]";
};
const xo = /* @__PURE__ */ pi(zl);
function Ja(n) {
  return f.isPlainObject(n) || f.isArray(n);
}
function ho(n) {
  return f.endsWith(n, "[]") ? n.slice(0, -2) : n;
}
function tt(n, e, a) {
  return n ? n.concat(e).map(function(t, s) {
    return t = ho(t), !a && s ? "[" + t + "]" : t;
  }).join(a ? "." : "") : e;
}
function Dl(n) {
  return f.isArray(n) && !n.some(Ja);
}
const Bl = f.toFlatObject(f, {}, null, function(e) {
  return /^is[A-Z]/.test(e);
});
function ua(n, e, a) {
  if (!f.isObject(n))
    throw new TypeError("target must be an object");
  e = e || new (xo || FormData)(), a = f.toFlatObject(a, {
    metaTokens: !0,
    dots: !1,
    indexes: !1
  }, !1, function(v, h) {
    return !f.isUndefined(h[v]);
  });
  const i = a.metaTokens, t = a.visitor || l, s = a.dots, o = a.indexes, c = (a.Blob || typeof Blob < "u" && Blob) && f.isSpecCompliantForm(e);
  if (!f.isFunction(t))
    throw new TypeError("visitor must be a function");
  function p(m) {
    if (m === null) return "";
    if (f.isDate(m))
      return m.toISOString();
    if (!c && f.isBlob(m))
      throw new g("Blob is not supported. Use a Buffer instead.");
    return f.isArrayBuffer(m) || f.isTypedArray(m) ? c && typeof Blob == "function" ? new Blob([m]) : Buffer.from(m) : m;
  }
  function l(m, v, h) {
    let b = m;
    if (m && !h && typeof m == "object") {
      if (f.endsWith(v, "{}"))
        v = i ? v : v.slice(0, -2), m = JSON.stringify(m);
      else if (f.isArray(m) && Dl(m) || (f.isFileList(m) || f.endsWith(v, "[]")) && (b = f.toArray(m)))
        return v = ho(v), b.forEach(function(w, _) {
          !(f.isUndefined(w) || w === null) && e.append(
            // eslint-disable-next-line no-nested-ternary
            o === !0 ? tt([v], _, s) : o === null ? v : v + "[]",
            p(w)
          );
        }), !1;
    }
    return Ja(m) ? !0 : (e.append(tt(h, v, s), p(m)), !1);
  }
  const u = [], d = Object.assign(Bl, {
    defaultVisitor: l,
    convertValue: p,
    isVisitable: Ja
  });
  function x(m, v) {
    if (!f.isUndefined(m)) {
      if (u.indexOf(m) !== -1)
        throw Error("Circular reference detected in " + v.join("."));
      u.push(m), f.forEach(m, function(b, y) {
        (!(f.isUndefined(b) || b === null) && t.call(
          e,
          b,
          f.isString(y) ? y.trim() : y,
          v,
          d
        )) === !0 && x(b, v ? v.concat(y) : [y]);
      }), u.pop();
    }
  }
  if (!f.isObject(n))
    throw new TypeError("data must be an object");
  return x(n), e;
}
function st(n) {
  const e = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(n).replace(/[!'()~]|%20|%00/g, function(i) {
    return e[i];
  });
}
function vo(n, e) {
  this._pairs = [], n && ua(n, this, e);
}
const bo = vo.prototype;
bo.append = function(e, a) {
  this._pairs.push([e, a]);
};
bo.toString = function(e) {
  const a = e ? function(i) {
    return e.call(this, i, st);
  } : st;
  return this._pairs.map(function(t) {
    return a(t[0]) + "=" + a(t[1]);
  }, "").join("&");
};
function ql(n) {
  return encodeURIComponent(n).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function ki(n, e, a) {
  if (!e)
    return n;
  const i = a && a.encode || ql, t = a && a.serialize;
  let s;
  if (t ? s = t(e, a) : s = f.isURLSearchParams(e) ? e.toString() : new vo(e, a).toString(i), s) {
    const o = n.indexOf("#");
    o !== -1 && (n = n.slice(0, o)), n += (n.indexOf("?") === -1 ? "?" : "&") + s;
  }
  return n;
}
class ot {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(e, a, i) {
    return this.handlers.push({
      fulfilled: e,
      rejected: a,
      synchronous: i ? i.synchronous : !1,
      runWhen: i ? i.runWhen : null
    }), this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(e) {
    this.handlers[e] && (this.handlers[e] = null);
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    this.handlers && (this.handlers = []);
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(e) {
    f.forEach(this.handlers, function(i) {
      i !== null && e(i);
    });
  }
}
const Si = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1
}, Il = Hn.URLSearchParams, Ul = {
  isNode: !0,
  classes: {
    URLSearchParams: Il,
    FormData: xo,
    Blob: typeof Blob < "u" && Blob || null
  },
  protocols: ["http", "https", "file", "data"]
}, _i = typeof window < "u" && typeof document < "u", Ga = typeof navigator == "object" && navigator || void 0, Ml = _i && (!Ga || ["ReactNative", "NativeScript", "NS"].indexOf(Ga.product) < 0), Hl = typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
self instanceof WorkerGlobalScope && typeof self.importScripts == "function", Wl = _i && window.location.href || "http://localhost", Vl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv: _i,
  hasStandardBrowserEnv: Ml,
  hasStandardBrowserWebWorkerEnv: Hl,
  navigator: Ga,
  origin: Wl
}, Symbol.toStringTag, { value: "Module" })), N = {
  ...Vl,
  ...Ul
};
function Jl(n, e) {
  return ua(n, new N.classes.URLSearchParams(), Object.assign({
    visitor: function(a, i, t, s) {
      return N.isNode && f.isBuffer(a) ? (this.append(i, a.toString("base64")), !1) : s.defaultVisitor.apply(this, arguments);
    }
  }, e));
}
function Gl(n) {
  return f.matchAll(/\w+|\[(\w*)]/g, n).map((e) => e[0] === "[]" ? "" : e[1] || e[0]);
}
function Kl(n) {
  const e = {}, a = Object.keys(n);
  let i;
  const t = a.length;
  let s;
  for (i = 0; i < t; i++)
    s = a[i], e[s] = n[s];
  return e;
}
function go(n) {
  function e(a, i, t, s) {
    let o = a[s++];
    if (o === "__proto__") return !0;
    const r = Number.isFinite(+o), c = s >= a.length;
    return o = !o && f.isArray(t) ? t.length : o, c ? (f.hasOwnProp(t, o) ? t[o] = [t[o], i] : t[o] = i, !r) : ((!t[o] || !f.isObject(t[o])) && (t[o] = []), e(a, i, t[o], s) && f.isArray(t[o]) && (t[o] = Kl(t[o])), !r);
  }
  if (f.isFormData(n) && f.isFunction(n.entries)) {
    const a = {};
    return f.forEachEntry(n, (i, t) => {
      e(Gl(i), t, a, 0);
    }), a;
  }
  return null;
}
function Xl(n, e, a) {
  if (f.isString(n))
    try {
      return (e || JSON.parse)(n), f.trim(n);
    } catch (i) {
      if (i.name !== "SyntaxError")
        throw i;
    }
  return (0, JSON.stringify)(n);
}
const en = {
  transitional: Si,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function(e, a) {
    const i = a.getContentType() || "", t = i.indexOf("application/json") > -1, s = f.isObject(e);
    if (s && f.isHTMLForm(e) && (e = new FormData(e)), f.isFormData(e))
      return t ? JSON.stringify(go(e)) : e;
    if (f.isArrayBuffer(e) || f.isBuffer(e) || f.isStream(e) || f.isFile(e) || f.isBlob(e) || f.isReadableStream(e))
      return e;
    if (f.isArrayBufferView(e))
      return e.buffer;
    if (f.isURLSearchParams(e))
      return a.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), e.toString();
    let r;
    if (s) {
      if (i.indexOf("application/x-www-form-urlencoded") > -1)
        return Jl(e, this.formSerializer).toString();
      if ((r = f.isFileList(e)) || i.indexOf("multipart/form-data") > -1) {
        const c = this.env && this.env.FormData;
        return ua(
          r ? { "files[]": e } : e,
          c && new c(),
          this.formSerializer
        );
      }
    }
    return s || t ? (a.setContentType("application/json", !1), Xl(e)) : e;
  }],
  transformResponse: [function(e) {
    const a = this.transitional || en.transitional, i = a && a.forcedJSONParsing, t = this.responseType === "json";
    if (f.isResponse(e) || f.isReadableStream(e))
      return e;
    if (e && f.isString(e) && (i && !this.responseType || t)) {
      const o = !(a && a.silentJSONParsing) && t;
      try {
        return JSON.parse(e);
      } catch (r) {
        if (o)
          throw r.name === "SyntaxError" ? g.from(r, g.ERR_BAD_RESPONSE, this, null, this.response) : r;
      }
    }
    return e;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: N.classes.FormData,
    Blob: N.classes.Blob
  },
  validateStatus: function(e) {
    return e >= 200 && e < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
f.forEach(["delete", "get", "head", "post", "put", "patch"], (n) => {
  en.headers[n] = {};
});
const Yl = f.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]), Zl = (n) => {
  const e = {};
  let a, i, t;
  return n && n.split(`
`).forEach(function(o) {
    t = o.indexOf(":"), a = o.substring(0, t).trim().toLowerCase(), i = o.substring(t + 1).trim(), !(!a || e[a] && Yl[a]) && (a === "set-cookie" ? e[a] ? e[a].push(i) : e[a] = [i] : e[a] = e[a] ? e[a] + ", " + i : i);
  }), e;
}, rt = Symbol("internals");
function ze(n) {
  return n && String(n).trim().toLowerCase();
}
function Tn(n) {
  return n === !1 || n == null ? n : f.isArray(n) ? n.map(Tn) : String(n);
}
function Ql(n) {
  const e = /* @__PURE__ */ Object.create(null), a = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let i;
  for (; i = a.exec(n); )
    e[i[1]] = i[2];
  return e;
}
const eu = (n) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(n.trim());
function Aa(n, e, a, i, t) {
  if (f.isFunction(i))
    return i.call(this, e, a);
  if (t && (e = a), !!f.isString(e)) {
    if (f.isString(i))
      return e.indexOf(i) !== -1;
    if (f.isRegExp(i))
      return i.test(e);
  }
}
function nu(n) {
  return n.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (e, a, i) => a.toUpperCase() + i);
}
function au(n, e) {
  const a = f.toCamelCase(" " + e);
  ["get", "set", "has"].forEach((i) => {
    Object.defineProperty(n, i + a, {
      value: function(t, s, o) {
        return this[i].call(this, e, t, s, o);
      },
      configurable: !0
    });
  });
}
class D {
  constructor(e) {
    e && this.set(e);
  }
  set(e, a, i) {
    const t = this;
    function s(r, c, p) {
      const l = ze(c);
      if (!l)
        throw new Error("header name must be a non-empty string");
      const u = f.findKey(t, l);
      (!u || t[u] === void 0 || p === !0 || p === void 0 && t[u] !== !1) && (t[u || c] = Tn(r));
    }
    const o = (r, c) => f.forEach(r, (p, l) => s(p, l, c));
    if (f.isPlainObject(e) || e instanceof this.constructor)
      o(e, a);
    else if (f.isString(e) && (e = e.trim()) && !eu(e))
      o(Zl(e), a);
    else if (f.isHeaders(e))
      for (const [r, c] of e.entries())
        s(c, r, i);
    else
      e != null && s(a, e, i);
    return this;
  }
  get(e, a) {
    if (e = ze(e), e) {
      const i = f.findKey(this, e);
      if (i) {
        const t = this[i];
        if (!a)
          return t;
        if (a === !0)
          return Ql(t);
        if (f.isFunction(a))
          return a.call(this, t, i);
        if (f.isRegExp(a))
          return a.exec(t);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(e, a) {
    if (e = ze(e), e) {
      const i = f.findKey(this, e);
      return !!(i && this[i] !== void 0 && (!a || Aa(this, this[i], i, a)));
    }
    return !1;
  }
  delete(e, a) {
    const i = this;
    let t = !1;
    function s(o) {
      if (o = ze(o), o) {
        const r = f.findKey(i, o);
        r && (!a || Aa(i, i[r], r, a)) && (delete i[r], t = !0);
      }
    }
    return f.isArray(e) ? e.forEach(s) : s(e), t;
  }
  clear(e) {
    const a = Object.keys(this);
    let i = a.length, t = !1;
    for (; i--; ) {
      const s = a[i];
      (!e || Aa(this, this[s], s, e, !0)) && (delete this[s], t = !0);
    }
    return t;
  }
  normalize(e) {
    const a = this, i = {};
    return f.forEach(this, (t, s) => {
      const o = f.findKey(i, s);
      if (o) {
        a[o] = Tn(t), delete a[s];
        return;
      }
      const r = e ? nu(s) : String(s).trim();
      r !== s && delete a[s], a[r] = Tn(t), i[r] = !0;
    }), this;
  }
  concat(...e) {
    return this.constructor.concat(this, ...e);
  }
  toJSON(e) {
    const a = /* @__PURE__ */ Object.create(null);
    return f.forEach(this, (i, t) => {
      i != null && i !== !1 && (a[t] = e && f.isArray(i) ? i.join(", ") : i);
    }), a;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([e, a]) => e + ": " + a).join(`
`);
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(e) {
    return e instanceof this ? e : new this(e);
  }
  static concat(e, ...a) {
    const i = new this(e);
    return a.forEach((t) => i.set(t)), i;
  }
  static accessor(e) {
    const i = (this[rt] = this[rt] = {
      accessors: {}
    }).accessors, t = this.prototype;
    function s(o) {
      const r = ze(o);
      i[r] || (au(t, o), i[r] = !0);
    }
    return f.isArray(e) ? e.forEach(s) : s(e), this;
  }
}
D.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
f.reduceDescriptors(D.prototype, ({ value: n }, e) => {
  let a = e[0].toUpperCase() + e.slice(1);
  return {
    get: () => n,
    set(i) {
      this[a] = i;
    }
  };
});
f.freezeMethods(D);
function ja(n, e) {
  const a = this || en, i = e || a, t = D.from(i.headers);
  let s = i.data;
  return f.forEach(n, function(r) {
    s = r.call(a, s, t.normalize(), e ? e.status : void 0);
  }), t.normalize(), s;
}
function yo(n) {
  return !!(n && n.__CANCEL__);
}
function xe(n, e, a) {
  g.call(this, n ?? "canceled", g.ERR_CANCELED, e, a), this.name = "CanceledError";
}
f.inherits(xe, g, {
  __CANCEL__: !0
});
function Re(n, e, a) {
  const i = a.config.validateStatus;
  !a.status || !i || i(a.status) ? n(a) : e(new g(
    "Request failed with status code " + a.status,
    [g.ERR_BAD_REQUEST, g.ERR_BAD_RESPONSE][Math.floor(a.status / 100) - 4],
    a.config,
    a.request,
    a
  ));
}
function iu(n) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(n);
}
function tu(n, e) {
  return e ? n.replace(/\/?\/$/, "") + "/" + e.replace(/^\/+/, "") : n;
}
function Ri(n, e) {
  return n && !iu(e) ? tu(n, e) : e;
}
var su = Hn.parse, ou = {
  ftp: 21,
  gopher: 70,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
}, ru = String.prototype.endsWith || function(n) {
  return n.length <= this.length && this.indexOf(n, this.length - n.length) !== -1;
};
function cu(n) {
  var e = typeof n == "string" ? su(n) : n || {}, a = e.protocol, i = e.host, t = e.port;
  if (typeof i != "string" || !i || typeof a != "string" || (a = a.split(":", 1)[0], i = i.replace(/:\d*$/, ""), t = parseInt(t) || ou[a] || 0, !pu(i, t)))
    return "";
  var s = Ae("npm_config_" + a + "_proxy") || Ae(a + "_proxy") || Ae("npm_config_proxy") || Ae("all_proxy");
  return s && s.indexOf("://") === -1 && (s = a + "://" + s), s;
}
function pu(n, e) {
  var a = (Ae("npm_config_no_proxy") || Ae("no_proxy")).toLowerCase();
  return a ? a === "*" ? !1 : a.split(/[,\s]/).every(function(i) {
    if (!i)
      return !0;
    var t = i.match(/^(.+):(\d+)$/), s = t ? t[1] : i, o = t ? parseInt(t[2]) : 0;
    return o && o !== e ? !0 : /^[.*]/.test(s) ? (s.charAt(0) === "*" && (s = s.slice(1)), !ru.call(n, s)) : n !== s;
  }) : !0;
}
function Ae(n) {
  return process.env[n.toLowerCase()] || process.env[n.toUpperCase()] || "";
}
var lu = cu, Ai = { exports: {} }, En = { exports: {} }, kn = { exports: {} }, Ta, ct;
function uu() {
  if (ct) return Ta;
  ct = 1;
  var n = 1e3, e = n * 60, a = e * 60, i = a * 24, t = i * 7, s = i * 365.25;
  Ta = function(l, u) {
    u = u || {};
    var d = typeof l;
    if (d === "string" && l.length > 0)
      return o(l);
    if (d === "number" && isFinite(l))
      return u.long ? c(l) : r(l);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(l)
    );
  };
  function o(l) {
    if (l = String(l), !(l.length > 100)) {
      var u = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        l
      );
      if (u) {
        var d = parseFloat(u[1]), x = (u[2] || "ms").toLowerCase();
        switch (x) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return d * s;
          case "weeks":
          case "week":
          case "w":
            return d * t;
          case "days":
          case "day":
          case "d":
            return d * i;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return d * a;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return d * e;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return d * n;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return d;
          default:
            return;
        }
      }
    }
  }
  function r(l) {
    var u = Math.abs(l);
    return u >= i ? Math.round(l / i) + "d" : u >= a ? Math.round(l / a) + "h" : u >= e ? Math.round(l / e) + "m" : u >= n ? Math.round(l / n) + "s" : l + "ms";
  }
  function c(l) {
    var u = Math.abs(l);
    return u >= i ? p(l, u, i, "day") : u >= a ? p(l, u, a, "hour") : u >= e ? p(l, u, e, "minute") : u >= n ? p(l, u, n, "second") : l + " ms";
  }
  function p(l, u, d, x) {
    var m = u >= d * 1.5;
    return Math.round(l / d) + " " + x + (m ? "s" : "");
  }
  return Ta;
}
var Ca, pt;
function wo() {
  if (pt) return Ca;
  pt = 1;
  function n(e) {
    i.debug = i, i.default = i, i.coerce = p, i.disable = o, i.enable = s, i.enabled = r, i.humanize = uu(), i.destroy = l, Object.keys(e).forEach((u) => {
      i[u] = e[u];
    }), i.names = [], i.skips = [], i.formatters = {};
    function a(u) {
      let d = 0;
      for (let x = 0; x < u.length; x++)
        d = (d << 5) - d + u.charCodeAt(x), d |= 0;
      return i.colors[Math.abs(d) % i.colors.length];
    }
    i.selectColor = a;
    function i(u) {
      let d, x = null, m, v;
      function h(...b) {
        if (!h.enabled)
          return;
        const y = h, w = Number(/* @__PURE__ */ new Date()), _ = w - (d || w);
        y.diff = _, y.prev = d, y.curr = w, d = w, b[0] = i.coerce(b[0]), typeof b[0] != "string" && b.unshift("%O");
        let k = 0;
        b[0] = b[0].replace(/%([a-zA-Z%])/g, (E, R) => {
          if (E === "%%")
            return "%";
          k++;
          const j = i.formatters[R];
          if (typeof j == "function") {
            const V = b[k];
            E = j.call(y, V), b.splice(k, 1), k--;
          }
          return E;
        }), i.formatArgs.call(y, b), (y.log || i.log).apply(y, b);
      }
      return h.namespace = u, h.useColors = i.useColors(), h.color = i.selectColor(u), h.extend = t, h.destroy = i.destroy, Object.defineProperty(h, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => x !== null ? x : (m !== i.namespaces && (m = i.namespaces, v = i.enabled(u)), v),
        set: (b) => {
          x = b;
        }
      }), typeof i.init == "function" && i.init(h), h;
    }
    function t(u, d) {
      const x = i(this.namespace + (typeof d > "u" ? ":" : d) + u);
      return x.log = this.log, x;
    }
    function s(u) {
      i.save(u), i.namespaces = u, i.names = [], i.skips = [];
      let d;
      const x = (typeof u == "string" ? u : "").split(/[\s,]+/), m = x.length;
      for (d = 0; d < m; d++)
        x[d] && (u = x[d].replace(/\*/g, ".*?"), u[0] === "-" ? i.skips.push(new RegExp("^" + u.slice(1) + "$")) : i.names.push(new RegExp("^" + u + "$")));
    }
    function o() {
      const u = [
        ...i.names.map(c),
        ...i.skips.map(c).map((d) => "-" + d)
      ].join(",");
      return i.enable(""), u;
    }
    function r(u) {
      if (u[u.length - 1] === "*")
        return !0;
      let d, x;
      for (d = 0, x = i.skips.length; d < x; d++)
        if (i.skips[d].test(u))
          return !1;
      for (d = 0, x = i.names.length; d < x; d++)
        if (i.names[d].test(u))
          return !0;
      return !1;
    }
    function c(u) {
      return u.toString().substring(2, u.toString().length - 2).replace(/\.\*\?$/, "*");
    }
    function p(u) {
      return u instanceof Error ? u.stack || u.message : u;
    }
    function l() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return i.enable(i.load()), i;
  }
  return Ca = n, Ca;
}
var lt;
function du() {
  return lt || (lt = 1, function(n, e) {
    e.formatArgs = i, e.save = t, e.load = s, e.useColors = a, e.storage = o(), e.destroy = /* @__PURE__ */ (() => {
      let c = !1;
      return () => {
        c || (c = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), e.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function a() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let c;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (c = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(c[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function i(c) {
      if (c[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + c[0] + (this.useColors ? "%c " : " ") + "+" + n.exports.humanize(this.diff), !this.useColors)
        return;
      const p = "color: " + this.color;
      c.splice(1, 0, p, "color: inherit");
      let l = 0, u = 0;
      c[0].replace(/%[a-zA-Z%]/g, (d) => {
        d !== "%%" && (l++, d === "%c" && (u = l));
      }), c.splice(u, 0, p);
    }
    e.log = console.debug || console.log || (() => {
    });
    function t(c) {
      try {
        c ? e.storage.setItem("debug", c) : e.storage.removeItem("debug");
      } catch {
      }
    }
    function s() {
      let c;
      try {
        c = e.storage.getItem("debug");
      } catch {
      }
      return !c && typeof process < "u" && "env" in process && (c = process.env.DEBUG), c;
    }
    function o() {
      try {
        return localStorage;
      } catch {
      }
    }
    n.exports = wo()(e);
    const { formatters: r } = n.exports;
    r.j = function(c) {
      try {
        return JSON.stringify(c);
      } catch (p) {
        return "[UnexpectedJSONParseError]: " + p.message;
      }
    };
  }(kn, kn.exports)), kn.exports;
}
var Sn = { exports: {} }, Oa, ut;
function mu() {
  return ut || (ut = 1, Oa = (n, e = process.argv) => {
    const a = n.startsWith("-") ? "" : n.length === 1 ? "-" : "--", i = e.indexOf(a + n), t = e.indexOf("--");
    return i !== -1 && (t === -1 || i < t);
  }), Oa;
}
var Pa, dt;
function fu() {
  if (dt) return Pa;
  dt = 1;
  const n = Ft, e = ci, a = mu(), { env: i } = process;
  let t;
  a("no-color") || a("no-colors") || a("color=false") || a("color=never") ? t = 0 : (a("color") || a("colors") || a("color=true") || a("color=always")) && (t = 1), "FORCE_COLOR" in i && (i.FORCE_COLOR === "true" ? t = 1 : i.FORCE_COLOR === "false" ? t = 0 : t = i.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(i.FORCE_COLOR, 10), 3));
  function s(c) {
    return c === 0 ? !1 : {
      level: c,
      hasBasic: !0,
      has256: c >= 2,
      has16m: c >= 3
    };
  }
  function o(c, p) {
    if (t === 0)
      return 0;
    if (a("color=16m") || a("color=full") || a("color=truecolor"))
      return 3;
    if (a("color=256"))
      return 2;
    if (c && !p && t === void 0)
      return 0;
    const l = t || 0;
    if (i.TERM === "dumb")
      return l;
    if (process.platform === "win32") {
      const u = n.release().split(".");
      return Number(u[0]) >= 10 && Number(u[2]) >= 10586 ? Number(u[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in i)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((u) => u in i) || i.CI_NAME === "codeship" ? 1 : l;
    if ("TEAMCITY_VERSION" in i)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(i.TEAMCITY_VERSION) ? 1 : 0;
    if (i.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in i) {
      const u = parseInt((i.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (i.TERM_PROGRAM) {
        case "iTerm.app":
          return u >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(i.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(i.TERM) || "COLORTERM" in i ? 1 : l;
  }
  function r(c) {
    const p = o(c, c && c.isTTY);
    return s(p);
  }
  return Pa = {
    supportsColor: r,
    stdout: s(o(!0, e.isatty(1))),
    stderr: s(o(!0, e.isatty(2)))
  }, Pa;
}
var mt;
function xu() {
  return mt || (mt = 1, function(n, e) {
    const a = ci, i = Se;
    e.init = l, e.log = r, e.formatArgs = s, e.save = c, e.load = p, e.useColors = t, e.destroy = i.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), e.colors = [6, 2, 3, 4, 5, 1];
    try {
      const d = fu();
      d && (d.stderr || d).level >= 2 && (e.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    e.inspectOpts = Object.keys(process.env).filter((d) => /^debug_/i.test(d)).reduce((d, x) => {
      const m = x.substring(6).toLowerCase().replace(/_([a-z])/g, (h, b) => b.toUpperCase());
      let v = process.env[x];
      return /^(yes|on|true|enabled)$/i.test(v) ? v = !0 : /^(no|off|false|disabled)$/i.test(v) ? v = !1 : v === "null" ? v = null : v = Number(v), d[m] = v, d;
    }, {});
    function t() {
      return "colors" in e.inspectOpts ? !!e.inspectOpts.colors : a.isatty(process.stderr.fd);
    }
    function s(d) {
      const { namespace: x, useColors: m } = this;
      if (m) {
        const v = this.color, h = "\x1B[3" + (v < 8 ? v : "8;5;" + v), b = `  ${h};1m${x} \x1B[0m`;
        d[0] = b + d[0].split(`
`).join(`
` + b), d.push(h + "m+" + n.exports.humanize(this.diff) + "\x1B[0m");
      } else
        d[0] = o() + x + " " + d[0];
    }
    function o() {
      return e.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function r(...d) {
      return process.stderr.write(i.formatWithOptions(e.inspectOpts, ...d) + `
`);
    }
    function c(d) {
      d ? process.env.DEBUG = d : delete process.env.DEBUG;
    }
    function p() {
      return process.env.DEBUG;
    }
    function l(d) {
      d.inspectOpts = {};
      const x = Object.keys(e.inspectOpts);
      for (let m = 0; m < x.length; m++)
        d.inspectOpts[x[m]] = e.inspectOpts[x[m]];
    }
    n.exports = wo()(e);
    const { formatters: u } = n.exports;
    u.o = function(d) {
      return this.inspectOpts.colors = this.useColors, i.inspect(d, this.inspectOpts).split(`
`).map((x) => x.trim()).join(" ");
    }, u.O = function(d) {
      return this.inspectOpts.colors = this.useColors, i.inspect(d, this.inspectOpts);
    };
  }(Sn, Sn.exports)), Sn.exports;
}
var ft;
function hu() {
  return ft || (ft = 1, typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? En.exports = du() : En.exports = xu()), En.exports;
}
var De, vu = function() {
  if (!De) {
    try {
      De = hu()("follow-redirects");
    } catch {
    }
    typeof De != "function" && (De = function() {
    });
  }
  De.apply(null, arguments);
}, nn = Hn, Ve = nn.URL, bu = oi, gu = ri, ji = Z.Writable, Ti = Ho, Eo = vu;
(function() {
  var e = typeof process < "u", a = typeof window < "u" && typeof document < "u", i = Ee(Error.captureStackTrace);
  !e && (a || !i) && console.warn("The follow-redirects package should be excluded from browser builds.");
})();
var Ci = !1;
try {
  Ti(new Ve(""));
} catch (n) {
  Ci = n.code === "ERR_INVALID_URL";
}
var yu = [
  "auth",
  "host",
  "hostname",
  "href",
  "path",
  "pathname",
  "port",
  "protocol",
  "query",
  "search",
  "hash"
], Oi = ["abort", "aborted", "connect", "error", "socket", "timeout"], Pi = /* @__PURE__ */ Object.create(null);
Oi.forEach(function(n) {
  Pi[n] = function(e, a, i) {
    this._redirectable.emit(n, e, a, i);
  };
});
var Ka = an(
  "ERR_INVALID_URL",
  "Invalid URL",
  TypeError
), Xa = an(
  "ERR_FR_REDIRECTION_FAILURE",
  "Redirected request failed"
), wu = an(
  "ERR_FR_TOO_MANY_REDIRECTS",
  "Maximum number of redirects exceeded",
  Xa
), Eu = an(
  "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
  "Request body larger than maxBodyLength limit"
), ku = an(
  "ERR_STREAM_WRITE_AFTER_END",
  "write after end"
), Su = ji.prototype.destroy || So;
function W(n, e) {
  ji.call(this), this._sanitizeOptions(n), this._options = n, this._ended = !1, this._ending = !1, this._redirectCount = 0, this._redirects = [], this._requestBodyLength = 0, this._requestBodyBuffers = [], e && this.on("response", e);
  var a = this;
  this._onNativeResponse = function(i) {
    try {
      a._processResponse(i);
    } catch (t) {
      a.emit("error", t instanceof Xa ? t : new Xa({ cause: t }));
    }
  }, this._performRequest();
}
W.prototype = Object.create(ji.prototype);
W.prototype.abort = function() {
  Fi(this._currentRequest), this._currentRequest.abort(), this.emit("abort");
};
W.prototype.destroy = function(n) {
  return Fi(this._currentRequest, n), Su.call(this, n), this;
};
W.prototype.write = function(n, e, a) {
  if (this._ending)
    throw new ku();
  if (!ge(n) && !Au(n))
    throw new TypeError("data should be a string, Buffer or Uint8Array");
  if (Ee(e) && (a = e, e = null), n.length === 0) {
    a && a();
    return;
  }
  this._requestBodyLength + n.length <= this._options.maxBodyLength ? (this._requestBodyLength += n.length, this._requestBodyBuffers.push({ data: n, encoding: e }), this._currentRequest.write(n, e, a)) : (this.emit("error", new Eu()), this.abort());
};
W.prototype.end = function(n, e, a) {
  if (Ee(n) ? (a = n, n = e = null) : Ee(e) && (a = e, e = null), !n)
    this._ended = this._ending = !0, this._currentRequest.end(null, null, a);
  else {
    var i = this, t = this._currentRequest;
    this.write(n, e, function() {
      i._ended = !0, t.end(null, null, a);
    }), this._ending = !0;
  }
};
W.prototype.setHeader = function(n, e) {
  this._options.headers[n] = e, this._currentRequest.setHeader(n, e);
};
W.prototype.removeHeader = function(n) {
  delete this._options.headers[n], this._currentRequest.removeHeader(n);
};
W.prototype.setTimeout = function(n, e) {
  var a = this;
  function i(o) {
    o.setTimeout(n), o.removeListener("timeout", o.destroy), o.addListener("timeout", o.destroy);
  }
  function t(o) {
    a._timeout && clearTimeout(a._timeout), a._timeout = setTimeout(function() {
      a.emit("timeout"), s();
    }, n), i(o);
  }
  function s() {
    a._timeout && (clearTimeout(a._timeout), a._timeout = null), a.removeListener("abort", s), a.removeListener("error", s), a.removeListener("response", s), a.removeListener("close", s), e && a.removeListener("timeout", e), a.socket || a._currentRequest.removeListener("socket", t);
  }
  return e && this.on("timeout", e), this.socket ? t(this.socket) : this._currentRequest.once("socket", t), this.on("socket", i), this.on("abort", s), this.on("error", s), this.on("response", s), this.on("close", s), this;
};
[
  "flushHeaders",
  "getHeader",
  "setNoDelay",
  "setSocketKeepAlive"
].forEach(function(n) {
  W.prototype[n] = function(e, a) {
    return this._currentRequest[n](e, a);
  };
});
["aborted", "connection", "socket"].forEach(function(n) {
  Object.defineProperty(W.prototype, n, {
    get: function() {
      return this._currentRequest[n];
    }
  });
});
W.prototype._sanitizeOptions = function(n) {
  if (n.headers || (n.headers = {}), n.host && (n.hostname || (n.hostname = n.host), delete n.host), !n.pathname && n.path) {
    var e = n.path.indexOf("?");
    e < 0 ? n.pathname = n.path : (n.pathname = n.path.substring(0, e), n.search = n.path.substring(e));
  }
};
W.prototype._performRequest = function() {
  var n = this._options.protocol, e = this._options.nativeProtocols[n];
  if (!e)
    throw new TypeError("Unsupported protocol " + n);
  if (this._options.agents) {
    var a = n.slice(0, -1);
    this._options.agent = this._options.agents[a];
  }
  var i = this._currentRequest = e.request(this._options, this._onNativeResponse);
  i._redirectable = this;
  for (var t of Oi)
    i.on(t, Pi[t]);
  if (this._currentUrl = /^\//.test(this._options.path) ? nn.format(this._options) : (
    // When making a request to a proxy, […]
    // a client MUST send the target URI in absolute-form […].
    this._options.path
  ), this._isRedirect) {
    var s = 0, o = this, r = this._requestBodyBuffers;
    (function c(p) {
      if (i === o._currentRequest)
        if (p)
          o.emit("error", p);
        else if (s < r.length) {
          var l = r[s++];
          i.finished || i.write(l.data, l.encoding, c);
        } else o._ended && i.end();
    })();
  }
};
W.prototype._processResponse = function(n) {
  var e = n.statusCode;
  this._options.trackRedirects && this._redirects.push({
    url: this._currentUrl,
    headers: n.headers,
    statusCode: e
  });
  var a = n.headers.location;
  if (!a || this._options.followRedirects === !1 || e < 300 || e >= 400) {
    n.responseUrl = this._currentUrl, n.redirects = this._redirects, this.emit("response", n), this._requestBodyBuffers = [];
    return;
  }
  if (Fi(this._currentRequest), n.destroy(), ++this._redirectCount > this._options.maxRedirects)
    throw new wu();
  var i, t = this._options.beforeRedirect;
  t && (i = Object.assign({
    // The Host header was set by nativeProtocol.request
    Host: n.req.getHeader("host")
  }, this._options.headers));
  var s = this._options.method;
  ((e === 301 || e === 302) && this._options.method === "POST" || // RFC7231§6.4.4: The 303 (See Other) status code indicates that
  // the server is redirecting the user agent to a different resource […]
  // A user agent can perform a retrieval request targeting that URI
  // (a GET or HEAD request if using HTTP) […]
  e === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) && (this._options.method = "GET", this._requestBodyBuffers = [], $a(/^content-/i, this._options.headers));
  var o = $a(/^host$/i, this._options.headers), r = $i(this._currentUrl), c = o || r.host, p = /^\w+:/.test(a) ? this._currentUrl : nn.format(Object.assign(r, { host: c })), l = _u(a, p);
  if (Eo("redirecting to", l.href), this._isRedirect = !0, Ya(l, this._options), (l.protocol !== r.protocol && l.protocol !== "https:" || l.host !== c && !Ru(l.host, c)) && $a(/^(?:(?:proxy-)?authorization|cookie)$/i, this._options.headers), Ee(t)) {
    var u = {
      headers: n.headers,
      statusCode: e
    }, d = {
      url: p,
      method: s,
      headers: i
    };
    t(this._options, u, d), this._sanitizeOptions(this._options);
  }
  this._performRequest();
};
function ko(n) {
  var e = {
    maxRedirects: 21,
    maxBodyLength: 10485760
  }, a = {};
  return Object.keys(n).forEach(function(i) {
    var t = i + ":", s = a[t] = n[i], o = e[i] = Object.create(s);
    function r(p, l, u) {
      return ju(p) ? p = Ya(p) : ge(p) ? p = Ya($i(p)) : (u = l, l = _o(p), p = { protocol: t }), Ee(l) && (u = l, l = null), l = Object.assign({
        maxRedirects: e.maxRedirects,
        maxBodyLength: e.maxBodyLength
      }, p, l), l.nativeProtocols = a, !ge(l.host) && !ge(l.hostname) && (l.hostname = "::1"), Ti.equal(l.protocol, t, "protocol mismatch"), Eo("options", l), new W(l, u);
    }
    function c(p, l, u) {
      var d = o.request(p, l, u);
      return d.end(), d;
    }
    Object.defineProperties(o, {
      request: { value: r, configurable: !0, enumerable: !0, writable: !0 },
      get: { value: c, configurable: !0, enumerable: !0, writable: !0 }
    });
  }), e;
}
function So() {
}
function $i(n) {
  var e;
  if (Ci)
    e = new Ve(n);
  else if (e = _o(nn.parse(n)), !ge(e.protocol))
    throw new Ka({ input: n });
  return e;
}
function _u(n, e) {
  return Ci ? new Ve(n, e) : $i(nn.resolve(e, n));
}
function _o(n) {
  if (/^\[/.test(n.hostname) && !/^\[[:0-9a-f]+\]$/i.test(n.hostname))
    throw new Ka({ input: n.href || n });
  if (/^\[/.test(n.host) && !/^\[[:0-9a-f]+\](:\d+)?$/i.test(n.host))
    throw new Ka({ input: n.href || n });
  return n;
}
function Ya(n, e) {
  var a = e || {};
  for (var i of yu)
    a[i] = n[i];
  return a.hostname.startsWith("[") && (a.hostname = a.hostname.slice(1, -1)), a.port !== "" && (a.port = Number(a.port)), a.path = a.search ? a.pathname + a.search : a.pathname, a;
}
function $a(n, e) {
  var a;
  for (var i in e)
    n.test(i) && (a = e[i], delete e[i]);
  return a === null || typeof a > "u" ? void 0 : String(a).trim();
}
function an(n, e, a) {
  function i(t) {
    Ee(Error.captureStackTrace) && Error.captureStackTrace(this, this.constructor), Object.assign(this, t || {}), this.code = n, this.message = this.cause ? e + ": " + this.cause.message : e;
  }
  return i.prototype = new (a || Error)(), Object.defineProperties(i.prototype, {
    constructor: {
      value: i,
      enumerable: !1
    },
    name: {
      value: "Error [" + n + "]",
      enumerable: !1
    }
  }), i;
}
function Fi(n, e) {
  for (var a of Oi)
    n.removeListener(a, Pi[a]);
  n.on("error", So), n.destroy(e);
}
function Ru(n, e) {
  Ti(ge(n) && ge(e));
  var a = n.length - e.length - 1;
  return a > 0 && n[a] === "." && n.endsWith(e);
}
function ge(n) {
  return typeof n == "string" || n instanceof String;
}
function Ee(n) {
  return typeof n == "function";
}
function Au(n) {
  return typeof n == "object" && "length" in n;
}
function ju(n) {
  return Ve && n instanceof Ve;
}
Ai.exports = ko({ http: bu, https: gu });
Ai.exports.wrap = ko;
var Tu = Ai.exports;
const Cu = /* @__PURE__ */ pi(Tu), qn = "1.7.7";
function Ro(n) {
  const e = /^([-+\w]{1,25})(:?\/\/|:)/.exec(n);
  return e && e[1] || "";
}
const Ou = /^(?:([^;]+);)?(?:[^;]+;)?(base64|),([\s\S]*)$/;
function Pu(n, e, a) {
  const i = a && a.Blob || N.classes.Blob, t = Ro(n);
  if (e === void 0 && i && (e = !0), t === "data") {
    n = t.length ? n.slice(t.length + 1) : n;
    const s = Ou.exec(n);
    if (!s)
      throw new g("Invalid URL", g.ERR_INVALID_URL);
    const o = s[1], r = s[2], c = s[3], p = Buffer.from(decodeURIComponent(c), r ? "base64" : "utf8");
    if (e) {
      if (!i)
        throw new g("Blob is not supported", g.ERR_NOT_SUPPORT);
      return new i([p], { type: o });
    }
    return p;
  }
  throw new g("Unsupported protocol " + t, g.ERR_NOT_SUPPORT);
}
const Fa = Symbol("internals");
class xt extends Z.Transform {
  constructor(e) {
    e = f.toFlatObject(e, {
      maxRate: 0,
      chunkSize: 64 * 1024,
      minChunkSize: 100,
      timeWindow: 500,
      ticksRate: 2,
      samplesCount: 15
    }, null, (i, t) => !f.isUndefined(t[i])), super({
      readableHighWaterMark: e.chunkSize
    });
    const a = this[Fa] = {
      timeWindow: e.timeWindow,
      chunkSize: e.chunkSize,
      maxRate: e.maxRate,
      minChunkSize: e.minChunkSize,
      bytesSeen: 0,
      isCaptured: !1,
      notifiedBytesLoaded: 0,
      ts: Date.now(),
      bytes: 0,
      onReadCallback: null
    };
    this.on("newListener", (i) => {
      i === "progress" && (a.isCaptured || (a.isCaptured = !0));
    });
  }
  _read(e) {
    const a = this[Fa];
    return a.onReadCallback && a.onReadCallback(), super._read(e);
  }
  _transform(e, a, i) {
    const t = this[Fa], s = t.maxRate, o = this.readableHighWaterMark, r = t.timeWindow, c = 1e3 / r, p = s / c, l = t.minChunkSize !== !1 ? Math.max(t.minChunkSize, p * 0.01) : 0, u = (x, m) => {
      const v = Buffer.byteLength(x);
      t.bytesSeen += v, t.bytes += v, t.isCaptured && this.emit("progress", t.bytesSeen), this.push(x) ? process.nextTick(m) : t.onReadCallback = () => {
        t.onReadCallback = null, process.nextTick(m);
      };
    }, d = (x, m) => {
      const v = Buffer.byteLength(x);
      let h = null, b = o, y, w = 0;
      if (s) {
        const _ = Date.now();
        (!t.ts || (w = _ - t.ts) >= r) && (t.ts = _, y = p - t.bytes, t.bytes = y < 0 ? -y : 0, w = 0), y = p - t.bytes;
      }
      if (s) {
        if (y <= 0)
          return setTimeout(() => {
            m(null, x);
          }, r - w);
        y < b && (b = y);
      }
      b && v > b && v - b > l && (h = x.subarray(b), x = x.subarray(0, b)), u(x, h ? () => {
        process.nextTick(m, null, h);
      } : m);
    };
    d(e, function x(m, v) {
      if (m)
        return i(m);
      v ? d(v, x) : i(null);
    });
  }
}
const { asyncIterator: ht } = Symbol, Ao = async function* (n) {
  n.stream ? yield* n.stream() : n.arrayBuffer ? yield await n.arrayBuffer() : n[ht] ? yield* n[ht]() : yield n;
}, $u = f.ALPHABET.ALPHA_DIGIT + "-_", Je = new Uo(), ue = `\r
`, Fu = Je.encode(ue), Lu = 2;
class Nu {
  constructor(e, a) {
    const { escapeName: i } = this.constructor, t = f.isString(a);
    let s = `Content-Disposition: form-data; name="${i(e)}"${!t && a.name ? `; filename="${i(a.name)}"` : ""}${ue}`;
    t ? a = Je.encode(String(a).replace(/\r?\n|\r\n?/g, ue)) : s += `Content-Type: ${a.type || "application/octet-stream"}${ue}`, this.headers = Je.encode(s + ue), this.contentLength = t ? a.byteLength : a.size, this.size = this.headers.byteLength + this.contentLength + Lu, this.name = e, this.value = a;
  }
  async *encode() {
    yield this.headers;
    const { value: e } = this;
    f.isTypedArray(e) ? yield e : yield* Ao(e), yield Fu;
  }
  static escapeName(e) {
    return String(e).replace(/[\r\n"]/g, (a) => ({
      "\r": "%0D",
      "\n": "%0A",
      '"': "%22"
    })[a]);
  }
}
const zu = (n, e, a) => {
  const {
    tag: i = "form-data-boundary",
    size: t = 25,
    boundary: s = i + "-" + f.generateString(t, $u)
  } = a || {};
  if (!f.isFormData(n))
    throw TypeError("FormData instance required");
  if (s.length < 1 || s.length > 70)
    throw Error("boundary must be 10-70 characters long");
  const o = Je.encode("--" + s + ue), r = Je.encode("--" + s + "--" + ue + ue);
  let c = r.byteLength;
  const p = Array.from(n.entries()).map(([u, d]) => {
    const x = new Nu(u, d);
    return c += x.size, x;
  });
  c += o.byteLength * p.length, c = f.toFiniteNumber(c);
  const l = {
    "Content-Type": `multipart/form-data; boundary=${s}`
  };
  return Number.isFinite(c) && (l["Content-Length"] = c), e && e(l), Mo.from(async function* () {
    for (const u of p)
      yield o, yield* u.encode();
    yield r;
  }());
};
class Du extends Z.Transform {
  __transform(e, a, i) {
    this.push(e), i();
  }
  _transform(e, a, i) {
    if (e.length !== 0 && (this._transform = this.__transform, e[0] !== 120)) {
      const t = Buffer.alloc(2);
      t[0] = 120, t[1] = 156, this.push(t, a);
    }
    this.__transform(e, a, i);
  }
}
const Bu = (n, e) => f.isAsyncFn(n) ? function(...a) {
  const i = a.pop();
  n.apply(this, a).then((t) => {
    try {
      e ? i(null, ...e(t)) : i(null, t);
    } catch (s) {
      i(s);
    }
  }, i);
} : n;
function qu(n, e) {
  n = n || 10;
  const a = new Array(n), i = new Array(n);
  let t = 0, s = 0, o;
  return e = e !== void 0 ? e : 1e3, function(c) {
    const p = Date.now(), l = i[s];
    o || (o = p), a[t] = c, i[t] = p;
    let u = s, d = 0;
    for (; u !== t; )
      d += a[u++], u = u % n;
    if (t = (t + 1) % n, t === s && (s = (s + 1) % n), p - o < e)
      return;
    const x = l && p - l;
    return x ? Math.round(d * 1e3 / x) : void 0;
  };
}
function Iu(n, e) {
  let a = 0, i = 1e3 / e, t, s;
  const o = (p, l = Date.now()) => {
    a = l, t = null, s && (clearTimeout(s), s = null), n.apply(null, p);
  };
  return [(...p) => {
    const l = Date.now(), u = l - a;
    u >= i ? o(p, l) : (t = p, s || (s = setTimeout(() => {
      s = null, o(t);
    }, i - u)));
  }, () => t && o(t)];
}
const Oe = (n, e, a = 3) => {
  let i = 0;
  const t = qu(50, 250);
  return Iu((s) => {
    const o = s.loaded, r = s.lengthComputable ? s.total : void 0, c = o - i, p = t(c), l = o <= r;
    i = o;
    const u = {
      loaded: o,
      total: r,
      progress: r ? o / r : void 0,
      bytes: c,
      rate: p || void 0,
      estimated: p && r && l ? (r - o) / p : void 0,
      event: s,
      lengthComputable: r != null,
      [e ? "download" : "upload"]: !0
    };
    n(u);
  }, a);
}, In = (n, e) => {
  const a = n != null;
  return [(i) => e[0]({
    lengthComputable: a,
    total: n,
    loaded: i
  }), e[1]];
}, Un = (n) => (...e) => f.asap(() => n(...e)), vt = {
  flush: de.constants.Z_SYNC_FLUSH,
  finishFlush: de.constants.Z_SYNC_FLUSH
}, Uu = {
  flush: de.constants.BROTLI_OPERATION_FLUSH,
  finishFlush: de.constants.BROTLI_OPERATION_FLUSH
}, bt = f.isFunction(de.createBrotliDecompress), { http: Mu, https: Hu } = Cu, Wu = /https:?/, gt = N.protocols.map((n) => n + ":"), yt = (n, [e, a]) => (n.on("end", a).on("error", a), e);
function Vu(n, e) {
  n.beforeRedirects.proxy && n.beforeRedirects.proxy(n), n.beforeRedirects.config && n.beforeRedirects.config(n, e);
}
function jo(n, e, a) {
  let i = e;
  if (!i && i !== !1) {
    const t = lu(a);
    t && (i = new URL(t));
  }
  if (i) {
    if (i.username && (i.auth = (i.username || "") + ":" + (i.password || "")), i.auth) {
      (i.auth.username || i.auth.password) && (i.auth = (i.auth.username || "") + ":" + (i.auth.password || ""));
      const s = Buffer.from(i.auth, "utf8").toString("base64");
      n.headers["Proxy-Authorization"] = "Basic " + s;
    }
    n.headers.host = n.hostname + (n.port ? ":" + n.port : "");
    const t = i.hostname || i.host;
    n.hostname = t, n.host = t, n.port = i.port, n.path = a, i.protocol && (n.protocol = i.protocol.includes(":") ? i.protocol : `${i.protocol}:`);
  }
  n.beforeRedirects.proxy = function(s) {
    jo(s, e, s.href);
  };
}
const Ju = typeof process < "u" && f.kindOf(process) === "process", Gu = (n) => new Promise((e, a) => {
  let i, t;
  const s = (c, p) => {
    t || (t = !0, i && i(c, p));
  }, o = (c) => {
    s(c), e(c);
  }, r = (c) => {
    s(c, !0), a(c);
  };
  n(o, r, (c) => i = c).catch(r);
}), Ku = ({ address: n, family: e }) => {
  if (!f.isString(n))
    throw TypeError("address must be a string");
  return {
    address: n,
    family: e || (n.indexOf(".") < 0 ? 6 : 4)
  };
}, wt = (n, e) => Ku(f.isObject(n) ? n : { address: n, family: e }), Xu = Ju && function(e) {
  return Gu(async function(i, t, s) {
    let { data: o, lookup: r, family: c } = e;
    const { responseType: p, responseEncoding: l } = e, u = e.method.toUpperCase();
    let d, x = !1, m;
    if (r) {
      const S = Bu(r, (A) => f.isArray(A) ? A : [A]);
      r = (A, q, ve) => {
        S(A, q, (z, ce, ma) => {
          if (z)
            return ve(z);
          const te = f.isArray(ce) ? ce.map((Y) => wt(Y)) : [wt(ce, ma)];
          q.all ? ve(z, te) : ve(z, te[0].address, te[0].family);
        });
      };
    }
    const v = new Wo(), h = () => {
      e.cancelToken && e.cancelToken.unsubscribe(b), e.signal && e.signal.removeEventListener("abort", b), v.removeAllListeners();
    };
    s((S, A) => {
      d = !0, A && (x = !0, h());
    });
    function b(S) {
      v.emit("abort", !S || S.type ? new xe(null, e, m) : S);
    }
    v.once("abort", t), (e.cancelToken || e.signal) && (e.cancelToken && e.cancelToken.subscribe(b), e.signal && (e.signal.aborted ? b() : e.signal.addEventListener("abort", b)));
    const y = Ri(e.baseURL, e.url), w = new URL(y, N.hasBrowserEnv ? N.origin : void 0), _ = w.protocol || gt[0];
    if (_ === "data:") {
      let S;
      if (u !== "GET")
        return Re(i, t, {
          status: 405,
          statusText: "method not allowed",
          headers: {},
          config: e
        });
      try {
        S = Pu(e.url, p === "blob", {
          Blob: e.env && e.env.Blob
        });
      } catch (A) {
        throw g.from(A, g.ERR_BAD_REQUEST, e);
      }
      return p === "text" ? (S = S.toString(l), (!l || l === "utf8") && (S = f.stripBOM(S))) : p === "stream" && (S = Z.Readable.from(S)), Re(i, t, {
        data: S,
        status: 200,
        statusText: "OK",
        headers: new D(),
        config: e
      });
    }
    if (gt.indexOf(_) === -1)
      return t(new g(
        "Unsupported protocol " + _,
        g.ERR_BAD_REQUEST,
        e
      ));
    const k = D.from(e.headers).normalize();
    k.set("User-Agent", "axios/" + qn, !1);
    const { onUploadProgress: C, onDownloadProgress: E } = e, R = e.maxRate;
    let j, V;
    if (f.isSpecCompliantForm(o)) {
      const S = k.getContentType(/boundary=([-_\w\d]{10,70})/i);
      o = zu(o, (A) => {
        k.set(A);
      }, {
        tag: `axios-${qn}-boundary`,
        boundary: S && S[1] || void 0
      });
    } else if (f.isFormData(o) && f.isFunction(o.getHeaders)) {
      if (k.set(o.getHeaders()), !k.hasContentLength())
        try {
          const S = await Se.promisify(o.getLength).call(o);
          Number.isFinite(S) && S >= 0 && k.setContentLength(S);
        } catch {
        }
    } else if (f.isBlob(o))
      o.size && k.setContentType(o.type || "application/octet-stream"), k.setContentLength(o.size || 0), o = Z.Readable.from(Ao(o));
    else if (o && !f.isStream(o)) {
      if (!Buffer.isBuffer(o)) if (f.isArrayBuffer(o))
        o = Buffer.from(new Uint8Array(o));
      else if (f.isString(o))
        o = Buffer.from(o, "utf-8");
      else
        return t(new g(
          "Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream",
          g.ERR_BAD_REQUEST,
          e
        ));
      if (k.setContentLength(o.length, !1), e.maxBodyLength > -1 && o.length > e.maxBodyLength)
        return t(new g(
          "Request body larger than maxBodyLength limit",
          g.ERR_BAD_REQUEST,
          e
        ));
    }
    const Q = f.toFiniteNumber(k.getContentLength());
    f.isArray(R) ? (j = R[0], V = R[1]) : j = V = R, o && (C || j) && (f.isStream(o) || (o = Z.Readable.from(o, { objectMode: !1 })), o = Z.pipeline([o, new xt({
      maxRate: f.toFiniteNumber(j)
    })], f.noop), C && o.on("progress", yt(
      o,
      In(
        Q,
        Oe(Un(C), !1, 3)
      )
    )));
    let he;
    if (e.auth) {
      const S = e.auth.username || "", A = e.auth.password || "";
      he = S + ":" + A;
    }
    if (!he && w.username) {
      const S = w.username, A = w.password;
      he = S + ":" + A;
    }
    he && k.delete("authorization");
    let tn;
    try {
      tn = ki(
        w.pathname + w.search,
        e.params,
        e.paramsSerializer
      ).replace(/^\?/, "");
    } catch (S) {
      const A = new Error(S.message);
      return A.config = e, A.url = e.url, A.exists = !0, t(A);
    }
    k.set(
      "Accept-Encoding",
      "gzip, compress, deflate" + (bt ? ", br" : ""),
      !1
    );
    const B = {
      path: tn,
      method: u,
      headers: k.toJSON(),
      agents: { http: e.httpAgent, https: e.httpsAgent },
      auth: he,
      protocol: _,
      family: c,
      beforeRedirect: Vu,
      beforeRedirects: {}
    };
    !f.isUndefined(r) && (B.lookup = r), e.socketPath ? B.socketPath = e.socketPath : (B.hostname = w.hostname.startsWith("[") ? w.hostname.slice(1, -1) : w.hostname, B.port = w.port, jo(B, e.proxy, _ + "//" + w.hostname + (w.port ? ":" + w.port : "") + B.path));
    let re;
    const Ne = Wu.test(B.protocol);
    if (B.agent = Ne ? e.httpsAgent : e.httpAgent, e.transport ? re = e.transport : e.maxRedirects === 0 ? re = Ne ? ri : oi : (e.maxRedirects && (B.maxRedirects = e.maxRedirects), e.beforeRedirect && (B.beforeRedirects.config = e.beforeRedirect), re = Ne ? Hu : Mu), e.maxBodyLength > -1 ? B.maxBodyLength = e.maxBodyLength : B.maxBodyLength = 1 / 0, e.insecureHTTPParser && (B.insecureHTTPParser = e.insecureHTTPParser), m = re.request(B, function(A) {
      if (m.destroyed) return;
      const q = [A], ve = +A.headers["content-length"];
      if (E || V) {
        const Y = new xt({
          maxRate: f.toFiniteNumber(V)
        });
        E && Y.on("progress", yt(
          Y,
          In(
            ve,
            Oe(Un(E), !0, 3)
          )
        )), q.push(Y);
      }
      let z = A;
      const ce = A.req || m;
      if (e.decompress !== !1 && A.headers["content-encoding"])
        switch ((u === "HEAD" || A.statusCode === 204) && delete A.headers["content-encoding"], (A.headers["content-encoding"] || "").toLowerCase()) {
          case "gzip":
          case "x-gzip":
          case "compress":
          case "x-compress":
            q.push(de.createUnzip(vt)), delete A.headers["content-encoding"];
            break;
          case "deflate":
            q.push(new Du()), q.push(de.createUnzip(vt)), delete A.headers["content-encoding"];
            break;
          case "br":
            bt && (q.push(de.createBrotliDecompress(Uu)), delete A.headers["content-encoding"]);
        }
      z = q.length > 1 ? Z.pipeline(q, f.noop) : q[0];
      const ma = Z.finished(z, () => {
        ma(), h();
      }), te = {
        status: A.statusCode,
        statusText: A.statusMessage,
        headers: new D(A.headers),
        config: e,
        request: ce
      };
      if (p === "stream")
        te.data = z, Re(i, t, te);
      else {
        const Y = [];
        let zi = 0;
        z.on("data", function(M) {
          Y.push(M), zi += M.length, e.maxContentLength > -1 && zi > e.maxContentLength && (x = !0, z.destroy(), t(new g(
            "maxContentLength size of " + e.maxContentLength + " exceeded",
            g.ERR_BAD_RESPONSE,
            e,
            ce
          )));
        }), z.on("aborted", function() {
          if (x)
            return;
          const M = new g(
            "maxContentLength size of " + e.maxContentLength + " exceeded",
            g.ERR_BAD_RESPONSE,
            e,
            ce
          );
          z.destroy(M), t(M);
        }), z.on("error", function(M) {
          m.destroyed || t(g.from(M, null, e, ce));
        }), z.on("end", function() {
          try {
            let M = Y.length === 1 ? Y[0] : Buffer.concat(Y);
            p !== "arraybuffer" && (M = M.toString(l), (!l || l === "utf8") && (M = f.stripBOM(M))), te.data = M;
          } catch (M) {
            return t(g.from(M, null, e, te.request, te));
          }
          Re(i, t, te);
        });
      }
      v.once("abort", (Y) => {
        z.destroyed || (z.emit("error", Y), z.destroy());
      });
    }), v.once("abort", (S) => {
      t(S), m.destroy(S);
    }), m.on("error", function(A) {
      t(g.from(A, null, e, m));
    }), m.on("socket", function(A) {
      A.setKeepAlive(!0, 1e3 * 60);
    }), e.timeout) {
      const S = parseInt(e.timeout, 10);
      if (Number.isNaN(S)) {
        t(new g(
          "error trying to parse `config.timeout` to int",
          g.ERR_BAD_OPTION_VALUE,
          e,
          m
        ));
        return;
      }
      m.setTimeout(S, function() {
        if (d) return;
        let q = e.timeout ? "timeout of " + e.timeout + "ms exceeded" : "timeout exceeded";
        const ve = e.transitional || Si;
        e.timeoutErrorMessage && (q = e.timeoutErrorMessage), t(new g(
          q,
          ve.clarifyTimeoutError ? g.ETIMEDOUT : g.ECONNABORTED,
          e,
          m
        )), b();
      });
    }
    if (f.isStream(o)) {
      let S = !1, A = !1;
      o.on("end", () => {
        S = !0;
      }), o.once("error", (q) => {
        A = !0, m.destroy(q);
      }), o.on("close", () => {
        !S && !A && b(new xe("Request stream has been aborted", e, m));
      }), o.pipe(m);
    } else
      m.end(o);
  });
}, Yu = N.hasStandardBrowserEnv ? (
  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  function() {
    const e = N.navigator && /(msie|trident)/i.test(N.navigator.userAgent), a = document.createElement("a");
    let i;
    function t(s) {
      let o = s;
      return e && (a.setAttribute("href", o), o = a.href), a.setAttribute("href", o), {
        href: a.href,
        protocol: a.protocol ? a.protocol.replace(/:$/, "") : "",
        host: a.host,
        search: a.search ? a.search.replace(/^\?/, "") : "",
        hash: a.hash ? a.hash.replace(/^#/, "") : "",
        hostname: a.hostname,
        port: a.port,
        pathname: a.pathname.charAt(0) === "/" ? a.pathname : "/" + a.pathname
      };
    }
    return i = t(window.location.href), function(o) {
      const r = f.isString(o) ? t(o) : o;
      return r.protocol === i.protocol && r.host === i.host;
    };
  }()
) : (
  // Non standard browser envs (web workers, react-native) lack needed support.
  /* @__PURE__ */ function() {
    return function() {
      return !0;
    };
  }()
), Zu = N.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(n, e, a, i, t, s) {
      const o = [n + "=" + encodeURIComponent(e)];
      f.isNumber(a) && o.push("expires=" + new Date(a).toGMTString()), f.isString(i) && o.push("path=" + i), f.isString(t) && o.push("domain=" + t), s === !0 && o.push("secure"), document.cookie = o.join("; ");
    },
    read(n) {
      const e = document.cookie.match(new RegExp("(^|;\\s*)(" + n + ")=([^;]*)"));
      return e ? decodeURIComponent(e[3]) : null;
    },
    remove(n) {
      this.write(n, "", Date.now() - 864e5);
    }
  }
) : (
  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {
    },
    read() {
      return null;
    },
    remove() {
    }
  }
), Et = (n) => n instanceof D ? { ...n } : n;
function ke(n, e) {
  e = e || {};
  const a = {};
  function i(p, l, u) {
    return f.isPlainObject(p) && f.isPlainObject(l) ? f.merge.call({ caseless: u }, p, l) : f.isPlainObject(l) ? f.merge({}, l) : f.isArray(l) ? l.slice() : l;
  }
  function t(p, l, u) {
    if (f.isUndefined(l)) {
      if (!f.isUndefined(p))
        return i(void 0, p, u);
    } else return i(p, l, u);
  }
  function s(p, l) {
    if (!f.isUndefined(l))
      return i(void 0, l);
  }
  function o(p, l) {
    if (f.isUndefined(l)) {
      if (!f.isUndefined(p))
        return i(void 0, p);
    } else return i(void 0, l);
  }
  function r(p, l, u) {
    if (u in e)
      return i(p, l);
    if (u in n)
      return i(void 0, p);
  }
  const c = {
    url: s,
    method: s,
    data: s,
    baseURL: o,
    transformRequest: o,
    transformResponse: o,
    paramsSerializer: o,
    timeout: o,
    timeoutMessage: o,
    withCredentials: o,
    withXSRFToken: o,
    adapter: o,
    responseType: o,
    xsrfCookieName: o,
    xsrfHeaderName: o,
    onUploadProgress: o,
    onDownloadProgress: o,
    decompress: o,
    maxContentLength: o,
    maxBodyLength: o,
    beforeRedirect: o,
    transport: o,
    httpAgent: o,
    httpsAgent: o,
    cancelToken: o,
    socketPath: o,
    responseEncoding: o,
    validateStatus: r,
    headers: (p, l) => t(Et(p), Et(l), !0)
  };
  return f.forEach(Object.keys(Object.assign({}, n, e)), function(l) {
    const u = c[l] || t, d = u(n[l], e[l], l);
    f.isUndefined(d) && u !== r || (a[l] = d);
  }), a;
}
const To = (n) => {
  const e = ke({}, n);
  let { data: a, withXSRFToken: i, xsrfHeaderName: t, xsrfCookieName: s, headers: o, auth: r } = e;
  e.headers = o = D.from(o), e.url = ki(Ri(e.baseURL, e.url), n.params, n.paramsSerializer), r && o.set(
    "Authorization",
    "Basic " + btoa((r.username || "") + ":" + (r.password ? unescape(encodeURIComponent(r.password)) : ""))
  );
  let c;
  if (f.isFormData(a)) {
    if (N.hasStandardBrowserEnv || N.hasStandardBrowserWebWorkerEnv)
      o.setContentType(void 0);
    else if ((c = o.getContentType()) !== !1) {
      const [p, ...l] = c ? c.split(";").map((u) => u.trim()).filter(Boolean) : [];
      o.setContentType([p || "multipart/form-data", ...l].join("; "));
    }
  }
  if (N.hasStandardBrowserEnv && (i && f.isFunction(i) && (i = i(e)), i || i !== !1 && Yu(e.url))) {
    const p = t && s && Zu.read(s);
    p && o.set(t, p);
  }
  return e;
}, Qu = typeof XMLHttpRequest < "u", ed = Qu && function(n) {
  return new Promise(function(a, i) {
    const t = To(n);
    let s = t.data;
    const o = D.from(t.headers).normalize();
    let { responseType: r, onUploadProgress: c, onDownloadProgress: p } = t, l, u, d, x, m;
    function v() {
      x && x(), m && m(), t.cancelToken && t.cancelToken.unsubscribe(l), t.signal && t.signal.removeEventListener("abort", l);
    }
    let h = new XMLHttpRequest();
    h.open(t.method.toUpperCase(), t.url, !0), h.timeout = t.timeout;
    function b() {
      if (!h)
        return;
      const w = D.from(
        "getAllResponseHeaders" in h && h.getAllResponseHeaders()
      ), k = {
        data: !r || r === "text" || r === "json" ? h.responseText : h.response,
        status: h.status,
        statusText: h.statusText,
        headers: w,
        config: n,
        request: h
      };
      Re(function(E) {
        a(E), v();
      }, function(E) {
        i(E), v();
      }, k), h = null;
    }
    "onloadend" in h ? h.onloadend = b : h.onreadystatechange = function() {
      !h || h.readyState !== 4 || h.status === 0 && !(h.responseURL && h.responseURL.indexOf("file:") === 0) || setTimeout(b);
    }, h.onabort = function() {
      h && (i(new g("Request aborted", g.ECONNABORTED, n, h)), h = null);
    }, h.onerror = function() {
      i(new g("Network Error", g.ERR_NETWORK, n, h)), h = null;
    }, h.ontimeout = function() {
      let _ = t.timeout ? "timeout of " + t.timeout + "ms exceeded" : "timeout exceeded";
      const k = t.transitional || Si;
      t.timeoutErrorMessage && (_ = t.timeoutErrorMessage), i(new g(
        _,
        k.clarifyTimeoutError ? g.ETIMEDOUT : g.ECONNABORTED,
        n,
        h
      )), h = null;
    }, s === void 0 && o.setContentType(null), "setRequestHeader" in h && f.forEach(o.toJSON(), function(_, k) {
      h.setRequestHeader(k, _);
    }), f.isUndefined(t.withCredentials) || (h.withCredentials = !!t.withCredentials), r && r !== "json" && (h.responseType = t.responseType), p && ([d, m] = Oe(p, !0), h.addEventListener("progress", d)), c && h.upload && ([u, x] = Oe(c), h.upload.addEventListener("progress", u), h.upload.addEventListener("loadend", x)), (t.cancelToken || t.signal) && (l = (w) => {
      h && (i(!w || w.type ? new xe(null, n, h) : w), h.abort(), h = null);
    }, t.cancelToken && t.cancelToken.subscribe(l), t.signal && (t.signal.aborted ? l() : t.signal.addEventListener("abort", l)));
    const y = Ro(t.url);
    if (y && N.protocols.indexOf(y) === -1) {
      i(new g("Unsupported protocol " + y + ":", g.ERR_BAD_REQUEST, n));
      return;
    }
    h.send(s || null);
  });
}, nd = (n, e) => {
  const { length: a } = n = n ? n.filter(Boolean) : [];
  if (e || a) {
    let i = new AbortController(), t;
    const s = function(p) {
      if (!t) {
        t = !0, r();
        const l = p instanceof Error ? p : this.reason;
        i.abort(l instanceof g ? l : new xe(l instanceof Error ? l.message : l));
      }
    };
    let o = e && setTimeout(() => {
      o = null, s(new g(`timeout ${e} of ms exceeded`, g.ETIMEDOUT));
    }, e);
    const r = () => {
      n && (o && clearTimeout(o), o = null, n.forEach((p) => {
        p.unsubscribe ? p.unsubscribe(s) : p.removeEventListener("abort", s);
      }), n = null);
    };
    n.forEach((p) => p.addEventListener("abort", s));
    const { signal: c } = i;
    return c.unsubscribe = () => f.asap(r), c;
  }
}, ad = function* (n, e) {
  let a = n.byteLength;
  if (a < e) {
    yield n;
    return;
  }
  let i = 0, t;
  for (; i < a; )
    t = i + e, yield n.slice(i, t), i = t;
}, id = async function* (n, e) {
  for await (const a of td(n))
    yield* ad(a, e);
}, td = async function* (n) {
  if (n[Symbol.asyncIterator]) {
    yield* n;
    return;
  }
  const e = n.getReader();
  try {
    for (; ; ) {
      const { done: a, value: i } = await e.read();
      if (a)
        break;
      yield i;
    }
  } finally {
    await e.cancel();
  }
}, kt = (n, e, a, i) => {
  const t = id(n, e);
  let s = 0, o, r = (c) => {
    o || (o = !0, i && i(c));
  };
  return new ReadableStream({
    async pull(c) {
      try {
        const { done: p, value: l } = await t.next();
        if (p) {
          r(), c.close();
          return;
        }
        let u = l.byteLength;
        if (a) {
          let d = s += u;
          a(d);
        }
        c.enqueue(new Uint8Array(l));
      } catch (p) {
        throw r(p), p;
      }
    },
    cancel(c) {
      return r(c), t.return();
    }
  }, {
    highWaterMark: 2
  });
}, da = typeof fetch == "function" && typeof Request == "function" && typeof Response == "function", Co = da && typeof ReadableStream == "function", sd = da && (typeof TextEncoder == "function" ? /* @__PURE__ */ ((n) => (e) => n.encode(e))(new TextEncoder()) : async (n) => new Uint8Array(await new Response(n).arrayBuffer())), Oo = (n, ...e) => {
  try {
    return !!n(...e);
  } catch {
    return !1;
  }
}, od = Co && Oo(() => {
  let n = !1;
  const e = new Request(N.origin, {
    body: new ReadableStream(),
    method: "POST",
    get duplex() {
      return n = !0, "half";
    }
  }).headers.has("Content-Type");
  return n && !e;
}), St = 64 * 1024, Za = Co && Oo(() => f.isReadableStream(new Response("").body)), Mn = {
  stream: Za && ((n) => n.body)
};
da && ((n) => {
  ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((e) => {
    !Mn[e] && (Mn[e] = f.isFunction(n[e]) ? (a) => a[e]() : (a, i) => {
      throw new g(`Response type '${e}' is not supported`, g.ERR_NOT_SUPPORT, i);
    });
  });
})(new Response());
const rd = async (n) => {
  if (n == null)
    return 0;
  if (f.isBlob(n))
    return n.size;
  if (f.isSpecCompliantForm(n))
    return (await new Request(N.origin, {
      method: "POST",
      body: n
    }).arrayBuffer()).byteLength;
  if (f.isArrayBufferView(n) || f.isArrayBuffer(n))
    return n.byteLength;
  if (f.isURLSearchParams(n) && (n = n + ""), f.isString(n))
    return (await sd(n)).byteLength;
}, cd = async (n, e) => {
  const a = f.toFiniteNumber(n.getContentLength());
  return a ?? rd(e);
}, pd = da && (async (n) => {
  let {
    url: e,
    method: a,
    data: i,
    signal: t,
    cancelToken: s,
    timeout: o,
    onDownloadProgress: r,
    onUploadProgress: c,
    responseType: p,
    headers: l,
    withCredentials: u = "same-origin",
    fetchOptions: d
  } = To(n);
  p = p ? (p + "").toLowerCase() : "text";
  let x = nd([t, s && s.toAbortSignal()], o), m;
  const v = x && x.unsubscribe && (() => {
    x.unsubscribe();
  });
  let h;
  try {
    if (c && od && a !== "get" && a !== "head" && (h = await cd(l, i)) !== 0) {
      let k = new Request(e, {
        method: "POST",
        body: i,
        duplex: "half"
      }), C;
      if (f.isFormData(i) && (C = k.headers.get("content-type")) && l.setContentType(C), k.body) {
        const [E, R] = In(
          h,
          Oe(Un(c))
        );
        i = kt(k.body, St, E, R);
      }
    }
    f.isString(u) || (u = u ? "include" : "omit");
    const b = "credentials" in Request.prototype;
    m = new Request(e, {
      ...d,
      signal: x,
      method: a.toUpperCase(),
      headers: l.normalize().toJSON(),
      body: i,
      duplex: "half",
      credentials: b ? u : void 0
    });
    let y = await fetch(m);
    const w = Za && (p === "stream" || p === "response");
    if (Za && (r || w && v)) {
      const k = {};
      ["status", "statusText", "headers"].forEach((j) => {
        k[j] = y[j];
      });
      const C = f.toFiniteNumber(y.headers.get("content-length")), [E, R] = r && In(
        C,
        Oe(Un(r), !0)
      ) || [];
      y = new Response(
        kt(y.body, St, E, () => {
          R && R(), v && v();
        }),
        k
      );
    }
    p = p || "text";
    let _ = await Mn[f.findKey(Mn, p) || "text"](y, n);
    return !w && v && v(), await new Promise((k, C) => {
      Re(k, C, {
        data: _,
        headers: D.from(y.headers),
        status: y.status,
        statusText: y.statusText,
        config: n,
        request: m
      });
    });
  } catch (b) {
    throw v && v(), b && b.name === "TypeError" && /fetch/i.test(b.message) ? Object.assign(
      new g("Network Error", g.ERR_NETWORK, n, m),
      {
        cause: b.cause || b
      }
    ) : g.from(b, b && b.code, n, m);
  }
}), Qa = {
  http: Xu,
  xhr: ed,
  fetch: pd
};
f.forEach(Qa, (n, e) => {
  if (n) {
    try {
      Object.defineProperty(n, "name", { value: e });
    } catch {
    }
    Object.defineProperty(n, "adapterName", { value: e });
  }
});
const _t = (n) => `- ${n}`, ld = (n) => f.isFunction(n) || n === null || n === !1, Po = {
  getAdapter: (n) => {
    n = f.isArray(n) ? n : [n];
    const { length: e } = n;
    let a, i;
    const t = {};
    for (let s = 0; s < e; s++) {
      a = n[s];
      let o;
      if (i = a, !ld(a) && (i = Qa[(o = String(a)).toLowerCase()], i === void 0))
        throw new g(`Unknown adapter '${o}'`);
      if (i)
        break;
      t[o || "#" + s] = i;
    }
    if (!i) {
      const s = Object.entries(t).map(
        ([r, c]) => `adapter ${r} ` + (c === !1 ? "is not supported by the environment" : "is not available in the build")
      );
      let o = e ? s.length > 1 ? `since :
` + s.map(_t).join(`
`) : " " + _t(s[0]) : "as no adapter specified";
      throw new g(
        "There is no suitable adapter to dispatch the request " + o,
        "ERR_NOT_SUPPORT"
      );
    }
    return i;
  },
  adapters: Qa
};
function La(n) {
  if (n.cancelToken && n.cancelToken.throwIfRequested(), n.signal && n.signal.aborted)
    throw new xe(null, n);
}
function Rt(n) {
  return La(n), n.headers = D.from(n.headers), n.data = ja.call(
    n,
    n.transformRequest
  ), ["post", "put", "patch"].indexOf(n.method) !== -1 && n.headers.setContentType("application/x-www-form-urlencoded", !1), Po.getAdapter(n.adapter || en.adapter)(n).then(function(i) {
    return La(n), i.data = ja.call(
      n,
      n.transformResponse,
      i
    ), i.headers = D.from(i.headers), i;
  }, function(i) {
    return yo(i) || (La(n), i && i.response && (i.response.data = ja.call(
      n,
      n.transformResponse,
      i.response
    ), i.response.headers = D.from(i.response.headers))), Promise.reject(i);
  });
}
const Li = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((n, e) => {
  Li[n] = function(i) {
    return typeof i === n || "a" + (e < 1 ? "n " : " ") + n;
  };
});
const At = {};
Li.transitional = function(e, a, i) {
  function t(s, o) {
    return "[Axios v" + qn + "] Transitional option '" + s + "'" + o + (i ? ". " + i : "");
  }
  return (s, o, r) => {
    if (e === !1)
      throw new g(
        t(o, " has been removed" + (a ? " in " + a : "")),
        g.ERR_DEPRECATED
      );
    return a && !At[o] && (At[o] = !0, console.warn(
      t(
        o,
        " has been deprecated since v" + a + " and will be removed in the near future"
      )
    )), e ? e(s, o, r) : !0;
  };
};
function ud(n, e, a) {
  if (typeof n != "object")
    throw new g("options must be an object", g.ERR_BAD_OPTION_VALUE);
  const i = Object.keys(n);
  let t = i.length;
  for (; t-- > 0; ) {
    const s = i[t], o = e[s];
    if (o) {
      const r = n[s], c = r === void 0 || o(r, s, n);
      if (c !== !0)
        throw new g("option " + s + " must be " + c, g.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (a !== !0)
      throw new g("Unknown option " + s, g.ERR_BAD_OPTION);
  }
}
const ei = {
  assertOptions: ud,
  validators: Li
}, le = ei.validators;
class ye {
  constructor(e) {
    this.defaults = e, this.interceptors = {
      request: new ot(),
      response: new ot()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(e, a) {
    try {
      return await this._request(e, a);
    } catch (i) {
      if (i instanceof Error) {
        let t;
        Error.captureStackTrace ? Error.captureStackTrace(t = {}) : t = new Error();
        const s = t.stack ? t.stack.replace(/^.+\n/, "") : "";
        try {
          i.stack ? s && !String(i.stack).endsWith(s.replace(/^.+\n.+\n/, "")) && (i.stack += `
` + s) : i.stack = s;
        } catch {
        }
      }
      throw i;
    }
  }
  _request(e, a) {
    typeof e == "string" ? (a = a || {}, a.url = e) : a = e || {}, a = ke(this.defaults, a);
    const { transitional: i, paramsSerializer: t, headers: s } = a;
    i !== void 0 && ei.assertOptions(i, {
      silentJSONParsing: le.transitional(le.boolean),
      forcedJSONParsing: le.transitional(le.boolean),
      clarifyTimeoutError: le.transitional(le.boolean)
    }, !1), t != null && (f.isFunction(t) ? a.paramsSerializer = {
      serialize: t
    } : ei.assertOptions(t, {
      encode: le.function,
      serialize: le.function
    }, !0)), a.method = (a.method || this.defaults.method || "get").toLowerCase();
    let o = s && f.merge(
      s.common,
      s[a.method]
    );
    s && f.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (m) => {
        delete s[m];
      }
    ), a.headers = D.concat(o, s);
    const r = [];
    let c = !0;
    this.interceptors.request.forEach(function(v) {
      typeof v.runWhen == "function" && v.runWhen(a) === !1 || (c = c && v.synchronous, r.unshift(v.fulfilled, v.rejected));
    });
    const p = [];
    this.interceptors.response.forEach(function(v) {
      p.push(v.fulfilled, v.rejected);
    });
    let l, u = 0, d;
    if (!c) {
      const m = [Rt.bind(this), void 0];
      for (m.unshift.apply(m, r), m.push.apply(m, p), d = m.length, l = Promise.resolve(a); u < d; )
        l = l.then(m[u++], m[u++]);
      return l;
    }
    d = r.length;
    let x = a;
    for (u = 0; u < d; ) {
      const m = r[u++], v = r[u++];
      try {
        x = m(x);
      } catch (h) {
        v.call(this, h);
        break;
      }
    }
    try {
      l = Rt.call(this, x);
    } catch (m) {
      return Promise.reject(m);
    }
    for (u = 0, d = p.length; u < d; )
      l = l.then(p[u++], p[u++]);
    return l;
  }
  getUri(e) {
    e = ke(this.defaults, e);
    const a = Ri(e.baseURL, e.url);
    return ki(a, e.params, e.paramsSerializer);
  }
}
f.forEach(["delete", "get", "head", "options"], function(e) {
  ye.prototype[e] = function(a, i) {
    return this.request(ke(i || {}, {
      method: e,
      url: a,
      data: (i || {}).data
    }));
  };
});
f.forEach(["post", "put", "patch"], function(e) {
  function a(i) {
    return function(s, o, r) {
      return this.request(ke(r || {}, {
        method: e,
        headers: i ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: s,
        data: o
      }));
    };
  }
  ye.prototype[e] = a(), ye.prototype[e + "Form"] = a(!0);
});
class Ni {
  constructor(e) {
    if (typeof e != "function")
      throw new TypeError("executor must be a function.");
    let a;
    this.promise = new Promise(function(s) {
      a = s;
    });
    const i = this;
    this.promise.then((t) => {
      if (!i._listeners) return;
      let s = i._listeners.length;
      for (; s-- > 0; )
        i._listeners[s](t);
      i._listeners = null;
    }), this.promise.then = (t) => {
      let s;
      const o = new Promise((r) => {
        i.subscribe(r), s = r;
      }).then(t);
      return o.cancel = function() {
        i.unsubscribe(s);
      }, o;
    }, e(function(s, o, r) {
      i.reason || (i.reason = new xe(s, o, r), a(i.reason));
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason)
      throw this.reason;
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(e) {
    if (this.reason) {
      e(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(e) : this._listeners = [e];
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(e) {
    if (!this._listeners)
      return;
    const a = this._listeners.indexOf(e);
    a !== -1 && this._listeners.splice(a, 1);
  }
  toAbortSignal() {
    const e = new AbortController(), a = (i) => {
      e.abort(i);
    };
    return this.subscribe(a), e.signal.unsubscribe = () => this.unsubscribe(a), e.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let e;
    return {
      token: new Ni(function(t) {
        e = t;
      }),
      cancel: e
    };
  }
}
function dd(n) {
  return function(a) {
    return n.apply(null, a);
  };
}
function md(n) {
  return f.isObject(n) && n.isAxiosError === !0;
}
const ni = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
};
Object.entries(ni).forEach(([n, e]) => {
  ni[e] = n;
});
function $o(n) {
  const e = new ye(n), a = Gs(ye.prototype.request, e);
  return f.extend(a, ye.prototype, e, { allOwnKeys: !0 }), f.extend(a, e, null, { allOwnKeys: !0 }), a.create = function(t) {
    return $o(ke(n, t));
  }, a;
}
const O = $o(en);
O.Axios = ye;
O.CanceledError = xe;
O.CancelToken = Ni;
O.isCancel = yo;
O.VERSION = qn;
O.toFormData = ua;
O.AxiosError = g;
O.Cancel = O.CanceledError;
O.all = function(e) {
  return Promise.all(e);
};
O.spread = dd;
O.isAxiosError = md;
O.mergeConfig = ke;
O.AxiosHeaders = D;
O.formToJSON = (n) => go(f.isHTMLForm(n) ? new FormData(n) : n);
O.getAdapter = Po.getAdapter;
O.HttpStatusCode = ni;
O.default = O;
async function fd({ playlistUrl: n, categoriesUrl: e, name: a }) {
  const i = await O.get(n), t = await O.get(e), s = { playlist: i.data, categories: t.data };
  return await P.writeAsync(Ws(a), s), s;
}
async function xd({ playlistUrl: n, categoriesUrl: e, name: a }) {
  const i = await O.get(n), t = await O.get(e), s = { playlist: i.data, categories: t.data };
  return await P.writeAsync(Vs(a), s), s;
}
async function hd({ playlistUrl: n, categoriesUrl: e, name: a }) {
  const i = await O.get(n), t = await O.get(e), s = { playlist: i.data, categories: t.data };
  return await P.writeAsync(Js(a), s), s;
}
async function vd(n) {
  return (await O.get(n)).status === 200;
}
async function bd(n) {
  const e = await P.readAsync(H, "json");
  if (e.playlists) {
    for (const a of e.playlists)
      if (a.name == n.name) return !1;
    e.playlists.push(n);
  } else
    e.playlists = [n];
  return e.currentPlaylist = {
    name: n.name,
    profile: "Default"
  }, await P.writeAsync(H, e);
}
async function gd(n) {
  const e = Ws(n);
  return await P.readAsync(e, "json");
}
async function yd(n) {
  return await P.readAsync(Vs(n), "json");
}
async function wd(n) {
  return await P.readAsync(Js(n), "json");
}
async function Ed(n) {
  return (await P.readAsync(H, "json")).playlists.find((a) => a.name == n);
}
async function kd(n) {
  if (!n) return;
  const e = await O.get(n);
  if (e.data)
    return e.data;
}
async function Sd(n) {
  if (!n) return;
  const e = await O.get(n);
  if (e.data)
    return e.data;
}
async function _d(n) {
  const { currentPlaylist: e } = await Fe(), a = we(e.name, n);
  let i = await P.readAsync(we(e.name, n), "json");
  return i || (i = { vod: [], series: [], live: [] }, await P.writeAsync(a, i)), i;
}
async function Rd(n) {
  const { currentPlaylist: e } = await Fe(), a = we(e.name, e.profile);
  return await P.writeAsync(a, n), n;
}
async function Ad(n) {
  const e = await P.readAsync(H, "json"), a = e.playlists.find((i) => i.name == n);
  return a ? (e.currentPlaylist = {
    name: n,
    profile: a.profiles[0]
  }, await P.writeAsync(H, e), !0) : !1;
}
async function jd(n) {
  const e = await P.readAsync(H, "json"), a = e.playlists.map((i) => (i.name == n && (i.updatedAt = /* @__PURE__ */ new Date()), i));
  return e.playlists = a, await P.writeAsync(H, e);
}
async function Td(n) {
  const e = await Fe(), a = we(e.currentPlaylist.name, n), i = e.playlists.find((r) => r.name === e.currentPlaylist.name);
  if (i == null ? void 0 : i.profiles.find((r) => r === n)) return !1;
  const s = e.playlists.map((r) => (r.name === e.currentPlaylist.name && r.profiles.push(n), r));
  e.playlists = s, await P.writeAsync(H, e);
  let o = await P.readAsync(we(e.currentPlaylist.name, n), "json");
  return o ? !1 : (o = { vod: [], series: [], live: [] }, await P.writeAsync(a, o), !0);
}
async function Cd(n) {
  const e = await P.readAsync(H, "json");
  return e.currentPlaylist.profile = n, await P.writeAsync(H, e), !0;
}
async function Od({ profile: n, newName: e }) {
  const a = await Fe(), i = we(a.currentPlaylist.name, n);
  a.currentPlaylist.profile = e;
  const t = a.playlists.map((s) => {
    if (s.name === a.currentPlaylist.name) {
      const o = s.profiles.filter((r) => r !== n);
      o.push(e), s.profiles = o;
    }
    return s;
  });
  return a.playlists = t, await P.writeAsync(H, a), await P.renameAsync(i, `${e}.json`);
}
async function Pd(n) {
  const e = await Fe();
  let a = [];
  const i = e.playlists.map((s) => {
    if (s.name === e.currentPlaylist.name) {
      const o = s.profiles.filter((r) => r !== n);
      s.profiles = o, a = o;
    }
    return s;
  });
  e.currentPlaylist.profile = a[0], e.playlists = i, await P.writeAsync(H, e);
  const t = we(e.currentPlaylist.name, n);
  await P.removeAsync(t);
}
function $d() {
  L.handle("get-metadata", Fe), L.handle("authenticate-user", async (n, e) => await vd(e)), L.handle("update-vod", async (n, e) => await fd(e)), L.handle("update-series", async (n, e) => await xd(e)), L.handle("update-live", async (n, e) => await hd(e)), L.handle("add-playlist-to-meta", async (n, e) => await bd(e)), L.handle("get-local-vod-playlist", async (n, e) => await gd(e)), L.handle("get-local-series-playlist", async (n, e) => await yd(e)), L.handle("get-local-live-playlist", async (n, e) => await wd(e)), L.handle("get-playlist-info", async (n, e) => await Ed(e)), L.handle("get-vod-info", async (n, e) => await kd(e)), L.handle("get-serie-info", async (n, e) => await Sd(e)), L.handle("get-user-data", async (n, e) => await _d(e)), L.handle("update-user-data", async (n, e) => await Rd(e)), L.handle("change-current-playlist", async (n, e) => await Ad(e)), L.handle("updated-at-playlist", async (n, e) => await jd(e)), L.handle("create-profile", async (n, e) => await Td(e)), L.handle("switch-profile", async (n, e) => await Cd(e)), L.handle("rename-profile", async (n, e) => await Od(e)), L.handle("remove-profile", async (n, e) => await Pd(e));
}
var ai = { exports: {} }, _n = { exports: {} }, Rn = { exports: {} }, Na, jt;
function Fd() {
  if (jt) return Na;
  jt = 1;
  var n = 1e3, e = n * 60, a = e * 60, i = a * 24, t = i * 365.25;
  Na = function(p, l) {
    l = l || {};
    var u = typeof p;
    if (u === "string" && p.length > 0)
      return s(p);
    if (u === "number" && isNaN(p) === !1)
      return l.long ? r(p) : o(p);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(p)
    );
  };
  function s(p) {
    if (p = String(p), !(p.length > 100)) {
      var l = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
        p
      );
      if (l) {
        var u = parseFloat(l[1]), d = (l[2] || "ms").toLowerCase();
        switch (d) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return u * t;
          case "days":
          case "day":
          case "d":
            return u * i;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return u * a;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return u * e;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return u * n;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return u;
          default:
            return;
        }
      }
    }
  }
  function o(p) {
    return p >= i ? Math.round(p / i) + "d" : p >= a ? Math.round(p / a) + "h" : p >= e ? Math.round(p / e) + "m" : p >= n ? Math.round(p / n) + "s" : p + "ms";
  }
  function r(p) {
    return c(p, i, "day") || c(p, a, "hour") || c(p, e, "minute") || c(p, n, "second") || p + " ms";
  }
  function c(p, l, u) {
    if (!(p < l))
      return p < l * 1.5 ? Math.floor(p / l) + " " + u : Math.ceil(p / l) + " " + u + "s";
  }
  return Na;
}
var Tt;
function Fo() {
  return Tt || (Tt = 1, function(n, e) {
    e = n.exports = t.debug = t.default = t, e.coerce = c, e.disable = o, e.enable = s, e.enabled = r, e.humanize = Fd(), e.names = [], e.skips = [], e.formatters = {};
    var a;
    function i(p) {
      var l = 0, u;
      for (u in p)
        l = (l << 5) - l + p.charCodeAt(u), l |= 0;
      return e.colors[Math.abs(l) % e.colors.length];
    }
    function t(p) {
      function l() {
        if (l.enabled) {
          var u = l, d = +/* @__PURE__ */ new Date(), x = d - (a || d);
          u.diff = x, u.prev = a, u.curr = d, a = d;
          for (var m = new Array(arguments.length), v = 0; v < m.length; v++)
            m[v] = arguments[v];
          m[0] = e.coerce(m[0]), typeof m[0] != "string" && m.unshift("%O");
          var h = 0;
          m[0] = m[0].replace(/%([a-zA-Z%])/g, function(y, w) {
            if (y === "%%") return y;
            h++;
            var _ = e.formatters[w];
            if (typeof _ == "function") {
              var k = m[h];
              y = _.call(u, k), m.splice(h, 1), h--;
            }
            return y;
          }), e.formatArgs.call(u, m);
          var b = l.log || e.log || console.log.bind(console);
          b.apply(u, m);
        }
      }
      return l.namespace = p, l.enabled = e.enabled(p), l.useColors = e.useColors(), l.color = i(p), typeof e.init == "function" && e.init(l), l;
    }
    function s(p) {
      e.save(p), e.names = [], e.skips = [];
      for (var l = (typeof p == "string" ? p : "").split(/[\s,]+/), u = l.length, d = 0; d < u; d++)
        l[d] && (p = l[d].replace(/\*/g, ".*?"), p[0] === "-" ? e.skips.push(new RegExp("^" + p.substr(1) + "$")) : e.names.push(new RegExp("^" + p + "$")));
    }
    function o() {
      e.enable("");
    }
    function r(p) {
      var l, u;
      for (l = 0, u = e.skips.length; l < u; l++)
        if (e.skips[l].test(p))
          return !1;
      for (l = 0, u = e.names.length; l < u; l++)
        if (e.names[l].test(p))
          return !0;
      return !1;
    }
    function c(p) {
      return p instanceof Error ? p.stack || p.message : p;
    }
  }(Rn, Rn.exports)), Rn.exports;
}
var Ct;
function Ld() {
  return Ct || (Ct = 1, function(n, e) {
    e = n.exports = Fo(), e.log = t, e.formatArgs = i, e.save = s, e.load = o, e.useColors = a, e.storage = typeof chrome < "u" && typeof chrome.storage < "u" ? chrome.storage.local : r(), e.colors = [
      "lightseagreen",
      "forestgreen",
      "goldenrod",
      "dodgerblue",
      "darkorchid",
      "crimson"
    ];
    function a() {
      return typeof window < "u" && window.process && window.process.type === "renderer" ? !0 : typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    e.formatters.j = function(c) {
      try {
        return JSON.stringify(c);
      } catch (p) {
        return "[UnexpectedJSONParseError]: " + p.message;
      }
    };
    function i(c) {
      var p = this.useColors;
      if (c[0] = (p ? "%c" : "") + this.namespace + (p ? " %c" : " ") + c[0] + (p ? "%c " : " ") + "+" + e.humanize(this.diff), !!p) {
        var l = "color: " + this.color;
        c.splice(1, 0, l, "color: inherit");
        var u = 0, d = 0;
        c[0].replace(/%[a-zA-Z%]/g, function(x) {
          x !== "%%" && (u++, x === "%c" && (d = u));
        }), c.splice(d, 0, l);
      }
    }
    function t() {
      return typeof console == "object" && console.log && Function.prototype.apply.call(console.log, console, arguments);
    }
    function s(c) {
      try {
        c == null ? e.storage.removeItem("debug") : e.storage.debug = c;
      } catch {
      }
    }
    function o() {
      var c;
      try {
        c = e.storage.debug;
      } catch {
      }
      return !c && typeof process < "u" && "env" in process && (c = process.env.DEBUG), c;
    }
    e.enable(o());
    function r() {
      try {
        return window.localStorage;
      } catch {
      }
    }
  }(_n, _n.exports)), _n.exports;
}
var An = { exports: {} }, Ot;
function Nd() {
  return Ot || (Ot = 1, function(n, e) {
    var a = ci, i = Se;
    e = n.exports = Fo(), e.init = d, e.log = c, e.formatArgs = r, e.save = p, e.load = l, e.useColors = o, e.colors = [6, 2, 3, 4, 5, 1], e.inspectOpts = Object.keys(process.env).filter(function(x) {
      return /^debug_/i.test(x);
    }).reduce(function(x, m) {
      var v = m.substring(6).toLowerCase().replace(/_([a-z])/g, function(b, y) {
        return y.toUpperCase();
      }), h = process.env[m];
      return /^(yes|on|true|enabled)$/i.test(h) ? h = !0 : /^(no|off|false|disabled)$/i.test(h) ? h = !1 : h === "null" ? h = null : h = Number(h), x[v] = h, x;
    }, {});
    var t = parseInt(process.env.DEBUG_FD, 10) || 2;
    t !== 1 && t !== 2 && i.deprecate(function() {
    }, "except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();
    var s = t === 1 ? process.stdout : t === 2 ? process.stderr : u(t);
    function o() {
      return "colors" in e.inspectOpts ? !!e.inspectOpts.colors : a.isatty(t);
    }
    e.formatters.o = function(x) {
      return this.inspectOpts.colors = this.useColors, i.inspect(x, this.inspectOpts).split(`
`).map(function(m) {
        return m.trim();
      }).join(" ");
    }, e.formatters.O = function(x) {
      return this.inspectOpts.colors = this.useColors, i.inspect(x, this.inspectOpts);
    };
    function r(x) {
      var m = this.namespace, v = this.useColors;
      if (v) {
        var h = this.color, b = "  \x1B[3" + h + ";1m" + m + " \x1B[0m";
        x[0] = b + x[0].split(`
`).join(`
` + b), x.push("\x1B[3" + h + "m+" + e.humanize(this.diff) + "\x1B[0m");
      } else
        x[0] = (/* @__PURE__ */ new Date()).toUTCString() + " " + m + " " + x[0];
    }
    function c() {
      return s.write(i.format.apply(i, arguments) + `
`);
    }
    function p(x) {
      x == null ? delete process.env.DEBUG : process.env.DEBUG = x;
    }
    function l() {
      return process.env.DEBUG;
    }
    function u(x) {
      var m, v = process.binding("tty_wrap");
      switch (v.guessHandleType(x)) {
        case "TTY":
          m = new a.WriteStream(x), m._type = "tty", m._handle && m._handle.unref && m._handle.unref();
          break;
        case "FILE":
          var h = Ge;
          m = new h.SyncWriteStream(x, { autoClose: !1 }), m._type = "fs";
          break;
        case "PIPE":
        case "TCP":
          var b = Jo;
          m = new b.Socket({
            fd: x,
            readable: !1,
            writable: !0
          }), m.readable = !1, m.read = null, m._type = "pipe", m._handle && m._handle.unref && m._handle.unref();
          break;
        default:
          throw new Error("Implement me. Unknown stream file type!");
      }
      return m.fd = x, m._isStdio = !0, m;
    }
    function d(x) {
      x.inspectOpts = {};
      for (var m = Object.keys(e.inspectOpts), v = 0; v < m.length; v++)
        x.inspectOpts[m[v]] = e.inspectOpts[m[v]];
    }
    e.enable(l());
  }(An, An.exports)), An.exports;
}
typeof process < "u" && process.type === "renderer" ? ai.exports = Ld() : ai.exports = Nd();
var zd = ai.exports, ii = F, Dd = Vo.spawn, Lo = zd("electron-squirrel-startup"), za = Bo.app, Pt = function(n, e) {
  var a = ii.resolve(ii.dirname(process.execPath), "..", "Update.exe");
  Lo("Spawning `%s` with args `%s`", a, n), Dd(a, n, {
    detached: !0
  }).on("close", e);
}, Bd = function() {
  if (process.platform === "win32") {
    var n = process.argv[1];
    Lo("processing squirrel command `%s`", n);
    var e = ii.basename(process.execPath);
    if (n === "--squirrel-install" || n === "--squirrel-updated")
      return Pt(["--createShortcut=" + e], za.quit), !0;
    if (n === "--squirrel-uninstall")
      return Pt(["--removeShortcut=" + e], za.quit), !0;
    if (n === "--squirrel-obsolete")
      return za.quit(), !0;
  }
  return !1;
}, qd = Bd();
const Id = /* @__PURE__ */ pi(qd), No = me.dirname(Io(import.meta.url));
process.env.APP_ROOT = me.join(No, "..");
const ti = process.env.VITE_DEV_SERVER_URL, cm = me.join(process.env.APP_ROOT, "dist-electron"), zo = me.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = ti ? me.join(process.env.APP_ROOT, "public") : zo;
let I;
Id && Te.quit();
const Da = qo.createFromPath(me.join(process.env.VITE_PUBLIC, "icon.png"));
function Do() {
  console.log(Da), I = new $t({
    icon: Da,
    webPreferences: {
      preload: me.join(No, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0,
      webSecurity: !1,
      spellcheck: !1
    }
  }), I.menuBarVisible = !1, I.webContents.on("did-finish-load", () => {
    I == null || I.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), ti ? I.loadURL(ti) : I.loadFile(me.join(zo, "index.html")), I.once("ready-to-show", () => {
    I == null || I.setIcon(Da), I == null || I.maximize();
  });
}
Te.on("window-all-closed", () => {
  process.platform !== "darwin" && (Te.quit(), I = null);
});
Te.on("activate", () => {
  $t.getAllWindows().length === 0 && Do();
});
Te.whenReady().then(() => {
  $d(), Do();
});
export {
  cm as MAIN_DIST,
  zo as RENDERER_DIST,
  ti as VITE_DEV_SERVER_URL
};
