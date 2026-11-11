import Ir, { app as H, ipcMain as L, nativeImage as Pr, BrowserWindow as tn } from "electron";
import { fileURLToPath as Tr } from "node:url";
import B from "node:path";
import wt, { randomUUID as nn } from "crypto";
import b from "path";
import rn from "util";
import je from "fs";
import Nr from "os";
import Cr from "child_process";
import Dr from "tty";
import xr from "net";
const jr = H.getPath("sessionData"), Et = b.join(jr, "projects"), lt = b.join(Et, "meta.json"), $t = (t) => b.join(Et, `${t}/info.json`), St = (t, e) => b.join(Et, `${t}/chapters/${e}.json`);
function Fr(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Fe = {}, Mr = (t) => function() {
  const e = arguments.length, n = new Array(e);
  for (let r = 0; r < e; r += 1)
    n[r] = arguments[r];
  return new Promise((r, s) => {
    n.push((i, l) => {
      i ? s(i) : r(l);
    }), t.apply(null, n);
  });
};
const Ae = je, Rr = Mr, _r = (t) => [
  typeof Ae[t] == "function",
  !t.match(/Sync$/),
  !t.match(/^[A-Z]/),
  !t.match(/^create/),
  !t.match(/^(un)?watch/)
].every(Boolean), Br = (t) => {
  const e = Ae[t];
  return Rr(e);
}, Ur = () => {
  const t = {};
  return Object.keys(Ae).forEach((e) => {
    _r(e) ? e === "exists" ? t.exists = () => {
      throw new Error("fs.exists() is deprecated");
    } : t[e] = Br(e) : t[e] = Ae[e];
  }), t;
};
var N = Ur(), W = {};
const Lr = (t) => {
  const e = (n) => ["a", "e", "i", "o", "u"].indexOf(n[0]) !== -1 ? `an ${n}` : `a ${n}`;
  return t.map(e).join(" or ");
}, sn = (t) => /array of /.test(t), on = (t) => t.split(" of ")[1], cn = (t) => sn(t) ? cn(on(t)) : [
  "string",
  "number",
  "boolean",
  "array",
  "object",
  "buffer",
  "null",
  "undefined",
  "function"
].some((e) => e === t), Q = (t) => t === null ? "null" : Array.isArray(t) ? "array" : Buffer.isBuffer(t) ? "buffer" : typeof t, Wr = (t, e, n) => n.indexOf(t) === e, zr = (t) => {
  let e = Q(t), n;
  return e === "array" && (n = t.map((r) => Q(r)).filter(Wr), e += ` of ${n.join(", ")}`), e;
}, qr = (t, e) => {
  const n = on(e);
  return Q(t) !== "array" ? !1 : t.every((r) => Q(r) === n);
}, ut = (t, e, n, r) => {
  if (!r.some((i) => {
    if (!cn(i))
      throw new Error(`Unknown type "${i}"`);
    return sn(i) ? qr(n, i) : i === Q(n);
  }))
    throw new Error(
      `Argument "${e}" passed to ${t} must be ${Lr(
        r
      )}. Received ${zr(n)}`
    );
}, Hr = (t, e, n, r) => {
  n !== void 0 && (ut(t, e, n, ["object"]), Object.keys(n).forEach((s) => {
    const i = `${e}.${s}`;
    if (r[s] !== void 0)
      ut(t, i, n[s], r[s]);
    else
      throw new Error(
        `Unknown argument "${i}" passed to ${t}`
      );
  }));
};
var A = {
  argument: ut,
  options: Hr
}, x = {}, Me = {};
Me.normalizeFileMode = (t) => {
  let e;
  return typeof t == "number" ? e = t.toString(8) : e = t, e.substring(e.length - 3);
};
var J = {};
const an = N, Gr = A, Jr = (t, e) => {
  const n = `${t}([path])`;
  Gr.argument(n, "path", e, ["string", "undefined"]);
}, Xr = (t) => {
  an.rmSync(t, {
    recursive: !0,
    force: !0,
    maxRetries: 3
  });
}, Vr = (t) => an.rm(t, {
  recursive: !0,
  force: !0,
  maxRetries: 3
});
J.validateInput = Jr;
J.sync = Xr;
J.async = Vr;
const Re = b, j = N, bt = Me, Mt = A, ln = J, Zr = (t, e, n) => {
  const r = `${t}(path, [criteria])`;
  Mt.argument(r, "path", e, ["string"]), Mt.options(r, "criteria", n, {
    empty: ["boolean"],
    mode: ["string", "number"]
  });
}, un = (t) => {
  const e = t || {};
  return typeof e.empty != "boolean" && (e.empty = !1), e.mode !== void 0 && (e.mode = bt.normalizeFileMode(e.mode)), e;
}, fn = (t) => new Error(
  `Path ${t} exists but is not a directory. Halting jetpack.dir() call for safety reasons.`
), Qr = (t) => {
  let e;
  try {
    e = j.statSync(t);
  } catch (n) {
    if (n.code !== "ENOENT")
      throw n;
  }
  if (e && !e.isDirectory())
    throw fn(t);
  return e;
}, At = (t, e) => {
  const n = e || {};
  try {
    j.mkdirSync(t, n.mode);
  } catch (r) {
    if (r.code === "ENOENT")
      At(Re.dirname(t), n), j.mkdirSync(t, n.mode);
    else if (r.code !== "EEXIST") throw r;
  }
}, Yr = (t, e, n) => {
  const r = () => {
    const i = bt.normalizeFileMode(e.mode);
    n.mode !== void 0 && n.mode !== i && j.chmodSync(t, n.mode);
  }, s = () => {
    n.empty && j.readdirSync(t).forEach((l) => {
      ln.sync(Re.resolve(t, l));
    });
  };
  r(), s();
}, Kr = (t, e) => {
  const n = un(e), r = Qr(t);
  r ? Yr(t, r, n) : At(t, n);
}, es = (t) => new Promise((e, n) => {
  j.stat(t).then((r) => {
    r.isDirectory() ? e(r) : n(fn(t));
  }).catch((r) => {
    r.code === "ENOENT" ? e(void 0) : n(r);
  });
}), ts = (t) => new Promise((e, n) => {
  j.readdir(t).then((r) => {
    const s = (i) => {
      if (i === r.length)
        e();
      else {
        const l = Re.resolve(t, r[i]);
        ln.async(l).then(() => {
          s(i + 1);
        });
      }
    };
    s(0);
  }).catch(n);
}), ns = (t, e, n) => new Promise((r, s) => {
  const i = () => {
    const o = bt.normalizeFileMode(e.mode);
    return n.mode !== void 0 && n.mode !== o ? j.chmod(t, n.mode) : Promise.resolve();
  }, l = () => n.empty ? ts(t) : Promise.resolve();
  i().then(l).then(r, s);
}), kt = (t, e) => {
  const n = e || {};
  return new Promise((r, s) => {
    j.mkdir(t, n.mode).then(r).catch((i) => {
      i.code === "ENOENT" ? kt(Re.dirname(t), n).then(() => j.mkdir(t, n.mode)).then(r).catch((l) => {
        l.code === "EEXIST" ? r() : s(l);
      }) : i.code === "EEXIST" ? r() : s(i);
    });
  });
}, rs = (t, e) => new Promise((n, r) => {
  const s = un(e);
  es(t).then((i) => i !== void 0 ? ns(
    t,
    i,
    s
  ) : kt(t, s)).then(n, r);
});
x.validateInput = Zr;
x.sync = Kr;
x.createSync = At;
x.async = rs;
x.createAsync = kt;
const dn = b, G = N, Ye = A, hn = x, ss = (t, e, n, r) => {
  const s = `${t}(path, data, [options])`;
  Ye.argument(s, "path", e, ["string"]), Ye.argument(s, "data", n, [
    "string",
    "buffer",
    "object",
    "array"
  ]), Ye.options(s, "options", r, {
    mode: ["string", "number"],
    atomic: ["boolean"],
    jsonIndent: ["number"]
  });
}, ke = ".__new__", yn = (t, e) => {
  let n = e;
  return typeof n != "number" && (n = 2), typeof t == "object" && !Buffer.isBuffer(t) && t !== null ? JSON.stringify(t, null, n) : t;
}, pn = (t, e, n) => {
  try {
    G.writeFileSync(t, e, n);
  } catch (r) {
    if (r.code === "ENOENT")
      hn.createSync(dn.dirname(t)), G.writeFileSync(t, e, n);
    else
      throw r;
  }
}, is = (t, e, n) => {
  pn(t + ke, e, n), G.renameSync(t + ke, t);
}, os = (t, e, n) => {
  const r = n || {}, s = yn(e, r.jsonIndent);
  let i = pn;
  r.atomic && (i = is), i(t, s, { mode: r.mode });
}, mn = (t, e, n) => new Promise((r, s) => {
  G.writeFile(t, e, n).then(r).catch((i) => {
    i.code === "ENOENT" ? hn.createAsync(dn.dirname(t)).then(() => G.writeFile(t, e, n)).then(r, s) : s(i);
  });
}), cs = (t, e, n) => new Promise((r, s) => {
  mn(t + ke, e, n).then(() => G.rename(t + ke, t)).then(r, s);
}), as = (t, e, n) => {
  const r = n || {}, s = yn(e, r.jsonIndent);
  let i = mn;
  return r.atomic && (i = cs), i(t, s, { mode: r.mode });
};
W.validateInput = ss;
W.sync = os;
W.async = as;
const gn = N, vn = W, Ke = A, ls = (t, e, n, r) => {
  const s = `${t}(path, data, [options])`;
  Ke.argument(s, "path", e, ["string"]), Ke.argument(s, "data", n, ["string", "buffer"]), Ke.options(s, "options", r, {
    mode: ["string", "number"]
  });
}, us = (t, e, n) => {
  try {
    gn.appendFileSync(t, e, n);
  } catch (r) {
    if (r.code === "ENOENT")
      vn.sync(t, e, n);
    else
      throw r;
  }
}, fs = (t, e, n) => new Promise((r, s) => {
  gn.appendFile(t, e, n).then(r).catch((i) => {
    i.code === "ENOENT" ? vn.async(t, e, n).then(r, s) : s(i);
  });
});
Fe.validateInput = ls;
Fe.sync = us;
Fe.async = fs;
var _e = {};
const Be = N, Ot = Me, Rt = A, Ue = W, ds = (t, e, n) => {
  const r = `${t}(path, [criteria])`;
  Rt.argument(r, "path", e, ["string"]), Rt.options(r, "criteria", n, {
    content: ["string", "buffer", "object", "array"],
    jsonIndent: ["number"],
    mode: ["string", "number"]
  });
}, wn = (t) => {
  const e = t || {};
  return e.mode !== void 0 && (e.mode = Ot.normalizeFileMode(e.mode)), e;
}, En = (t) => new Error(
  `Path ${t} exists but is not a file. Halting jetpack.file() call for safety reasons.`
), hs = (t) => {
  let e;
  try {
    e = Be.statSync(t);
  } catch (n) {
    if (n.code !== "ENOENT")
      throw n;
  }
  if (e && !e.isFile())
    throw En(t);
  return e;
}, ys = (t, e, n) => {
  const r = Ot.normalizeFileMode(e.mode), s = () => n.content !== void 0 ? (Ue.sync(t, n.content, {
    mode: r,
    jsonIndent: n.jsonIndent
  }), !0) : !1, i = () => {
    n.mode !== void 0 && n.mode !== r && Be.chmodSync(t, n.mode);
  };
  s() || i();
}, ps = (t, e) => {
  let n = "";
  e.content !== void 0 && (n = e.content), Ue.sync(t, n, {
    mode: e.mode,
    jsonIndent: e.jsonIndent
  });
}, ms = (t, e) => {
  const n = wn(e), r = hs(t);
  r !== void 0 ? ys(t, r, n) : ps(t, n);
}, gs = (t) => new Promise((e, n) => {
  Be.stat(t).then((r) => {
    r.isFile() ? e(r) : n(En(t));
  }).catch((r) => {
    r.code === "ENOENT" ? e(void 0) : n(r);
  });
}), vs = (t, e, n) => {
  const r = Ot.normalizeFileMode(e.mode), s = () => new Promise((l, o) => {
    n.content !== void 0 ? Ue.async(t, n.content, {
      mode: r,
      jsonIndent: n.jsonIndent
    }).then(() => {
      l(!0);
    }).catch(o) : l(!1);
  }), i = () => {
    if (n.mode !== void 0 && n.mode !== r)
      return Be.chmod(t, n.mode);
  };
  return s().then((l) => {
    if (!l)
      return i();
  });
}, ws = (t, e) => {
  let n = "";
  return e.content !== void 0 && (n = e.content), Ue.async(t, n, {
    mode: e.mode,
    jsonIndent: e.jsonIndent
  });
}, Es = (t, e) => new Promise((n, r) => {
  const s = wn(e);
  gs(t).then((i) => i !== void 0 ? vs(t, i, s) : ws(t, s)).then(n, r);
});
_e.validateInput = ds;
_e.sync = ms;
_e.async = Es;
var Le = {}, te = {}, F = {};
const $n = wt, $s = b, U = N, _t = A, ft = ["md5", "sha1", "sha256", "sha512"], dt = ["report", "follow"], Ss = (t, e, n) => {
  const r = `${t}(path, [options])`;
  if (_t.argument(r, "path", e, ["string"]), _t.options(r, "options", n, {
    checksum: ["string"],
    mode: ["boolean"],
    times: ["boolean"],
    absolutePath: ["boolean"],
    symlinks: ["string"]
  }), n && n.checksum !== void 0 && ft.indexOf(n.checksum) === -1)
    throw new Error(
      `Argument "options.checksum" passed to ${r} must have one of values: ${ft.join(
        ", "
      )}`
    );
  if (n && n.symlinks !== void 0 && dt.indexOf(n.symlinks) === -1)
    throw new Error(
      `Argument "options.symlinks" passed to ${r} must have one of values: ${dt.join(
        ", "
      )}`
    );
}, Sn = (t, e, n) => {
  const r = {};
  return r.name = $s.basename(t), n.isFile() ? (r.type = "file", r.size = n.size) : n.isDirectory() ? r.type = "dir" : n.isSymbolicLink() ? r.type = "symlink" : r.type = "other", e.mode && (r.mode = n.mode), e.times && (r.accessTime = n.atime, r.modifyTime = n.mtime, r.changeTime = n.ctime, r.birthTime = n.birthtime), e.absolutePath && (r.absolutePath = t), r;
}, bs = (t, e) => {
  const n = $n.createHash(e), r = U.readFileSync(t);
  return n.update(r), n.digest("hex");
}, As = (t, e, n) => {
  e.type === "file" && n.checksum ? e[n.checksum] = bs(t, n.checksum) : e.type === "symlink" && (e.pointsAt = U.readlinkSync(t));
}, ks = (t, e) => {
  let n = U.lstatSync, r;
  const s = e || {};
  s.symlinks === "follow" && (n = U.statSync);
  try {
    r = n(t);
  } catch (l) {
    if (l.code === "ENOENT")
      return;
    throw l;
  }
  const i = Sn(t, s, r);
  return As(t, i, s), i;
}, Os = (t, e) => new Promise((n, r) => {
  const s = $n.createHash(e), i = U.createReadStream(t);
  i.on("data", (l) => {
    s.update(l);
  }), i.on("end", () => {
    n(s.digest("hex"));
  }), i.on("error", r);
}), Is = (t, e, n) => e.type === "file" && n.checksum ? Os(t, n.checksum).then((r) => (e[n.checksum] = r, e)) : e.type === "symlink" ? U.readlink(t).then((r) => (e.pointsAt = r, e)) : Promise.resolve(e), Ps = (t, e) => new Promise((n, r) => {
  let s = U.lstat;
  const i = e || {};
  i.symlinks === "follow" && (s = U.stat), s(t).then((l) => {
    const o = Sn(t, i, l);
    Is(t, o, i).then(n, r);
  }).catch((l) => {
    l.code === "ENOENT" ? n(void 0) : r(l);
  });
});
F.supportedChecksumAlgorithms = ft;
F.symlinkOptions = dt;
F.validateInput = Ss;
F.sync = ks;
F.async = Ps;
var We = {};
const bn = N, Ts = A, Ns = (t, e) => {
  const n = `${t}(path)`;
  Ts.argument(n, "path", e, ["string", "undefined"]);
}, Cs = (t) => {
  try {
    return bn.readdirSync(t);
  } catch (e) {
    if (e.code === "ENOENT")
      return;
    throw e;
  }
}, Ds = (t) => new Promise((e, n) => {
  bn.readdir(t).then((r) => {
    e(r);
  }).catch((r) => {
    r.code === "ENOENT" ? e(void 0) : n(r);
  });
});
We.validateInput = Ns;
We.sync = Cs;
We.async = Ds;
const Oe = je, Ie = b, Z = F, Pe = (t) => t.isDirectory() ? "dir" : t.isFile() ? "file" : t.isSymbolicLink() ? "symlink" : "other", xs = (t, e, n) => {
  e.maxLevelsDeep === void 0 && (e.maxLevelsDeep = 1 / 0);
  const r = e.inspectOptions !== void 0;
  e.symlinks && (e.inspectOptions === void 0 ? e.inspectOptions = { symlinks: e.symlinks } : e.inspectOptions.symlinks = e.symlinks);
  const s = (l, o) => {
    Oe.readdirSync(l, { withFileTypes: !0 }).forEach((c) => {
      const a = typeof c == "string";
      let u;
      a ? u = Ie.join(l, c) : u = Ie.join(l, c.name);
      let f;
      if (r)
        f = Z.sync(u, e.inspectOptions);
      else if (a) {
        const y = Z.sync(
          u,
          e.inspectOptions
        );
        f = { name: y.name, type: y.type };
      } else {
        const y = Pe(c);
        if (y === "symlink" && e.symlinks === "follow") {
          const h = Oe.statSync(u);
          f = { name: c.name, type: Pe(h) };
        } else
          f = { name: c.name, type: y };
      }
      f !== void 0 && (n(u, f), f.type === "dir" && o < e.maxLevelsDeep && s(u, o + 1));
    });
  }, i = Z.sync(t, e.inspectOptions);
  i ? (r ? n(t, i) : n(t, { name: i.name, type: i.type }), i.type === "dir" && s(t, 1)) : n(t, void 0);
}, js = 5, Fs = (t, e, n, r) => {
  e.maxLevelsDeep === void 0 && (e.maxLevelsDeep = 1 / 0);
  const s = e.inspectOptions !== void 0;
  e.symlinks && (e.inspectOptions === void 0 ? e.inspectOptions = { symlinks: e.symlinks } : e.inspectOptions.symlinks = e.symlinks);
  const i = [];
  let l = 0;
  const o = () => {
    if (i.length === 0 && l === 0)
      r();
    else if (i.length > 0 && l < js) {
      const f = i.pop();
      l += 1, f();
    }
  }, c = (f) => {
    i.push(f), o();
  }, a = () => {
    l -= 1, o();
  }, u = (f, y) => {
    const h = (d, g) => {
      g.type === "dir" && y < e.maxLevelsDeep && u(d, y + 1);
    };
    c(() => {
      Oe.readdir(f, { withFileTypes: !0 }, (d, g) => {
        d ? r(d) : (g.forEach((p) => {
          const k = typeof p == "string";
          let E;
          if (k ? E = Ie.join(f, p) : E = Ie.join(f, p.name), s || k)
            c(() => {
              Z.async(E, e.inspectOptions).then((S) => {
                S !== void 0 && (s ? n(E, S) : n(E, {
                  name: S.name,
                  type: S.type
                }), h(E, S)), a();
              }).catch((S) => {
                r(S);
              });
            });
          else {
            const S = Pe(p);
            if (S === "symlink" && e.symlinks === "follow")
              c(() => {
                Oe.stat(E, ($, C) => {
                  if ($)
                    r($);
                  else {
                    const O = {
                      name: p.name,
                      type: Pe(C)
                    };
                    n(E, O), h(E, O), a();
                  }
                });
              });
            else {
              const $ = { name: p.name, type: S };
              n(E, $), h(E, $);
            }
          }
        }), a());
      });
    });
  };
  Z.async(t, e.inspectOptions).then((f) => {
    f ? (s ? n(t, f) : n(t, { name: f.name, type: f.type }), f.type === "dir" ? u(t, 1) : r()) : (n(t, void 0), r());
  }).catch((f) => {
    r(f);
  });
};
te.sync = xs;
te.async = Fs;
var It = {};
const Ms = typeof process == "object" && process && process.platform === "win32";
var Rs = Ms ? { sep: "\\" } : { sep: "/" }, _s = An;
function An(t, e, n) {
  t instanceof RegExp && (t = Bt(t, n)), e instanceof RegExp && (e = Bt(e, n));
  var r = kn(t, e, n);
  return r && {
    start: r[0],
    end: r[1],
    pre: n.slice(0, r[0]),
    body: n.slice(r[0] + t.length, r[1]),
    post: n.slice(r[1] + e.length)
  };
}
function Bt(t, e) {
  var n = e.match(t);
  return n ? n[0] : null;
}
An.range = kn;
function kn(t, e, n) {
  var r, s, i, l, o, c = n.indexOf(t), a = n.indexOf(e, c + 1), u = c;
  if (c >= 0 && a > 0) {
    if (t === e)
      return [c, a];
    for (r = [], i = n.length; u >= 0 && !o; )
      u == c ? (r.push(u), c = n.indexOf(t, u + 1)) : r.length == 1 ? o = [r.pop(), a] : (s = r.pop(), s < i && (i = s, l = a), a = n.indexOf(e, u + 1)), u = c < a && c >= 0 ? c : a;
    r.length && (o = [i, l]);
  }
  return o;
}
var On = _s, Bs = Ws, In = "\0SLASH" + Math.random() + "\0", Pn = "\0OPEN" + Math.random() + "\0", Pt = "\0CLOSE" + Math.random() + "\0", Tn = "\0COMMA" + Math.random() + "\0", Nn = "\0PERIOD" + Math.random() + "\0";
function et(t) {
  return parseInt(t, 10) == t ? parseInt(t, 10) : t.charCodeAt(0);
}
function Us(t) {
  return t.split("\\\\").join(In).split("\\{").join(Pn).split("\\}").join(Pt).split("\\,").join(Tn).split("\\.").join(Nn);
}
function Ls(t) {
  return t.split(In).join("\\").split(Pn).join("{").split(Pt).join("}").split(Tn).join(",").split(Nn).join(".");
}
function Cn(t) {
  if (!t)
    return [""];
  var e = [], n = On("{", "}", t);
  if (!n)
    return t.split(",");
  var r = n.pre, s = n.body, i = n.post, l = r.split(",");
  l[l.length - 1] += "{" + s + "}";
  var o = Cn(i);
  return i.length && (l[l.length - 1] += o.shift(), l.push.apply(l, o)), e.push.apply(e, l), e;
}
function Ws(t) {
  return t ? (t.substr(0, 2) === "{}" && (t = "\\{\\}" + t.substr(2)), V(Us(t), !0).map(Ls)) : [];
}
function zs(t) {
  return "{" + t + "}";
}
function qs(t) {
  return /^-?0\d/.test(t);
}
function Hs(t, e) {
  return t <= e;
}
function Gs(t, e) {
  return t >= e;
}
function V(t, e) {
  var n = [], r = On("{", "}", t);
  if (!r) return [t];
  var s = r.pre, i = r.post.length ? V(r.post, !1) : [""];
  if (/\$$/.test(r.pre))
    for (var l = 0; l < i.length; l++) {
      var o = s + "{" + r.body + "}" + i[l];
      n.push(o);
    }
  else {
    var c = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(r.body), a = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(r.body), u = c || a, f = r.body.indexOf(",") >= 0;
    if (!u && !f)
      return r.post.match(/,.*\}/) ? (t = r.pre + "{" + r.body + Pt + r.post, V(t)) : [t];
    var y;
    if (u)
      y = r.body.split(/\.\./);
    else if (y = Cn(r.body), y.length === 1 && (y = V(y[0], !1).map(zs), y.length === 1))
      return i.map(function(z) {
        return r.pre + y[0] + z;
      });
    var h;
    if (u) {
      var d = et(y[0]), g = et(y[1]), p = Math.max(y[0].length, y[1].length), k = y.length == 3 ? Math.abs(et(y[2])) : 1, E = Hs, S = g < d;
      S && (k *= -1, E = Gs);
      var $ = y.some(qs);
      h = [];
      for (var C = d; E(C, g); C += k) {
        var O;
        if (a)
          O = String.fromCharCode(C), O === "\\" && (O = "");
        else if (O = String(C), $) {
          var v = p - O.length;
          if (v > 0) {
            var m = new Array(v + 1).join("0");
            C < 0 ? O = "-" + m + O.slice(1) : O = m + O;
          }
        }
        h.push(O);
      }
    } else {
      h = [];
      for (var w = 0; w < y.length; w++)
        h.push.apply(h, V(y[w], !1));
    }
    for (var w = 0; w < h.length; w++)
      for (var l = 0; l < i.length; l++) {
        var o = s + h[w] + i[l];
        (!e || u || o) && n.push(o);
      }
  }
  return n;
}
const T = Dn = (t, e, n = {}) => (Te(e), !n.nocomment && e.charAt(0) === "#" ? !1 : new ze(e, n).match(t));
var Dn = T;
const ht = Rs;
T.sep = ht.sep;
const D = Symbol("globstar **");
T.GLOBSTAR = D;
const Js = Bs, Ut = {
  "!": { open: "(?:(?!(?:", close: "))[^/]*?)" },
  "?": { open: "(?:", close: ")?" },
  "+": { open: "(?:", close: ")+" },
  "*": { open: "(?:", close: ")*" },
  "@": { open: "(?:", close: ")" }
}, yt = "[^/]", tt = yt + "*?", Xs = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?", Vs = "(?:(?!(?:\\/|^)\\.).)*?", xn = (t) => t.split("").reduce((e, n) => (e[n] = !0, e), {}), Lt = xn("().*{}+?[]^$\\!"), Zs = xn("[.("), Wt = /\/+/;
T.filter = (t, e = {}) => (n, r, s) => T(n, t, e);
const _ = (t, e = {}) => {
  const n = {};
  return Object.keys(t).forEach((r) => n[r] = t[r]), Object.keys(e).forEach((r) => n[r] = e[r]), n;
};
T.defaults = (t) => {
  if (!t || typeof t != "object" || !Object.keys(t).length)
    return T;
  const e = T, n = (r, s, i) => e(r, s, _(t, i));
  return n.Minimatch = class extends e.Minimatch {
    constructor(s, i) {
      super(s, _(t, i));
    }
  }, n.Minimatch.defaults = (r) => e.defaults(_(t, r)).Minimatch, n.filter = (r, s) => e.filter(r, _(t, s)), n.defaults = (r) => e.defaults(_(t, r)), n.makeRe = (r, s) => e.makeRe(r, _(t, s)), n.braceExpand = (r, s) => e.braceExpand(r, _(t, s)), n.match = (r, s, i) => e.match(r, s, _(t, i)), n;
};
T.braceExpand = (t, e) => jn(t, e);
const jn = (t, e = {}) => (Te(t), e.nobrace || !/\{(?:(?!\{).)*\}/.test(t) ? [t] : Js(t)), Qs = 1024 * 64, Te = (t) => {
  if (typeof t != "string")
    throw new TypeError("invalid pattern");
  if (t.length > Qs)
    throw new TypeError("pattern is too long");
}, nt = Symbol("subparse");
T.makeRe = (t, e) => new ze(t, e || {}).makeRe();
T.match = (t, e, n = {}) => {
  const r = new ze(e, n);
  return t = t.filter((s) => r.match(s)), r.options.nonull && !t.length && t.push(e), t;
};
const Ys = (t) => t.replace(/\\(.)/g, "$1"), Ks = (t) => t.replace(/\\([^-\]])/g, "$1"), ei = (t) => t.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), ti = (t) => t.replace(/[[\]\\]/g, "\\$&");
let ze = class {
  constructor(e, n) {
    Te(e), n || (n = {}), this.options = n, this.set = [], this.pattern = e, this.windowsPathsNoEscape = !!n.windowsPathsNoEscape || n.allowWindowsEscape === !1, this.windowsPathsNoEscape && (this.pattern = this.pattern.replace(/\\/g, "/")), this.regexp = null, this.negate = !1, this.comment = !1, this.empty = !1, this.partial = !!n.partial, this.make();
  }
  debug() {
  }
  make() {
    const e = this.pattern, n = this.options;
    if (!n.nocomment && e.charAt(0) === "#") {
      this.comment = !0;
      return;
    }
    if (!e) {
      this.empty = !0;
      return;
    }
    this.parseNegate();
    let r = this.globSet = this.braceExpand();
    n.debug && (this.debug = (...s) => console.error(...s)), this.debug(this.pattern, r), r = this.globParts = r.map((s) => s.split(Wt)), this.debug(this.pattern, r), r = r.map((s, i, l) => s.map(this.parse, this)), this.debug(this.pattern, r), r = r.filter((s) => s.indexOf(!1) === -1), this.debug(this.pattern, r), this.set = r;
  }
  parseNegate() {
    if (this.options.nonegate) return;
    const e = this.pattern;
    let n = !1, r = 0;
    for (let s = 0; s < e.length && e.charAt(s) === "!"; s++)
      n = !n, r++;
    r && (this.pattern = e.slice(r)), this.negate = n;
  }
  // set partial to true to test if, for example,
  // "/a/b" matches the start of "/*/b/*/d"
  // Partial means, if you run out of file before you run
  // out of pattern, then that's fine, as long as all
  // the parts match.
  matchOne(e, n, r) {
    var s = this.options;
    this.debug(
      "matchOne",
      { this: this, file: e, pattern: n }
    ), this.debug("matchOne", e.length, n.length);
    for (var i = 0, l = 0, o = e.length, c = n.length; i < o && l < c; i++, l++) {
      this.debug("matchOne loop");
      var a = n[l], u = e[i];
      if (this.debug(n, a, u), a === !1) return !1;
      if (a === D) {
        this.debug("GLOBSTAR", [n, a, u]);
        var f = i, y = l + 1;
        if (y === c) {
          for (this.debug("** at the end"); i < o; i++)
            if (e[i] === "." || e[i] === ".." || !s.dot && e[i].charAt(0) === ".") return !1;
          return !0;
        }
        for (; f < o; ) {
          var h = e[f];
          if (this.debug(`
globstar while`, e, f, n, y, h), this.matchOne(e.slice(f), n.slice(y), r))
            return this.debug("globstar found match!", f, o, h), !0;
          if (h === "." || h === ".." || !s.dot && h.charAt(0) === ".") {
            this.debug("dot detected!", e, f, n, y);
            break;
          }
          this.debug("globstar swallow a segment, and continue"), f++;
        }
        return !!(r && (this.debug(`
>>> no match, partial?`, e, f, n, y), f === o));
      }
      var d;
      if (typeof a == "string" ? (d = u === a, this.debug("string match", a, u, d)) : (d = u.match(a), this.debug("pattern match", a, u, d)), !d) return !1;
    }
    if (i === o && l === c)
      return !0;
    if (i === o)
      return r;
    if (l === c)
      return i === o - 1 && e[i] === "";
    throw new Error("wtf?");
  }
  braceExpand() {
    return jn(this.pattern, this.options);
  }
  parse(e, n) {
    Te(e);
    const r = this.options;
    if (e === "**")
      if (r.noglobstar)
        e = "*";
      else
        return D;
    if (e === "") return "";
    let s = "", i = !1, l = !1;
    const o = [], c = [];
    let a, u = !1, f = -1, y = -1, h, d, g, p = e.charAt(0) === ".", k = r.dot || p;
    const E = () => p ? "" : k ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)", S = (v) => v.charAt(0) === "." ? "" : r.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)", $ = () => {
      if (a) {
        switch (a) {
          case "*":
            s += tt, i = !0;
            break;
          case "?":
            s += yt, i = !0;
            break;
          default:
            s += "\\" + a;
            break;
        }
        this.debug("clearStateChar %j %j", a, s), a = !1;
      }
    };
    for (let v = 0, m; v < e.length && (m = e.charAt(v)); v++) {
      if (this.debug("%s	%s %s %j", e, v, s, m), l) {
        if (m === "/")
          return !1;
        Lt[m] && (s += "\\"), s += m, l = !1;
        continue;
      }
      switch (m) {
        case "/":
          return !1;
        case "\\":
          if (u && e.charAt(v + 1) === "-") {
            s += m;
            continue;
          }
          $(), l = !0;
          continue;
        case "?":
        case "*":
        case "+":
        case "@":
        case "!":
          if (this.debug("%s	%s %s %j <-- stateChar", e, v, s, m), u) {
            this.debug("  in class"), m === "!" && v === y + 1 && (m = "^"), s += m;
            continue;
          }
          this.debug("call clearStateChar %j", a), $(), a = m, r.noext && $();
          continue;
        case "(": {
          if (u) {
            s += "(";
            continue;
          }
          if (!a) {
            s += "\\(";
            continue;
          }
          const w = {
            type: a,
            start: v - 1,
            reStart: s.length,
            open: Ut[a].open,
            close: Ut[a].close
          };
          this.debug(this.pattern, "	", w), o.push(w), s += w.open, w.start === 0 && w.type !== "!" && (p = !0, s += S(e.slice(v + 1))), this.debug("plType %j %j", a, s), a = !1;
          continue;
        }
        case ")": {
          const w = o[o.length - 1];
          if (u || !w) {
            s += "\\)";
            continue;
          }
          o.pop(), $(), i = !0, d = w, s += d.close, d.type === "!" && c.push(Object.assign(d, { reEnd: s.length }));
          continue;
        }
        case "|": {
          const w = o[o.length - 1];
          if (u || !w) {
            s += "\\|";
            continue;
          }
          $(), s += "|", w.start === 0 && w.type !== "!" && (p = !0, s += S(e.slice(v + 1)));
          continue;
        }
        case "[":
          if ($(), u) {
            s += "\\" + m;
            continue;
          }
          u = !0, y = v, f = s.length, s += m;
          continue;
        case "]":
          if (v === y + 1 || !u) {
            s += "\\" + m;
            continue;
          }
          h = e.substring(y + 1, v);
          try {
            RegExp("[" + ti(Ks(h)) + "]"), s += m;
          } catch {
            s = s.substring(0, f) + "(?:$.)";
          }
          i = !0, u = !1;
          continue;
        default:
          $(), Lt[m] && !(m === "^" && u) && (s += "\\"), s += m;
          break;
      }
    }
    for (u && (h = e.slice(y + 1), g = this.parse(h, nt), s = s.substring(0, f) + "\\[" + g[0], i = i || g[1]), d = o.pop(); d; d = o.pop()) {
      let v;
      v = s.slice(d.reStart + d.open.length), this.debug("setting tail", s, d), v = v.replace(/((?:\\{2}){0,64})(\\?)\|/g, (w, z, M) => (M || (M = "\\"), z + z + M + "|")), this.debug(`tail=%j
   %s`, v, v, d, s);
      const m = d.type === "*" ? tt : d.type === "?" ? yt : "\\" + d.type;
      i = !0, s = s.slice(0, d.reStart) + m + "\\(" + v;
    }
    $(), l && (s += "\\\\");
    const C = Zs[s.charAt(0)];
    for (let v = c.length - 1; v > -1; v--) {
      const m = c[v], w = s.slice(0, m.reStart), z = s.slice(m.reStart, m.reEnd - 8);
      let M = s.slice(m.reEnd);
      const br = s.slice(m.reEnd - 8, m.reEnd) + M, Ar = w.split(")").length, kr = w.split("(").length - Ar;
      let Qe = M;
      for (let Ft = 0; Ft < kr; Ft++)
        Qe = Qe.replace(/\)[+*?]?/, "");
      M = Qe;
      const Or = M === "" && n !== nt ? "(?:$|\\/)" : "";
      s = w + z + M + Or + br;
    }
    if (s !== "" && i && (s = "(?=.)" + s), C && (s = E() + s), n === nt)
      return [s, i];
    if (r.nocase && !i && (i = e.toUpperCase() !== e.toLowerCase()), !i)
      return Ys(e);
    const O = r.nocase ? "i" : "";
    try {
      return Object.assign(new RegExp("^" + s + "$", O), {
        _glob: e,
        _src: s
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
    const n = this.options, r = n.noglobstar ? tt : n.dot ? Xs : Vs, s = n.nocase ? "i" : "";
    let i = e.map((l) => (l = l.map(
      (o) => typeof o == "string" ? ei(o) : o === D ? D : o._src
    ).reduce((o, c) => (o[o.length - 1] === D && c === D || o.push(c), o), []), l.forEach((o, c) => {
      o !== D || l[c - 1] === D || (c === 0 ? l.length > 1 ? l[c + 1] = "(?:\\/|" + r + "\\/)?" + l[c + 1] : l[c] = r : c === l.length - 1 ? l[c - 1] += "(?:\\/|" + r + ")?" : (l[c - 1] += "(?:\\/|\\/" + r + "\\/)" + l[c + 1], l[c + 1] = D));
    }), l.filter((o) => o !== D).join("/"))).join("|");
    i = "^(?:" + i + ")$", this.negate && (i = "^(?!" + i + ").*$");
    try {
      this.regexp = new RegExp(i, s);
    } catch {
      this.regexp = !1;
    }
    return this.regexp;
  }
  match(e, n = this.partial) {
    if (this.debug("match", e, this.pattern), this.comment) return !1;
    if (this.empty) return e === "";
    if (e === "/" && n) return !0;
    const r = this.options;
    ht.sep !== "/" && (e = e.split(ht.sep).join("/")), e = e.split(Wt), this.debug(this.pattern, "split", e);
    const s = this.set;
    this.debug(this.pattern, "set", s);
    let i;
    for (let l = e.length - 1; l >= 0 && (i = e[l], !i); l--)
      ;
    for (let l = 0; l < s.length; l++) {
      const o = s[l];
      let c = e;
      if (r.matchBase && o.length === 1 && (c = [i]), this.matchOne(c, o, n))
        return r.flipNegate ? !0 : !this.negate;
    }
    return r.flipNegate ? !1 : this.negate;
  }
  static defaults(e) {
    return T.defaults(e).Minimatch;
  }
};
T.Minimatch = ze;
const ni = Dn.Minimatch, ri = (t, e) => {
  const n = e.indexOf("/") !== -1, r = /^!?\//.test(e), s = /^!/.test(e);
  let i;
  if (!r && n) {
    const l = e.replace(/^!/, "").replace(/^\.\//, "");
    return /\/$/.test(t) ? i = "" : i = "/", s ? `!${t}${i}${l}` : `${t}${i}${l}`;
  }
  return e;
};
It.create = (t, e, n) => {
  let r;
  typeof e == "string" ? r = [e] : r = e;
  const s = r.map((l) => ri(t, l)).map((l) => new ni(l, {
    matchBase: !0,
    nocomment: !0,
    nocase: n || !1,
    dot: !0,
    windowsPathsNoEscape: !0
  }));
  return (l) => {
    let o = "matching", c = !1, a, u;
    for (u = 0; u < s.length; u += 1) {
      if (a = s[u], a.negate && (o = "negation", u === 0 && (c = !0)), o === "negation" && c && !a.match(l))
        return !1;
      o === "matching" && !c && (c = a.match(l));
    }
    return c;
  };
};
const si = b, Fn = te, Mn = F, Rn = It, zt = A, ii = (t, e, n) => {
  const r = `${t}([path], options)`;
  zt.argument(r, "path", e, ["string"]), zt.options(r, "options", n, {
    matching: ["string", "array of string"],
    filter: ["function"],
    files: ["boolean"],
    directories: ["boolean"],
    recursive: ["boolean"],
    ignoreCase: ["boolean"]
  });
}, _n = (t) => {
  const e = t || {};
  return e.matching === void 0 && (e.matching = "*"), e.files === void 0 && (e.files = !0), e.ignoreCase === void 0 && (e.ignoreCase = !1), e.directories === void 0 && (e.directories = !1), e.recursive === void 0 && (e.recursive = !0), e;
}, Bn = (t, e) => t.map((n) => si.relative(e, n)), Un = (t) => {
  const e = new Error(`Path you want to find stuff in doesn't exist ${t}`);
  return e.code = "ENOENT", e;
}, Ln = (t) => {
  const e = new Error(
    `Path you want to find stuff in must be a directory ${t}`
  );
  return e.code = "ENOTDIR", e;
}, oi = (t, e) => {
  const n = [], r = Rn.create(
    t,
    e.matching,
    e.ignoreCase
  );
  let s = 1 / 0;
  return e.recursive === !1 && (s = 1), Fn.sync(
    t,
    {
      maxLevelsDeep: s,
      symlinks: "follow",
      inspectOptions: { times: !0, absolutePath: !0 }
    },
    (i, l) => {
      l && i !== t && r(i) && (l.type === "file" && e.files === !0 || l.type === "dir" && e.directories === !0) && (e.filter ? e.filter(l) && n.push(i) : n.push(i));
    }
  ), n.sort(), Bn(n, e.cwd);
}, ci = (t, e) => {
  const n = Mn.sync(t, { symlinks: "follow" });
  if (n === void 0)
    throw Un(t);
  if (n.type !== "dir")
    throw Ln(t);
  return oi(t, _n(e));
}, ai = (t, e) => new Promise((n, r) => {
  const s = [], i = Rn.create(
    t,
    e.matching,
    e.ignoreCase
  );
  let l = 1 / 0;
  e.recursive === !1 && (l = 1);
  let o = 0, c = !1;
  const a = () => {
    c && o === 0 && (s.sort(), n(Bn(s, e.cwd)));
  };
  Fn.async(
    t,
    {
      maxLevelsDeep: l,
      symlinks: "follow",
      inspectOptions: { times: !0, absolutePath: !0 }
    },
    (u, f) => {
      if (f && u !== t && i(u) && (f.type === "file" && e.files === !0 || f.type === "dir" && e.directories === !0))
        if (e.filter) {
          const h = e.filter(f);
          typeof h.then == "function" ? (o += 1, h.then((g) => {
            g && s.push(u), o -= 1, a();
          }).catch((g) => {
            r(g);
          })) : h && s.push(u);
        } else
          s.push(u);
    },
    (u) => {
      u ? r(u) : (c = !0, a());
    }
  );
}), li = (t, e) => Mn.async(t, { symlinks: "follow" }).then((n) => {
  if (n === void 0)
    throw Un(t);
  if (n.type !== "dir")
    throw Ln(t);
  return ai(t, _n(e));
});
Le.validateInput = ii;
Le.sync = ci;
Le.async = li;
var qe = {};
const ui = wt, Ne = b, se = F, qt = A, Wn = te, fi = (t, e, n) => {
  const r = `${t}(path, [options])`;
  if (qt.argument(r, "path", e, ["string"]), qt.options(r, "options", n, {
    checksum: ["string"],
    relativePath: ["boolean"],
    times: ["boolean"],
    symlinks: ["string"]
  }), n && n.checksum !== void 0 && se.supportedChecksumAlgorithms.indexOf(n.checksum) === -1)
    throw new Error(
      `Argument "options.checksum" passed to ${r} must have one of values: ${se.supportedChecksumAlgorithms.join(
        ", "
      )}`
    );
  if (n && n.symlinks !== void 0 && se.symlinkOptions.indexOf(n.symlinks) === -1)
    throw new Error(
      `Argument "options.symlinks" passed to ${r} must have one of values: ${se.symlinkOptions.join(
        ", "
      )}`
    );
}, di = (t, e) => t === void 0 ? "." : t.relativePath + "/" + e.name, hi = (t, e) => {
  const n = ui.createHash(e);
  return t.forEach((r) => {
    n.update(r.name + r[e]);
  }), n.digest("hex");
}, Tt = (t, e, n) => {
  n.relativePath && (e.relativePath = di(t, e)), e.type === "dir" && (e.children.forEach((r) => {
    Tt(e, r, n);
  }), e.size = 0, e.children.sort((r, s) => r.type === "dir" && s.type === "file" ? -1 : r.type === "file" && s.type === "dir" ? 1 : r.name.localeCompare(s.name)), e.children.forEach((r) => {
    e.size += r.size || 0;
  }), n.checksum && (e[n.checksum] = hi(
    e.children,
    n.checksum
  )));
}, Nt = (t, e, n) => {
  const r = e[0];
  if (e.length > 1) {
    const s = t.children.find((i) => i.name === r);
    return Nt(s, e.slice(1));
  }
  return t;
}, yi = (t, e) => {
  const n = e || {};
  let r;
  return Wn.sync(t, { inspectOptions: n }, (s, i) => {
    if (i) {
      i.type === "dir" && (i.children = []);
      const l = Ne.relative(t, s);
      l === "" ? r = i : Nt(
        r,
        l.split(Ne.sep)
      ).children.push(i);
    }
  }), r && Tt(void 0, r, n), r;
}, pi = (t, e) => {
  const n = e || {};
  let r;
  return new Promise((s, i) => {
    Wn.async(
      t,
      { inspectOptions: n },
      (l, o) => {
        if (o) {
          o.type === "dir" && (o.children = []);
          const c = Ne.relative(t, l);
          c === "" ? r = o : Nt(
            r,
            c.split(Ne.sep)
          ).children.push(o);
        }
      },
      (l) => {
        l ? i(l) : (r && Tt(void 0, r, n), s(r));
      }
    );
  });
};
qe.validateInput = fi;
qe.sync = yi;
qe.async = pi;
var ne = {}, X = {};
const zn = N, mi = A, gi = (t, e) => {
  const n = `${t}(path)`;
  mi.argument(n, "path", e, ["string"]);
}, vi = (t) => {
  try {
    const e = zn.statSync(t);
    return e.isDirectory() ? "dir" : e.isFile() ? "file" : "other";
  } catch (e) {
    if (e.code !== "ENOENT")
      throw e;
  }
  return !1;
}, wi = (t) => new Promise((e, n) => {
  zn.stat(t).then((r) => {
    r.isDirectory() ? e("dir") : r.isFile() ? e("file") : e("other");
  }).catch((r) => {
    r.code === "ENOENT" ? e(!1) : n(r);
  });
});
X.validateInput = gi;
X.sync = vi;
X.async = wi;
const Y = b, P = N, Ct = x, Ce = X, qn = F, Ei = W, $i = It, Hn = Me, Gn = te, rt = A, Si = (t, e, n, r) => {
  const s = `${t}(from, to, [options])`;
  rt.argument(s, "from", e, ["string"]), rt.argument(s, "to", n, ["string"]), rt.options(s, "options", r, {
    overwrite: ["boolean", "function"],
    matching: ["string", "array of string"],
    ignoreCase: ["boolean"]
  });
}, Jn = (t, e) => {
  const n = t || {}, r = {};
  return n.ignoreCase === void 0 && (n.ignoreCase = !1), r.overwrite = n.overwrite, n.matching ? r.allowedToCopy = $i.create(
    e,
    n.matching,
    n.ignoreCase
  ) : r.allowedToCopy = () => !0, r;
}, Xn = (t) => {
  const e = new Error(`Path to copy doesn't exist ${t}`);
  return e.code = "ENOENT", e;
}, He = (t) => {
  const e = new Error(`Destination path already exists ${t}`);
  return e.code = "EEXIST", e;
}, Ge = {
  mode: !0,
  symlinks: "report",
  times: !0,
  absolutePath: !0
}, Vn = (t) => typeof t.opts.overwrite != "function" && t.opts.overwrite !== !0, bi = (t, e, n) => {
  if (!Ce.sync(t))
    throw Xn(t);
  if (Ce.sync(e) && !n.overwrite)
    throw He(e);
}, Ai = (t) => {
  if (typeof t.opts.overwrite == "function") {
    const e = qn.sync(t.destPath, Ge);
    return t.opts.overwrite(t.srcInspectData, e);
  }
  return t.opts.overwrite === !0;
}, ki = (t, e, n, r) => {
  const s = P.readFileSync(t);
  try {
    P.writeFileSync(e, s, { mode: n, flag: "wx" });
  } catch (i) {
    if (i.code === "ENOENT")
      Ei.sync(e, s, { mode: n });
    else if (i.code === "EEXIST") {
      if (Ai(r))
        P.writeFileSync(e, s, { mode: n });
      else if (Vn(r))
        throw He(r.destPath);
    } else
      throw i;
  }
}, Oi = (t, e) => {
  const n = P.readlinkSync(t);
  try {
    P.symlinkSync(n, e);
  } catch (r) {
    if (r.code === "EEXIST")
      P.unlinkSync(e), P.symlinkSync(n, e);
    else
      throw r;
  }
}, Ii = (t, e, n, r) => {
  const s = { srcPath: t, destPath: n, srcInspectData: e, opts: r }, i = Hn.normalizeFileMode(e.mode);
  e.type === "dir" ? Ct.createSync(n, { mode: i }) : e.type === "file" ? ki(t, n, i, s) : e.type === "symlink" && Oi(t, n);
}, Pi = (t, e, n) => {
  const r = Jn(n, t);
  bi(t, e, r), Gn.sync(t, { inspectOptions: Ge }, (s, i) => {
    const l = Y.relative(t, s), o = Y.resolve(e, l);
    r.allowedToCopy(s, o, i) && Ii(s, i, o, r);
  });
}, Ti = (t, e, n) => Ce.async(t).then((r) => {
  if (r)
    return Ce.async(e);
  throw Xn(t);
}).then((r) => {
  if (r && !n.overwrite)
    throw He(e);
}), Ni = (t) => new Promise((e, n) => {
  typeof t.opts.overwrite == "function" ? qn.async(t.destPath, Ge).then((r) => {
    e(
      t.opts.overwrite(t.srcInspectData, r)
    );
  }).catch(n) : e(t.opts.overwrite === !0);
}), pt = (t, e, n, r, s) => new Promise((i, l) => {
  const o = s || {};
  let c = "wx";
  o.overwrite && (c = "w");
  const a = P.createReadStream(t), u = P.createWriteStream(e, { mode: n, flags: c });
  a.on("error", l), u.on("error", (f) => {
    a.resume(), f.code === "ENOENT" ? Ct.createAsync(Y.dirname(e)).then(() => {
      pt(t, e, n, r).then(
        i,
        l
      );
    }).catch(l) : f.code === "EEXIST" ? Ni(r).then((y) => {
      y ? pt(t, e, n, r, {
        overwrite: !0
      }).then(i, l) : Vn(r) ? l(He(e)) : i();
    }).catch(l) : l(f);
  }), u.on("finish", i), a.pipe(u);
}), Ci = (t, e) => P.readlink(t).then((n) => new Promise((r, s) => {
  P.symlink(n, e).then(r).catch((i) => {
    i.code === "EEXIST" ? P.unlink(e).then(() => P.symlink(n, e)).then(r, s) : s(i);
  });
})), Di = (t, e, n, r) => {
  const s = { srcPath: t, destPath: n, srcInspectData: e, opts: r }, i = Hn.normalizeFileMode(e.mode);
  return e.type === "dir" ? Ct.createAsync(n, { mode: i }) : e.type === "file" ? pt(t, n, i, s) : e.type === "symlink" ? Ci(t, n) : Promise.resolve();
}, xi = (t, e, n) => new Promise((r, s) => {
  const i = Jn(n, t);
  Ti(t, e, i).then(() => {
    let l = !1, o = 0;
    Gn.async(
      t,
      { inspectOptions: Ge },
      (c, a) => {
        if (a) {
          const u = Y.relative(t, c), f = Y.resolve(e, u);
          i.allowedToCopy(c, a, f) && (o += 1, Di(c, a, f, i).then(() => {
            o -= 1, l && o === 0 && r();
          }).catch(s));
        }
      },
      (c) => {
        c ? s(c) : (l = !0, l && o === 0 && r());
      }
    );
  }).catch(s);
});
ne.validateInput = Si;
ne.sync = Pi;
ne.async = xi;
var re = {};
const Zn = b, q = N, st = A, Qn = ne, Yn = x, K = X, De = J, ji = (t, e, n, r) => {
  const s = `${t}(from, to, [options])`;
  st.argument(s, "from", e, ["string"]), st.argument(s, "to", n, ["string"]), st.options(s, "options", r, {
    overwrite: ["boolean"]
  });
}, Kn = (t) => t || {}, er = (t) => {
  const e = new Error(`Destination path already exists ${t}`);
  return e.code = "EEXIST", e;
}, tr = (t) => {
  const e = new Error(`Path to move doesn't exist ${t}`);
  return e.code = "ENOENT", e;
}, Fi = (t, e, n) => {
  const r = Kn(n);
  if (K.sync(e) !== !1 && r.overwrite !== !0)
    throw er(e);
  try {
    q.renameSync(t, e);
  } catch (s) {
    if (s.code === "EISDIR" || s.code === "EPERM")
      De.sync(e), q.renameSync(t, e);
    else if (s.code === "EXDEV")
      Qn.sync(t, e, { overwrite: !0 }), De.sync(t);
    else if (s.code === "ENOENT") {
      if (!K.sync(t))
        throw tr(t);
      Yn.createSync(Zn.dirname(e)), q.renameSync(t, e);
    } else
      throw s;
  }
}, Mi = (t) => new Promise((e, n) => {
  const r = Zn.dirname(t);
  K.async(r).then((s) => {
    s ? n() : Yn.createAsync(r).then(e, n);
  }).catch(n);
}), Ri = (t, e, n) => {
  const r = Kn(n);
  return new Promise((s, i) => {
    K.async(e).then((l) => {
      l !== !1 && r.overwrite !== !0 ? i(er(e)) : q.rename(t, e).then(s).catch((o) => {
        o.code === "EISDIR" || o.code === "EPERM" ? De.async(e).then(() => q.rename(t, e)).then(s, i) : o.code === "EXDEV" ? Qn.async(t, e, { overwrite: !0 }).then(() => De.async(t)).then(s, i) : o.code === "ENOENT" ? K.async(t).then((c) => {
          c ? Mi(e).then(() => q.rename(t, e)).then(s, i) : i(tr(t));
        }).catch(i) : i(o);
      });
    });
  });
};
re.validateInput = ji;
re.sync = Fi;
re.async = Ri;
var Je = {};
const nr = N, Ht = A, Gt = ["utf8", "buffer", "json", "jsonWithDates"], _i = (t, e, n) => {
  const r = `${t}(path, returnAs)`;
  if (Ht.argument(r, "path", e, ["string"]), Ht.argument(r, "returnAs", n, [
    "string",
    "undefined"
  ]), n && Gt.indexOf(n) === -1)
    throw new Error(
      `Argument "returnAs" passed to ${r} must have one of values: ${Gt.join(
        ", "
      )}`
    );
}, rr = (t, e) => typeof e == "string" && /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/.exec(e) ? new Date(e) : e, sr = (t, e) => {
  const n = new Error(
    `JSON parsing failed while reading ${t} [${e}]`
  );
  return n.originalError = e, n;
}, Bi = (t, e) => {
  const n = e || "utf8";
  let r, s = "utf8";
  n === "buffer" && (s = null);
  try {
    r = nr.readFileSync(t, { encoding: s });
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw i;
  }
  try {
    n === "json" ? r = JSON.parse(r) : n === "jsonWithDates" && (r = JSON.parse(r, rr));
  } catch (i) {
    throw sr(t, i);
  }
  return r;
}, Ui = (t, e) => new Promise((n, r) => {
  const s = e || "utf8";
  let i = "utf8";
  s === "buffer" && (i = null), nr.readFile(t, { encoding: i }).then((l) => {
    try {
      n(s === "json" ? JSON.parse(l) : s === "jsonWithDates" ? JSON.parse(l, rr) : l);
    } catch (o) {
      r(sr(t, o));
    }
  }).catch((l) => {
    l.code === "ENOENT" ? n(void 0) : r(l);
  });
});
Je.validateInput = _i;
Je.sync = Bi;
Je.async = Ui;
var Xe = {};
const ee = b, ir = re, it = A, Li = (t, e, n, r) => {
  const s = `${t}(path, newName, [options])`;
  if (it.argument(s, "path", e, ["string"]), it.argument(s, "newName", n, ["string"]), it.options(s, "options", r, {
    overwrite: ["boolean"]
  }), ee.basename(n) !== n)
    throw new Error(
      `Argument "newName" passed to ${s} should be a filename, not a path. Received "${n}"`
    );
}, Wi = (t, e, n) => {
  const r = ee.join(ee.dirname(t), e);
  ir.sync(t, r, n);
}, zi = (t, e, n) => {
  const r = ee.join(ee.dirname(t), e);
  return ir.async(t, r, n);
};
Xe.validateInput = Li;
Xe.sync = Wi;
Xe.async = zi;
var Ve = {};
const or = b, xe = N, Jt = A, cr = x, qi = (t, e, n) => {
  const r = `${t}(symlinkValue, path)`;
  Jt.argument(r, "symlinkValue", e, ["string"]), Jt.argument(r, "path", n, ["string"]);
}, Hi = (t, e) => {
  try {
    xe.symlinkSync(t, e);
  } catch (n) {
    if (n.code === "ENOENT")
      cr.createSync(or.dirname(e)), xe.symlinkSync(t, e);
    else
      throw n;
  }
}, Gi = (t, e) => new Promise((n, r) => {
  xe.symlink(t, e).then(n).catch((s) => {
    s.code === "ENOENT" ? cr.createAsync(or.dirname(e)).then(() => xe.symlink(t, e)).then(n, r) : r(s);
  });
});
Ve.validateInput = qi;
Ve.sync = Hi;
Ve.async = Gi;
var Dt = {};
const ar = je;
Dt.createWriteStream = ar.createWriteStream;
Dt.createReadStream = ar.createReadStream;
var Ze = {};
const xt = b, Ji = Nr, lr = wt, ur = x, fr = N, Xi = A, Vi = (t, e) => {
  const n = `${t}([options])`;
  Xi.options(n, "options", e, {
    prefix: ["string"],
    basePath: ["string"]
  });
}, dr = (t, e) => {
  t = t || {};
  const n = {};
  return typeof t.prefix != "string" ? n.prefix = "" : n.prefix = t.prefix, typeof t.basePath == "string" ? n.basePath = xt.resolve(e, t.basePath) : n.basePath = Ji.tmpdir(), n;
}, hr = 32, Zi = (t, e) => {
  const n = dr(e, t), r = lr.randomBytes(hr / 2).toString("hex"), s = xt.join(
    n.basePath,
    n.prefix + r
  );
  try {
    fr.mkdirSync(s);
  } catch (i) {
    if (i.code === "ENOENT")
      ur.sync(s);
    else
      throw i;
  }
  return s;
}, Qi = (t, e) => new Promise((n, r) => {
  const s = dr(e, t);
  lr.randomBytes(hr / 2, (i, l) => {
    if (i)
      r(i);
    else {
      const o = l.toString("hex"), c = xt.join(
        s.basePath,
        s.prefix + o
      );
      fr.mkdir(c, (a) => {
        a ? a.code === "ENOENT" ? ur.async(c).then(() => {
          n(c);
        }, r) : r(a) : n(c);
      });
    }
  });
});
Ze.validateInput = Vi;
Ze.sync = Zi;
Ze.async = Qi;
const Xt = rn, ot = b, ie = Fe, oe = x, ce = _e, ae = Le, le = F, ue = qe, fe = ne, de = X, he = We, ye = re, pe = Je, me = J, ge = Xe, ve = Ve, Vt = Dt, we = Ze, Ee = W, yr = (t) => {
  const e = () => t || process.cwd(), n = function() {
    if (arguments.length === 0)
      return e();
    const o = Array.prototype.slice.call(arguments), c = [e()].concat(o);
    return yr(ot.resolve.apply(null, c));
  }, r = (o) => ot.resolve(e(), o), s = function() {
    return Array.prototype.unshift.call(arguments, e()), ot.resolve.apply(null, arguments);
  }, i = (o) => {
    const c = o || {};
    return c.cwd = e(), c;
  }, l = {
    cwd: n,
    path: s,
    append: (o, c, a) => {
      ie.validateInput("append", o, c, a), ie.sync(r(o), c, a);
    },
    appendAsync: (o, c, a) => (ie.validateInput("appendAsync", o, c, a), ie.async(r(o), c, a)),
    copy: (o, c, a) => {
      fe.validateInput("copy", o, c, a), fe.sync(r(o), r(c), a);
    },
    copyAsync: (o, c, a) => (fe.validateInput("copyAsync", o, c, a), fe.async(r(o), r(c), a)),
    createWriteStream: (o, c) => Vt.createWriteStream(r(o), c),
    createReadStream: (o, c) => Vt.createReadStream(r(o), c),
    dir: (o, c) => {
      oe.validateInput("dir", o, c);
      const a = r(o);
      return oe.sync(a, c), n(a);
    },
    dirAsync: (o, c) => (oe.validateInput("dirAsync", o, c), new Promise((a, u) => {
      const f = r(o);
      oe.async(f, c).then(() => {
        a(n(f));
      }, u);
    })),
    exists: (o) => (de.validateInput("exists", o), de.sync(r(o))),
    existsAsync: (o) => (de.validateInput("existsAsync", o), de.async(r(o))),
    file: (o, c) => (ce.validateInput("file", o, c), ce.sync(r(o), c), l),
    fileAsync: (o, c) => (ce.validateInput("fileAsync", o, c), new Promise((a, u) => {
      ce.async(r(o), c).then(() => {
        a(l);
      }, u);
    })),
    find: (o, c) => (typeof c > "u" && typeof o == "object" && (c = o, o = "."), ae.validateInput("find", o, c), ae.sync(r(o), i(c))),
    findAsync: (o, c) => (typeof c > "u" && typeof o == "object" && (c = o, o = "."), ae.validateInput("findAsync", o, c), ae.async(r(o), i(c))),
    inspect: (o, c) => (le.validateInput("inspect", o, c), le.sync(r(o), c)),
    inspectAsync: (o, c) => (le.validateInput("inspectAsync", o, c), le.async(r(o), c)),
    inspectTree: (o, c) => (ue.validateInput("inspectTree", o, c), ue.sync(r(o), c)),
    inspectTreeAsync: (o, c) => (ue.validateInput("inspectTreeAsync", o, c), ue.async(r(o), c)),
    list: (o) => (he.validateInput("list", o), he.sync(r(o || "."))),
    listAsync: (o) => (he.validateInput("listAsync", o), he.async(r(o || "."))),
    move: (o, c, a) => {
      ye.validateInput("move", o, c, a), ye.sync(r(o), r(c), a);
    },
    moveAsync: (o, c, a) => (ye.validateInput("moveAsync", o, c, a), ye.async(r(o), r(c), a)),
    read: (o, c) => (pe.validateInput("read", o, c), pe.sync(r(o), c)),
    readAsync: (o, c) => (pe.validateInput("readAsync", o, c), pe.async(r(o), c)),
    remove: (o) => {
      me.validateInput("remove", o), me.sync(r(o || "."));
    },
    removeAsync: (o) => (me.validateInput("removeAsync", o), me.async(r(o || "."))),
    rename: (o, c, a) => {
      ge.validateInput("rename", o, c, a), ge.sync(r(o), c, a);
    },
    renameAsync: (o, c, a) => (ge.validateInput("renameAsync", o, c, a), ge.async(r(o), c, a)),
    symlink: (o, c) => {
      ve.validateInput("symlink", o, c), ve.sync(o, r(c));
    },
    symlinkAsync: (o, c) => (ve.validateInput("symlinkAsync", o, c), ve.async(o, r(c))),
    tmpDir: (o) => {
      we.validateInput("tmpDir", o);
      const c = we.sync(e(), o);
      return n(c);
    },
    tmpDirAsync: (o) => (we.validateInput("tmpDirAsync", o), new Promise((c, a) => {
      we.async(e(), o).then((u) => {
        c(n(u));
      }, a);
    })),
    write: (o, c, a) => {
      Ee.validateInput("write", o, c, a), Ee.sync(r(o), c, a);
    },
    writeAsync: (o, c, a) => (Ee.validateInput("writeAsync", o, c, a), Ee.async(r(o), c, a))
  };
  return Xt.inspect.custom !== void 0 && (l[Xt.inspect.custom] = () => `[fs-jetpack CWD: ${e()}]`), l;
};
var Yi = yr;
const Ki = Yi;
var R = Ki();
async function jt(t) {
  const e = $t(t);
  return await R.readAsync(e, "json");
}
async function pr(t) {
  const e = $t(t.id);
  await R.writeAsync(e, t);
}
async function eo({ projectId: t, chapterTitle: e, position: n }) {
  const r = nn(), s = St(t, r), i = { id: r, title: e, position: n, tags: [] };
  await R.writeAsync(s, i);
  const l = await jt(t);
  return l.chapters.push(i), await pr(l), r;
}
async function to({ name: t }) {
  const e = nn(), n = { name: t, id: e };
  let r = await R.readAsync(lt, "json");
  r || (r = { projects: [] }), r.projects.push(n), await R.writeAsync(lt, r);
  const s = $t(e), i = { id: e, name: t, chapters: [], notes: [], scenes: [] };
  return await R.writeAsync(s, i), e;
}
async function mr({ projectId: t, chapterData: e }) {
  const n = St(t, e.id);
  await R.writeAsync(n, e);
  const r = await jt(t), s = r.chapters.map((i) => i.id === e.id ? {
    ...i,
    title: e.title,
    position: e.position,
    tags: e.tags ? e.tags : []
  } : i);
  r.chapters = s, await pr(r);
}
async function no() {
  const t = await R.readAsync(lt, "json");
  return t ? t.projects : [];
}
async function gr({ projectId: t, chapterId: e }) {
  const n = St(t, e);
  return await R.readAsync(n, "json");
}
async function ro({ projectId: t, chapterId: e, tags: n }) {
  const s = { ...await gr({ projectId: t, chapterId: e }), tags: n };
  await mr({ projectId: t, chapterData: s });
}
function so() {
  L.handle("create-new-project", async (t, e) => await to(e)), L.handle("get-project-info", async (t, e) => await jt(e)), L.handle("get-all-projects", async (t) => await no()), L.handle("create-new-chapter", async (t, e) => await eo(e)), L.handle("get-chapter", async (t, e) => await gr(e)), L.handle("update-chapter", async (t, e) => await mr(e)), L.handle("update-tags", async (t, e) => await ro(e));
}
var mt = { exports: {} }, $e = { exports: {} }, Se = { exports: {} }, ct, Zt;
function io() {
  if (Zt) return ct;
  Zt = 1;
  var t = 1e3, e = t * 60, n = e * 60, r = n * 24, s = r * 365.25;
  ct = function(a, u) {
    u = u || {};
    var f = typeof a;
    if (f === "string" && a.length > 0)
      return i(a);
    if (f === "number" && isNaN(a) === !1)
      return u.long ? o(a) : l(a);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(a)
    );
  };
  function i(a) {
    if (a = String(a), !(a.length > 100)) {
      var u = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
        a
      );
      if (u) {
        var f = parseFloat(u[1]), y = (u[2] || "ms").toLowerCase();
        switch (y) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return f * s;
          case "days":
          case "day":
          case "d":
            return f * r;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return f * n;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return f * e;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return f * t;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return f;
          default:
            return;
        }
      }
    }
  }
  function l(a) {
    return a >= r ? Math.round(a / r) + "d" : a >= n ? Math.round(a / n) + "h" : a >= e ? Math.round(a / e) + "m" : a >= t ? Math.round(a / t) + "s" : a + "ms";
  }
  function o(a) {
    return c(a, r, "day") || c(a, n, "hour") || c(a, e, "minute") || c(a, t, "second") || a + " ms";
  }
  function c(a, u, f) {
    if (!(a < u))
      return a < u * 1.5 ? Math.floor(a / u) + " " + f : Math.ceil(a / u) + " " + f + "s";
  }
  return ct;
}
var Qt;
function vr() {
  return Qt || (Qt = 1, function(t, e) {
    e = t.exports = s.debug = s.default = s, e.coerce = c, e.disable = l, e.enable = i, e.enabled = o, e.humanize = io(), e.names = [], e.skips = [], e.formatters = {};
    var n;
    function r(a) {
      var u = 0, f;
      for (f in a)
        u = (u << 5) - u + a.charCodeAt(f), u |= 0;
      return e.colors[Math.abs(u) % e.colors.length];
    }
    function s(a) {
      function u() {
        if (u.enabled) {
          var f = u, y = +/* @__PURE__ */ new Date(), h = y - (n || y);
          f.diff = h, f.prev = n, f.curr = y, n = y;
          for (var d = new Array(arguments.length), g = 0; g < d.length; g++)
            d[g] = arguments[g];
          d[0] = e.coerce(d[0]), typeof d[0] != "string" && d.unshift("%O");
          var p = 0;
          d[0] = d[0].replace(/%([a-zA-Z%])/g, function(E, S) {
            if (E === "%%") return E;
            p++;
            var $ = e.formatters[S];
            if (typeof $ == "function") {
              var C = d[p];
              E = $.call(f, C), d.splice(p, 1), p--;
            }
            return E;
          }), e.formatArgs.call(f, d);
          var k = u.log || e.log || console.log.bind(console);
          k.apply(f, d);
        }
      }
      return u.namespace = a, u.enabled = e.enabled(a), u.useColors = e.useColors(), u.color = r(a), typeof e.init == "function" && e.init(u), u;
    }
    function i(a) {
      e.save(a), e.names = [], e.skips = [];
      for (var u = (typeof a == "string" ? a : "").split(/[\s,]+/), f = u.length, y = 0; y < f; y++)
        u[y] && (a = u[y].replace(/\*/g, ".*?"), a[0] === "-" ? e.skips.push(new RegExp("^" + a.substr(1) + "$")) : e.names.push(new RegExp("^" + a + "$")));
    }
    function l() {
      e.enable("");
    }
    function o(a) {
      var u, f;
      for (u = 0, f = e.skips.length; u < f; u++)
        if (e.skips[u].test(a))
          return !1;
      for (u = 0, f = e.names.length; u < f; u++)
        if (e.names[u].test(a))
          return !0;
      return !1;
    }
    function c(a) {
      return a instanceof Error ? a.stack || a.message : a;
    }
  }(Se, Se.exports)), Se.exports;
}
var Yt;
function oo() {
  return Yt || (Yt = 1, function(t, e) {
    e = t.exports = vr(), e.log = s, e.formatArgs = r, e.save = i, e.load = l, e.useColors = n, e.storage = typeof chrome < "u" && typeof chrome.storage < "u" ? chrome.storage.local : o(), e.colors = [
      "lightseagreen",
      "forestgreen",
      "goldenrod",
      "dodgerblue",
      "darkorchid",
      "crimson"
    ];
    function n() {
      return typeof window < "u" && window.process && window.process.type === "renderer" ? !0 : typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    e.formatters.j = function(c) {
      try {
        return JSON.stringify(c);
      } catch (a) {
        return "[UnexpectedJSONParseError]: " + a.message;
      }
    };
    function r(c) {
      var a = this.useColors;
      if (c[0] = (a ? "%c" : "") + this.namespace + (a ? " %c" : " ") + c[0] + (a ? "%c " : " ") + "+" + e.humanize(this.diff), !!a) {
        var u = "color: " + this.color;
        c.splice(1, 0, u, "color: inherit");
        var f = 0, y = 0;
        c[0].replace(/%[a-zA-Z%]/g, function(h) {
          h !== "%%" && (f++, h === "%c" && (y = f));
        }), c.splice(y, 0, u);
      }
    }
    function s() {
      return typeof console == "object" && console.log && Function.prototype.apply.call(console.log, console, arguments);
    }
    function i(c) {
      try {
        c == null ? e.storage.removeItem("debug") : e.storage.debug = c;
      } catch {
      }
    }
    function l() {
      var c;
      try {
        c = e.storage.debug;
      } catch {
      }
      return !c && typeof process < "u" && "env" in process && (c = process.env.DEBUG), c;
    }
    e.enable(l());
    function o() {
      try {
        return window.localStorage;
      } catch {
      }
    }
  }($e, $e.exports)), $e.exports;
}
var be = { exports: {} }, Kt;
function co() {
  return Kt || (Kt = 1, function(t, e) {
    var n = Dr, r = rn;
    e = t.exports = vr(), e.init = y, e.log = c, e.formatArgs = o, e.save = a, e.load = u, e.useColors = l, e.colors = [6, 2, 3, 4, 5, 1], e.inspectOpts = Object.keys(process.env).filter(function(h) {
      return /^debug_/i.test(h);
    }).reduce(function(h, d) {
      var g = d.substring(6).toLowerCase().replace(/_([a-z])/g, function(k, E) {
        return E.toUpperCase();
      }), p = process.env[d];
      return /^(yes|on|true|enabled)$/i.test(p) ? p = !0 : /^(no|off|false|disabled)$/i.test(p) ? p = !1 : p === "null" ? p = null : p = Number(p), h[g] = p, h;
    }, {});
    var s = parseInt(process.env.DEBUG_FD, 10) || 2;
    s !== 1 && s !== 2 && r.deprecate(function() {
    }, "except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();
    var i = s === 1 ? process.stdout : s === 2 ? process.stderr : f(s);
    function l() {
      return "colors" in e.inspectOpts ? !!e.inspectOpts.colors : n.isatty(s);
    }
    e.formatters.o = function(h) {
      return this.inspectOpts.colors = this.useColors, r.inspect(h, this.inspectOpts).split(`
`).map(function(d) {
        return d.trim();
      }).join(" ");
    }, e.formatters.O = function(h) {
      return this.inspectOpts.colors = this.useColors, r.inspect(h, this.inspectOpts);
    };
    function o(h) {
      var d = this.namespace, g = this.useColors;
      if (g) {
        var p = this.color, k = "  \x1B[3" + p + ";1m" + d + " \x1B[0m";
        h[0] = k + h[0].split(`
`).join(`
` + k), h.push("\x1B[3" + p + "m+" + e.humanize(this.diff) + "\x1B[0m");
      } else
        h[0] = (/* @__PURE__ */ new Date()).toUTCString() + " " + d + " " + h[0];
    }
    function c() {
      return i.write(r.format.apply(r, arguments) + `
`);
    }
    function a(h) {
      h == null ? delete process.env.DEBUG : process.env.DEBUG = h;
    }
    function u() {
      return process.env.DEBUG;
    }
    function f(h) {
      var d, g = process.binding("tty_wrap");
      switch (g.guessHandleType(h)) {
        case "TTY":
          d = new n.WriteStream(h), d._type = "tty", d._handle && d._handle.unref && d._handle.unref();
          break;
        case "FILE":
          var p = je;
          d = new p.SyncWriteStream(h, { autoClose: !1 }), d._type = "fs";
          break;
        case "PIPE":
        case "TCP":
          var k = xr;
          d = new k.Socket({
            fd: h,
            readable: !1,
            writable: !0
          }), d.readable = !1, d.read = null, d._type = "pipe", d._handle && d._handle.unref && d._handle.unref();
          break;
        default:
          throw new Error("Implement me. Unknown stream file type!");
      }
      return d.fd = h, d._isStdio = !0, d;
    }
    function y(h) {
      h.inspectOpts = {};
      for (var d = Object.keys(e.inspectOpts), g = 0; g < d.length; g++)
        h.inspectOpts[d[g]] = e.inspectOpts[d[g]];
    }
    e.enable(u());
  }(be, be.exports)), be.exports;
}
typeof process < "u" && process.type === "renderer" ? mt.exports = oo() : mt.exports = co();
var ao = mt.exports, gt = b, lo = Cr.spawn, wr = ao("electron-squirrel-startup"), at = Ir.app, en = function(t, e) {
  var n = gt.resolve(gt.dirname(process.execPath), "..", "Update.exe");
  wr("Spawning `%s` with args `%s`", n, t), lo(n, t, {
    detached: !0
  }).on("close", e);
}, uo = function() {
  if (process.platform === "win32") {
    var t = process.argv[1];
    wr("processing squirrel command `%s`", t);
    var e = gt.basename(process.execPath);
    if (t === "--squirrel-install" || t === "--squirrel-updated")
      return en(["--createShortcut=" + e], at.quit), !0;
    if (t === "--squirrel-uninstall")
      return en(["--removeShortcut=" + e], at.quit), !0;
    if (t === "--squirrel-obsolete")
      return at.quit(), !0;
  }
  return !1;
}, fo = uo();
const ho = /* @__PURE__ */ Fr(fo), Er = B.dirname(Tr(import.meta.url));
process.env.APP_ROOT = B.join(Er, "..");
const vt = process.env.VITE_DEV_SERVER_URL, Po = B.join(process.env.APP_ROOT, "dist-electron"), $r = B.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = vt ? B.join(process.env.APP_ROOT, "public") : $r;
let I;
ho && H.quit();
const yo = Pr.createFromPath(B.join(process.env.VITE_PUBLIC, "icon.png"));
function Sr() {
  I = new tn({
    icon: yo,
    webPreferences: {
      preload: B.join(Er, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0,
      webSecurity: !1,
      spellcheck: !1
    }
  }), I.menuBarVisible = !1, I.webContents.on("did-finish-load", () => {
    I == null || I.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), vt ? I.loadURL(vt) : I.loadFile(B.join($r, "index.html")), I.once("ready-to-show", () => {
    I == null || I.maximize();
  });
}
H.on("window-all-closed", () => {
  process.platform !== "darwin" && (H.quit(), I = null);
});
H.on("activate", () => {
  tn.getAllWindows().length === 0 && Sr();
});
H.whenReady().then(() => {
  so(), Sr();
});
export {
  Po as MAIN_DIST,
  $r as RENDERER_DIST,
  vt as VITE_DEV_SERVER_URL
};
