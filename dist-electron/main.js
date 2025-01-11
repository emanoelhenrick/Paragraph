import require$$3, { app as app$1, ipcMain, nativeImage, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path$4 from "node:path";
import require$$0$1, { randomUUID } from "crypto";
import path$3 from "path";
import require$$0$2 from "util";
import require$$0 from "fs";
import require$$1 from "os";
import require$$1$1 from "child_process";
import require$$0$3 from "tty";
import require$$4 from "net";
const SessionDataDir = app$1.getPath("sessionData");
const PROJECTS_DIR = path$3.join(SessionDataDir, "projects");
const META_PATH = path$3.join(PROJECTS_DIR, "meta.json");
const getProjectInfoPath = (projectId) => path$3.join(PROJECTS_DIR, `${projectId}/info.json`);
const getChapterPath = (projectId, chapterId) => path$3.join(PROJECTS_DIR, `${projectId}/chapters/${chapterId}.json`);
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var append$1 = {};
var promisify$1 = (fn) => {
  return function() {
    const length = arguments.length;
    const args = new Array(length);
    for (let i = 0; i < length; i += 1) {
      args[i] = arguments[i];
    }
    return new Promise((resolve, reject) => {
      args.push((err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
      fn.apply(null, args);
    });
  };
};
const fs$f = require$$0;
const promisify = promisify$1;
const isCallbackMethod = (key) => {
  return [
    typeof fs$f[key] === "function",
    !key.match(/Sync$/),
    !key.match(/^[A-Z]/),
    !key.match(/^create/),
    !key.match(/^(un)?watch/)
  ].every(Boolean);
};
const adaptMethod = (name) => {
  const original = fs$f[name];
  return promisify(original);
};
const adaptAllMethods = () => {
  const adapted = {};
  Object.keys(fs$f).forEach((key) => {
    if (isCallbackMethod(key)) {
      if (key === "exists") {
        adapted.exists = () => {
          throw new Error("fs.exists() is deprecated");
        };
      } else {
        adapted[key] = adaptMethod(key);
      }
    } else {
      adapted[key] = fs$f[key];
    }
  });
  return adapted;
};
var fs_1 = adaptAllMethods();
var write$4 = {};
const prettyPrintTypes = (types) => {
  const addArticle = (str) => {
    const vowels = ["a", "e", "i", "o", "u"];
    if (vowels.indexOf(str[0]) !== -1) {
      return `an ${str}`;
    }
    return `a ${str}`;
  };
  return types.map(addArticle).join(" or ");
};
const isArrayOfNotation = (typeDefinition) => {
  return /array of /.test(typeDefinition);
};
const extractTypeFromArrayOfNotation = (typeDefinition) => {
  return typeDefinition.split(" of ")[1];
};
const isValidTypeDefinition = (typeStr) => {
  if (isArrayOfNotation(typeStr)) {
    return isValidTypeDefinition(extractTypeFromArrayOfNotation(typeStr));
  }
  return [
    "string",
    "number",
    "boolean",
    "array",
    "object",
    "buffer",
    "null",
    "undefined",
    "function"
  ].some((validType) => {
    return validType === typeStr;
  });
};
const detectType = (value) => {
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return "array";
  }
  if (Buffer.isBuffer(value)) {
    return "buffer";
  }
  return typeof value;
};
const onlyUniqueValuesInArrayFilter = (value, index, self) => {
  return self.indexOf(value) === index;
};
const detectTypeDeep = (value) => {
  let type = detectType(value);
  let typesInArray;
  if (type === "array") {
    typesInArray = value.map((element) => {
      return detectType(element);
    }).filter(onlyUniqueValuesInArrayFilter);
    type += ` of ${typesInArray.join(", ")}`;
  }
  return type;
};
const validateArray = (argumentValue, typeToCheck) => {
  const allowedTypeInArray = extractTypeFromArrayOfNotation(typeToCheck);
  if (detectType(argumentValue) !== "array") {
    return false;
  }
  return argumentValue.every((element) => {
    return detectType(element) === allowedTypeInArray;
  });
};
const validateArgument = (methodName, argumentName, argumentValue, argumentMustBe) => {
  const isOneOfAllowedTypes = argumentMustBe.some((type) => {
    if (!isValidTypeDefinition(type)) {
      throw new Error(`Unknown type "${type}"`);
    }
    if (isArrayOfNotation(type)) {
      return validateArray(argumentValue, type);
    }
    return type === detectType(argumentValue);
  });
  if (!isOneOfAllowedTypes) {
    throw new Error(
      `Argument "${argumentName}" passed to ${methodName} must be ${prettyPrintTypes(
        argumentMustBe
      )}. Received ${detectTypeDeep(argumentValue)}`
    );
  }
};
const validateOptions = (methodName, optionsObjName, obj, allowedOptions) => {
  if (obj !== void 0) {
    validateArgument(methodName, optionsObjName, obj, ["object"]);
    Object.keys(obj).forEach((key) => {
      const argName = `${optionsObjName}.${key}`;
      if (allowedOptions[key] !== void 0) {
        validateArgument(methodName, argName, obj[key], allowedOptions[key]);
      } else {
        throw new Error(
          `Unknown argument "${argName}" passed to ${methodName}`
        );
      }
    });
  }
};
var validate$g = {
  argument: validateArgument,
  options: validateOptions
};
var dir$6 = {};
var mode = {};
mode.normalizeFileMode = (mode2) => {
  let modeAsString;
  if (typeof mode2 === "number") {
    modeAsString = mode2.toString(8);
  } else {
    modeAsString = mode2;
  }
  return modeAsString.substring(modeAsString.length - 3);
};
var remove$3 = {};
const fs$e = fs_1;
const validate$f = validate$g;
const validateInput$f = (methodName, path2) => {
  const methodSignature = `${methodName}([path])`;
  validate$f.argument(methodSignature, "path", path2, ["string", "undefined"]);
};
const removeSync = (path2) => {
  fs$e.rmSync(path2, {
    recursive: true,
    force: true,
    maxRetries: 3
  });
};
const removeAsync = (path2) => {
  return fs$e.rm(path2, {
    recursive: true,
    force: true,
    maxRetries: 3
  });
};
remove$3.validateInput = validateInput$f;
remove$3.sync = removeSync;
remove$3.async = removeAsync;
const pathUtil$b = path$3;
const fs$d = fs_1;
const modeUtil$1 = mode;
const validate$e = validate$g;
const remove$2 = remove$3;
const validateInput$e = (methodName, path2, criteria) => {
  const methodSignature = `${methodName}(path, [criteria])`;
  validate$e.argument(methodSignature, "path", path2, ["string"]);
  validate$e.options(methodSignature, "criteria", criteria, {
    empty: ["boolean"],
    mode: ["string", "number"]
  });
};
const getCriteriaDefaults$1 = (passedCriteria) => {
  const criteria = passedCriteria || {};
  if (typeof criteria.empty !== "boolean") {
    criteria.empty = false;
  }
  if (criteria.mode !== void 0) {
    criteria.mode = modeUtil$1.normalizeFileMode(criteria.mode);
  }
  return criteria;
};
const generatePathOccupiedByNotDirectoryError = (path2) => {
  return new Error(
    `Path ${path2} exists but is not a directory. Halting jetpack.dir() call for safety reasons.`
  );
};
const checkWhatAlreadyOccupiesPathSync$1 = (path2) => {
  let stat;
  try {
    stat = fs$d.statSync(path2);
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }
  if (stat && !stat.isDirectory()) {
    throw generatePathOccupiedByNotDirectoryError(path2);
  }
  return stat;
};
const createBrandNewDirectorySync = (path2, opts) => {
  const options = opts || {};
  try {
    fs$d.mkdirSync(path2, options.mode);
  } catch (err) {
    if (err.code === "ENOENT") {
      createBrandNewDirectorySync(pathUtil$b.dirname(path2), options);
      fs$d.mkdirSync(path2, options.mode);
    } else if (err.code === "EEXIST") ;
    else {
      throw err;
    }
  }
};
const checkExistingDirectoryFulfillsCriteriaSync = (path2, stat, criteria) => {
  const checkMode = () => {
    const mode2 = modeUtil$1.normalizeFileMode(stat.mode);
    if (criteria.mode !== void 0 && criteria.mode !== mode2) {
      fs$d.chmodSync(path2, criteria.mode);
    }
  };
  const checkEmptiness = () => {
    if (criteria.empty) {
      const list2 = fs$d.readdirSync(path2);
      list2.forEach((filename) => {
        remove$2.sync(pathUtil$b.resolve(path2, filename));
      });
    }
  };
  checkMode();
  checkEmptiness();
};
const dirSync = (path2, passedCriteria) => {
  const criteria = getCriteriaDefaults$1(passedCriteria);
  const stat = checkWhatAlreadyOccupiesPathSync$1(path2);
  if (stat) {
    checkExistingDirectoryFulfillsCriteriaSync(path2, stat, criteria);
  } else {
    createBrandNewDirectorySync(path2, criteria);
  }
};
const checkWhatAlreadyOccupiesPathAsync$1 = (path2) => {
  return new Promise((resolve, reject) => {
    fs$d.stat(path2).then((stat) => {
      if (stat.isDirectory()) {
        resolve(stat);
      } else {
        reject(generatePathOccupiedByNotDirectoryError(path2));
      }
    }).catch((err) => {
      if (err.code === "ENOENT") {
        resolve(void 0);
      } else {
        reject(err);
      }
    });
  });
};
const emptyAsync = (path2) => {
  return new Promise((resolve, reject) => {
    fs$d.readdir(path2).then((list2) => {
      const doOne = (index) => {
        if (index === list2.length) {
          resolve();
        } else {
          const subPath = pathUtil$b.resolve(path2, list2[index]);
          remove$2.async(subPath).then(() => {
            doOne(index + 1);
          });
        }
      };
      doOne(0);
    }).catch(reject);
  });
};
const checkExistingDirectoryFulfillsCriteriaAsync = (path2, stat, criteria) => {
  return new Promise((resolve, reject) => {
    const checkMode = () => {
      const mode2 = modeUtil$1.normalizeFileMode(stat.mode);
      if (criteria.mode !== void 0 && criteria.mode !== mode2) {
        return fs$d.chmod(path2, criteria.mode);
      }
      return Promise.resolve();
    };
    const checkEmptiness = () => {
      if (criteria.empty) {
        return emptyAsync(path2);
      }
      return Promise.resolve();
    };
    checkMode().then(checkEmptiness).then(resolve, reject);
  });
};
const createBrandNewDirectoryAsync = (path2, opts) => {
  const options = opts || {};
  return new Promise((resolve, reject) => {
    fs$d.mkdir(path2, options.mode).then(resolve).catch((err) => {
      if (err.code === "ENOENT") {
        createBrandNewDirectoryAsync(pathUtil$b.dirname(path2), options).then(() => {
          return fs$d.mkdir(path2, options.mode);
        }).then(resolve).catch((err2) => {
          if (err2.code === "EEXIST") {
            resolve();
          } else {
            reject(err2);
          }
        });
      } else if (err.code === "EEXIST") {
        resolve();
      } else {
        reject(err);
      }
    });
  });
};
const dirAsync = (path2, passedCriteria) => {
  return new Promise((resolve, reject) => {
    const criteria = getCriteriaDefaults$1(passedCriteria);
    checkWhatAlreadyOccupiesPathAsync$1(path2).then((stat) => {
      if (stat !== void 0) {
        return checkExistingDirectoryFulfillsCriteriaAsync(
          path2,
          stat,
          criteria
        );
      }
      return createBrandNewDirectoryAsync(path2, criteria);
    }).then(resolve, reject);
  });
};
dir$6.validateInput = validateInput$e;
dir$6.sync = dirSync;
dir$6.createSync = createBrandNewDirectorySync;
dir$6.async = dirAsync;
dir$6.createAsync = createBrandNewDirectoryAsync;
const pathUtil$a = path$3;
const fs$c = fs_1;
const validate$d = validate$g;
const dir$5 = dir$6;
const validateInput$d = (methodName, path2, data, options) => {
  const methodSignature = `${methodName}(path, data, [options])`;
  validate$d.argument(methodSignature, "path", path2, ["string"]);
  validate$d.argument(methodSignature, "data", data, [
    "string",
    "buffer",
    "object",
    "array"
  ]);
  validate$d.options(methodSignature, "options", options, {
    mode: ["string", "number"],
    atomic: ["boolean"],
    jsonIndent: ["number"]
  });
};
const newExt = ".__new__";
const serializeToJsonMaybe = (data, jsonIndent) => {
  let indent = jsonIndent;
  if (typeof indent !== "number") {
    indent = 2;
  }
  if (typeof data === "object" && !Buffer.isBuffer(data) && data !== null) {
    return JSON.stringify(data, null, indent);
  }
  return data;
};
const writeFileSync = (path2, data, options) => {
  try {
    fs$c.writeFileSync(path2, data, options);
  } catch (err) {
    if (err.code === "ENOENT") {
      dir$5.createSync(pathUtil$a.dirname(path2));
      fs$c.writeFileSync(path2, data, options);
    } else {
      throw err;
    }
  }
};
const writeAtomicSync = (path2, data, options) => {
  writeFileSync(path2 + newExt, data, options);
  fs$c.renameSync(path2 + newExt, path2);
};
const writeSync = (path2, data, options) => {
  const opts = options || {};
  const processedData = serializeToJsonMaybe(data, opts.jsonIndent);
  let writeStrategy = writeFileSync;
  if (opts.atomic) {
    writeStrategy = writeAtomicSync;
  }
  writeStrategy(path2, processedData, { mode: opts.mode });
};
const writeFileAsync = (path2, data, options) => {
  return new Promise((resolve, reject) => {
    fs$c.writeFile(path2, data, options).then(resolve).catch((err) => {
      if (err.code === "ENOENT") {
        dir$5.createAsync(pathUtil$a.dirname(path2)).then(() => {
          return fs$c.writeFile(path2, data, options);
        }).then(resolve, reject);
      } else {
        reject(err);
      }
    });
  });
};
const writeAtomicAsync = (path2, data, options) => {
  return new Promise((resolve, reject) => {
    writeFileAsync(path2 + newExt, data, options).then(() => {
      return fs$c.rename(path2 + newExt, path2);
    }).then(resolve, reject);
  });
};
const writeAsync = (path2, data, options) => {
  const opts = options || {};
  const processedData = serializeToJsonMaybe(data, opts.jsonIndent);
  let writeStrategy = writeFileAsync;
  if (opts.atomic) {
    writeStrategy = writeAtomicAsync;
  }
  return writeStrategy(path2, processedData, { mode: opts.mode });
};
write$4.validateInput = validateInput$d;
write$4.sync = writeSync;
write$4.async = writeAsync;
const fs$b = fs_1;
const write$3 = write$4;
const validate$c = validate$g;
const validateInput$c = (methodName, path2, data, options) => {
  const methodSignature = `${methodName}(path, data, [options])`;
  validate$c.argument(methodSignature, "path", path2, ["string"]);
  validate$c.argument(methodSignature, "data", data, ["string", "buffer"]);
  validate$c.options(methodSignature, "options", options, {
    mode: ["string", "number"]
  });
};
const appendSync = (path2, data, options) => {
  try {
    fs$b.appendFileSync(path2, data, options);
  } catch (err) {
    if (err.code === "ENOENT") {
      write$3.sync(path2, data, options);
    } else {
      throw err;
    }
  }
};
const appendAsync = (path2, data, options) => {
  return new Promise((resolve, reject) => {
    fs$b.appendFile(path2, data, options).then(resolve).catch((err) => {
      if (err.code === "ENOENT") {
        write$3.async(path2, data, options).then(resolve, reject);
      } else {
        reject(err);
      }
    });
  });
};
append$1.validateInput = validateInput$c;
append$1.sync = appendSync;
append$1.async = appendAsync;
var file$1 = {};
const fs$a = fs_1;
const modeUtil = mode;
const validate$b = validate$g;
const write$2 = write$4;
const validateInput$b = (methodName, path2, criteria) => {
  const methodSignature = `${methodName}(path, [criteria])`;
  validate$b.argument(methodSignature, "path", path2, ["string"]);
  validate$b.options(methodSignature, "criteria", criteria, {
    content: ["string", "buffer", "object", "array"],
    jsonIndent: ["number"],
    mode: ["string", "number"]
  });
};
const getCriteriaDefaults = (passedCriteria) => {
  const criteria = passedCriteria || {};
  if (criteria.mode !== void 0) {
    criteria.mode = modeUtil.normalizeFileMode(criteria.mode);
  }
  return criteria;
};
const generatePathOccupiedByNotFileError = (path2) => {
  return new Error(
    `Path ${path2} exists but is not a file. Halting jetpack.file() call for safety reasons.`
  );
};
const checkWhatAlreadyOccupiesPathSync = (path2) => {
  let stat;
  try {
    stat = fs$a.statSync(path2);
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }
  if (stat && !stat.isFile()) {
    throw generatePathOccupiedByNotFileError(path2);
  }
  return stat;
};
const checkExistingFileFulfillsCriteriaSync = (path2, stat, criteria) => {
  const mode2 = modeUtil.normalizeFileMode(stat.mode);
  const checkContent = () => {
    if (criteria.content !== void 0) {
      write$2.sync(path2, criteria.content, {
        mode: mode2,
        jsonIndent: criteria.jsonIndent
      });
      return true;
    }
    return false;
  };
  const checkMode = () => {
    if (criteria.mode !== void 0 && criteria.mode !== mode2) {
      fs$a.chmodSync(path2, criteria.mode);
    }
  };
  const contentReplaced = checkContent();
  if (!contentReplaced) {
    checkMode();
  }
};
const createBrandNewFileSync = (path2, criteria) => {
  let content = "";
  if (criteria.content !== void 0) {
    content = criteria.content;
  }
  write$2.sync(path2, content, {
    mode: criteria.mode,
    jsonIndent: criteria.jsonIndent
  });
};
const fileSync = (path2, passedCriteria) => {
  const criteria = getCriteriaDefaults(passedCriteria);
  const stat = checkWhatAlreadyOccupiesPathSync(path2);
  if (stat !== void 0) {
    checkExistingFileFulfillsCriteriaSync(path2, stat, criteria);
  } else {
    createBrandNewFileSync(path2, criteria);
  }
};
const checkWhatAlreadyOccupiesPathAsync = (path2) => {
  return new Promise((resolve, reject) => {
    fs$a.stat(path2).then((stat) => {
      if (stat.isFile()) {
        resolve(stat);
      } else {
        reject(generatePathOccupiedByNotFileError(path2));
      }
    }).catch((err) => {
      if (err.code === "ENOENT") {
        resolve(void 0);
      } else {
        reject(err);
      }
    });
  });
};
const checkExistingFileFulfillsCriteriaAsync = (path2, stat, criteria) => {
  const mode2 = modeUtil.normalizeFileMode(stat.mode);
  const checkContent = () => {
    return new Promise((resolve, reject) => {
      if (criteria.content !== void 0) {
        write$2.async(path2, criteria.content, {
          mode: mode2,
          jsonIndent: criteria.jsonIndent
        }).then(() => {
          resolve(true);
        }).catch(reject);
      } else {
        resolve(false);
      }
    });
  };
  const checkMode = () => {
    if (criteria.mode !== void 0 && criteria.mode !== mode2) {
      return fs$a.chmod(path2, criteria.mode);
    }
    return void 0;
  };
  return checkContent().then((contentReplaced) => {
    if (!contentReplaced) {
      return checkMode();
    }
    return void 0;
  });
};
const createBrandNewFileAsync = (path2, criteria) => {
  let content = "";
  if (criteria.content !== void 0) {
    content = criteria.content;
  }
  return write$2.async(path2, content, {
    mode: criteria.mode,
    jsonIndent: criteria.jsonIndent
  });
};
const fileAsync = (path2, passedCriteria) => {
  return new Promise((resolve, reject) => {
    const criteria = getCriteriaDefaults(passedCriteria);
    checkWhatAlreadyOccupiesPathAsync(path2).then((stat) => {
      if (stat !== void 0) {
        return checkExistingFileFulfillsCriteriaAsync(path2, stat, criteria);
      }
      return createBrandNewFileAsync(path2, criteria);
    }).then(resolve, reject);
  });
};
file$1.validateInput = validateInput$b;
file$1.sync = fileSync;
file$1.async = fileAsync;
var find$1 = {};
var tree_walker = {};
var inspect$5 = {};
const crypto$2 = require$$0$1;
const pathUtil$9 = path$3;
const fs$9 = fs_1;
const validate$a = validate$g;
const supportedChecksumAlgorithms = ["md5", "sha1", "sha256", "sha512"];
const symlinkOptions = ["report", "follow"];
const validateInput$a = (methodName, path2, options) => {
  const methodSignature = `${methodName}(path, [options])`;
  validate$a.argument(methodSignature, "path", path2, ["string"]);
  validate$a.options(methodSignature, "options", options, {
    checksum: ["string"],
    mode: ["boolean"],
    times: ["boolean"],
    absolutePath: ["boolean"],
    symlinks: ["string"]
  });
  if (options && options.checksum !== void 0 && supportedChecksumAlgorithms.indexOf(options.checksum) === -1) {
    throw new Error(
      `Argument "options.checksum" passed to ${methodSignature} must have one of values: ${supportedChecksumAlgorithms.join(
        ", "
      )}`
    );
  }
  if (options && options.symlinks !== void 0 && symlinkOptions.indexOf(options.symlinks) === -1) {
    throw new Error(
      `Argument "options.symlinks" passed to ${methodSignature} must have one of values: ${symlinkOptions.join(
        ", "
      )}`
    );
  }
};
const createInspectObj = (path2, options, stat) => {
  const obj = {};
  obj.name = pathUtil$9.basename(path2);
  if (stat.isFile()) {
    obj.type = "file";
    obj.size = stat.size;
  } else if (stat.isDirectory()) {
    obj.type = "dir";
  } else if (stat.isSymbolicLink()) {
    obj.type = "symlink";
  } else {
    obj.type = "other";
  }
  if (options.mode) {
    obj.mode = stat.mode;
  }
  if (options.times) {
    obj.accessTime = stat.atime;
    obj.modifyTime = stat.mtime;
    obj.changeTime = stat.ctime;
    obj.birthTime = stat.birthtime;
  }
  if (options.absolutePath) {
    obj.absolutePath = path2;
  }
  return obj;
};
const fileChecksum = (path2, algo) => {
  const hash = crypto$2.createHash(algo);
  const data = fs$9.readFileSync(path2);
  hash.update(data);
  return hash.digest("hex");
};
const addExtraFieldsSync = (path2, inspectObj, options) => {
  if (inspectObj.type === "file" && options.checksum) {
    inspectObj[options.checksum] = fileChecksum(path2, options.checksum);
  } else if (inspectObj.type === "symlink") {
    inspectObj.pointsAt = fs$9.readlinkSync(path2);
  }
};
const inspectSync = (path2, options) => {
  let statOperation = fs$9.lstatSync;
  let stat;
  const opts = options || {};
  if (opts.symlinks === "follow") {
    statOperation = fs$9.statSync;
  }
  try {
    stat = statOperation(path2);
  } catch (err) {
    if (err.code === "ENOENT") {
      return void 0;
    }
    throw err;
  }
  const inspectObj = createInspectObj(path2, opts, stat);
  addExtraFieldsSync(path2, inspectObj, opts);
  return inspectObj;
};
const fileChecksumAsync = (path2, algo) => {
  return new Promise((resolve, reject) => {
    const hash = crypto$2.createHash(algo);
    const s = fs$9.createReadStream(path2);
    s.on("data", (data) => {
      hash.update(data);
    });
    s.on("end", () => {
      resolve(hash.digest("hex"));
    });
    s.on("error", reject);
  });
};
const addExtraFieldsAsync = (path2, inspectObj, options) => {
  if (inspectObj.type === "file" && options.checksum) {
    return fileChecksumAsync(path2, options.checksum).then((checksum) => {
      inspectObj[options.checksum] = checksum;
      return inspectObj;
    });
  } else if (inspectObj.type === "symlink") {
    return fs$9.readlink(path2).then((linkPath) => {
      inspectObj.pointsAt = linkPath;
      return inspectObj;
    });
  }
  return Promise.resolve(inspectObj);
};
const inspectAsync = (path2, options) => {
  return new Promise((resolve, reject) => {
    let statOperation = fs$9.lstat;
    const opts = options || {};
    if (opts.symlinks === "follow") {
      statOperation = fs$9.stat;
    }
    statOperation(path2).then((stat) => {
      const inspectObj = createInspectObj(path2, opts, stat);
      addExtraFieldsAsync(path2, inspectObj, opts).then(resolve, reject);
    }).catch((err) => {
      if (err.code === "ENOENT") {
        resolve(void 0);
      } else {
        reject(err);
      }
    });
  });
};
inspect$5.supportedChecksumAlgorithms = supportedChecksumAlgorithms;
inspect$5.symlinkOptions = symlinkOptions;
inspect$5.validateInput = validateInput$a;
inspect$5.sync = inspectSync;
inspect$5.async = inspectAsync;
var list$1 = {};
const fs$8 = fs_1;
const validate$9 = validate$g;
const validateInput$9 = (methodName, path2) => {
  const methodSignature = `${methodName}(path)`;
  validate$9.argument(methodSignature, "path", path2, ["string", "undefined"]);
};
const listSync = (path2) => {
  try {
    return fs$8.readdirSync(path2);
  } catch (err) {
    if (err.code === "ENOENT") {
      return void 0;
    }
    throw err;
  }
};
const listAsync = (path2) => {
  return new Promise((resolve, reject) => {
    fs$8.readdir(path2).then((list2) => {
      resolve(list2);
    }).catch((err) => {
      if (err.code === "ENOENT") {
        resolve(void 0);
      } else {
        reject(err);
      }
    });
  });
};
list$1.validateInput = validateInput$9;
list$1.sync = listSync;
list$1.async = listAsync;
const fs$7 = require$$0;
const pathUtil$8 = path$3;
const inspect$4 = inspect$5;
const fileType = (dirent) => {
  if (dirent.isDirectory()) {
    return "dir";
  }
  if (dirent.isFile()) {
    return "file";
  }
  if (dirent.isSymbolicLink()) {
    return "symlink";
  }
  return "other";
};
const initialWalkSync = (path2, options, callback) => {
  if (options.maxLevelsDeep === void 0) {
    options.maxLevelsDeep = Infinity;
  }
  const performInspectOnEachNode = options.inspectOptions !== void 0;
  if (options.symlinks) {
    if (options.inspectOptions === void 0) {
      options.inspectOptions = { symlinks: options.symlinks };
    } else {
      options.inspectOptions.symlinks = options.symlinks;
    }
  }
  const walkSync = (path3, currentLevel) => {
    fs$7.readdirSync(path3, { withFileTypes: true }).forEach((direntItem) => {
      const withFileTypesNotSupported = typeof direntItem === "string";
      let fileItemPath;
      if (withFileTypesNotSupported) {
        fileItemPath = pathUtil$8.join(path3, direntItem);
      } else {
        fileItemPath = pathUtil$8.join(path3, direntItem.name);
      }
      let fileItem;
      if (performInspectOnEachNode) {
        fileItem = inspect$4.sync(fileItemPath, options.inspectOptions);
      } else if (withFileTypesNotSupported) {
        const inspectObject = inspect$4.sync(
          fileItemPath,
          options.inspectOptions
        );
        fileItem = { name: inspectObject.name, type: inspectObject.type };
      } else {
        const type = fileType(direntItem);
        if (type === "symlink" && options.symlinks === "follow") {
          const symlinkPointsTo = fs$7.statSync(fileItemPath);
          fileItem = { name: direntItem.name, type: fileType(symlinkPointsTo) };
        } else {
          fileItem = { name: direntItem.name, type };
        }
      }
      if (fileItem !== void 0) {
        callback(fileItemPath, fileItem);
        if (fileItem.type === "dir" && currentLevel < options.maxLevelsDeep) {
          walkSync(fileItemPath, currentLevel + 1);
        }
      }
    });
  };
  const item = inspect$4.sync(path2, options.inspectOptions);
  if (item) {
    if (performInspectOnEachNode) {
      callback(path2, item);
    } else {
      callback(path2, { name: item.name, type: item.type });
    }
    if (item.type === "dir") {
      walkSync(path2, 1);
    }
  } else {
    callback(path2, void 0);
  }
};
const maxConcurrentOperations = 5;
const initialWalkAsync = (path2, options, callback, doneCallback) => {
  if (options.maxLevelsDeep === void 0) {
    options.maxLevelsDeep = Infinity;
  }
  const performInspectOnEachNode = options.inspectOptions !== void 0;
  if (options.symlinks) {
    if (options.inspectOptions === void 0) {
      options.inspectOptions = { symlinks: options.symlinks };
    } else {
      options.inspectOptions.symlinks = options.symlinks;
    }
  }
  const concurrentOperationsQueue = [];
  let nowDoingConcurrentOperations = 0;
  const checkConcurrentOperations = () => {
    if (concurrentOperationsQueue.length === 0 && nowDoingConcurrentOperations === 0) {
      doneCallback();
    } else if (concurrentOperationsQueue.length > 0 && nowDoingConcurrentOperations < maxConcurrentOperations) {
      const operation = concurrentOperationsQueue.pop();
      nowDoingConcurrentOperations += 1;
      operation();
    }
  };
  const whenConcurrencySlotAvailable = (operation) => {
    concurrentOperationsQueue.push(operation);
    checkConcurrentOperations();
  };
  const concurrentOperationDone = () => {
    nowDoingConcurrentOperations -= 1;
    checkConcurrentOperations();
  };
  const walkAsync = (path3, currentLevel) => {
    const goDeeperIfDir = (fileItemPath, fileItem) => {
      if (fileItem.type === "dir" && currentLevel < options.maxLevelsDeep) {
        walkAsync(fileItemPath, currentLevel + 1);
      }
    };
    whenConcurrencySlotAvailable(() => {
      fs$7.readdir(path3, { withFileTypes: true }, (err, files) => {
        if (err) {
          doneCallback(err);
        } else {
          files.forEach((direntItem) => {
            const withFileTypesNotSupported = typeof direntItem === "string";
            let fileItemPath;
            if (withFileTypesNotSupported) {
              fileItemPath = pathUtil$8.join(path3, direntItem);
            } else {
              fileItemPath = pathUtil$8.join(path3, direntItem.name);
            }
            if (performInspectOnEachNode || withFileTypesNotSupported) {
              whenConcurrencySlotAvailable(() => {
                inspect$4.async(fileItemPath, options.inspectOptions).then((fileItem) => {
                  if (fileItem !== void 0) {
                    if (performInspectOnEachNode) {
                      callback(fileItemPath, fileItem);
                    } else {
                      callback(fileItemPath, {
                        name: fileItem.name,
                        type: fileItem.type
                      });
                    }
                    goDeeperIfDir(fileItemPath, fileItem);
                  }
                  concurrentOperationDone();
                }).catch((err2) => {
                  doneCallback(err2);
                });
              });
            } else {
              const type = fileType(direntItem);
              if (type === "symlink" && options.symlinks === "follow") {
                whenConcurrencySlotAvailable(() => {
                  fs$7.stat(fileItemPath, (err2, symlinkPointsTo) => {
                    if (err2) {
                      doneCallback(err2);
                    } else {
                      const fileItem = {
                        name: direntItem.name,
                        type: fileType(symlinkPointsTo)
                      };
                      callback(fileItemPath, fileItem);
                      goDeeperIfDir(fileItemPath, fileItem);
                      concurrentOperationDone();
                    }
                  });
                });
              } else {
                const fileItem = { name: direntItem.name, type };
                callback(fileItemPath, fileItem);
                goDeeperIfDir(fileItemPath, fileItem);
              }
            }
          });
          concurrentOperationDone();
        }
      });
    });
  };
  inspect$4.async(path2, options.inspectOptions).then((item) => {
    if (item) {
      if (performInspectOnEachNode) {
        callback(path2, item);
      } else {
        callback(path2, { name: item.name, type: item.type });
      }
      if (item.type === "dir") {
        walkAsync(path2, 1);
      } else {
        doneCallback();
      }
    } else {
      callback(path2, void 0);
      doneCallback();
    }
  }).catch((err) => {
    doneCallback(err);
  });
};
tree_walker.sync = initialWalkSync;
tree_walker.async = initialWalkAsync;
var matcher$2 = {};
const isWindows = typeof process === "object" && process && process.platform === "win32";
var path$2 = isWindows ? { sep: "\\" } : { sep: "/" };
var balancedMatch = balanced$1;
function balanced$1(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);
  var r = range(a, b, str);
  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}
function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}
balanced$1.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;
  if (ai >= 0 && bi > 0) {
    if (a === b) {
      return [ai, bi];
    }
    begs = [];
    left = str.length;
    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [begs.pop(), bi];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }
        bi = str.indexOf(b, i + 1);
      }
      i = ai < bi && ai >= 0 ? ai : bi;
    }
    if (begs.length) {
      result = [left, right];
    }
  }
  return result;
}
var balanced = balancedMatch;
var braceExpansion = expandTop;
var escSlash = "\0SLASH" + Math.random() + "\0";
var escOpen = "\0OPEN" + Math.random() + "\0";
var escClose = "\0CLOSE" + Math.random() + "\0";
var escComma = "\0COMMA" + Math.random() + "\0";
var escPeriod = "\0PERIOD" + Math.random() + "\0";
function numeric(str) {
  return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
}
function escapeBraces(str) {
  return str.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod);
}
function unescapeBraces(str) {
  return str.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".");
}
function parseCommaParts(str) {
  if (!str)
    return [""];
  var parts = [];
  var m = balanced("{", "}", str);
  if (!m)
    return str.split(",");
  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(",");
  p[p.length - 1] += "{" + body + "}";
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length - 1] += postParts.shift();
    p.push.apply(p, postParts);
  }
  parts.push.apply(parts, p);
  return parts;
}
function expandTop(str) {
  if (!str)
    return [];
  if (str.substr(0, 2) === "{}") {
    str = "\\{\\}" + str.substr(2);
  }
  return expand$1(escapeBraces(str), true).map(unescapeBraces);
}
function embrace(str) {
  return "{" + str + "}";
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}
function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}
function expand$1(str, isTop) {
  var expansions = [];
  var m = balanced("{", "}", str);
  if (!m) return [str];
  var pre = m.pre;
  var post = m.post.length ? expand$1(m.post, false) : [""];
  if (/\$$/.test(m.pre)) {
    for (var k = 0; k < post.length; k++) {
      var expansion = pre + "{" + m.body + "}" + post[k];
      expansions.push(expansion);
    }
  } else {
    var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
    var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
    var isSequence = isNumericSequence || isAlphaSequence;
    var isOptions = m.body.indexOf(",") >= 0;
    if (!isSequence && !isOptions) {
      if (m.post.match(/,.*\}/)) {
        str = m.pre + "{" + m.body + escClose + m.post;
        return expand$1(str);
      }
      return [str];
    }
    var n;
    if (isSequence) {
      n = m.body.split(/\.\./);
    } else {
      n = parseCommaParts(m.body);
      if (n.length === 1) {
        n = expand$1(n[0], false).map(embrace);
        if (n.length === 1) {
          return post.map(function(p) {
            return m.pre + n[0] + p;
          });
        }
      }
    }
    var N;
    if (isSequence) {
      var x = numeric(n[0]);
      var y = numeric(n[1]);
      var width = Math.max(n[0].length, n[1].length);
      var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
      var test = lte;
      var reverse = y < x;
      if (reverse) {
        incr *= -1;
        test = gte;
      }
      var pad = n.some(isPadded);
      N = [];
      for (var i = x; test(i, y); i += incr) {
        var c;
        if (isAlphaSequence) {
          c = String.fromCharCode(i);
          if (c === "\\")
            c = "";
        } else {
          c = String(i);
          if (pad) {
            var need = width - c.length;
            if (need > 0) {
              var z = new Array(need + 1).join("0");
              if (i < 0)
                c = "-" + z + c.slice(1);
              else
                c = z + c;
            }
          }
        }
        N.push(c);
      }
    } else {
      N = [];
      for (var j = 0; j < n.length; j++) {
        N.push.apply(N, expand$1(n[j], false));
      }
    }
    for (var j = 0; j < N.length; j++) {
      for (var k = 0; k < post.length; k++) {
        var expansion = pre + N[j] + post[k];
        if (!isTop || isSequence || expansion)
          expansions.push(expansion);
      }
    }
  }
  return expansions;
}
const minimatch = minimatch_1 = (p, pattern, options = {}) => {
  assertValidPattern(pattern);
  if (!options.nocomment && pattern.charAt(0) === "#") {
    return false;
  }
  return new Minimatch$1(pattern, options).match(p);
};
var minimatch_1 = minimatch;
const path$1 = path$2;
minimatch.sep = path$1.sep;
const GLOBSTAR = Symbol("globstar **");
minimatch.GLOBSTAR = GLOBSTAR;
const expand = braceExpansion;
const plTypes = {
  "!": { open: "(?:(?!(?:", close: "))[^/]*?)" },
  "?": { open: "(?:", close: ")?" },
  "+": { open: "(?:", close: ")+" },
  "*": { open: "(?:", close: ")*" },
  "@": { open: "(?:", close: ")" }
};
const qmark = "[^/]";
const star = qmark + "*?";
const twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
const twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?";
const charSet = (s) => s.split("").reduce((set, c) => {
  set[c] = true;
  return set;
}, {});
const reSpecials = charSet("().*{}+?[]^$\\!");
const addPatternStartSet = charSet("[.(");
const slashSplit = /\/+/;
minimatch.filter = (pattern, options = {}) => (p, i, list2) => minimatch(p, pattern, options);
const ext = (a, b = {}) => {
  const t = {};
  Object.keys(a).forEach((k) => t[k] = a[k]);
  Object.keys(b).forEach((k) => t[k] = b[k]);
  return t;
};
minimatch.defaults = (def) => {
  if (!def || typeof def !== "object" || !Object.keys(def).length) {
    return minimatch;
  }
  const orig = minimatch;
  const m = (p, pattern, options) => orig(p, pattern, ext(def, options));
  m.Minimatch = class Minimatch extends orig.Minimatch {
    constructor(pattern, options) {
      super(pattern, ext(def, options));
    }
  };
  m.Minimatch.defaults = (options) => orig.defaults(ext(def, options)).Minimatch;
  m.filter = (pattern, options) => orig.filter(pattern, ext(def, options));
  m.defaults = (options) => orig.defaults(ext(def, options));
  m.makeRe = (pattern, options) => orig.makeRe(pattern, ext(def, options));
  m.braceExpand = (pattern, options) => orig.braceExpand(pattern, ext(def, options));
  m.match = (list2, pattern, options) => orig.match(list2, pattern, ext(def, options));
  return m;
};
minimatch.braceExpand = (pattern, options) => braceExpand(pattern, options);
const braceExpand = (pattern, options = {}) => {
  assertValidPattern(pattern);
  if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
    return [pattern];
  }
  return expand(pattern);
};
const MAX_PATTERN_LENGTH = 1024 * 64;
const assertValidPattern = (pattern) => {
  if (typeof pattern !== "string") {
    throw new TypeError("invalid pattern");
  }
  if (pattern.length > MAX_PATTERN_LENGTH) {
    throw new TypeError("pattern is too long");
  }
};
const SUBPARSE = Symbol("subparse");
minimatch.makeRe = (pattern, options) => new Minimatch$1(pattern, options || {}).makeRe();
minimatch.match = (list2, pattern, options = {}) => {
  const mm = new Minimatch$1(pattern, options);
  list2 = list2.filter((f) => mm.match(f));
  if (mm.options.nonull && !list2.length) {
    list2.push(pattern);
  }
  return list2;
};
const globUnescape = (s) => s.replace(/\\(.)/g, "$1");
const charUnescape = (s) => s.replace(/\\([^-\]])/g, "$1");
const regExpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
const braExpEscape = (s) => s.replace(/[[\]\\]/g, "\\$&");
let Minimatch$1 = class Minimatch {
  constructor(pattern, options) {
    assertValidPattern(pattern);
    if (!options) options = {};
    this.options = options;
    this.set = [];
    this.pattern = pattern;
    this.windowsPathsNoEscape = !!options.windowsPathsNoEscape || options.allowWindowsEscape === false;
    if (this.windowsPathsNoEscape) {
      this.pattern = this.pattern.replace(/\\/g, "/");
    }
    this.regexp = null;
    this.negate = false;
    this.comment = false;
    this.empty = false;
    this.partial = !!options.partial;
    this.make();
  }
  debug() {
  }
  make() {
    const pattern = this.pattern;
    const options = this.options;
    if (!options.nocomment && pattern.charAt(0) === "#") {
      this.comment = true;
      return;
    }
    if (!pattern) {
      this.empty = true;
      return;
    }
    this.parseNegate();
    let set = this.globSet = this.braceExpand();
    if (options.debug) this.debug = (...args) => console.error(...args);
    this.debug(this.pattern, set);
    set = this.globParts = set.map((s) => s.split(slashSplit));
    this.debug(this.pattern, set);
    set = set.map((s, si, set2) => s.map(this.parse, this));
    this.debug(this.pattern, set);
    set = set.filter((s) => s.indexOf(false) === -1);
    this.debug(this.pattern, set);
    this.set = set;
  }
  parseNegate() {
    if (this.options.nonegate) return;
    const pattern = this.pattern;
    let negate = false;
    let negateOffset = 0;
    for (let i = 0; i < pattern.length && pattern.charAt(i) === "!"; i++) {
      negate = !negate;
      negateOffset++;
    }
    if (negateOffset) this.pattern = pattern.slice(negateOffset);
    this.negate = negate;
  }
  // set partial to true to test if, for example,
  // "/a/b" matches the start of "/*/b/*/d"
  // Partial means, if you run out of file before you run
  // out of pattern, then that's fine, as long as all
  // the parts match.
  matchOne(file2, pattern, partial) {
    var options = this.options;
    this.debug(
      "matchOne",
      { "this": this, file: file2, pattern }
    );
    this.debug("matchOne", file2.length, pattern.length);
    for (var fi = 0, pi = 0, fl = file2.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
      this.debug("matchOne loop");
      var p = pattern[pi];
      var f = file2[fi];
      this.debug(pattern, p, f);
      if (p === false) return false;
      if (p === GLOBSTAR) {
        this.debug("GLOBSTAR", [pattern, p, f]);
        var fr = fi;
        var pr = pi + 1;
        if (pr === pl) {
          this.debug("** at the end");
          for (; fi < fl; fi++) {
            if (file2[fi] === "." || file2[fi] === ".." || !options.dot && file2[fi].charAt(0) === ".") return false;
          }
          return true;
        }
        while (fr < fl) {
          var swallowee = file2[fr];
          this.debug("\nglobstar while", file2, fr, pattern, pr, swallowee);
          if (this.matchOne(file2.slice(fr), pattern.slice(pr), partial)) {
            this.debug("globstar found match!", fr, fl, swallowee);
            return true;
          } else {
            if (swallowee === "." || swallowee === ".." || !options.dot && swallowee.charAt(0) === ".") {
              this.debug("dot detected!", file2, fr, pattern, pr);
              break;
            }
            this.debug("globstar swallow a segment, and continue");
            fr++;
          }
        }
        if (partial) {
          this.debug("\n>>> no match, partial?", file2, fr, pattern, pr);
          if (fr === fl) return true;
        }
        return false;
      }
      var hit;
      if (typeof p === "string") {
        hit = f === p;
        this.debug("string match", p, f, hit);
      } else {
        hit = f.match(p);
        this.debug("pattern match", p, f, hit);
      }
      if (!hit) return false;
    }
    if (fi === fl && pi === pl) {
      return true;
    } else if (fi === fl) {
      return partial;
    } else if (pi === pl) {
      return fi === fl - 1 && file2[fi] === "";
    }
    throw new Error("wtf?");
  }
  braceExpand() {
    return braceExpand(this.pattern, this.options);
  }
  parse(pattern, isSub) {
    assertValidPattern(pattern);
    const options = this.options;
    if (pattern === "**") {
      if (!options.noglobstar)
        return GLOBSTAR;
      else
        pattern = "*";
    }
    if (pattern === "") return "";
    let re = "";
    let hasMagic = false;
    let escaping = false;
    const patternListStack = [];
    const negativeLists = [];
    let stateChar;
    let inClass = false;
    let reClassStart = -1;
    let classStart = -1;
    let cs;
    let pl;
    let sp;
    let dotTravAllowed = pattern.charAt(0) === ".";
    let dotFileAllowed = options.dot || dotTravAllowed;
    const patternStart = () => dotTravAllowed ? "" : dotFileAllowed ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)";
    const subPatternStart = (p) => p.charAt(0) === "." ? "" : options.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)";
    const clearStateChar = () => {
      if (stateChar) {
        switch (stateChar) {
          case "*":
            re += star;
            hasMagic = true;
            break;
          case "?":
            re += qmark;
            hasMagic = true;
            break;
          default:
            re += "\\" + stateChar;
            break;
        }
        this.debug("clearStateChar %j %j", stateChar, re);
        stateChar = false;
      }
    };
    for (let i = 0, c; i < pattern.length && (c = pattern.charAt(i)); i++) {
      this.debug("%s	%s %s %j", pattern, i, re, c);
      if (escaping) {
        if (c === "/") {
          return false;
        }
        if (reSpecials[c]) {
          re += "\\";
        }
        re += c;
        escaping = false;
        continue;
      }
      switch (c) {
        case "/": {
          return false;
        }
        case "\\":
          if (inClass && pattern.charAt(i + 1) === "-") {
            re += c;
            continue;
          }
          clearStateChar();
          escaping = true;
          continue;
        case "?":
        case "*":
        case "+":
        case "@":
        case "!":
          this.debug("%s	%s %s %j <-- stateChar", pattern, i, re, c);
          if (inClass) {
            this.debug("  in class");
            if (c === "!" && i === classStart + 1) c = "^";
            re += c;
            continue;
          }
          this.debug("call clearStateChar %j", stateChar);
          clearStateChar();
          stateChar = c;
          if (options.noext) clearStateChar();
          continue;
        case "(": {
          if (inClass) {
            re += "(";
            continue;
          }
          if (!stateChar) {
            re += "\\(";
            continue;
          }
          const plEntry = {
            type: stateChar,
            start: i - 1,
            reStart: re.length,
            open: plTypes[stateChar].open,
            close: plTypes[stateChar].close
          };
          this.debug(this.pattern, "	", plEntry);
          patternListStack.push(plEntry);
          re += plEntry.open;
          if (plEntry.start === 0 && plEntry.type !== "!") {
            dotTravAllowed = true;
            re += subPatternStart(pattern.slice(i + 1));
          }
          this.debug("plType %j %j", stateChar, re);
          stateChar = false;
          continue;
        }
        case ")": {
          const plEntry = patternListStack[patternListStack.length - 1];
          if (inClass || !plEntry) {
            re += "\\)";
            continue;
          }
          patternListStack.pop();
          clearStateChar();
          hasMagic = true;
          pl = plEntry;
          re += pl.close;
          if (pl.type === "!") {
            negativeLists.push(Object.assign(pl, { reEnd: re.length }));
          }
          continue;
        }
        case "|": {
          const plEntry = patternListStack[patternListStack.length - 1];
          if (inClass || !plEntry) {
            re += "\\|";
            continue;
          }
          clearStateChar();
          re += "|";
          if (plEntry.start === 0 && plEntry.type !== "!") {
            dotTravAllowed = true;
            re += subPatternStart(pattern.slice(i + 1));
          }
          continue;
        }
        case "[":
          clearStateChar();
          if (inClass) {
            re += "\\" + c;
            continue;
          }
          inClass = true;
          classStart = i;
          reClassStart = re.length;
          re += c;
          continue;
        case "]":
          if (i === classStart + 1 || !inClass) {
            re += "\\" + c;
            continue;
          }
          cs = pattern.substring(classStart + 1, i);
          try {
            RegExp("[" + braExpEscape(charUnescape(cs)) + "]");
            re += c;
          } catch (er) {
            re = re.substring(0, reClassStart) + "(?:$.)";
          }
          hasMagic = true;
          inClass = false;
          continue;
        default:
          clearStateChar();
          if (reSpecials[c] && !(c === "^" && inClass)) {
            re += "\\";
          }
          re += c;
          break;
      }
    }
    if (inClass) {
      cs = pattern.slice(classStart + 1);
      sp = this.parse(cs, SUBPARSE);
      re = re.substring(0, reClassStart) + "\\[" + sp[0];
      hasMagic = hasMagic || sp[1];
    }
    for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
      let tail;
      tail = re.slice(pl.reStart + pl.open.length);
      this.debug("setting tail", re, pl);
      tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, (_, $1, $2) => {
        if (!$2) {
          $2 = "\\";
        }
        return $1 + $1 + $2 + "|";
      });
      this.debug("tail=%j\n   %s", tail, tail, pl, re);
      const t = pl.type === "*" ? star : pl.type === "?" ? qmark : "\\" + pl.type;
      hasMagic = true;
      re = re.slice(0, pl.reStart) + t + "\\(" + tail;
    }
    clearStateChar();
    if (escaping) {
      re += "\\\\";
    }
    const addPatternStart = addPatternStartSet[re.charAt(0)];
    for (let n = negativeLists.length - 1; n > -1; n--) {
      const nl = negativeLists[n];
      const nlBefore = re.slice(0, nl.reStart);
      const nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
      let nlAfter = re.slice(nl.reEnd);
      const nlLast = re.slice(nl.reEnd - 8, nl.reEnd) + nlAfter;
      const closeParensBefore = nlBefore.split(")").length;
      const openParensBefore = nlBefore.split("(").length - closeParensBefore;
      let cleanAfter = nlAfter;
      for (let i = 0; i < openParensBefore; i++) {
        cleanAfter = cleanAfter.replace(/\)[+*?]?/, "");
      }
      nlAfter = cleanAfter;
      const dollar = nlAfter === "" && isSub !== SUBPARSE ? "(?:$|\\/)" : "";
      re = nlBefore + nlFirst + nlAfter + dollar + nlLast;
    }
    if (re !== "" && hasMagic) {
      re = "(?=.)" + re;
    }
    if (addPatternStart) {
      re = patternStart() + re;
    }
    if (isSub === SUBPARSE) {
      return [re, hasMagic];
    }
    if (options.nocase && !hasMagic) {
      hasMagic = pattern.toUpperCase() !== pattern.toLowerCase();
    }
    if (!hasMagic) {
      return globUnescape(pattern);
    }
    const flags = options.nocase ? "i" : "";
    try {
      return Object.assign(new RegExp("^" + re + "$", flags), {
        _glob: pattern,
        _src: re
      });
    } catch (er) {
      return new RegExp("$.");
    }
  }
  makeRe() {
    if (this.regexp || this.regexp === false) return this.regexp;
    const set = this.set;
    if (!set.length) {
      this.regexp = false;
      return this.regexp;
    }
    const options = this.options;
    const twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot;
    const flags = options.nocase ? "i" : "";
    let re = set.map((pattern) => {
      pattern = pattern.map(
        (p) => typeof p === "string" ? regExpEscape(p) : p === GLOBSTAR ? GLOBSTAR : p._src
      ).reduce((set2, p) => {
        if (!(set2[set2.length - 1] === GLOBSTAR && p === GLOBSTAR)) {
          set2.push(p);
        }
        return set2;
      }, []);
      pattern.forEach((p, i) => {
        if (p !== GLOBSTAR || pattern[i - 1] === GLOBSTAR) {
          return;
        }
        if (i === 0) {
          if (pattern.length > 1) {
            pattern[i + 1] = "(?:\\/|" + twoStar + "\\/)?" + pattern[i + 1];
          } else {
            pattern[i] = twoStar;
          }
        } else if (i === pattern.length - 1) {
          pattern[i - 1] += "(?:\\/|" + twoStar + ")?";
        } else {
          pattern[i - 1] += "(?:\\/|\\/" + twoStar + "\\/)" + pattern[i + 1];
          pattern[i + 1] = GLOBSTAR;
        }
      });
      return pattern.filter((p) => p !== GLOBSTAR).join("/");
    }).join("|");
    re = "^(?:" + re + ")$";
    if (this.negate) re = "^(?!" + re + ").*$";
    try {
      this.regexp = new RegExp(re, flags);
    } catch (ex) {
      this.regexp = false;
    }
    return this.regexp;
  }
  match(f, partial = this.partial) {
    this.debug("match", f, this.pattern);
    if (this.comment) return false;
    if (this.empty) return f === "";
    if (f === "/" && partial) return true;
    const options = this.options;
    if (path$1.sep !== "/") {
      f = f.split(path$1.sep).join("/");
    }
    f = f.split(slashSplit);
    this.debug(this.pattern, "split", f);
    const set = this.set;
    this.debug(this.pattern, "set", set);
    let filename;
    for (let i = f.length - 1; i >= 0; i--) {
      filename = f[i];
      if (filename) break;
    }
    for (let i = 0; i < set.length; i++) {
      const pattern = set[i];
      let file2 = f;
      if (options.matchBase && pattern.length === 1) {
        file2 = [filename];
      }
      const hit = this.matchOne(file2, pattern, partial);
      if (hit) {
        if (options.flipNegate) return true;
        return !this.negate;
      }
    }
    if (options.flipNegate) return false;
    return this.negate;
  }
  static defaults(def) {
    return minimatch.defaults(def).Minimatch;
  }
};
minimatch.Minimatch = Minimatch$1;
const Minimatch2 = minimatch_1.Minimatch;
const convertPatternToAbsolutePath = (basePath, pattern) => {
  const hasSlash = pattern.indexOf("/") !== -1;
  const isAbsolute = /^!?\//.test(pattern);
  const isNegated = /^!/.test(pattern);
  let separator;
  if (!isAbsolute && hasSlash) {
    const patternWithoutFirstCharacters = pattern.replace(/^!/, "").replace(/^\.\//, "");
    if (/\/$/.test(basePath)) {
      separator = "";
    } else {
      separator = "/";
    }
    if (isNegated) {
      return `!${basePath}${separator}${patternWithoutFirstCharacters}`;
    }
    return `${basePath}${separator}${patternWithoutFirstCharacters}`;
  }
  return pattern;
};
matcher$2.create = (basePath, patterns, ignoreCase) => {
  let normalizedPatterns;
  if (typeof patterns === "string") {
    normalizedPatterns = [patterns];
  } else {
    normalizedPatterns = patterns;
  }
  const matchers = normalizedPatterns.map((pattern) => {
    return convertPatternToAbsolutePath(basePath, pattern);
  }).map((pattern) => {
    return new Minimatch2(pattern, {
      matchBase: true,
      nocomment: true,
      nocase: ignoreCase || false,
      dot: true,
      windowsPathsNoEscape: true
    });
  });
  const performMatch = (absolutePath) => {
    let mode2 = "matching";
    let weHaveMatch = false;
    let currentMatcher;
    let i;
    for (i = 0; i < matchers.length; i += 1) {
      currentMatcher = matchers[i];
      if (currentMatcher.negate) {
        mode2 = "negation";
        if (i === 0) {
          weHaveMatch = true;
        }
      }
      if (mode2 === "negation" && weHaveMatch && !currentMatcher.match(absolutePath)) {
        return false;
      }
      if (mode2 === "matching" && !weHaveMatch) {
        weHaveMatch = currentMatcher.match(absolutePath);
      }
    }
    return weHaveMatch;
  };
  return performMatch;
};
const pathUtil$7 = path$3;
const treeWalker$2 = tree_walker;
const inspect$3 = inspect$5;
const matcher$1 = matcher$2;
const validate$8 = validate$g;
const validateInput$8 = (methodName, path2, options) => {
  const methodSignature = `${methodName}([path], options)`;
  validate$8.argument(methodSignature, "path", path2, ["string"]);
  validate$8.options(methodSignature, "options", options, {
    matching: ["string", "array of string"],
    filter: ["function"],
    files: ["boolean"],
    directories: ["boolean"],
    recursive: ["boolean"],
    ignoreCase: ["boolean"]
  });
};
const normalizeOptions = (options) => {
  const opts = options || {};
  if (opts.matching === void 0) {
    opts.matching = "*";
  }
  if (opts.files === void 0) {
    opts.files = true;
  }
  if (opts.ignoreCase === void 0) {
    opts.ignoreCase = false;
  }
  if (opts.directories === void 0) {
    opts.directories = false;
  }
  if (opts.recursive === void 0) {
    opts.recursive = true;
  }
  return opts;
};
const processFoundPaths = (foundPaths, cwd) => {
  return foundPaths.map((path2) => {
    return pathUtil$7.relative(cwd, path2);
  });
};
const generatePathDoesntExistError = (path2) => {
  const err = new Error(`Path you want to find stuff in doesn't exist ${path2}`);
  err.code = "ENOENT";
  return err;
};
const generatePathNotDirectoryError = (path2) => {
  const err = new Error(
    `Path you want to find stuff in must be a directory ${path2}`
  );
  err.code = "ENOTDIR";
  return err;
};
const findSync = (path2, options) => {
  const foundAbsolutePaths = [];
  const matchesAnyOfGlobs = matcher$1.create(
    path2,
    options.matching,
    options.ignoreCase
  );
  let maxLevelsDeep = Infinity;
  if (options.recursive === false) {
    maxLevelsDeep = 1;
  }
  treeWalker$2.sync(
    path2,
    {
      maxLevelsDeep,
      symlinks: "follow",
      inspectOptions: { times: true, absolutePath: true }
    },
    (itemPath, item) => {
      if (item && itemPath !== path2 && matchesAnyOfGlobs(itemPath)) {
        const weHaveMatch = item.type === "file" && options.files === true || item.type === "dir" && options.directories === true;
        if (weHaveMatch) {
          if (options.filter) {
            const passedThroughFilter = options.filter(item);
            if (passedThroughFilter) {
              foundAbsolutePaths.push(itemPath);
            }
          } else {
            foundAbsolutePaths.push(itemPath);
          }
        }
      }
    }
  );
  foundAbsolutePaths.sort();
  return processFoundPaths(foundAbsolutePaths, options.cwd);
};
const findSyncInit = (path2, options) => {
  const entryPointInspect = inspect$3.sync(path2, { symlinks: "follow" });
  if (entryPointInspect === void 0) {
    throw generatePathDoesntExistError(path2);
  } else if (entryPointInspect.type !== "dir") {
    throw generatePathNotDirectoryError(path2);
  }
  return findSync(path2, normalizeOptions(options));
};
const findAsync = (path2, options) => {
  return new Promise((resolve, reject) => {
    const foundAbsolutePaths = [];
    const matchesAnyOfGlobs = matcher$1.create(
      path2,
      options.matching,
      options.ignoreCase
    );
    let maxLevelsDeep = Infinity;
    if (options.recursive === false) {
      maxLevelsDeep = 1;
    }
    let waitingForFiltersToFinish = 0;
    let treeWalkerDone = false;
    const maybeDone = () => {
      if (treeWalkerDone && waitingForFiltersToFinish === 0) {
        foundAbsolutePaths.sort();
        resolve(processFoundPaths(foundAbsolutePaths, options.cwd));
      }
    };
    treeWalker$2.async(
      path2,
      {
        maxLevelsDeep,
        symlinks: "follow",
        inspectOptions: { times: true, absolutePath: true }
      },
      (itemPath, item) => {
        if (item && itemPath !== path2 && matchesAnyOfGlobs(itemPath)) {
          const weHaveMatch = item.type === "file" && options.files === true || item.type === "dir" && options.directories === true;
          if (weHaveMatch) {
            if (options.filter) {
              const passedThroughFilter = options.filter(item);
              const isPromise = typeof passedThroughFilter.then === "function";
              if (isPromise) {
                waitingForFiltersToFinish += 1;
                passedThroughFilter.then((passedThroughFilterResult) => {
                  if (passedThroughFilterResult) {
                    foundAbsolutePaths.push(itemPath);
                  }
                  waitingForFiltersToFinish -= 1;
                  maybeDone();
                }).catch((err) => {
                  reject(err);
                });
              } else if (passedThroughFilter) {
                foundAbsolutePaths.push(itemPath);
              }
            } else {
              foundAbsolutePaths.push(itemPath);
            }
          }
        }
      },
      (err) => {
        if (err) {
          reject(err);
        } else {
          treeWalkerDone = true;
          maybeDone();
        }
      }
    );
  });
};
const findAsyncInit = (path2, options) => {
  return inspect$3.async(path2, { symlinks: "follow" }).then((entryPointInspect) => {
    if (entryPointInspect === void 0) {
      throw generatePathDoesntExistError(path2);
    } else if (entryPointInspect.type !== "dir") {
      throw generatePathNotDirectoryError(path2);
    }
    return findAsync(path2, normalizeOptions(options));
  });
};
find$1.validateInput = validateInput$8;
find$1.sync = findSyncInit;
find$1.async = findAsyncInit;
var inspect_tree = {};
const crypto$1 = require$$0$1;
const pathUtil$6 = path$3;
const inspect$2 = inspect$5;
const validate$7 = validate$g;
const treeWalker$1 = tree_walker;
const validateInput$7 = (methodName, path2, options) => {
  const methodSignature = `${methodName}(path, [options])`;
  validate$7.argument(methodSignature, "path", path2, ["string"]);
  validate$7.options(methodSignature, "options", options, {
    checksum: ["string"],
    relativePath: ["boolean"],
    times: ["boolean"],
    symlinks: ["string"]
  });
  if (options && options.checksum !== void 0 && inspect$2.supportedChecksumAlgorithms.indexOf(options.checksum) === -1) {
    throw new Error(
      `Argument "options.checksum" passed to ${methodSignature} must have one of values: ${inspect$2.supportedChecksumAlgorithms.join(
        ", "
      )}`
    );
  }
  if (options && options.symlinks !== void 0 && inspect$2.symlinkOptions.indexOf(options.symlinks) === -1) {
    throw new Error(
      `Argument "options.symlinks" passed to ${methodSignature} must have one of values: ${inspect$2.symlinkOptions.join(
        ", "
      )}`
    );
  }
};
const relativePathInTree = (parentInspectObj, inspectObj) => {
  if (parentInspectObj === void 0) {
    return ".";
  }
  return parentInspectObj.relativePath + "/" + inspectObj.name;
};
const checksumOfDir = (inspectList, algo) => {
  const hash = crypto$1.createHash(algo);
  inspectList.forEach((inspectObj) => {
    hash.update(inspectObj.name + inspectObj[algo]);
  });
  return hash.digest("hex");
};
const calculateTreeDependentProperties = (parentInspectObj, inspectObj, options) => {
  if (options.relativePath) {
    inspectObj.relativePath = relativePathInTree(parentInspectObj, inspectObj);
  }
  if (inspectObj.type === "dir") {
    inspectObj.children.forEach((childInspectObj) => {
      calculateTreeDependentProperties(inspectObj, childInspectObj, options);
    });
    inspectObj.size = 0;
    inspectObj.children.sort((a, b) => {
      if (a.type === "dir" && b.type === "file") {
        return -1;
      }
      if (a.type === "file" && b.type === "dir") {
        return 1;
      }
      return a.name.localeCompare(b.name);
    });
    inspectObj.children.forEach((child) => {
      inspectObj.size += child.size || 0;
    });
    if (options.checksum) {
      inspectObj[options.checksum] = checksumOfDir(
        inspectObj.children,
        options.checksum
      );
    }
  }
};
const findParentInTree = (treeNode, pathChain, item) => {
  const name = pathChain[0];
  if (pathChain.length > 1) {
    const itemInTreeForPathChain = treeNode.children.find((child) => {
      return child.name === name;
    });
    return findParentInTree(itemInTreeForPathChain, pathChain.slice(1));
  }
  return treeNode;
};
const inspectTreeSync = (path2, opts) => {
  const options = opts || {};
  let tree;
  treeWalker$1.sync(path2, { inspectOptions: options }, (itemPath, item) => {
    if (item) {
      if (item.type === "dir") {
        item.children = [];
      }
      const relativePath = pathUtil$6.relative(path2, itemPath);
      if (relativePath === "") {
        tree = item;
      } else {
        const parentItem = findParentInTree(
          tree,
          relativePath.split(pathUtil$6.sep)
        );
        parentItem.children.push(item);
      }
    }
  });
  if (tree) {
    calculateTreeDependentProperties(void 0, tree, options);
  }
  return tree;
};
const inspectTreeAsync = (path2, opts) => {
  const options = opts || {};
  let tree;
  return new Promise((resolve, reject) => {
    treeWalker$1.async(
      path2,
      { inspectOptions: options },
      (itemPath, item) => {
        if (item) {
          if (item.type === "dir") {
            item.children = [];
          }
          const relativePath = pathUtil$6.relative(path2, itemPath);
          if (relativePath === "") {
            tree = item;
          } else {
            const parentItem = findParentInTree(
              tree,
              relativePath.split(pathUtil$6.sep)
            );
            parentItem.children.push(item);
          }
        }
      },
      (err) => {
        if (err) {
          reject(err);
        } else {
          if (tree) {
            calculateTreeDependentProperties(void 0, tree, options);
          }
          resolve(tree);
        }
      }
    );
  });
};
inspect_tree.validateInput = validateInput$7;
inspect_tree.sync = inspectTreeSync;
inspect_tree.async = inspectTreeAsync;
var copy$2 = {};
var exists$3 = {};
const fs$6 = fs_1;
const validate$6 = validate$g;
const validateInput$6 = (methodName, path2) => {
  const methodSignature = `${methodName}(path)`;
  validate$6.argument(methodSignature, "path", path2, ["string"]);
};
const existsSync = (path2) => {
  try {
    const stat = fs$6.statSync(path2);
    if (stat.isDirectory()) {
      return "dir";
    } else if (stat.isFile()) {
      return "file";
    }
    return "other";
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }
  return false;
};
const existsAsync = (path2) => {
  return new Promise((resolve, reject) => {
    fs$6.stat(path2).then((stat) => {
      if (stat.isDirectory()) {
        resolve("dir");
      } else if (stat.isFile()) {
        resolve("file");
      } else {
        resolve("other");
      }
    }).catch((err) => {
      if (err.code === "ENOENT") {
        resolve(false);
      } else {
        reject(err);
      }
    });
  });
};
exists$3.validateInput = validateInput$6;
exists$3.sync = existsSync;
exists$3.async = existsAsync;
const pathUtil$5 = path$3;
const fs$5 = fs_1;
const dir$4 = dir$6;
const exists$2 = exists$3;
const inspect$1 = inspect$5;
const write$1 = write$4;
const matcher = matcher$2;
const fileMode = mode;
const treeWalker = tree_walker;
const validate$5 = validate$g;
const validateInput$5 = (methodName, from, to, options) => {
  const methodSignature = `${methodName}(from, to, [options])`;
  validate$5.argument(methodSignature, "from", from, ["string"]);
  validate$5.argument(methodSignature, "to", to, ["string"]);
  validate$5.options(methodSignature, "options", options, {
    overwrite: ["boolean", "function"],
    matching: ["string", "array of string"],
    ignoreCase: ["boolean"]
  });
};
const parseOptions$1 = (options, from) => {
  const opts = options || {};
  const parsedOptions = {};
  if (opts.ignoreCase === void 0) {
    opts.ignoreCase = false;
  }
  parsedOptions.overwrite = opts.overwrite;
  if (opts.matching) {
    parsedOptions.allowedToCopy = matcher.create(
      from,
      opts.matching,
      opts.ignoreCase
    );
  } else {
    parsedOptions.allowedToCopy = () => {
      return true;
    };
  }
  return parsedOptions;
};
const generateNoSourceError = (path2) => {
  const err = new Error(`Path to copy doesn't exist ${path2}`);
  err.code = "ENOENT";
  return err;
};
const generateDestinationExistsError$1 = (path2) => {
  const err = new Error(`Destination path already exists ${path2}`);
  err.code = "EEXIST";
  return err;
};
const inspectOptions = {
  mode: true,
  symlinks: "report",
  times: true,
  absolutePath: true
};
const shouldThrowDestinationExistsError = (context) => {
  return typeof context.opts.overwrite !== "function" && context.opts.overwrite !== true;
};
const checksBeforeCopyingSync = (from, to, opts) => {
  if (!exists$2.sync(from)) {
    throw generateNoSourceError(from);
  }
  if (exists$2.sync(to) && !opts.overwrite) {
    throw generateDestinationExistsError$1(to);
  }
};
const canOverwriteItSync = (context) => {
  if (typeof context.opts.overwrite === "function") {
    const destInspectData = inspect$1.sync(context.destPath, inspectOptions);
    return context.opts.overwrite(context.srcInspectData, destInspectData);
  }
  return context.opts.overwrite === true;
};
const copyFileSync = (srcPath, destPath, mode2, context) => {
  const data = fs$5.readFileSync(srcPath);
  try {
    fs$5.writeFileSync(destPath, data, { mode: mode2, flag: "wx" });
  } catch (err) {
    if (err.code === "ENOENT") {
      write$1.sync(destPath, data, { mode: mode2 });
    } else if (err.code === "EEXIST") {
      if (canOverwriteItSync(context)) {
        fs$5.writeFileSync(destPath, data, { mode: mode2 });
      } else if (shouldThrowDestinationExistsError(context)) {
        throw generateDestinationExistsError$1(context.destPath);
      }
    } else {
      throw err;
    }
  }
};
const copySymlinkSync = (from, to) => {
  const symlinkPointsAt = fs$5.readlinkSync(from);
  try {
    fs$5.symlinkSync(symlinkPointsAt, to);
  } catch (err) {
    if (err.code === "EEXIST") {
      fs$5.unlinkSync(to);
      fs$5.symlinkSync(symlinkPointsAt, to);
    } else {
      throw err;
    }
  }
};
const copyItemSync = (srcPath, srcInspectData, destPath, opts) => {
  const context = { srcPath, destPath, srcInspectData, opts };
  const mode2 = fileMode.normalizeFileMode(srcInspectData.mode);
  if (srcInspectData.type === "dir") {
    dir$4.createSync(destPath, { mode: mode2 });
  } else if (srcInspectData.type === "file") {
    copyFileSync(srcPath, destPath, mode2, context);
  } else if (srcInspectData.type === "symlink") {
    copySymlinkSync(srcPath, destPath);
  }
};
const copySync = (from, to, options) => {
  const opts = parseOptions$1(options, from);
  checksBeforeCopyingSync(from, to, opts);
  treeWalker.sync(from, { inspectOptions }, (srcPath, srcInspectData) => {
    const rel = pathUtil$5.relative(from, srcPath);
    const destPath = pathUtil$5.resolve(to, rel);
    if (opts.allowedToCopy(srcPath, destPath, srcInspectData)) {
      copyItemSync(srcPath, srcInspectData, destPath, opts);
    }
  });
};
const checksBeforeCopyingAsync = (from, to, opts) => {
  return exists$2.async(from).then((srcPathExists) => {
    if (!srcPathExists) {
      throw generateNoSourceError(from);
    } else {
      return exists$2.async(to);
    }
  }).then((destPathExists) => {
    if (destPathExists && !opts.overwrite) {
      throw generateDestinationExistsError$1(to);
    }
  });
};
const canOverwriteItAsync = (context) => {
  return new Promise((resolve, reject) => {
    if (typeof context.opts.overwrite === "function") {
      inspect$1.async(context.destPath, inspectOptions).then((destInspectData) => {
        resolve(
          context.opts.overwrite(context.srcInspectData, destInspectData)
        );
      }).catch(reject);
    } else {
      resolve(context.opts.overwrite === true);
    }
  });
};
const copyFileAsync = (srcPath, destPath, mode2, context, runOptions) => {
  return new Promise((resolve, reject) => {
    const runOpts = runOptions || {};
    let flags = "wx";
    if (runOpts.overwrite) {
      flags = "w";
    }
    const readStream = fs$5.createReadStream(srcPath);
    const writeStream = fs$5.createWriteStream(destPath, { mode: mode2, flags });
    readStream.on("error", reject);
    writeStream.on("error", (err) => {
      readStream.resume();
      if (err.code === "ENOENT") {
        dir$4.createAsync(pathUtil$5.dirname(destPath)).then(() => {
          copyFileAsync(srcPath, destPath, mode2, context).then(
            resolve,
            reject
          );
        }).catch(reject);
      } else if (err.code === "EEXIST") {
        canOverwriteItAsync(context).then((canOverwite) => {
          if (canOverwite) {
            copyFileAsync(srcPath, destPath, mode2, context, {
              overwrite: true
            }).then(resolve, reject);
          } else if (shouldThrowDestinationExistsError(context)) {
            reject(generateDestinationExistsError$1(destPath));
          } else {
            resolve();
          }
        }).catch(reject);
      } else {
        reject(err);
      }
    });
    writeStream.on("finish", resolve);
    readStream.pipe(writeStream);
  });
};
const copySymlinkAsync = (from, to) => {
  return fs$5.readlink(from).then((symlinkPointsAt) => {
    return new Promise((resolve, reject) => {
      fs$5.symlink(symlinkPointsAt, to).then(resolve).catch((err) => {
        if (err.code === "EEXIST") {
          fs$5.unlink(to).then(() => {
            return fs$5.symlink(symlinkPointsAt, to);
          }).then(resolve, reject);
        } else {
          reject(err);
        }
      });
    });
  });
};
const copyItemAsync = (srcPath, srcInspectData, destPath, opts) => {
  const context = { srcPath, destPath, srcInspectData, opts };
  const mode2 = fileMode.normalizeFileMode(srcInspectData.mode);
  if (srcInspectData.type === "dir") {
    return dir$4.createAsync(destPath, { mode: mode2 });
  } else if (srcInspectData.type === "file") {
    return copyFileAsync(srcPath, destPath, mode2, context);
  } else if (srcInspectData.type === "symlink") {
    return copySymlinkAsync(srcPath, destPath);
  }
  return Promise.resolve();
};
const copyAsync = (from, to, options) => {
  return new Promise((resolve, reject) => {
    const opts = parseOptions$1(options, from);
    checksBeforeCopyingAsync(from, to, opts).then(() => {
      let allFilesDelivered = false;
      let filesInProgress = 0;
      treeWalker.async(
        from,
        { inspectOptions },
        (srcPath, item) => {
          if (item) {
            const rel = pathUtil$5.relative(from, srcPath);
            const destPath = pathUtil$5.resolve(to, rel);
            if (opts.allowedToCopy(srcPath, item, destPath)) {
              filesInProgress += 1;
              copyItemAsync(srcPath, item, destPath, opts).then(() => {
                filesInProgress -= 1;
                if (allFilesDelivered && filesInProgress === 0) {
                  resolve();
                }
              }).catch(reject);
            }
          }
        },
        (err) => {
          if (err) {
            reject(err);
          } else {
            allFilesDelivered = true;
            if (allFilesDelivered && filesInProgress === 0) {
              resolve();
            }
          }
        }
      );
    }).catch(reject);
  });
};
copy$2.validateInput = validateInput$5;
copy$2.sync = copySync;
copy$2.async = copyAsync;
var move$2 = {};
const pathUtil$4 = path$3;
const fs$4 = fs_1;
const validate$4 = validate$g;
const copy$1 = copy$2;
const dir$3 = dir$6;
const exists$1 = exists$3;
const remove$1 = remove$3;
const validateInput$4 = (methodName, from, to, options) => {
  const methodSignature = `${methodName}(from, to, [options])`;
  validate$4.argument(methodSignature, "from", from, ["string"]);
  validate$4.argument(methodSignature, "to", to, ["string"]);
  validate$4.options(methodSignature, "options", options, {
    overwrite: ["boolean"]
  });
};
const parseOptions = (options) => {
  const opts = options || {};
  return opts;
};
const generateDestinationExistsError = (path2) => {
  const err = new Error(`Destination path already exists ${path2}`);
  err.code = "EEXIST";
  return err;
};
const generateSourceDoesntExistError = (path2) => {
  const err = new Error(`Path to move doesn't exist ${path2}`);
  err.code = "ENOENT";
  return err;
};
const moveSync = (from, to, options) => {
  const opts = parseOptions(options);
  if (exists$1.sync(to) !== false && opts.overwrite !== true) {
    throw generateDestinationExistsError(to);
  }
  try {
    fs$4.renameSync(from, to);
  } catch (err) {
    if (err.code === "EISDIR" || err.code === "EPERM") {
      remove$1.sync(to);
      fs$4.renameSync(from, to);
    } else if (err.code === "EXDEV") {
      copy$1.sync(from, to, { overwrite: true });
      remove$1.sync(from);
    } else if (err.code === "ENOENT") {
      if (!exists$1.sync(from)) {
        throw generateSourceDoesntExistError(from);
      }
      dir$3.createSync(pathUtil$4.dirname(to));
      fs$4.renameSync(from, to);
    } else {
      throw err;
    }
  }
};
const ensureDestinationPathExistsAsync = (to) => {
  return new Promise((resolve, reject) => {
    const destDir = pathUtil$4.dirname(to);
    exists$1.async(destDir).then((dstExists) => {
      if (!dstExists) {
        dir$3.createAsync(destDir).then(resolve, reject);
      } else {
        reject();
      }
    }).catch(reject);
  });
};
const moveAsync = (from, to, options) => {
  const opts = parseOptions(options);
  return new Promise((resolve, reject) => {
    exists$1.async(to).then((destinationExists) => {
      if (destinationExists !== false && opts.overwrite !== true) {
        reject(generateDestinationExistsError(to));
      } else {
        fs$4.rename(from, to).then(resolve).catch((err) => {
          if (err.code === "EISDIR" || err.code === "EPERM") {
            remove$1.async(to).then(() => fs$4.rename(from, to)).then(resolve, reject);
          } else if (err.code === "EXDEV") {
            copy$1.async(from, to, { overwrite: true }).then(() => remove$1.async(from)).then(resolve, reject);
          } else if (err.code === "ENOENT") {
            exists$1.async(from).then((srcExists) => {
              if (!srcExists) {
                reject(generateSourceDoesntExistError(from));
              } else {
                ensureDestinationPathExistsAsync(to).then(() => {
                  return fs$4.rename(from, to);
                }).then(resolve, reject);
              }
            }).catch(reject);
          } else {
            reject(err);
          }
        });
      }
    });
  });
};
move$2.validateInput = validateInput$4;
move$2.sync = moveSync;
move$2.async = moveAsync;
var read$1 = {};
const fs$3 = fs_1;
const validate$3 = validate$g;
const supportedReturnAs = ["utf8", "buffer", "json", "jsonWithDates"];
const validateInput$3 = (methodName, path2, returnAs) => {
  const methodSignature = `${methodName}(path, returnAs)`;
  validate$3.argument(methodSignature, "path", path2, ["string"]);
  validate$3.argument(methodSignature, "returnAs", returnAs, [
    "string",
    "undefined"
  ]);
  if (returnAs && supportedReturnAs.indexOf(returnAs) === -1) {
    throw new Error(
      `Argument "returnAs" passed to ${methodSignature} must have one of values: ${supportedReturnAs.join(
        ", "
      )}`
    );
  }
};
const jsonDateParser = (key, value) => {
  const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
  if (typeof value === "string") {
    if (reISO.exec(value)) {
      return new Date(value);
    }
  }
  return value;
};
const makeNicerJsonParsingError = (path2, err) => {
  const nicerError = new Error(
    `JSON parsing failed while reading ${path2} [${err}]`
  );
  nicerError.originalError = err;
  return nicerError;
};
const readSync = (path2, returnAs) => {
  const retAs = returnAs || "utf8";
  let data;
  let encoding = "utf8";
  if (retAs === "buffer") {
    encoding = null;
  }
  try {
    data = fs$3.readFileSync(path2, { encoding });
  } catch (err) {
    if (err.code === "ENOENT") {
      return void 0;
    }
    throw err;
  }
  try {
    if (retAs === "json") {
      data = JSON.parse(data);
    } else if (retAs === "jsonWithDates") {
      data = JSON.parse(data, jsonDateParser);
    }
  } catch (err) {
    throw makeNicerJsonParsingError(path2, err);
  }
  return data;
};
const readAsync = (path2, returnAs) => {
  return new Promise((resolve, reject) => {
    const retAs = returnAs || "utf8";
    let encoding = "utf8";
    if (retAs === "buffer") {
      encoding = null;
    }
    fs$3.readFile(path2, { encoding }).then((data) => {
      try {
        if (retAs === "json") {
          resolve(JSON.parse(data));
        } else if (retAs === "jsonWithDates") {
          resolve(JSON.parse(data, jsonDateParser));
        } else {
          resolve(data);
        }
      } catch (err) {
        reject(makeNicerJsonParsingError(path2, err));
      }
    }).catch((err) => {
      if (err.code === "ENOENT") {
        resolve(void 0);
      } else {
        reject(err);
      }
    });
  });
};
read$1.validateInput = validateInput$3;
read$1.sync = readSync;
read$1.async = readAsync;
var rename$1 = {};
const pathUtil$3 = path$3;
const move$1 = move$2;
const validate$2 = validate$g;
const validateInput$2 = (methodName, path2, newName, options) => {
  const methodSignature = `${methodName}(path, newName, [options])`;
  validate$2.argument(methodSignature, "path", path2, ["string"]);
  validate$2.argument(methodSignature, "newName", newName, ["string"]);
  validate$2.options(methodSignature, "options", options, {
    overwrite: ["boolean"]
  });
  if (pathUtil$3.basename(newName) !== newName) {
    throw new Error(
      `Argument "newName" passed to ${methodSignature} should be a filename, not a path. Received "${newName}"`
    );
  }
};
const renameSync = (path2, newName, options) => {
  const newPath = pathUtil$3.join(pathUtil$3.dirname(path2), newName);
  move$1.sync(path2, newPath, options);
};
const renameAsync = (path2, newName, options) => {
  const newPath = pathUtil$3.join(pathUtil$3.dirname(path2), newName);
  return move$1.async(path2, newPath, options);
};
rename$1.validateInput = validateInput$2;
rename$1.sync = renameSync;
rename$1.async = renameAsync;
var symlink$1 = {};
const pathUtil$2 = path$3;
const fs$2 = fs_1;
const validate$1 = validate$g;
const dir$2 = dir$6;
const validateInput$1 = (methodName, symlinkValue, path2) => {
  const methodSignature = `${methodName}(symlinkValue, path)`;
  validate$1.argument(methodSignature, "symlinkValue", symlinkValue, ["string"]);
  validate$1.argument(methodSignature, "path", path2, ["string"]);
};
const symlinkSync = (symlinkValue, path2) => {
  try {
    fs$2.symlinkSync(symlinkValue, path2);
  } catch (err) {
    if (err.code === "ENOENT") {
      dir$2.createSync(pathUtil$2.dirname(path2));
      fs$2.symlinkSync(symlinkValue, path2);
    } else {
      throw err;
    }
  }
};
const symlinkAsync = (symlinkValue, path2) => {
  return new Promise((resolve, reject) => {
    fs$2.symlink(symlinkValue, path2).then(resolve).catch((err) => {
      if (err.code === "ENOENT") {
        dir$2.createAsync(pathUtil$2.dirname(path2)).then(() => {
          return fs$2.symlink(symlinkValue, path2);
        }).then(resolve, reject);
      } else {
        reject(err);
      }
    });
  });
};
symlink$1.validateInput = validateInput$1;
symlink$1.sync = symlinkSync;
symlink$1.async = symlinkAsync;
var streams$1 = {};
const fs$1 = require$$0;
streams$1.createWriteStream = fs$1.createWriteStream;
streams$1.createReadStream = fs$1.createReadStream;
var tmp_dir = {};
const pathUtil$1 = path$3;
const os = require$$1;
const crypto = require$$0$1;
const dir$1 = dir$6;
const fs = fs_1;
const validate = validate$g;
const validateInput = (methodName, options) => {
  const methodSignature = `${methodName}([options])`;
  validate.options(methodSignature, "options", options, {
    prefix: ["string"],
    basePath: ["string"]
  });
};
const getOptionsDefaults = (passedOptions, cwdPath) => {
  passedOptions = passedOptions || {};
  const options = {};
  if (typeof passedOptions.prefix !== "string") {
    options.prefix = "";
  } else {
    options.prefix = passedOptions.prefix;
  }
  if (typeof passedOptions.basePath === "string") {
    options.basePath = pathUtil$1.resolve(cwdPath, passedOptions.basePath);
  } else {
    options.basePath = os.tmpdir();
  }
  return options;
};
const randomStringLength = 32;
const tmpDirSync = (cwdPath, passedOptions) => {
  const options = getOptionsDefaults(passedOptions, cwdPath);
  const randomString = crypto.randomBytes(randomStringLength / 2).toString("hex");
  const dirPath = pathUtil$1.join(
    options.basePath,
    options.prefix + randomString
  );
  try {
    fs.mkdirSync(dirPath);
  } catch (err) {
    if (err.code === "ENOENT") {
      dir$1.sync(dirPath);
    } else {
      throw err;
    }
  }
  return dirPath;
};
const tmpDirAsync = (cwdPath, passedOptions) => {
  return new Promise((resolve, reject) => {
    const options = getOptionsDefaults(passedOptions, cwdPath);
    crypto.randomBytes(randomStringLength / 2, (err, bytes) => {
      if (err) {
        reject(err);
      } else {
        const randomString = bytes.toString("hex");
        const dirPath = pathUtil$1.join(
          options.basePath,
          options.prefix + randomString
        );
        fs.mkdir(dirPath, (err2) => {
          if (err2) {
            if (err2.code === "ENOENT") {
              dir$1.async(dirPath).then(() => {
                resolve(dirPath);
              }, reject);
            } else {
              reject(err2);
            }
          } else {
            resolve(dirPath);
          }
        });
      }
    });
  });
};
tmp_dir.validateInput = validateInput;
tmp_dir.sync = tmpDirSync;
tmp_dir.async = tmpDirAsync;
const util = require$$0$2;
const pathUtil = path$3;
const append = append$1;
const dir = dir$6;
const file = file$1;
const find = find$1;
const inspect = inspect$5;
const inspectTree = inspect_tree;
const copy = copy$2;
const exists = exists$3;
const list = list$1;
const move = move$2;
const read = read$1;
const remove = remove$3;
const rename = rename$1;
const symlink = symlink$1;
const streams = streams$1;
const tmpDir = tmp_dir;
const write = write$4;
const jetpackContext = (cwdPath) => {
  const getCwdPath = () => {
    return cwdPath || process.cwd();
  };
  const cwd = function() {
    if (arguments.length === 0) {
      return getCwdPath();
    }
    const args = Array.prototype.slice.call(arguments);
    const pathParts = [getCwdPath()].concat(args);
    return jetpackContext(pathUtil.resolve.apply(null, pathParts));
  };
  const resolvePath = (path2) => {
    return pathUtil.resolve(getCwdPath(), path2);
  };
  const getPath = function() {
    Array.prototype.unshift.call(arguments, getCwdPath());
    return pathUtil.resolve.apply(null, arguments);
  };
  const normalizeOptions2 = (options) => {
    const opts = options || {};
    opts.cwd = getCwdPath();
    return opts;
  };
  const api = {
    cwd,
    path: getPath,
    append: (path2, data, options) => {
      append.validateInput("append", path2, data, options);
      append.sync(resolvePath(path2), data, options);
    },
    appendAsync: (path2, data, options) => {
      append.validateInput("appendAsync", path2, data, options);
      return append.async(resolvePath(path2), data, options);
    },
    copy: (from, to, options) => {
      copy.validateInput("copy", from, to, options);
      copy.sync(resolvePath(from), resolvePath(to), options);
    },
    copyAsync: (from, to, options) => {
      copy.validateInput("copyAsync", from, to, options);
      return copy.async(resolvePath(from), resolvePath(to), options);
    },
    createWriteStream: (path2, options) => {
      return streams.createWriteStream(resolvePath(path2), options);
    },
    createReadStream: (path2, options) => {
      return streams.createReadStream(resolvePath(path2), options);
    },
    dir: (path2, criteria) => {
      dir.validateInput("dir", path2, criteria);
      const normalizedPath = resolvePath(path2);
      dir.sync(normalizedPath, criteria);
      return cwd(normalizedPath);
    },
    dirAsync: (path2, criteria) => {
      dir.validateInput("dirAsync", path2, criteria);
      return new Promise((resolve, reject) => {
        const normalizedPath = resolvePath(path2);
        dir.async(normalizedPath, criteria).then(() => {
          resolve(cwd(normalizedPath));
        }, reject);
      });
    },
    exists: (path2) => {
      exists.validateInput("exists", path2);
      return exists.sync(resolvePath(path2));
    },
    existsAsync: (path2) => {
      exists.validateInput("existsAsync", path2);
      return exists.async(resolvePath(path2));
    },
    file: (path2, criteria) => {
      file.validateInput("file", path2, criteria);
      file.sync(resolvePath(path2), criteria);
      return api;
    },
    fileAsync: (path2, criteria) => {
      file.validateInput("fileAsync", path2, criteria);
      return new Promise((resolve, reject) => {
        file.async(resolvePath(path2), criteria).then(() => {
          resolve(api);
        }, reject);
      });
    },
    find: (startPath, options) => {
      if (typeof options === "undefined" && typeof startPath === "object") {
        options = startPath;
        startPath = ".";
      }
      find.validateInput("find", startPath, options);
      return find.sync(resolvePath(startPath), normalizeOptions2(options));
    },
    findAsync: (startPath, options) => {
      if (typeof options === "undefined" && typeof startPath === "object") {
        options = startPath;
        startPath = ".";
      }
      find.validateInput("findAsync", startPath, options);
      return find.async(resolvePath(startPath), normalizeOptions2(options));
    },
    inspect: (path2, fieldsToInclude) => {
      inspect.validateInput("inspect", path2, fieldsToInclude);
      return inspect.sync(resolvePath(path2), fieldsToInclude);
    },
    inspectAsync: (path2, fieldsToInclude) => {
      inspect.validateInput("inspectAsync", path2, fieldsToInclude);
      return inspect.async(resolvePath(path2), fieldsToInclude);
    },
    inspectTree: (path2, options) => {
      inspectTree.validateInput("inspectTree", path2, options);
      return inspectTree.sync(resolvePath(path2), options);
    },
    inspectTreeAsync: (path2, options) => {
      inspectTree.validateInput("inspectTreeAsync", path2, options);
      return inspectTree.async(resolvePath(path2), options);
    },
    list: (path2) => {
      list.validateInput("list", path2);
      return list.sync(resolvePath(path2 || "."));
    },
    listAsync: (path2) => {
      list.validateInput("listAsync", path2);
      return list.async(resolvePath(path2 || "."));
    },
    move: (from, to, options) => {
      move.validateInput("move", from, to, options);
      move.sync(resolvePath(from), resolvePath(to), options);
    },
    moveAsync: (from, to, options) => {
      move.validateInput("moveAsync", from, to, options);
      return move.async(resolvePath(from), resolvePath(to), options);
    },
    read: (path2, returnAs) => {
      read.validateInput("read", path2, returnAs);
      return read.sync(resolvePath(path2), returnAs);
    },
    readAsync: (path2, returnAs) => {
      read.validateInput("readAsync", path2, returnAs);
      return read.async(resolvePath(path2), returnAs);
    },
    remove: (path2) => {
      remove.validateInput("remove", path2);
      remove.sync(resolvePath(path2 || "."));
    },
    removeAsync: (path2) => {
      remove.validateInput("removeAsync", path2);
      return remove.async(resolvePath(path2 || "."));
    },
    rename: (path2, newName, options) => {
      rename.validateInput("rename", path2, newName, options);
      rename.sync(resolvePath(path2), newName, options);
    },
    renameAsync: (path2, newName, options) => {
      rename.validateInput("renameAsync", path2, newName, options);
      return rename.async(resolvePath(path2), newName, options);
    },
    symlink: (symlinkValue, path2) => {
      symlink.validateInput("symlink", symlinkValue, path2);
      symlink.sync(symlinkValue, resolvePath(path2));
    },
    symlinkAsync: (symlinkValue, path2) => {
      symlink.validateInput("symlinkAsync", symlinkValue, path2);
      return symlink.async(symlinkValue, resolvePath(path2));
    },
    tmpDir: (options) => {
      tmpDir.validateInput("tmpDir", options);
      const pathOfCreatedDirectory = tmpDir.sync(getCwdPath(), options);
      return cwd(pathOfCreatedDirectory);
    },
    tmpDirAsync: (options) => {
      tmpDir.validateInput("tmpDirAsync", options);
      return new Promise((resolve, reject) => {
        tmpDir.async(getCwdPath(), options).then((pathOfCreatedDirectory) => {
          resolve(cwd(pathOfCreatedDirectory));
        }, reject);
      });
    },
    write: (path2, data, options) => {
      write.validateInput("write", path2, data, options);
      write.sync(resolvePath(path2), data, options);
    },
    writeAsync: (path2, data, options) => {
      write.validateInput("writeAsync", path2, data, options);
      return write.async(resolvePath(path2), data, options);
    }
  };
  if (util.inspect.custom !== void 0) {
    api[util.inspect.custom] = () => {
      return `[fs-jetpack CWD: ${getCwdPath()}]`;
    };
  }
  return api;
};
var jetpack$1 = jetpackContext;
const jetpack = jetpack$1;
var main = jetpack();
async function createNewChapter({ projectId, chapterTitle, position }) {
  const newChapterId = randomUUID();
  const chapterPath = getChapterPath(projectId, newChapterId);
  const chapter = { id: newChapterId, title: chapterTitle, position };
  return await main.writeAsync(chapterPath, chapter);
}
async function createNewProject({ name }) {
  const newProjectId = randomUUID();
  const projectMeta = { name, id: newProjectId };
  let metadata = await main.readAsync(META_PATH, "json");
  if (!metadata) metadata = { projects: [] };
  metadata.projects.push(projectMeta);
  await main.writeAsync(META_PATH, metadata);
  const projectInfoPath = getProjectInfoPath(newProjectId);
  const projectInfo = { id: newProjectId, name };
  await main.writeAsync(projectInfoPath, projectInfo);
  return newProjectId;
}
async function updateChapter({ projectId, chapterData }) {
  const chapterPath = getChapterPath(projectId, chapterData.id);
  return await main.writeAsync(chapterPath, chapterData);
}
async function getAllProjects() {
  const metadata = await main.readAsync(META_PATH, "json");
  if (!metadata) return [];
  return metadata.projects;
}
function CoreControllers() {
  ipcMain.handle("create-new-project", async (_event, args) => await createNewProject(args));
  ipcMain.handle("get-all-projects", async (_event) => await getAllProjects());
  ipcMain.handle("create-new-chapter", async (_event, args) => await createNewChapter(args));
  ipcMain.handle("update-chapter", async (_event, args) => await updateChapter(args));
}
var src = { exports: {} };
var browser = { exports: {} };
var debug$1 = { exports: {} };
var ms;
var hasRequiredMs;
function requireMs() {
  if (hasRequiredMs) return ms;
  hasRequiredMs = 1;
  var s = 1e3;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var y = d * 365.25;
  ms = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === "string" && val.length > 0) {
      return parse(val);
    } else if (type === "number" && isNaN(val) === false) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
    );
  };
  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
      str
    );
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || "ms").toLowerCase();
    switch (type) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return n * y;
      case "days":
      case "day":
      case "d":
        return n * d;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return n * h;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return n * m;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return n * s;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return n;
      default:
        return void 0;
    }
  }
  function fmtShort(ms2) {
    if (ms2 >= d) {
      return Math.round(ms2 / d) + "d";
    }
    if (ms2 >= h) {
      return Math.round(ms2 / h) + "h";
    }
    if (ms2 >= m) {
      return Math.round(ms2 / m) + "m";
    }
    if (ms2 >= s) {
      return Math.round(ms2 / s) + "s";
    }
    return ms2 + "ms";
  }
  function fmtLong(ms2) {
    return plural(ms2, d, "day") || plural(ms2, h, "hour") || plural(ms2, m, "minute") || plural(ms2, s, "second") || ms2 + " ms";
  }
  function plural(ms2, n, name) {
    if (ms2 < n) {
      return;
    }
    if (ms2 < n * 1.5) {
      return Math.floor(ms2 / n) + " " + name;
    }
    return Math.ceil(ms2 / n) + " " + name + "s";
  }
  return ms;
}
var hasRequiredDebug;
function requireDebug() {
  if (hasRequiredDebug) return debug$1.exports;
  hasRequiredDebug = 1;
  (function(module, exports) {
    exports = module.exports = createDebug.debug = createDebug["default"] = createDebug;
    exports.coerce = coerce;
    exports.disable = disable;
    exports.enable = enable;
    exports.enabled = enabled;
    exports.humanize = requireMs();
    exports.names = [];
    exports.skips = [];
    exports.formatters = {};
    var prevTime;
    function selectColor(namespace) {
      var hash = 0, i;
      for (i in namespace) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
      }
      return exports.colors[Math.abs(hash) % exports.colors.length];
    }
    function createDebug(namespace) {
      function debug2() {
        if (!debug2.enabled) return;
        var self = debug2;
        var curr = +/* @__PURE__ */ new Date();
        var ms2 = curr - (prevTime || curr);
        self.diff = ms2;
        self.prev = prevTime;
        self.curr = curr;
        prevTime = curr;
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        args[0] = exports.coerce(args[0]);
        if ("string" !== typeof args[0]) {
          args.unshift("%O");
        }
        var index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
          if (match === "%%") return match;
          index++;
          var formatter = exports.formatters[format];
          if ("function" === typeof formatter) {
            var val = args[index];
            match = formatter.call(self, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        exports.formatArgs.call(self, args);
        var logFn = debug2.log || exports.log || console.log.bind(console);
        logFn.apply(self, args);
      }
      debug2.namespace = namespace;
      debug2.enabled = exports.enabled(namespace);
      debug2.useColors = exports.useColors();
      debug2.color = selectColor(namespace);
      if ("function" === typeof exports.init) {
        exports.init(debug2);
      }
      return debug2;
    }
    function enable(namespaces) {
      exports.save(namespaces);
      exports.names = [];
      exports.skips = [];
      var split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
      var len = split.length;
      for (var i = 0; i < len; i++) {
        if (!split[i]) continue;
        namespaces = split[i].replace(/\*/g, ".*?");
        if (namespaces[0] === "-") {
          exports.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
        } else {
          exports.names.push(new RegExp("^" + namespaces + "$"));
        }
      }
    }
    function disable() {
      exports.enable("");
    }
    function enabled(name) {
      var i, len;
      for (i = 0, len = exports.skips.length; i < len; i++) {
        if (exports.skips[i].test(name)) {
          return false;
        }
      }
      for (i = 0, len = exports.names.length; i < len; i++) {
        if (exports.names[i].test(name)) {
          return true;
        }
      }
      return false;
    }
    function coerce(val) {
      if (val instanceof Error) return val.stack || val.message;
      return val;
    }
  })(debug$1, debug$1.exports);
  return debug$1.exports;
}
var hasRequiredBrowser;
function requireBrowser() {
  if (hasRequiredBrowser) return browser.exports;
  hasRequiredBrowser = 1;
  (function(module, exports) {
    exports = module.exports = requireDebug();
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = "undefined" != typeof chrome && "undefined" != typeof chrome.storage ? chrome.storage.local : localstorage();
    exports.colors = [
      "lightseagreen",
      "forestgreen",
      "goldenrod",
      "dodgerblue",
      "darkorchid",
      "crimson"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && window.process.type === "renderer") {
        return true;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    exports.formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (err) {
        return "[UnexpectedJSONParseError]: " + err.message;
      }
    };
    function formatArgs(args) {
      var useColors2 = this.useColors;
      args[0] = (useColors2 ? "%c" : "") + this.namespace + (useColors2 ? " %c" : " ") + args[0] + (useColors2 ? "%c " : " ") + "+" + exports.humanize(this.diff);
      if (!useColors2) return;
      var c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      var index = 0;
      var lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, function(match) {
        if ("%%" === match) return;
        index++;
        if ("%c" === match) {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    function log() {
      return "object" === typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
    }
    function save(namespaces) {
      try {
        if (null == namespaces) {
          exports.storage.removeItem("debug");
        } else {
          exports.storage.debug = namespaces;
        }
      } catch (e) {
      }
    }
    function load() {
      var r;
      try {
        r = exports.storage.debug;
      } catch (e) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    exports.enable(load());
    function localstorage() {
      try {
        return window.localStorage;
      } catch (e) {
      }
    }
  })(browser, browser.exports);
  return browser.exports;
}
var node = { exports: {} };
var hasRequiredNode;
function requireNode() {
  if (hasRequiredNode) return node.exports;
  hasRequiredNode = 1;
  (function(module, exports) {
    var tty = require$$0$3;
    var util2 = require$$0$2;
    exports = module.exports = requireDebug();
    exports.init = init;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.colors = [6, 2, 3, 4, 5, 1];
    exports.inspectOpts = Object.keys(process.env).filter(function(key) {
      return /^debug_/i.test(key);
    }).reduce(function(obj, key) {
      var prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, function(_, k) {
        return k.toUpperCase();
      });
      var val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
      else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
      else if (val === "null") val = null;
      else val = Number(val);
      obj[prop] = val;
      return obj;
    }, {});
    var fd = parseInt(process.env.DEBUG_FD, 10) || 2;
    if (1 !== fd && 2 !== fd) {
      util2.deprecate(function() {
      }, "except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();
    }
    var stream = 1 === fd ? process.stdout : 2 === fd ? process.stderr : createWritableStdioStream(fd);
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(fd);
    }
    exports.formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts).split("\n").map(function(str) {
        return str.trim();
      }).join(" ");
    };
    exports.formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts);
    };
    function formatArgs(args) {
      var name = this.namespace;
      var useColors2 = this.useColors;
      if (useColors2) {
        var c = this.color;
        var prefix = "  \x1B[3" + c + ";1m" + name + " \x1B[0m";
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push("\x1B[3" + c + "m+" + exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = (/* @__PURE__ */ new Date()).toUTCString() + " " + name + " " + args[0];
      }
    }
    function log() {
      return stream.write(util2.format.apply(util2, arguments) + "\n");
    }
    function save(namespaces) {
      if (null == namespaces) {
        delete process.env.DEBUG;
      } else {
        process.env.DEBUG = namespaces;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function createWritableStdioStream(fd2) {
      var stream2;
      var tty_wrap = process.binding("tty_wrap");
      switch (tty_wrap.guessHandleType(fd2)) {
        case "TTY":
          stream2 = new tty.WriteStream(fd2);
          stream2._type = "tty";
          if (stream2._handle && stream2._handle.unref) {
            stream2._handle.unref();
          }
          break;
        case "FILE":
          var fs2 = require$$0;
          stream2 = new fs2.SyncWriteStream(fd2, { autoClose: false });
          stream2._type = "fs";
          break;
        case "PIPE":
        case "TCP":
          var net = require$$4;
          stream2 = new net.Socket({
            fd: fd2,
            readable: false,
            writable: true
          });
          stream2.readable = false;
          stream2.read = null;
          stream2._type = "pipe";
          if (stream2._handle && stream2._handle.unref) {
            stream2._handle.unref();
          }
          break;
        default:
          throw new Error("Implement me. Unknown stream file type!");
      }
      stream2.fd = fd2;
      stream2._isStdio = true;
      return stream2;
    }
    function init(debug2) {
      debug2.inspectOpts = {};
      var keys = Object.keys(exports.inspectOpts);
      for (var i = 0; i < keys.length; i++) {
        debug2.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
      }
    }
    exports.enable(load());
  })(node, node.exports);
  return node.exports;
}
if (typeof process !== "undefined" && process.type === "renderer") {
  src.exports = requireBrowser();
} else {
  src.exports = requireNode();
}
var srcExports = src.exports;
var path = path$3;
var spawn = require$$1$1.spawn;
var debug = srcExports("electron-squirrel-startup");
var app = require$$3.app;
var run = function(args, done) {
  var updateExe = path.resolve(path.dirname(process.execPath), "..", "Update.exe");
  debug("Spawning `%s` with args `%s`", updateExe, args);
  spawn(updateExe, args, {
    detached: true
  }).on("close", done);
};
var check = function() {
  if (process.platform === "win32") {
    var cmd = process.argv[1];
    debug("processing squirrel command `%s`", cmd);
    var target = path.basename(process.execPath);
    if (cmd === "--squirrel-install" || cmd === "--squirrel-updated") {
      run(["--createShortcut=" + target], app.quit);
      return true;
    }
    if (cmd === "--squirrel-uninstall") {
      run(["--removeShortcut=" + target], app.quit);
      return true;
    }
    if (cmd === "--squirrel-obsolete") {
      app.quit();
      return true;
    }
  }
  return false;
};
var electronSquirrelStartup = check();
const started = /* @__PURE__ */ getDefaultExportFromCjs(electronSquirrelStartup);
const __dirname = path$4.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path$4.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path$4.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path$4.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path$4.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
if (started) app$1.quit();
const appIcon = nativeImage.createFromPath(path$4.join(process.env.VITE_PUBLIC, "icon.png"));
function createWindow() {
  win = new BrowserWindow({
    icon: appIcon,
    webPreferences: {
      preload: path$4.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      spellcheck: false
    }
  });
  win.menuBarVisible = false;
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path$4.join(RENDERER_DIST, "index.html"));
  }
  win.once("ready-to-show", () => {
    win == null ? void 0 : win.maximize();
  });
}
app$1.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app$1.quit();
    win = null;
  }
});
app$1.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app$1.whenReady().then(() => {
  CoreControllers();
  createWindow();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
