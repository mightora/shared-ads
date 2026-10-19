var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = __commonJS({
  "node_modules/fast-deep-equal/index.js"(exports, module) {
    "use strict";
    module.exports = function equal(a, b) {
      if (a === b) return true;
      if (a && b && typeof a == "object" && typeof b == "object") {
        if (a.constructor !== b.constructor) return false;
        var length, i, keys;
        if (Array.isArray(a)) {
          length = a.length;
          if (length != b.length) return false;
          for (i = length; i-- !== 0; )
            if (!equal(a[i], b[i])) return false;
          return true;
        }
        if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;
        for (i = length; i-- !== 0; )
          if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
        for (i = length; i-- !== 0; ) {
          var key = keys[i];
          if (!equal(a[key], b[key])) return false;
        }
        return true;
      }
      return a !== a && b !== b;
    };
  }
});

// node_modules/ajv/dist/runtime/equal.js
var require_equal = __commonJS({
  "node_modules/ajv/dist/runtime/equal.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var equal = require_fast_deep_equal();
    equal.code = 'require("ajv/dist/runtime/equal").default';
    exports.default = equal;
  }
});

// node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length = __commonJS({
  "node_modules/ajv/dist/runtime/ucs2length.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ucs2length(str) {
      const len = str.length;
      let length = 0;
      let pos = 0;
      let value;
      while (pos < len) {
        length++;
        value = str.charCodeAt(pos++);
        if (value >= 55296 && value <= 56319 && pos < len) {
          value = str.charCodeAt(pos);
          if ((value & 64512) === 56320)
            pos++;
        }
      }
      return length;
    }
    exports.default = ucs2length;
    ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default';
  }
});

// <stdin>
var validate = validate10;
var stdin_default = validate10;
var schema11 = { "$schema": "http://json-schema.org/draft-07/schema#", "$id": "https://mightora.github.io/shared-ads/config/schema-v1.json", "type": "object", "properties": { "schemaVersion": { "const": 1 }, "revision": { "type": "string", "pattern": "^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$" }, "global": { "type": "object", "properties": { "enabled": { "type": "boolean" }, "killSwitch": { "type": "boolean" }, "houseEnabled": { "type": "boolean" }, "googleEnabled": { "type": "boolean" }, "mode": { "enum": ["mixed", "house-only", "google-only", "off"] }, "rotation": { "enum": ["equal", "weighted"] }, "maxAdsPerPage": { "type": "integer", "minimum": 0, "maximum": 2 }, "cacheSeconds": { "type": "integer", "minimum": 30, "maximum": 300 }, "allowedSizes": { "type": "array", "items": { "enum": ["320x50", "468x60", "728x90", "320x100", "300x250"] }, "maxItems": 5, "minItems": 1, "uniqueItems": true }, "imageOrigins": { "type": "array", "items": { "type": "string", "minLength": 1, "maxLength": 300 }, "maxItems": 20, "minItems": 1, "uniqueItems": true }, "destinationOrigins": { "type": "array", "items": { "type": "string", "minLength": 1, "maxLength": 300 }, "maxItems": 100, "minItems": 1, "uniqueItems": true }, "categories": { "type": "array", "items": { "type": "string", "pattern": "^[a-z0-9][a-z0-9-]{0,63}$" }, "maxItems": 30, "minItems": 1, "uniqueItems": true }, "fallback": { "enum": ["house", "empty"] }, "google": { "type": "object", "properties": { "publisherId": { "anyOf": [{ "type": "null" }, { "type": "string", "pattern": "^ca-pub-[0-9]{16}$" }] }, "autoAdsDisabledConfirmed": { "type": "boolean" }, "certifiedCmpIds": { "type": "array", "items": { "type": "integer", "minimum": 1, "maximum": 4095 }, "maxItems": 30, "minItems": 0, "uniqueItems": true } }, "required": ["publisherId", "autoAdsDisabledConfirmed", "certifiedCmpIds"], "additionalProperties": false } }, "required": ["enabled", "killSwitch", "houseEnabled", "googleEnabled", "mode", "rotation", "maxAdsPerPage", "cacheSeconds", "allowedSizes", "imageOrigins", "destinationOrigins", "categories", "fallback", "google"], "additionalProperties": false }, "sites": { "type": "array", "items": { "type": "object", "properties": { "id": { "type": "string", "pattern": "^[a-z0-9][a-z0-9-]{0,63}$" }, "domain": { "type": "string", "pattern": "^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$", "maxLength": 253 }, "pathPrefixes": { "type": "array", "items": { "type": "string", "minLength": 1, "maxLength": 2048 }, "maxItems": 30, "minItems": 1, "uniqueItems": true }, "audience": { "enum": ["general", "child-directed"] }, "enabled": { "type": "boolean" }, "houseAdsApproved": { "type": "boolean" }, "googleEnabled": { "type": "boolean" }, "googleApproved": { "type": "boolean" }, "mode": { "enum": ["mixed", "house-only", "google-only", "off"] }, "maxAdsPerPage": { "type": "integer", "minimum": 0, "maximum": 2 }, "categories": { "type": "array", "items": { "type": "string", "pattern": "^[a-z0-9][a-z0-9-]{0,63}$" }, "maxItems": 30, "minItems": 1, "uniqueItems": true }, "allowedSizes": { "type": "array", "items": { "enum": ["320x50", "468x60", "728x90", "320x100", "300x250"] }, "maxItems": 5, "minItems": 1, "uniqueItems": true }, "exclusions": { "type": "array", "items": { "type": "string", "minLength": 1, "maxLength": 2048 }, "maxItems": 100, "minItems": 0, "uniqueItems": true }, "longContentPaths": { "type": "array", "items": { "type": "string", "minLength": 1, "maxLength": 2048 }, "maxItems": 30, "minItems": 0, "uniqueItems": true }, "placements": { "type": "object", "properties": { "content-bottom": { "type": "object", "properties": { "enabled": { "type": "boolean" }, "sizes": { "type": "array", "items": { "enum": ["320x50", "468x60", "728x90", "320x100", "300x250"] }, "maxItems": 5, "minItems": 1, "uniqueItems": true } }, "required": ["enabled", "sizes"], "additionalProperties": false }, "article-middle": { "type": "object", "properties": { "enabled": { "type": "boolean" }, "sizes": { "type": "array", "items": { "enum": ["320x50", "468x60", "728x90", "320x100", "300x250"] }, "maxItems": 5, "minItems": 1, "uniqueItems": true } }, "required": ["enabled", "sizes"], "additionalProperties": false }, "sidebar": { "type": "object", "properties": { "enabled": { "type": "boolean" }, "sizes": { "type": "array", "items": { "enum": ["320x50", "468x60", "728x90", "320x100", "300x250"] }, "maxItems": 5, "minItems": 1, "uniqueItems": true } }, "required": ["enabled", "sizes"], "additionalProperties": false }, "landing-secondary": { "type": "object", "properties": { "enabled": { "type": "boolean" }, "sizes": { "type": "array", "items": { "enum": ["320x50", "468x60", "728x90", "320x100", "300x250"] }, "maxItems": 5, "minItems": 1, "uniqueItems": true } }, "required": ["enabled", "sizes"], "additionalProperties": false }, "footer-above-author": { "type": "object", "properties": { "enabled": { "type": "boolean" }, "sizes": { "type": "array", "items": { "enum": ["320x50", "468x60", "728x90", "320x100", "300x250"] }, "maxItems": 5, "minItems": 1, "uniqueItems": true } }, "required": ["enabled", "sizes"], "additionalProperties": false } }, "additionalProperties": false }, "googleUnits": { "type": "array", "items": { "type": "object", "properties": { "id": { "type": "string", "pattern": "^[a-z0-9][a-z0-9-]{0,63}$" }, "name": { "type": "string", "minLength": 1, "maxLength": 100 }, "description": { "type": "string", "minLength": 1, "maxLength": 500 }, "enabled": { "type": "boolean" }, "weight": { "type": "number", "minimum": 0, "maximum": 1e6 }, "start": { "type": "string", "minLength": 1, "maxLength": 30 }, "end": { "type": "string", "minLength": 1, "maxLength": 30 }, "minScreen": { "type": "integer", "minimum": 0, "maximum": 1e4 }, "maxScreen": { "type": "integer", "minimum": 0, "maximum": 1e4 }, "placement": { "enum": ["content-bottom", "article-middle", "sidebar", "landing-secondary", "footer-above-author"] }, "slot": { "type": "string", "pattern": "^[0-9]{6,20}$" }, "size": { "enum": ["320x50", "468x60", "728x90", "320x100", "300x250"] }, "format": { "enum": ["fixed", "responsive-horizontal"] } }, "required": ["id", "name", "description", "enabled", "weight", "start", "end", "minScreen", "maxScreen", "placement", "slot", "size", "format"], "additionalProperties": false }, "maxItems": 30, "minItems": 0, "uniqueItems": true } }, "required": ["id", "domain", "pathPrefixes", "audience", "enabled", "houseAdsApproved", "googleEnabled", "googleApproved", "mode", "maxAdsPerPage", "categories", "allowedSizes", "exclusions", "longContentPaths", "placements", "googleUnits"], "additionalProperties": false }, "maxItems": 500, "minItems": 0, "uniqueItems": true }, "campaigns": { "type": "array", "items": { "type": "object", "properties": { "id": { "type": "string", "pattern": "^[a-z0-9][a-z0-9-]{0,63}$" }, "name": { "type": "string", "minLength": 1, "maxLength": 100 }, "description": { "type": "string", "minLength": 1, "maxLength": 500 }, "enabled": { "type": "boolean" }, "weight": { "type": "number", "minimum": 0, "maximum": 1e6 }, "start": { "type": "string", "minLength": 1, "maxLength": 30 }, "end": { "type": "string", "minLength": 1, "maxLength": 30 }, "minScreen": { "type": "integer", "minimum": 0, "maximum": 1e4 }, "maxScreen": { "type": "integer", "minimum": 0, "maximum": 1e4 }, "category": { "type": "string", "pattern": "^[a-z0-9][a-z0-9-]{0,63}$" }, "sites": { "type": "array", "items": { "type": "string", "pattern": "^[a-z0-9][a-z0-9-]{0,63}$" }, "maxItems": 500, "minItems": 1, "uniqueItems": true }, "placements": { "type": "array", "items": { "enum": ["content-bottom", "article-middle", "sidebar", "landing-secondary", "footer-above-author"] }, "maxItems": 5, "minItems": 1, "uniqueItems": true }, "variants": { "type": "array", "items": { "type": "object", "properties": { "src": { "type": "string", "minLength": 1, "maxLength": 2048 }, "width": { "type": "integer", "minimum": 1, "maximum": 728 }, "height": { "type": "integer", "minimum": 1, "maximum": 250 } }, "required": ["src", "width", "height"], "additionalProperties": false }, "maxItems": 5, "minItems": 1, "uniqueItems": true }, "alt": { "type": "string", "minLength": 1, "maxLength": 250 }, "destination": { "type": "string", "minLength": 1, "maxLength": 2048 }, "disclosure": { "enum": ["Advertisement", "Paid advertisement", "House advertisement"] } }, "required": ["id", "name", "description", "enabled", "weight", "start", "end", "minScreen", "maxScreen", "category", "sites", "placements", "variants", "alt", "destination", "disclosure"], "additionalProperties": false }, "maxItems": 1e3, "minItems": 0, "uniqueItems": true } }, "required": ["schemaVersion", "revision", "global", "sites", "campaigns"], "additionalProperties": false };
var pattern0 = new RegExp("^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$", "u");
var pattern1 = new RegExp("^[a-z0-9][a-z0-9-]{0,63}$", "u");
var pattern2 = new RegExp("^ca-pub-[0-9]{16}$", "u");
var pattern4 = new RegExp("^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$", "u");
var pattern7 = new RegExp("^[0-9]{6,20}$", "u");
var func2 = Object.prototype.hasOwnProperty;
var func0 = require_equal().default;
var func4 = require_ucs2length().default;
function validate10(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  ;
  let vErrors = null;
  let errors = 0;
  if (data && typeof data == "object" && !Array.isArray(data)) {
    if (data.schemaVersion === void 0) {
      const err0 = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "schemaVersion" }, message: "must have required property 'schemaVersion'" };
      if (vErrors === null) {
        vErrors = [err0];
      } else {
        vErrors.push(err0);
      }
      errors++;
    }
    if (data.revision === void 0) {
      const err1 = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "revision" }, message: "must have required property 'revision'" };
      if (vErrors === null) {
        vErrors = [err1];
      } else {
        vErrors.push(err1);
      }
      errors++;
    }
    if (data.global === void 0) {
      const err2 = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "global" }, message: "must have required property 'global'" };
      if (vErrors === null) {
        vErrors = [err2];
      } else {
        vErrors.push(err2);
      }
      errors++;
    }
    if (data.sites === void 0) {
      const err3 = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "sites" }, message: "must have required property 'sites'" };
      if (vErrors === null) {
        vErrors = [err3];
      } else {
        vErrors.push(err3);
      }
      errors++;
    }
    if (data.campaigns === void 0) {
      const err4 = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "campaigns" }, message: "must have required property 'campaigns'" };
      if (vErrors === null) {
        vErrors = [err4];
      } else {
        vErrors.push(err4);
      }
      errors++;
    }
    for (const key0 in data) {
      if (!(key0 === "schemaVersion" || key0 === "revision" || key0 === "global" || key0 === "sites" || key0 === "campaigns")) {
        const err5 = { instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" };
        if (vErrors === null) {
          vErrors = [err5];
        } else {
          vErrors.push(err5);
        }
        errors++;
      }
    }
    if (data.schemaVersion !== void 0) {
      if (1 !== data.schemaVersion) {
        const err6 = { instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
        if (vErrors === null) {
          vErrors = [err6];
        } else {
          vErrors.push(err6);
        }
        errors++;
      }
    }
    if (data.revision !== void 0) {
      let data1 = data.revision;
      if (typeof data1 === "string") {
        if (!pattern0.test(data1)) {
          const err7 = { instancePath: instancePath + "/revision", schemaPath: "#/properties/revision/pattern", keyword: "pattern", params: { pattern: "^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$" }, message: 'must match pattern "^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$"' };
          if (vErrors === null) {
            vErrors = [err7];
          } else {
            vErrors.push(err7);
          }
          errors++;
        }
      } else {
        const err8 = { instancePath: instancePath + "/revision", schemaPath: "#/properties/revision/type", keyword: "type", params: { type: "string" }, message: "must be string" };
        if (vErrors === null) {
          vErrors = [err8];
        } else {
          vErrors.push(err8);
        }
        errors++;
      }
    }
    if (data.global !== void 0) {
      let data2 = data.global;
      if (data2 && typeof data2 == "object" && !Array.isArray(data2)) {
        if (data2.enabled === void 0) {
          const err9 = { instancePath: instancePath + "/global", schemaPath: "#/properties/global/required", keyword: "required", params: { missingProperty: "enabled" }, message: "must have required property 'enabled'" };
          if (vErrors === null) {
            vErrors = [err9];
          } else {
            vErrors.push(err9);
          }
          errors++;
        }
        if (data2.killSwitch === void 0) {
          const err10 = { instancePath: instancePath + "/global", schemaPath: "#/properties/global/required", keyword: "required", params: { missingProperty: "killSwitch" }, message: "must have required property 'killSwitch'" };
          if (vErrors === null) {
            vErrors = [err10];
          } else {
            vErrors.push(err10);
          }
          errors++;
        }
        if (data2.houseEnabled === void 0) {
          const err11 = { instancePath: instancePath + "/global", schemaPath: "#/properties/global/required", keyword: "required", params: { missingProperty: "houseEnabled" }, message: "must have required property 'houseEnabled'" };
          if (vErrors === null) {
            vErrors = [err11];
          } else {
            vErrors.push(err11);
          }
          errors++;
        }
        if (data2.googleEnabled === void 0) {
          const err12 = { instancePath: instancePath + "/global", schemaPath: "#/properties/global/required", keyword: "required", params: { missingProperty: "googleEnabled" }, message: "must have required property 'googleEnabled'" };
          if (vErrors === null) {
            vErrors = [err12];
          } else {
            vErrors.push(err12);
          }
          errors++;
        }
        if (data2.mode === void 0) {
          const err13 = { instancePath: instancePath + "/global", schemaPath: "#/properties/global/required", keyword: "required", params: { missingProperty: "mode" }, message: "must have required property 'mode'" };
          if (vErrors === null) {
            vErrors = [err13];
          } else {
            vErrors.push(err13);
          }
          errors++;
        }
        if (data2.rotation === void 0) {
          const err14 = { instancePath: instancePath + "/global", schemaPath: "#/properties/global/required", keyword: "required", params: { missingProperty: "rotation" }, message: "must have required property 'rotation'" };
          if (vErrors === null) {
            vErrors = [err14];
          } else {
            vErrors.push(err14);
          }
          errors++;
        }
        if (data2.maxAdsPerPage === void 0) {
          const err15 = { instancePath: instancePath + "/global", schemaPath: "#/properties/global/required", keyword: "required", params: { missingProperty: "maxAdsPerPage" }, message: "must have required property 'maxAdsPerPage'" };
          if (vErrors === null) {
            vErrors = [err15];
          } else {
            vErrors.push(err15);
          }
          errors++;
        }
        if (data2.cacheSeconds === void 0) {
          const err16 = { instancePath: instancePath + "/global", schemaPath: "#/properties/global/required", keyword: "required", params: { missingProperty: "cacheSeconds" }, message: "must have required property 'cacheSeconds'" };
          if (vErrors === null) {
            vErrors = [err16];
          } else {
            vErrors.push(err16);
          }
          errors++;
        }
        if (data2.allowedSizes === void 0) {
          const err17 = { instancePath: instancePath + "/global", schemaPath: "#/properties/global/required", keyword: "required", params: { missingProperty: "allowedSizes" }, message: "must have required property 'allowedSizes'" };
          if (vErrors === null) {
            vErrors = [err17];
          } else {
            vErrors.push(err17);
          }
          errors++;
        }
        if (data2.imageOrigins === void 0) {
          const err18 = { instancePath: instancePath + "/global", schemaPath: "#/properties/global/required", keyword: "required", params: { missingProperty: "imageOrigins" }, message: "must have required property 'imageOrigins'" };
          if (vErrors === null) {
            vErrors = [err18];
          } else {
            vErrors.push(err18);
          }
          errors++;
        }
        if (data2.destinationOrigins === void 0) {
          const err19 = { instancePath: instancePath + "/global", schemaPath: "#/properties/global/required", keyword: "required", params: { missingProperty: "destinationOrigins" }, message: "must have required property 'destinationOrigins'" };
          if (vErrors === null) {
            vErrors = [err19];
          } else {
            vErrors.push(err19);
          }
          errors++;
        }
        if (data2.categories === void 0) {
          const err20 = { instancePath: instancePath + "/global", schemaPath: "#/properties/global/required", keyword: "required", params: { missingProperty: "categories" }, message: "must have required property 'categories'" };
          if (vErrors === null) {
            vErrors = [err20];
          } else {
            vErrors.push(err20);
          }
          errors++;
        }
        if (data2.fallback === void 0) {
          const err21 = { instancePath: instancePath + "/global", schemaPath: "#/properties/global/required", keyword: "required", params: { missingProperty: "fallback" }, message: "must have required property 'fallback'" };
          if (vErrors === null) {
            vErrors = [err21];
          } else {
            vErrors.push(err21);
          }
          errors++;
        }
        if (data2.google === void 0) {
          const err22 = { instancePath: instancePath + "/global", schemaPath: "#/properties/global/required", keyword: "required", params: { missingProperty: "google" }, message: "must have required property 'google'" };
          if (vErrors === null) {
            vErrors = [err22];
          } else {
            vErrors.push(err22);
          }
          errors++;
        }
        for (const key1 in data2) {
          if (!func2.call(schema11.properties.global.properties, key1)) {
            const err23 = { instancePath: instancePath + "/global", schemaPath: "#/properties/global/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties" };
            if (vErrors === null) {
              vErrors = [err23];
            } else {
              vErrors.push(err23);
            }
            errors++;
          }
        }
        if (data2.enabled !== void 0) {
          if (typeof data2.enabled !== "boolean") {
            const err24 = { instancePath: instancePath + "/global/enabled", schemaPath: "#/properties/global/properties/enabled/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
            if (vErrors === null) {
              vErrors = [err24];
            } else {
              vErrors.push(err24);
            }
            errors++;
          }
        }
        if (data2.killSwitch !== void 0) {
          if (typeof data2.killSwitch !== "boolean") {
            const err25 = { instancePath: instancePath + "/global/killSwitch", schemaPath: "#/properties/global/properties/killSwitch/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
            if (vErrors === null) {
              vErrors = [err25];
            } else {
              vErrors.push(err25);
            }
            errors++;
          }
        }
        if (data2.houseEnabled !== void 0) {
          if (typeof data2.houseEnabled !== "boolean") {
            const err26 = { instancePath: instancePath + "/global/houseEnabled", schemaPath: "#/properties/global/properties/houseEnabled/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
            if (vErrors === null) {
              vErrors = [err26];
            } else {
              vErrors.push(err26);
            }
            errors++;
          }
        }
        if (data2.googleEnabled !== void 0) {
          if (typeof data2.googleEnabled !== "boolean") {
            const err27 = { instancePath: instancePath + "/global/googleEnabled", schemaPath: "#/properties/global/properties/googleEnabled/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
            if (vErrors === null) {
              vErrors = [err27];
            } else {
              vErrors.push(err27);
            }
            errors++;
          }
        }
        if (data2.mode !== void 0) {
          let data7 = data2.mode;
          if (!(data7 === "mixed" || data7 === "house-only" || data7 === "google-only" || data7 === "off")) {
            const err28 = { instancePath: instancePath + "/global/mode", schemaPath: "#/properties/global/properties/mode/enum", keyword: "enum", params: { allowedValues: schema11.properties.global.properties.mode.enum }, message: "must be equal to one of the allowed values" };
            if (vErrors === null) {
              vErrors = [err28];
            } else {
              vErrors.push(err28);
            }
            errors++;
          }
        }
        if (data2.rotation !== void 0) {
          let data8 = data2.rotation;
          if (!(data8 === "equal" || data8 === "weighted")) {
            const err29 = { instancePath: instancePath + "/global/rotation", schemaPath: "#/properties/global/properties/rotation/enum", keyword: "enum", params: { allowedValues: schema11.properties.global.properties.rotation.enum }, message: "must be equal to one of the allowed values" };
            if (vErrors === null) {
              vErrors = [err29];
            } else {
              vErrors.push(err29);
            }
            errors++;
          }
        }
        if (data2.maxAdsPerPage !== void 0) {
          let data9 = data2.maxAdsPerPage;
          if (!(typeof data9 == "number" && (!(data9 % 1) && !isNaN(data9)) && isFinite(data9))) {
            const err30 = { instancePath: instancePath + "/global/maxAdsPerPage", schemaPath: "#/properties/global/properties/maxAdsPerPage/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
            if (vErrors === null) {
              vErrors = [err30];
            } else {
              vErrors.push(err30);
            }
            errors++;
          }
          if (typeof data9 == "number" && isFinite(data9)) {
            if (data9 > 2 || isNaN(data9)) {
              const err31 = { instancePath: instancePath + "/global/maxAdsPerPage", schemaPath: "#/properties/global/properties/maxAdsPerPage/maximum", keyword: "maximum", params: { comparison: "<=", limit: 2 }, message: "must be <= 2" };
              if (vErrors === null) {
                vErrors = [err31];
              } else {
                vErrors.push(err31);
              }
              errors++;
            }
            if (data9 < 0 || isNaN(data9)) {
              const err32 = { instancePath: instancePath + "/global/maxAdsPerPage", schemaPath: "#/properties/global/properties/maxAdsPerPage/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" };
              if (vErrors === null) {
                vErrors = [err32];
              } else {
                vErrors.push(err32);
              }
              errors++;
            }
          }
        }
        if (data2.cacheSeconds !== void 0) {
          let data10 = data2.cacheSeconds;
          if (!(typeof data10 == "number" && (!(data10 % 1) && !isNaN(data10)) && isFinite(data10))) {
            const err33 = { instancePath: instancePath + "/global/cacheSeconds", schemaPath: "#/properties/global/properties/cacheSeconds/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
            if (vErrors === null) {
              vErrors = [err33];
            } else {
              vErrors.push(err33);
            }
            errors++;
          }
          if (typeof data10 == "number" && isFinite(data10)) {
            if (data10 > 300 || isNaN(data10)) {
              const err34 = { instancePath: instancePath + "/global/cacheSeconds", schemaPath: "#/properties/global/properties/cacheSeconds/maximum", keyword: "maximum", params: { comparison: "<=", limit: 300 }, message: "must be <= 300" };
              if (vErrors === null) {
                vErrors = [err34];
              } else {
                vErrors.push(err34);
              }
              errors++;
            }
            if (data10 < 30 || isNaN(data10)) {
              const err35 = { instancePath: instancePath + "/global/cacheSeconds", schemaPath: "#/properties/global/properties/cacheSeconds/minimum", keyword: "minimum", params: { comparison: ">=", limit: 30 }, message: "must be >= 30" };
              if (vErrors === null) {
                vErrors = [err35];
              } else {
                vErrors.push(err35);
              }
              errors++;
            }
          }
        }
        if (data2.allowedSizes !== void 0) {
          let data11 = data2.allowedSizes;
          if (Array.isArray(data11)) {
            if (data11.length > 5) {
              const err36 = { instancePath: instancePath + "/global/allowedSizes", schemaPath: "#/properties/global/properties/allowedSizes/maxItems", keyword: "maxItems", params: { limit: 5 }, message: "must NOT have more than 5 items" };
              if (vErrors === null) {
                vErrors = [err36];
              } else {
                vErrors.push(err36);
              }
              errors++;
            }
            if (data11.length < 1) {
              const err37 = { instancePath: instancePath + "/global/allowedSizes", schemaPath: "#/properties/global/properties/allowedSizes/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" };
              if (vErrors === null) {
                vErrors = [err37];
              } else {
                vErrors.push(err37);
              }
              errors++;
            }
            const len0 = data11.length;
            for (let i0 = 0; i0 < len0; i0++) {
              let data12 = data11[i0];
              if (!(data12 === "320x50" || data12 === "468x60" || data12 === "728x90" || data12 === "320x100" || data12 === "300x250")) {
                const err38 = { instancePath: instancePath + "/global/allowedSizes/" + i0, schemaPath: "#/properties/global/properties/allowedSizes/items/enum", keyword: "enum", params: { allowedValues: schema11.properties.global.properties.allowedSizes.items.enum }, message: "must be equal to one of the allowed values" };
                if (vErrors === null) {
                  vErrors = [err38];
                } else {
                  vErrors.push(err38);
                }
                errors++;
              }
            }
            let i1 = data11.length;
            let j0;
            if (i1 > 1) {
              outer0: for (; i1--; ) {
                for (j0 = i1; j0--; ) {
                  if (func0(data11[i1], data11[j0])) {
                    const err39 = { instancePath: instancePath + "/global/allowedSizes", schemaPath: "#/properties/global/properties/allowedSizes/uniqueItems", keyword: "uniqueItems", params: { i: i1, j: j0 }, message: "must NOT have duplicate items (items ## " + j0 + " and " + i1 + " are identical)" };
                    if (vErrors === null) {
                      vErrors = [err39];
                    } else {
                      vErrors.push(err39);
                    }
                    errors++;
                    break outer0;
                  }
                }
              }
            }
          } else {
            const err40 = { instancePath: instancePath + "/global/allowedSizes", schemaPath: "#/properties/global/properties/allowedSizes/type", keyword: "type", params: { type: "array" }, message: "must be array" };
            if (vErrors === null) {
              vErrors = [err40];
            } else {
              vErrors.push(err40);
            }
            errors++;
          }
        }
        if (data2.imageOrigins !== void 0) {
          let data13 = data2.imageOrigins;
          if (Array.isArray(data13)) {
            if (data13.length > 20) {
              const err41 = { instancePath: instancePath + "/global/imageOrigins", schemaPath: "#/properties/global/properties/imageOrigins/maxItems", keyword: "maxItems", params: { limit: 20 }, message: "must NOT have more than 20 items" };
              if (vErrors === null) {
                vErrors = [err41];
              } else {
                vErrors.push(err41);
              }
              errors++;
            }
            if (data13.length < 1) {
              const err42 = { instancePath: instancePath + "/global/imageOrigins", schemaPath: "#/properties/global/properties/imageOrigins/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" };
              if (vErrors === null) {
                vErrors = [err42];
              } else {
                vErrors.push(err42);
              }
              errors++;
            }
            const len1 = data13.length;
            for (let i2 = 0; i2 < len1; i2++) {
              let data14 = data13[i2];
              if (typeof data14 === "string") {
                if (func4(data14) > 300) {
                  const err43 = { instancePath: instancePath + "/global/imageOrigins/" + i2, schemaPath: "#/properties/global/properties/imageOrigins/items/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                  if (vErrors === null) {
                    vErrors = [err43];
                  } else {
                    vErrors.push(err43);
                  }
                  errors++;
                }
                if (func4(data14) < 1) {
                  const err44 = { instancePath: instancePath + "/global/imageOrigins/" + i2, schemaPath: "#/properties/global/properties/imageOrigins/items/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                  if (vErrors === null) {
                    vErrors = [err44];
                  } else {
                    vErrors.push(err44);
                  }
                  errors++;
                }
              } else {
                const err45 = { instancePath: instancePath + "/global/imageOrigins/" + i2, schemaPath: "#/properties/global/properties/imageOrigins/items/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                if (vErrors === null) {
                  vErrors = [err45];
                } else {
                  vErrors.push(err45);
                }
                errors++;
              }
            }
            let i3 = data13.length;
            let j1;
            if (i3 > 1) {
              const indices0 = {};
              for (; i3--; ) {
                let item0 = data13[i3];
                if (typeof item0 !== "string") {
                  continue;
                }
                if (typeof indices0[item0] == "number") {
                  j1 = indices0[item0];
                  const err46 = { instancePath: instancePath + "/global/imageOrigins", schemaPath: "#/properties/global/properties/imageOrigins/uniqueItems", keyword: "uniqueItems", params: { i: i3, j: j1 }, message: "must NOT have duplicate items (items ## " + j1 + " and " + i3 + " are identical)" };
                  if (vErrors === null) {
                    vErrors = [err46];
                  } else {
                    vErrors.push(err46);
                  }
                  errors++;
                  break;
                }
                indices0[item0] = i3;
              }
            }
          } else {
            const err47 = { instancePath: instancePath + "/global/imageOrigins", schemaPath: "#/properties/global/properties/imageOrigins/type", keyword: "type", params: { type: "array" }, message: "must be array" };
            if (vErrors === null) {
              vErrors = [err47];
            } else {
              vErrors.push(err47);
            }
            errors++;
          }
        }
        if (data2.destinationOrigins !== void 0) {
          let data15 = data2.destinationOrigins;
          if (Array.isArray(data15)) {
            if (data15.length > 100) {
              const err48 = { instancePath: instancePath + "/global/destinationOrigins", schemaPath: "#/properties/global/properties/destinationOrigins/maxItems", keyword: "maxItems", params: { limit: 100 }, message: "must NOT have more than 100 items" };
              if (vErrors === null) {
                vErrors = [err48];
              } else {
                vErrors.push(err48);
              }
              errors++;
            }
            if (data15.length < 1) {
              const err49 = { instancePath: instancePath + "/global/destinationOrigins", schemaPath: "#/properties/global/properties/destinationOrigins/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" };
              if (vErrors === null) {
                vErrors = [err49];
              } else {
                vErrors.push(err49);
              }
              errors++;
            }
            const len2 = data15.length;
            for (let i4 = 0; i4 < len2; i4++) {
              let data16 = data15[i4];
              if (typeof data16 === "string") {
                if (func4(data16) > 300) {
                  const err50 = { instancePath: instancePath + "/global/destinationOrigins/" + i4, schemaPath: "#/properties/global/properties/destinationOrigins/items/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                  if (vErrors === null) {
                    vErrors = [err50];
                  } else {
                    vErrors.push(err50);
                  }
                  errors++;
                }
                if (func4(data16) < 1) {
                  const err51 = { instancePath: instancePath + "/global/destinationOrigins/" + i4, schemaPath: "#/properties/global/properties/destinationOrigins/items/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                  if (vErrors === null) {
                    vErrors = [err51];
                  } else {
                    vErrors.push(err51);
                  }
                  errors++;
                }
              } else {
                const err52 = { instancePath: instancePath + "/global/destinationOrigins/" + i4, schemaPath: "#/properties/global/properties/destinationOrigins/items/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                if (vErrors === null) {
                  vErrors = [err52];
                } else {
                  vErrors.push(err52);
                }
                errors++;
              }
            }
            let i5 = data15.length;
            let j2;
            if (i5 > 1) {
              const indices1 = {};
              for (; i5--; ) {
                let item1 = data15[i5];
                if (typeof item1 !== "string") {
                  continue;
                }
                if (typeof indices1[item1] == "number") {
                  j2 = indices1[item1];
                  const err53 = { instancePath: instancePath + "/global/destinationOrigins", schemaPath: "#/properties/global/properties/destinationOrigins/uniqueItems", keyword: "uniqueItems", params: { i: i5, j: j2 }, message: "must NOT have duplicate items (items ## " + j2 + " and " + i5 + " are identical)" };
                  if (vErrors === null) {
                    vErrors = [err53];
                  } else {
                    vErrors.push(err53);
                  }
                  errors++;
                  break;
                }
                indices1[item1] = i5;
              }
            }
          } else {
            const err54 = { instancePath: instancePath + "/global/destinationOrigins", schemaPath: "#/properties/global/properties/destinationOrigins/type", keyword: "type", params: { type: "array" }, message: "must be array" };
            if (vErrors === null) {
              vErrors = [err54];
            } else {
              vErrors.push(err54);
            }
            errors++;
          }
        }
        if (data2.categories !== void 0) {
          let data17 = data2.categories;
          if (Array.isArray(data17)) {
            if (data17.length > 30) {
              const err55 = { instancePath: instancePath + "/global/categories", schemaPath: "#/properties/global/properties/categories/maxItems", keyword: "maxItems", params: { limit: 30 }, message: "must NOT have more than 30 items" };
              if (vErrors === null) {
                vErrors = [err55];
              } else {
                vErrors.push(err55);
              }
              errors++;
            }
            if (data17.length < 1) {
              const err56 = { instancePath: instancePath + "/global/categories", schemaPath: "#/properties/global/properties/categories/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" };
              if (vErrors === null) {
                vErrors = [err56];
              } else {
                vErrors.push(err56);
              }
              errors++;
            }
            const len3 = data17.length;
            for (let i6 = 0; i6 < len3; i6++) {
              let data18 = data17[i6];
              if (typeof data18 === "string") {
                if (!pattern1.test(data18)) {
                  const err57 = { instancePath: instancePath + "/global/categories/" + i6, schemaPath: "#/properties/global/properties/categories/items/pattern", keyword: "pattern", params: { pattern: "^[a-z0-9][a-z0-9-]{0,63}$" }, message: 'must match pattern "^[a-z0-9][a-z0-9-]{0,63}$"' };
                  if (vErrors === null) {
                    vErrors = [err57];
                  } else {
                    vErrors.push(err57);
                  }
                  errors++;
                }
              } else {
                const err58 = { instancePath: instancePath + "/global/categories/" + i6, schemaPath: "#/properties/global/properties/categories/items/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                if (vErrors === null) {
                  vErrors = [err58];
                } else {
                  vErrors.push(err58);
                }
                errors++;
              }
            }
            let i7 = data17.length;
            let j3;
            if (i7 > 1) {
              const indices2 = {};
              for (; i7--; ) {
                let item2 = data17[i7];
                if (typeof item2 !== "string") {
                  continue;
                }
                if (typeof indices2[item2] == "number") {
                  j3 = indices2[item2];
                  const err59 = { instancePath: instancePath + "/global/categories", schemaPath: "#/properties/global/properties/categories/uniqueItems", keyword: "uniqueItems", params: { i: i7, j: j3 }, message: "must NOT have duplicate items (items ## " + j3 + " and " + i7 + " are identical)" };
                  if (vErrors === null) {
                    vErrors = [err59];
                  } else {
                    vErrors.push(err59);
                  }
                  errors++;
                  break;
                }
                indices2[item2] = i7;
              }
            }
          } else {
            const err60 = { instancePath: instancePath + "/global/categories", schemaPath: "#/properties/global/properties/categories/type", keyword: "type", params: { type: "array" }, message: "must be array" };
            if (vErrors === null) {
              vErrors = [err60];
            } else {
              vErrors.push(err60);
            }
            errors++;
          }
        }
        if (data2.fallback !== void 0) {
          let data19 = data2.fallback;
          if (!(data19 === "house" || data19 === "empty")) {
            const err61 = { instancePath: instancePath + "/global/fallback", schemaPath: "#/properties/global/properties/fallback/enum", keyword: "enum", params: { allowedValues: schema11.properties.global.properties.fallback.enum }, message: "must be equal to one of the allowed values" };
            if (vErrors === null) {
              vErrors = [err61];
            } else {
              vErrors.push(err61);
            }
            errors++;
          }
        }
        if (data2.google !== void 0) {
          let data20 = data2.google;
          if (data20 && typeof data20 == "object" && !Array.isArray(data20)) {
            if (data20.publisherId === void 0) {
              const err62 = { instancePath: instancePath + "/global/google", schemaPath: "#/properties/global/properties/google/required", keyword: "required", params: { missingProperty: "publisherId" }, message: "must have required property 'publisherId'" };
              if (vErrors === null) {
                vErrors = [err62];
              } else {
                vErrors.push(err62);
              }
              errors++;
            }
            if (data20.autoAdsDisabledConfirmed === void 0) {
              const err63 = { instancePath: instancePath + "/global/google", schemaPath: "#/properties/global/properties/google/required", keyword: "required", params: { missingProperty: "autoAdsDisabledConfirmed" }, message: "must have required property 'autoAdsDisabledConfirmed'" };
              if (vErrors === null) {
                vErrors = [err63];
              } else {
                vErrors.push(err63);
              }
              errors++;
            }
            if (data20.certifiedCmpIds === void 0) {
              const err64 = { instancePath: instancePath + "/global/google", schemaPath: "#/properties/global/properties/google/required", keyword: "required", params: { missingProperty: "certifiedCmpIds" }, message: "must have required property 'certifiedCmpIds'" };
              if (vErrors === null) {
                vErrors = [err64];
              } else {
                vErrors.push(err64);
              }
              errors++;
            }
            for (const key2 in data20) {
              if (!(key2 === "publisherId" || key2 === "autoAdsDisabledConfirmed" || key2 === "certifiedCmpIds")) {
                const err65 = { instancePath: instancePath + "/global/google", schemaPath: "#/properties/global/properties/google/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key2 }, message: "must NOT have additional properties" };
                if (vErrors === null) {
                  vErrors = [err65];
                } else {
                  vErrors.push(err65);
                }
                errors++;
              }
            }
            if (data20.publisherId !== void 0) {
              let data21 = data20.publisherId;
              const _errs42 = errors;
              let valid15 = false;
              const _errs43 = errors;
              if (data21 !== null) {
                const err66 = { instancePath: instancePath + "/global/google/publisherId", schemaPath: "#/properties/global/properties/google/properties/publisherId/anyOf/0/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                if (vErrors === null) {
                  vErrors = [err66];
                } else {
                  vErrors.push(err66);
                }
                errors++;
              }
              var _valid0 = _errs43 === errors;
              valid15 = valid15 || _valid0;
              if (!valid15) {
                const _errs45 = errors;
                if (typeof data21 === "string") {
                  if (!pattern2.test(data21)) {
                    const err67 = { instancePath: instancePath + "/global/google/publisherId", schemaPath: "#/properties/global/properties/google/properties/publisherId/anyOf/1/pattern", keyword: "pattern", params: { pattern: "^ca-pub-[0-9]{16}$" }, message: 'must match pattern "^ca-pub-[0-9]{16}$"' };
                    if (vErrors === null) {
                      vErrors = [err67];
                    } else {
                      vErrors.push(err67);
                    }
                    errors++;
                  }
                } else {
                  const err68 = { instancePath: instancePath + "/global/google/publisherId", schemaPath: "#/properties/global/properties/google/properties/publisherId/anyOf/1/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                  if (vErrors === null) {
                    vErrors = [err68];
                  } else {
                    vErrors.push(err68);
                  }
                  errors++;
                }
                var _valid0 = _errs45 === errors;
                valid15 = valid15 || _valid0;
              }
              if (!valid15) {
                const err69 = { instancePath: instancePath + "/global/google/publisherId", schemaPath: "#/properties/global/properties/google/properties/publisherId/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                if (vErrors === null) {
                  vErrors = [err69];
                } else {
                  vErrors.push(err69);
                }
                errors++;
              } else {
                errors = _errs42;
                if (vErrors !== null) {
                  if (_errs42) {
                    vErrors.length = _errs42;
                  } else {
                    vErrors = null;
                  }
                }
              }
            }
            if (data20.autoAdsDisabledConfirmed !== void 0) {
              if (typeof data20.autoAdsDisabledConfirmed !== "boolean") {
                const err70 = { instancePath: instancePath + "/global/google/autoAdsDisabledConfirmed", schemaPath: "#/properties/global/properties/google/properties/autoAdsDisabledConfirmed/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                if (vErrors === null) {
                  vErrors = [err70];
                } else {
                  vErrors.push(err70);
                }
                errors++;
              }
            }
            if (data20.certifiedCmpIds !== void 0) {
              let data23 = data20.certifiedCmpIds;
              if (Array.isArray(data23)) {
                if (data23.length > 30) {
                  const err71 = { instancePath: instancePath + "/global/google/certifiedCmpIds", schemaPath: "#/properties/global/properties/google/properties/certifiedCmpIds/maxItems", keyword: "maxItems", params: { limit: 30 }, message: "must NOT have more than 30 items" };
                  if (vErrors === null) {
                    vErrors = [err71];
                  } else {
                    vErrors.push(err71);
                  }
                  errors++;
                }
                if (data23.length < 0) {
                  const err72 = { instancePath: instancePath + "/global/google/certifiedCmpIds", schemaPath: "#/properties/global/properties/google/properties/certifiedCmpIds/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" };
                  if (vErrors === null) {
                    vErrors = [err72];
                  } else {
                    vErrors.push(err72);
                  }
                  errors++;
                }
                const len4 = data23.length;
                for (let i8 = 0; i8 < len4; i8++) {
                  let data24 = data23[i8];
                  if (!(typeof data24 == "number" && (!(data24 % 1) && !isNaN(data24)) && isFinite(data24))) {
                    const err73 = { instancePath: instancePath + "/global/google/certifiedCmpIds/" + i8, schemaPath: "#/properties/global/properties/google/properties/certifiedCmpIds/items/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                    if (vErrors === null) {
                      vErrors = [err73];
                    } else {
                      vErrors.push(err73);
                    }
                    errors++;
                  }
                  if (typeof data24 == "number" && isFinite(data24)) {
                    if (data24 > 4095 || isNaN(data24)) {
                      const err74 = { instancePath: instancePath + "/global/google/certifiedCmpIds/" + i8, schemaPath: "#/properties/global/properties/google/properties/certifiedCmpIds/items/maximum", keyword: "maximum", params: { comparison: "<=", limit: 4095 }, message: "must be <= 4095" };
                      if (vErrors === null) {
                        vErrors = [err74];
                      } else {
                        vErrors.push(err74);
                      }
                      errors++;
                    }
                    if (data24 < 1 || isNaN(data24)) {
                      const err75 = { instancePath: instancePath + "/global/google/certifiedCmpIds/" + i8, schemaPath: "#/properties/global/properties/google/properties/certifiedCmpIds/items/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1" };
                      if (vErrors === null) {
                        vErrors = [err75];
                      } else {
                        vErrors.push(err75);
                      }
                      errors++;
                    }
                  }
                }
                let i9 = data23.length;
                let j4;
                if (i9 > 1) {
                  const indices3 = {};
                  for (; i9--; ) {
                    let item3 = data23[i9];
                    if (!(typeof item3 == "number" && (!(item3 % 1) && !isNaN(item3)) && isFinite(item3))) {
                      continue;
                    }
                    if (typeof indices3[item3] == "number") {
                      j4 = indices3[item3];
                      const err76 = { instancePath: instancePath + "/global/google/certifiedCmpIds", schemaPath: "#/properties/global/properties/google/properties/certifiedCmpIds/uniqueItems", keyword: "uniqueItems", params: { i: i9, j: j4 }, message: "must NOT have duplicate items (items ## " + j4 + " and " + i9 + " are identical)" };
                      if (vErrors === null) {
                        vErrors = [err76];
                      } else {
                        vErrors.push(err76);
                      }
                      errors++;
                      break;
                    }
                    indices3[item3] = i9;
                  }
                }
              } else {
                const err77 = { instancePath: instancePath + "/global/google/certifiedCmpIds", schemaPath: "#/properties/global/properties/google/properties/certifiedCmpIds/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                if (vErrors === null) {
                  vErrors = [err77];
                } else {
                  vErrors.push(err77);
                }
                errors++;
              }
            }
          } else {
            const err78 = { instancePath: instancePath + "/global/google", schemaPath: "#/properties/global/properties/google/type", keyword: "type", params: { type: "object" }, message: "must be object" };
            if (vErrors === null) {
              vErrors = [err78];
            } else {
              vErrors.push(err78);
            }
            errors++;
          }
        }
      } else {
        const err79 = { instancePath: instancePath + "/global", schemaPath: "#/properties/global/type", keyword: "type", params: { type: "object" }, message: "must be object" };
        if (vErrors === null) {
          vErrors = [err79];
        } else {
          vErrors.push(err79);
        }
        errors++;
      }
    }
    if (data.sites !== void 0) {
      let data25 = data.sites;
      if (Array.isArray(data25)) {
        if (data25.length > 500) {
          const err80 = { instancePath: instancePath + "/sites", schemaPath: "#/properties/sites/maxItems", keyword: "maxItems", params: { limit: 500 }, message: "must NOT have more than 500 items" };
          if (vErrors === null) {
            vErrors = [err80];
          } else {
            vErrors.push(err80);
          }
          errors++;
        }
        if (data25.length < 0) {
          const err81 = { instancePath: instancePath + "/sites", schemaPath: "#/properties/sites/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" };
          if (vErrors === null) {
            vErrors = [err81];
          } else {
            vErrors.push(err81);
          }
          errors++;
        }
        const len5 = data25.length;
        for (let i10 = 0; i10 < len5; i10++) {
          let data26 = data25[i10];
          if (data26 && typeof data26 == "object" && !Array.isArray(data26)) {
            if (data26.id === void 0) {
              const err82 = { instancePath: instancePath + "/sites/" + i10, schemaPath: "#/properties/sites/items/required", keyword: "required", params: { missingProperty: "id" }, message: "must have required property 'id'" };
              if (vErrors === null) {
                vErrors = [err82];
              } else {
                vErrors.push(err82);
              }
              errors++;
            }
            if (data26.domain === void 0) {
              const err83 = { instancePath: instancePath + "/sites/" + i10, schemaPath: "#/properties/sites/items/required", keyword: "required", params: { missingProperty: "domain" }, message: "must have required property 'domain'" };
              if (vErrors === null) {
                vErrors = [err83];
              } else {
                vErrors.push(err83);
              }
              errors++;
            }
            if (data26.pathPrefixes === void 0) {
              const err84 = { instancePath: instancePath + "/sites/" + i10, schemaPath: "#/properties/sites/items/required", keyword: "required", params: { missingProperty: "pathPrefixes" }, message: "must have required property 'pathPrefixes'" };
              if (vErrors === null) {
                vErrors = [err84];
              } else {
                vErrors.push(err84);
              }
              errors++;
            }
            if (data26.audience === void 0) {
              const err85 = { instancePath: instancePath + "/sites/" + i10, schemaPath: "#/properties/sites/items/required", keyword: "required", params: { missingProperty: "audience" }, message: "must have required property 'audience'" };
              if (vErrors === null) {
                vErrors = [err85];
              } else {
                vErrors.push(err85);
              }
              errors++;
            }
            if (data26.enabled === void 0) {
              const err86 = { instancePath: instancePath + "/sites/" + i10, schemaPath: "#/properties/sites/items/required", keyword: "required", params: { missingProperty: "enabled" }, message: "must have required property 'enabled'" };
              if (vErrors === null) {
                vErrors = [err86];
              } else {
                vErrors.push(err86);
              }
              errors++;
            }
            if (data26.houseAdsApproved === void 0) {
              const err87 = { instancePath: instancePath + "/sites/" + i10, schemaPath: "#/properties/sites/items/required", keyword: "required", params: { missingProperty: "houseAdsApproved" }, message: "must have required property 'houseAdsApproved'" };
              if (vErrors === null) {
                vErrors = [err87];
              } else {
                vErrors.push(err87);
              }
              errors++;
            }
            if (data26.googleEnabled === void 0) {
              const err88 = { instancePath: instancePath + "/sites/" + i10, schemaPath: "#/properties/sites/items/required", keyword: "required", params: { missingProperty: "googleEnabled" }, message: "must have required property 'googleEnabled'" };
              if (vErrors === null) {
                vErrors = [err88];
              } else {
                vErrors.push(err88);
              }
              errors++;
            }
            if (data26.googleApproved === void 0) {
              const err89 = { instancePath: instancePath + "/sites/" + i10, schemaPath: "#/properties/sites/items/required", keyword: "required", params: { missingProperty: "googleApproved" }, message: "must have required property 'googleApproved'" };
              if (vErrors === null) {
                vErrors = [err89];
              } else {
                vErrors.push(err89);
              }
              errors++;
            }
            if (data26.mode === void 0) {
              const err90 = { instancePath: instancePath + "/sites/" + i10, schemaPath: "#/properties/sites/items/required", keyword: "required", params: { missingProperty: "mode" }, message: "must have required property 'mode'" };
              if (vErrors === null) {
                vErrors = [err90];
              } else {
                vErrors.push(err90);
              }
              errors++;
            }
            if (data26.maxAdsPerPage === void 0) {
              const err91 = { instancePath: instancePath + "/sites/" + i10, schemaPath: "#/properties/sites/items/required", keyword: "required", params: { missingProperty: "maxAdsPerPage" }, message: "must have required property 'maxAdsPerPage'" };
              if (vErrors === null) {
                vErrors = [err91];
              } else {
                vErrors.push(err91);
              }
              errors++;
            }
            if (data26.categories === void 0) {
              const err92 = { instancePath: instancePath + "/sites/" + i10, schemaPath: "#/properties/sites/items/required", keyword: "required", params: { missingProperty: "categories" }, message: "must have required property 'categories'" };
              if (vErrors === null) {
                vErrors = [err92];
              } else {
                vErrors.push(err92);
              }
              errors++;
            }
            if (data26.allowedSizes === void 0) {
              const err93 = { instancePath: instancePath + "/sites/" + i10, schemaPath: "#/properties/sites/items/required", keyword: "required", params: { missingProperty: "allowedSizes" }, message: "must have required property 'allowedSizes'" };
              if (vErrors === null) {
                vErrors = [err93];
              } else {
                vErrors.push(err93);
              }
              errors++;
            }
            if (data26.exclusions === void 0) {
              const err94 = { instancePath: instancePath + "/sites/" + i10, schemaPath: "#/properties/sites/items/required", keyword: "required", params: { missingProperty: "exclusions" }, message: "must have required property 'exclusions'" };
              if (vErrors === null) {
                vErrors = [err94];
              } else {
                vErrors.push(err94);
              }
              errors++;
            }
            if (data26.longContentPaths === void 0) {
              const err95 = { instancePath: instancePath + "/sites/" + i10, schemaPath: "#/properties/sites/items/required", keyword: "required", params: { missingProperty: "longContentPaths" }, message: "must have required property 'longContentPaths'" };
              if (vErrors === null) {
                vErrors = [err95];
              } else {
                vErrors.push(err95);
              }
              errors++;
            }
            if (data26.placements === void 0) {
              const err96 = { instancePath: instancePath + "/sites/" + i10, schemaPath: "#/properties/sites/items/required", keyword: "required", params: { missingProperty: "placements" }, message: "must have required property 'placements'" };
              if (vErrors === null) {
                vErrors = [err96];
              } else {
                vErrors.push(err96);
              }
              errors++;
            }
            if (data26.googleUnits === void 0) {
              const err97 = { instancePath: instancePath + "/sites/" + i10, schemaPath: "#/properties/sites/items/required", keyword: "required", params: { missingProperty: "googleUnits" }, message: "must have required property 'googleUnits'" };
              if (vErrors === null) {
                vErrors = [err97];
              } else {
                vErrors.push(err97);
              }
              errors++;
            }
            for (const key3 in data26) {
              if (!func2.call(schema11.properties.sites.items.properties, key3)) {
                const err98 = { instancePath: instancePath + "/sites/" + i10, schemaPath: "#/properties/sites/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key3 }, message: "must NOT have additional properties" };
                if (vErrors === null) {
                  vErrors = [err98];
                } else {
                  vErrors.push(err98);
                }
                errors++;
              }
            }
            if (data26.id !== void 0) {
              let data27 = data26.id;
              if (typeof data27 === "string") {
                if (!pattern1.test(data27)) {
                  const err99 = { instancePath: instancePath + "/sites/" + i10 + "/id", schemaPath: "#/properties/sites/items/properties/id/pattern", keyword: "pattern", params: { pattern: "^[a-z0-9][a-z0-9-]{0,63}$" }, message: 'must match pattern "^[a-z0-9][a-z0-9-]{0,63}$"' };
                  if (vErrors === null) {
                    vErrors = [err99];
                  } else {
                    vErrors.push(err99);
                  }
                  errors++;
                }
              } else {
                const err100 = { instancePath: instancePath + "/sites/" + i10 + "/id", schemaPath: "#/properties/sites/items/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                if (vErrors === null) {
                  vErrors = [err100];
                } else {
                  vErrors.push(err100);
                }
                errors++;
              }
            }
            if (data26.domain !== void 0) {
              let data28 = data26.domain;
              if (typeof data28 === "string") {
                if (func4(data28) > 253) {
                  const err101 = { instancePath: instancePath + "/sites/" + i10 + "/domain", schemaPath: "#/properties/sites/items/properties/domain/maxLength", keyword: "maxLength", params: { limit: 253 }, message: "must NOT have more than 253 characters" };
                  if (vErrors === null) {
                    vErrors = [err101];
                  } else {
                    vErrors.push(err101);
                  }
                  errors++;
                }
                if (!pattern4.test(data28)) {
                  const err102 = { instancePath: instancePath + "/sites/" + i10 + "/domain", schemaPath: "#/properties/sites/items/properties/domain/pattern", keyword: "pattern", params: { pattern: "^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$" }, message: 'must match pattern "^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$"' };
                  if (vErrors === null) {
                    vErrors = [err102];
                  } else {
                    vErrors.push(err102);
                  }
                  errors++;
                }
              } else {
                const err103 = { instancePath: instancePath + "/sites/" + i10 + "/domain", schemaPath: "#/properties/sites/items/properties/domain/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                if (vErrors === null) {
                  vErrors = [err103];
                } else {
                  vErrors.push(err103);
                }
                errors++;
              }
            }
            if (data26.pathPrefixes !== void 0) {
              let data29 = data26.pathPrefixes;
              if (Array.isArray(data29)) {
                if (data29.length > 30) {
                  const err104 = { instancePath: instancePath + "/sites/" + i10 + "/pathPrefixes", schemaPath: "#/properties/sites/items/properties/pathPrefixes/maxItems", keyword: "maxItems", params: { limit: 30 }, message: "must NOT have more than 30 items" };
                  if (vErrors === null) {
                    vErrors = [err104];
                  } else {
                    vErrors.push(err104);
                  }
                  errors++;
                }
                if (data29.length < 1) {
                  const err105 = { instancePath: instancePath + "/sites/" + i10 + "/pathPrefixes", schemaPath: "#/properties/sites/items/properties/pathPrefixes/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" };
                  if (vErrors === null) {
                    vErrors = [err105];
                  } else {
                    vErrors.push(err105);
                  }
                  errors++;
                }
                const len6 = data29.length;
                for (let i11 = 0; i11 < len6; i11++) {
                  let data30 = data29[i11];
                  if (typeof data30 === "string") {
                    if (func4(data30) > 2048) {
                      const err106 = { instancePath: instancePath + "/sites/" + i10 + "/pathPrefixes/" + i11, schemaPath: "#/properties/sites/items/properties/pathPrefixes/items/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" };
                      if (vErrors === null) {
                        vErrors = [err106];
                      } else {
                        vErrors.push(err106);
                      }
                      errors++;
                    }
                    if (func4(data30) < 1) {
                      const err107 = { instancePath: instancePath + "/sites/" + i10 + "/pathPrefixes/" + i11, schemaPath: "#/properties/sites/items/properties/pathPrefixes/items/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                      if (vErrors === null) {
                        vErrors = [err107];
                      } else {
                        vErrors.push(err107);
                      }
                      errors++;
                    }
                  } else {
                    const err108 = { instancePath: instancePath + "/sites/" + i10 + "/pathPrefixes/" + i11, schemaPath: "#/properties/sites/items/properties/pathPrefixes/items/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                    if (vErrors === null) {
                      vErrors = [err108];
                    } else {
                      vErrors.push(err108);
                    }
                    errors++;
                  }
                }
                let i12 = data29.length;
                let j5;
                if (i12 > 1) {
                  const indices4 = {};
                  for (; i12--; ) {
                    let item4 = data29[i12];
                    if (typeof item4 !== "string") {
                      continue;
                    }
                    if (typeof indices4[item4] == "number") {
                      j5 = indices4[item4];
                      const err109 = { instancePath: instancePath + "/sites/" + i10 + "/pathPrefixes", schemaPath: "#/properties/sites/items/properties/pathPrefixes/uniqueItems", keyword: "uniqueItems", params: { i: i12, j: j5 }, message: "must NOT have duplicate items (items ## " + j5 + " and " + i12 + " are identical)" };
                      if (vErrors === null) {
                        vErrors = [err109];
                      } else {
                        vErrors.push(err109);
                      }
                      errors++;
                      break;
                    }
                    indices4[item4] = i12;
                  }
                }
              } else {
                const err110 = { instancePath: instancePath + "/sites/" + i10 + "/pathPrefixes", schemaPath: "#/properties/sites/items/properties/pathPrefixes/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                if (vErrors === null) {
                  vErrors = [err110];
                } else {
                  vErrors.push(err110);
                }
                errors++;
              }
            }
            if (data26.audience !== void 0) {
              let data31 = data26.audience;
              if (!(data31 === "general" || data31 === "child-directed")) {
                const err111 = { instancePath: instancePath + "/sites/" + i10 + "/audience", schemaPath: "#/properties/sites/items/properties/audience/enum", keyword: "enum", params: { allowedValues: schema11.properties.sites.items.properties.audience.enum }, message: "must be equal to one of the allowed values" };
                if (vErrors === null) {
                  vErrors = [err111];
                } else {
                  vErrors.push(err111);
                }
                errors++;
              }
            }
            if (data26.enabled !== void 0) {
              if (typeof data26.enabled !== "boolean") {
                const err112 = { instancePath: instancePath + "/sites/" + i10 + "/enabled", schemaPath: "#/properties/sites/items/properties/enabled/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                if (vErrors === null) {
                  vErrors = [err112];
                } else {
                  vErrors.push(err112);
                }
                errors++;
              }
            }
            if (data26.houseAdsApproved !== void 0) {
              if (typeof data26.houseAdsApproved !== "boolean") {
                const err113 = { instancePath: instancePath + "/sites/" + i10 + "/houseAdsApproved", schemaPath: "#/properties/sites/items/properties/houseAdsApproved/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                if (vErrors === null) {
                  vErrors = [err113];
                } else {
                  vErrors.push(err113);
                }
                errors++;
              }
            }
            if (data26.googleEnabled !== void 0) {
              if (typeof data26.googleEnabled !== "boolean") {
                const err114 = { instancePath: instancePath + "/sites/" + i10 + "/googleEnabled", schemaPath: "#/properties/sites/items/properties/googleEnabled/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                if (vErrors === null) {
                  vErrors = [err114];
                } else {
                  vErrors.push(err114);
                }
                errors++;
              }
            }
            if (data26.googleApproved !== void 0) {
              if (typeof data26.googleApproved !== "boolean") {
                const err115 = { instancePath: instancePath + "/sites/" + i10 + "/googleApproved", schemaPath: "#/properties/sites/items/properties/googleApproved/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                if (vErrors === null) {
                  vErrors = [err115];
                } else {
                  vErrors.push(err115);
                }
                errors++;
              }
            }
            if (data26.mode !== void 0) {
              let data36 = data26.mode;
              if (!(data36 === "mixed" || data36 === "house-only" || data36 === "google-only" || data36 === "off")) {
                const err116 = { instancePath: instancePath + "/sites/" + i10 + "/mode", schemaPath: "#/properties/sites/items/properties/mode/enum", keyword: "enum", params: { allowedValues: schema11.properties.sites.items.properties.mode.enum }, message: "must be equal to one of the allowed values" };
                if (vErrors === null) {
                  vErrors = [err116];
                } else {
                  vErrors.push(err116);
                }
                errors++;
              }
            }
            if (data26.maxAdsPerPage !== void 0) {
              let data37 = data26.maxAdsPerPage;
              if (!(typeof data37 == "number" && (!(data37 % 1) && !isNaN(data37)) && isFinite(data37))) {
                const err117 = { instancePath: instancePath + "/sites/" + i10 + "/maxAdsPerPage", schemaPath: "#/properties/sites/items/properties/maxAdsPerPage/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                if (vErrors === null) {
                  vErrors = [err117];
                } else {
                  vErrors.push(err117);
                }
                errors++;
              }
              if (typeof data37 == "number" && isFinite(data37)) {
                if (data37 > 2 || isNaN(data37)) {
                  const err118 = { instancePath: instancePath + "/sites/" + i10 + "/maxAdsPerPage", schemaPath: "#/properties/sites/items/properties/maxAdsPerPage/maximum", keyword: "maximum", params: { comparison: "<=", limit: 2 }, message: "must be <= 2" };
                  if (vErrors === null) {
                    vErrors = [err118];
                  } else {
                    vErrors.push(err118);
                  }
                  errors++;
                }
                if (data37 < 0 || isNaN(data37)) {
                  const err119 = { instancePath: instancePath + "/sites/" + i10 + "/maxAdsPerPage", schemaPath: "#/properties/sites/items/properties/maxAdsPerPage/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" };
                  if (vErrors === null) {
                    vErrors = [err119];
                  } else {
                    vErrors.push(err119);
                  }
                  errors++;
                }
              }
            }
            if (data26.categories !== void 0) {
              let data38 = data26.categories;
              if (Array.isArray(data38)) {
                if (data38.length > 30) {
                  const err120 = { instancePath: instancePath + "/sites/" + i10 + "/categories", schemaPath: "#/properties/sites/items/properties/categories/maxItems", keyword: "maxItems", params: { limit: 30 }, message: "must NOT have more than 30 items" };
                  if (vErrors === null) {
                    vErrors = [err120];
                  } else {
                    vErrors.push(err120);
                  }
                  errors++;
                }
                if (data38.length < 1) {
                  const err121 = { instancePath: instancePath + "/sites/" + i10 + "/categories", schemaPath: "#/properties/sites/items/properties/categories/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" };
                  if (vErrors === null) {
                    vErrors = [err121];
                  } else {
                    vErrors.push(err121);
                  }
                  errors++;
                }
                const len7 = data38.length;
                for (let i13 = 0; i13 < len7; i13++) {
                  let data39 = data38[i13];
                  if (typeof data39 === "string") {
                    if (!pattern1.test(data39)) {
                      const err122 = { instancePath: instancePath + "/sites/" + i10 + "/categories/" + i13, schemaPath: "#/properties/sites/items/properties/categories/items/pattern", keyword: "pattern", params: { pattern: "^[a-z0-9][a-z0-9-]{0,63}$" }, message: 'must match pattern "^[a-z0-9][a-z0-9-]{0,63}$"' };
                      if (vErrors === null) {
                        vErrors = [err122];
                      } else {
                        vErrors.push(err122);
                      }
                      errors++;
                    }
                  } else {
                    const err123 = { instancePath: instancePath + "/sites/" + i10 + "/categories/" + i13, schemaPath: "#/properties/sites/items/properties/categories/items/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                    if (vErrors === null) {
                      vErrors = [err123];
                    } else {
                      vErrors.push(err123);
                    }
                    errors++;
                  }
                }
                let i14 = data38.length;
                let j6;
                if (i14 > 1) {
                  const indices5 = {};
                  for (; i14--; ) {
                    let item5 = data38[i14];
                    if (typeof item5 !== "string") {
                      continue;
                    }
                    if (typeof indices5[item5] == "number") {
                      j6 = indices5[item5];
                      const err124 = { instancePath: instancePath + "/sites/" + i10 + "/categories", schemaPath: "#/properties/sites/items/properties/categories/uniqueItems", keyword: "uniqueItems", params: { i: i14, j: j6 }, message: "must NOT have duplicate items (items ## " + j6 + " and " + i14 + " are identical)" };
                      if (vErrors === null) {
                        vErrors = [err124];
                      } else {
                        vErrors.push(err124);
                      }
                      errors++;
                      break;
                    }
                    indices5[item5] = i14;
                  }
                }
              } else {
                const err125 = { instancePath: instancePath + "/sites/" + i10 + "/categories", schemaPath: "#/properties/sites/items/properties/categories/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                if (vErrors === null) {
                  vErrors = [err125];
                } else {
                  vErrors.push(err125);
                }
                errors++;
              }
            }
            if (data26.allowedSizes !== void 0) {
              let data40 = data26.allowedSizes;
              if (Array.isArray(data40)) {
                if (data40.length > 5) {
                  const err126 = { instancePath: instancePath + "/sites/" + i10 + "/allowedSizes", schemaPath: "#/properties/sites/items/properties/allowedSizes/maxItems", keyword: "maxItems", params: { limit: 5 }, message: "must NOT have more than 5 items" };
                  if (vErrors === null) {
                    vErrors = [err126];
                  } else {
                    vErrors.push(err126);
                  }
                  errors++;
                }
                if (data40.length < 1) {
                  const err127 = { instancePath: instancePath + "/sites/" + i10 + "/allowedSizes", schemaPath: "#/properties/sites/items/properties/allowedSizes/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" };
                  if (vErrors === null) {
                    vErrors = [err127];
                  } else {
                    vErrors.push(err127);
                  }
                  errors++;
                }
                const len8 = data40.length;
                for (let i15 = 0; i15 < len8; i15++) {
                  let data41 = data40[i15];
                  if (!(data41 === "320x50" || data41 === "468x60" || data41 === "728x90" || data41 === "320x100" || data41 === "300x250")) {
                    const err128 = { instancePath: instancePath + "/sites/" + i10 + "/allowedSizes/" + i15, schemaPath: "#/properties/sites/items/properties/allowedSizes/items/enum", keyword: "enum", params: { allowedValues: schema11.properties.sites.items.properties.allowedSizes.items.enum }, message: "must be equal to one of the allowed values" };
                    if (vErrors === null) {
                      vErrors = [err128];
                    } else {
                      vErrors.push(err128);
                    }
                    errors++;
                  }
                }
                let i16 = data40.length;
                let j7;
                if (i16 > 1) {
                  outer1: for (; i16--; ) {
                    for (j7 = i16; j7--; ) {
                      if (func0(data40[i16], data40[j7])) {
                        const err129 = { instancePath: instancePath + "/sites/" + i10 + "/allowedSizes", schemaPath: "#/properties/sites/items/properties/allowedSizes/uniqueItems", keyword: "uniqueItems", params: { i: i16, j: j7 }, message: "must NOT have duplicate items (items ## " + j7 + " and " + i16 + " are identical)" };
                        if (vErrors === null) {
                          vErrors = [err129];
                        } else {
                          vErrors.push(err129);
                        }
                        errors++;
                        break outer1;
                      }
                    }
                  }
                }
              } else {
                const err130 = { instancePath: instancePath + "/sites/" + i10 + "/allowedSizes", schemaPath: "#/properties/sites/items/properties/allowedSizes/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                if (vErrors === null) {
                  vErrors = [err130];
                } else {
                  vErrors.push(err130);
                }
                errors++;
              }
            }
            if (data26.exclusions !== void 0) {
              let data42 = data26.exclusions;
              if (Array.isArray(data42)) {
                if (data42.length > 100) {
                  const err131 = { instancePath: instancePath + "/sites/" + i10 + "/exclusions", schemaPath: "#/properties/sites/items/properties/exclusions/maxItems", keyword: "maxItems", params: { limit: 100 }, message: "must NOT have more than 100 items" };
                  if (vErrors === null) {
                    vErrors = [err131];
                  } else {
                    vErrors.push(err131);
                  }
                  errors++;
                }
                if (data42.length < 0) {
                  const err132 = { instancePath: instancePath + "/sites/" + i10 + "/exclusions", schemaPath: "#/properties/sites/items/properties/exclusions/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" };
                  if (vErrors === null) {
                    vErrors = [err132];
                  } else {
                    vErrors.push(err132);
                  }
                  errors++;
                }
                const len9 = data42.length;
                for (let i17 = 0; i17 < len9; i17++) {
                  let data43 = data42[i17];
                  if (typeof data43 === "string") {
                    if (func4(data43) > 2048) {
                      const err133 = { instancePath: instancePath + "/sites/" + i10 + "/exclusions/" + i17, schemaPath: "#/properties/sites/items/properties/exclusions/items/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" };
                      if (vErrors === null) {
                        vErrors = [err133];
                      } else {
                        vErrors.push(err133);
                      }
                      errors++;
                    }
                    if (func4(data43) < 1) {
                      const err134 = { instancePath: instancePath + "/sites/" + i10 + "/exclusions/" + i17, schemaPath: "#/properties/sites/items/properties/exclusions/items/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                      if (vErrors === null) {
                        vErrors = [err134];
                      } else {
                        vErrors.push(err134);
                      }
                      errors++;
                    }
                  } else {
                    const err135 = { instancePath: instancePath + "/sites/" + i10 + "/exclusions/" + i17, schemaPath: "#/properties/sites/items/properties/exclusions/items/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                    if (vErrors === null) {
                      vErrors = [err135];
                    } else {
                      vErrors.push(err135);
                    }
                    errors++;
                  }
                }
                let i18 = data42.length;
                let j8;
                if (i18 > 1) {
                  const indices6 = {};
                  for (; i18--; ) {
                    let item6 = data42[i18];
                    if (typeof item6 !== "string") {
                      continue;
                    }
                    if (typeof indices6[item6] == "number") {
                      j8 = indices6[item6];
                      const err136 = { instancePath: instancePath + "/sites/" + i10 + "/exclusions", schemaPath: "#/properties/sites/items/properties/exclusions/uniqueItems", keyword: "uniqueItems", params: { i: i18, j: j8 }, message: "must NOT have duplicate items (items ## " + j8 + " and " + i18 + " are identical)" };
                      if (vErrors === null) {
                        vErrors = [err136];
                      } else {
                        vErrors.push(err136);
                      }
                      errors++;
                      break;
                    }
                    indices6[item6] = i18;
                  }
                }
              } else {
                const err137 = { instancePath: instancePath + "/sites/" + i10 + "/exclusions", schemaPath: "#/properties/sites/items/properties/exclusions/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                if (vErrors === null) {
                  vErrors = [err137];
                } else {
                  vErrors.push(err137);
                }
                errors++;
              }
            }
            if (data26.longContentPaths !== void 0) {
              let data44 = data26.longContentPaths;
              if (Array.isArray(data44)) {
                if (data44.length > 30) {
                  const err138 = { instancePath: instancePath + "/sites/" + i10 + "/longContentPaths", schemaPath: "#/properties/sites/items/properties/longContentPaths/maxItems", keyword: "maxItems", params: { limit: 30 }, message: "must NOT have more than 30 items" };
                  if (vErrors === null) {
                    vErrors = [err138];
                  } else {
                    vErrors.push(err138);
                  }
                  errors++;
                }
                if (data44.length < 0) {
                  const err139 = { instancePath: instancePath + "/sites/" + i10 + "/longContentPaths", schemaPath: "#/properties/sites/items/properties/longContentPaths/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" };
                  if (vErrors === null) {
                    vErrors = [err139];
                  } else {
                    vErrors.push(err139);
                  }
                  errors++;
                }
                const len10 = data44.length;
                for (let i19 = 0; i19 < len10; i19++) {
                  let data45 = data44[i19];
                  if (typeof data45 === "string") {
                    if (func4(data45) > 2048) {
                      const err140 = { instancePath: instancePath + "/sites/" + i10 + "/longContentPaths/" + i19, schemaPath: "#/properties/sites/items/properties/longContentPaths/items/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" };
                      if (vErrors === null) {
                        vErrors = [err140];
                      } else {
                        vErrors.push(err140);
                      }
                      errors++;
                    }
                    if (func4(data45) < 1) {
                      const err141 = { instancePath: instancePath + "/sites/" + i10 + "/longContentPaths/" + i19, schemaPath: "#/properties/sites/items/properties/longContentPaths/items/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                      if (vErrors === null) {
                        vErrors = [err141];
                      } else {
                        vErrors.push(err141);
                      }
                      errors++;
                    }
                  } else {
                    const err142 = { instancePath: instancePath + "/sites/" + i10 + "/longContentPaths/" + i19, schemaPath: "#/properties/sites/items/properties/longContentPaths/items/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                    if (vErrors === null) {
                      vErrors = [err142];
                    } else {
                      vErrors.push(err142);
                    }
                    errors++;
                  }
                }
                let i20 = data44.length;
                let j9;
                if (i20 > 1) {
                  const indices7 = {};
                  for (; i20--; ) {
                    let item7 = data44[i20];
                    if (typeof item7 !== "string") {
                      continue;
                    }
                    if (typeof indices7[item7] == "number") {
                      j9 = indices7[item7];
                      const err143 = { instancePath: instancePath + "/sites/" + i10 + "/longContentPaths", schemaPath: "#/properties/sites/items/properties/longContentPaths/uniqueItems", keyword: "uniqueItems", params: { i: i20, j: j9 }, message: "must NOT have duplicate items (items ## " + j9 + " and " + i20 + " are identical)" };
                      if (vErrors === null) {
                        vErrors = [err143];
                      } else {
                        vErrors.push(err143);
                      }
                      errors++;
                      break;
                    }
                    indices7[item7] = i20;
                  }
                }
              } else {
                const err144 = { instancePath: instancePath + "/sites/" + i10 + "/longContentPaths", schemaPath: "#/properties/sites/items/properties/longContentPaths/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                if (vErrors === null) {
                  vErrors = [err144];
                } else {
                  vErrors.push(err144);
                }
                errors++;
              }
            }
            if (data26.placements !== void 0) {
              let data46 = data26.placements;
              if (data46 && typeof data46 == "object" && !Array.isArray(data46)) {
                for (const key4 in data46) {
                  if (!(key4 === "content-bottom" || key4 === "article-middle" || key4 === "sidebar" || key4 === "landing-secondary" || key4 === "footer-above-author")) {
                    const err145 = { instancePath: instancePath + "/sites/" + i10 + "/placements", schemaPath: "#/properties/sites/items/properties/placements/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key4 }, message: "must NOT have additional properties" };
                    if (vErrors === null) {
                      vErrors = [err145];
                    } else {
                      vErrors.push(err145);
                    }
                    errors++;
                  }
                }
                if (data46["content-bottom"] !== void 0) {
                  let data47 = data46["content-bottom"];
                  if (data47 && typeof data47 == "object" && !Array.isArray(data47)) {
                    if (data47.enabled === void 0) {
                      const err146 = { instancePath: instancePath + "/sites/" + i10 + "/placements/content-bottom", schemaPath: "#/properties/sites/items/properties/placements/properties/content-bottom/required", keyword: "required", params: { missingProperty: "enabled" }, message: "must have required property 'enabled'" };
                      if (vErrors === null) {
                        vErrors = [err146];
                      } else {
                        vErrors.push(err146);
                      }
                      errors++;
                    }
                    if (data47.sizes === void 0) {
                      const err147 = { instancePath: instancePath + "/sites/" + i10 + "/placements/content-bottom", schemaPath: "#/properties/sites/items/properties/placements/properties/content-bottom/required", keyword: "required", params: { missingProperty: "sizes" }, message: "must have required property 'sizes'" };
                      if (vErrors === null) {
                        vErrors = [err147];
                      } else {
                        vErrors.push(err147);
                      }
                      errors++;
                    }
                    for (const key5 in data47) {
                      if (!(key5 === "enabled" || key5 === "sizes")) {
                        const err148 = { instancePath: instancePath + "/sites/" + i10 + "/placements/content-bottom", schemaPath: "#/properties/sites/items/properties/placements/properties/content-bottom/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key5 }, message: "must NOT have additional properties" };
                        if (vErrors === null) {
                          vErrors = [err148];
                        } else {
                          vErrors.push(err148);
                        }
                        errors++;
                      }
                    }
                    if (data47.enabled !== void 0) {
                      if (typeof data47.enabled !== "boolean") {
                        const err149 = { instancePath: instancePath + "/sites/" + i10 + "/placements/content-bottom/enabled", schemaPath: "#/properties/sites/items/properties/placements/properties/content-bottom/properties/enabled/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                        if (vErrors === null) {
                          vErrors = [err149];
                        } else {
                          vErrors.push(err149);
                        }
                        errors++;
                      }
                    }
                    if (data47.sizes !== void 0) {
                      let data49 = data47.sizes;
                      if (Array.isArray(data49)) {
                        if (data49.length > 5) {
                          const err150 = { instancePath: instancePath + "/sites/" + i10 + "/placements/content-bottom/sizes", schemaPath: "#/properties/sites/items/properties/placements/properties/content-bottom/properties/sizes/maxItems", keyword: "maxItems", params: { limit: 5 }, message: "must NOT have more than 5 items" };
                          if (vErrors === null) {
                            vErrors = [err150];
                          } else {
                            vErrors.push(err150);
                          }
                          errors++;
                        }
                        if (data49.length < 1) {
                          const err151 = { instancePath: instancePath + "/sites/" + i10 + "/placements/content-bottom/sizes", schemaPath: "#/properties/sites/items/properties/placements/properties/content-bottom/properties/sizes/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" };
                          if (vErrors === null) {
                            vErrors = [err151];
                          } else {
                            vErrors.push(err151);
                          }
                          errors++;
                        }
                        const len11 = data49.length;
                        for (let i21 = 0; i21 < len11; i21++) {
                          let data50 = data49[i21];
                          if (!(data50 === "320x50" || data50 === "468x60" || data50 === "728x90" || data50 === "320x100" || data50 === "300x250")) {
                            const err152 = { instancePath: instancePath + "/sites/" + i10 + "/placements/content-bottom/sizes/" + i21, schemaPath: "#/properties/sites/items/properties/placements/properties/content-bottom/properties/sizes/items/enum", keyword: "enum", params: { allowedValues: schema11.properties.sites.items.properties.placements.properties["content-bottom"].properties.sizes.items.enum }, message: "must be equal to one of the allowed values" };
                            if (vErrors === null) {
                              vErrors = [err152];
                            } else {
                              vErrors.push(err152);
                            }
                            errors++;
                          }
                        }
                        let i22 = data49.length;
                        let j10;
                        if (i22 > 1) {
                          outer2: for (; i22--; ) {
                            for (j10 = i22; j10--; ) {
                              if (func0(data49[i22], data49[j10])) {
                                const err153 = { instancePath: instancePath + "/sites/" + i10 + "/placements/content-bottom/sizes", schemaPath: "#/properties/sites/items/properties/placements/properties/content-bottom/properties/sizes/uniqueItems", keyword: "uniqueItems", params: { i: i22, j: j10 }, message: "must NOT have duplicate items (items ## " + j10 + " and " + i22 + " are identical)" };
                                if (vErrors === null) {
                                  vErrors = [err153];
                                } else {
                                  vErrors.push(err153);
                                }
                                errors++;
                                break outer2;
                              }
                            }
                          }
                        }
                      } else {
                        const err154 = { instancePath: instancePath + "/sites/" + i10 + "/placements/content-bottom/sizes", schemaPath: "#/properties/sites/items/properties/placements/properties/content-bottom/properties/sizes/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                        if (vErrors === null) {
                          vErrors = [err154];
                        } else {
                          vErrors.push(err154);
                        }
                        errors++;
                      }
                    }
                  } else {
                    const err155 = { instancePath: instancePath + "/sites/" + i10 + "/placements/content-bottom", schemaPath: "#/properties/sites/items/properties/placements/properties/content-bottom/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                    if (vErrors === null) {
                      vErrors = [err155];
                    } else {
                      vErrors.push(err155);
                    }
                    errors++;
                  }
                }
                if (data46["article-middle"] !== void 0) {
                  let data51 = data46["article-middle"];
                  if (data51 && typeof data51 == "object" && !Array.isArray(data51)) {
                    if (data51.enabled === void 0) {
                      const err156 = { instancePath: instancePath + "/sites/" + i10 + "/placements/article-middle", schemaPath: "#/properties/sites/items/properties/placements/properties/article-middle/required", keyword: "required", params: { missingProperty: "enabled" }, message: "must have required property 'enabled'" };
                      if (vErrors === null) {
                        vErrors = [err156];
                      } else {
                        vErrors.push(err156);
                      }
                      errors++;
                    }
                    if (data51.sizes === void 0) {
                      const err157 = { instancePath: instancePath + "/sites/" + i10 + "/placements/article-middle", schemaPath: "#/properties/sites/items/properties/placements/properties/article-middle/required", keyword: "required", params: { missingProperty: "sizes" }, message: "must have required property 'sizes'" };
                      if (vErrors === null) {
                        vErrors = [err157];
                      } else {
                        vErrors.push(err157);
                      }
                      errors++;
                    }
                    for (const key6 in data51) {
                      if (!(key6 === "enabled" || key6 === "sizes")) {
                        const err158 = { instancePath: instancePath + "/sites/" + i10 + "/placements/article-middle", schemaPath: "#/properties/sites/items/properties/placements/properties/article-middle/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key6 }, message: "must NOT have additional properties" };
                        if (vErrors === null) {
                          vErrors = [err158];
                        } else {
                          vErrors.push(err158);
                        }
                        errors++;
                      }
                    }
                    if (data51.enabled !== void 0) {
                      if (typeof data51.enabled !== "boolean") {
                        const err159 = { instancePath: instancePath + "/sites/" + i10 + "/placements/article-middle/enabled", schemaPath: "#/properties/sites/items/properties/placements/properties/article-middle/properties/enabled/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                        if (vErrors === null) {
                          vErrors = [err159];
                        } else {
                          vErrors.push(err159);
                        }
                        errors++;
                      }
                    }
                    if (data51.sizes !== void 0) {
                      let data53 = data51.sizes;
                      if (Array.isArray(data53)) {
                        if (data53.length > 5) {
                          const err160 = { instancePath: instancePath + "/sites/" + i10 + "/placements/article-middle/sizes", schemaPath: "#/properties/sites/items/properties/placements/properties/article-middle/properties/sizes/maxItems", keyword: "maxItems", params: { limit: 5 }, message: "must NOT have more than 5 items" };
                          if (vErrors === null) {
                            vErrors = [err160];
                          } else {
                            vErrors.push(err160);
                          }
                          errors++;
                        }
                        if (data53.length < 1) {
                          const err161 = { instancePath: instancePath + "/sites/" + i10 + "/placements/article-middle/sizes", schemaPath: "#/properties/sites/items/properties/placements/properties/article-middle/properties/sizes/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" };
                          if (vErrors === null) {
                            vErrors = [err161];
                          } else {
                            vErrors.push(err161);
                          }
                          errors++;
                        }
                        const len12 = data53.length;
                        for (let i23 = 0; i23 < len12; i23++) {
                          let data54 = data53[i23];
                          if (!(data54 === "320x50" || data54 === "468x60" || data54 === "728x90" || data54 === "320x100" || data54 === "300x250")) {
                            const err162 = { instancePath: instancePath + "/sites/" + i10 + "/placements/article-middle/sizes/" + i23, schemaPath: "#/properties/sites/items/properties/placements/properties/article-middle/properties/sizes/items/enum", keyword: "enum", params: { allowedValues: schema11.properties.sites.items.properties.placements.properties["article-middle"].properties.sizes.items.enum }, message: "must be equal to one of the allowed values" };
                            if (vErrors === null) {
                              vErrors = [err162];
                            } else {
                              vErrors.push(err162);
                            }
                            errors++;
                          }
                        }
                        let i24 = data53.length;
                        let j11;
                        if (i24 > 1) {
                          outer3: for (; i24--; ) {
                            for (j11 = i24; j11--; ) {
                              if (func0(data53[i24], data53[j11])) {
                                const err163 = { instancePath: instancePath + "/sites/" + i10 + "/placements/article-middle/sizes", schemaPath: "#/properties/sites/items/properties/placements/properties/article-middle/properties/sizes/uniqueItems", keyword: "uniqueItems", params: { i: i24, j: j11 }, message: "must NOT have duplicate items (items ## " + j11 + " and " + i24 + " are identical)" };
                                if (vErrors === null) {
                                  vErrors = [err163];
                                } else {
                                  vErrors.push(err163);
                                }
                                errors++;
                                break outer3;
                              }
                            }
                          }
                        }
                      } else {
                        const err164 = { instancePath: instancePath + "/sites/" + i10 + "/placements/article-middle/sizes", schemaPath: "#/properties/sites/items/properties/placements/properties/article-middle/properties/sizes/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                        if (vErrors === null) {
                          vErrors = [err164];
                        } else {
                          vErrors.push(err164);
                        }
                        errors++;
                      }
                    }
                  } else {
                    const err165 = { instancePath: instancePath + "/sites/" + i10 + "/placements/article-middle", schemaPath: "#/properties/sites/items/properties/placements/properties/article-middle/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                    if (vErrors === null) {
                      vErrors = [err165];
                    } else {
                      vErrors.push(err165);
                    }
                    errors++;
                  }
                }
                if (data46.sidebar !== void 0) {
                  let data55 = data46.sidebar;
                  if (data55 && typeof data55 == "object" && !Array.isArray(data55)) {
                    if (data55.enabled === void 0) {
                      const err166 = { instancePath: instancePath + "/sites/" + i10 + "/placements/sidebar", schemaPath: "#/properties/sites/items/properties/placements/properties/sidebar/required", keyword: "required", params: { missingProperty: "enabled" }, message: "must have required property 'enabled'" };
                      if (vErrors === null) {
                        vErrors = [err166];
                      } else {
                        vErrors.push(err166);
                      }
                      errors++;
                    }
                    if (data55.sizes === void 0) {
                      const err167 = { instancePath: instancePath + "/sites/" + i10 + "/placements/sidebar", schemaPath: "#/properties/sites/items/properties/placements/properties/sidebar/required", keyword: "required", params: { missingProperty: "sizes" }, message: "must have required property 'sizes'" };
                      if (vErrors === null) {
                        vErrors = [err167];
                      } else {
                        vErrors.push(err167);
                      }
                      errors++;
                    }
                    for (const key7 in data55) {
                      if (!(key7 === "enabled" || key7 === "sizes")) {
                        const err168 = { instancePath: instancePath + "/sites/" + i10 + "/placements/sidebar", schemaPath: "#/properties/sites/items/properties/placements/properties/sidebar/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key7 }, message: "must NOT have additional properties" };
                        if (vErrors === null) {
                          vErrors = [err168];
                        } else {
                          vErrors.push(err168);
                        }
                        errors++;
                      }
                    }
                    if (data55.enabled !== void 0) {
                      if (typeof data55.enabled !== "boolean") {
                        const err169 = { instancePath: instancePath + "/sites/" + i10 + "/placements/sidebar/enabled", schemaPath: "#/properties/sites/items/properties/placements/properties/sidebar/properties/enabled/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                        if (vErrors === null) {
                          vErrors = [err169];
                        } else {
                          vErrors.push(err169);
                        }
                        errors++;
                      }
                    }
                    if (data55.sizes !== void 0) {
                      let data57 = data55.sizes;
                      if (Array.isArray(data57)) {
                        if (data57.length > 5) {
                          const err170 = { instancePath: instancePath + "/sites/" + i10 + "/placements/sidebar/sizes", schemaPath: "#/properties/sites/items/properties/placements/properties/sidebar/properties/sizes/maxItems", keyword: "maxItems", params: { limit: 5 }, message: "must NOT have more than 5 items" };
                          if (vErrors === null) {
                            vErrors = [err170];
                          } else {
                            vErrors.push(err170);
                          }
                          errors++;
                        }
                        if (data57.length < 1) {
                          const err171 = { instancePath: instancePath + "/sites/" + i10 + "/placements/sidebar/sizes", schemaPath: "#/properties/sites/items/properties/placements/properties/sidebar/properties/sizes/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" };
                          if (vErrors === null) {
                            vErrors = [err171];
                          } else {
                            vErrors.push(err171);
                          }
                          errors++;
                        }
                        const len13 = data57.length;
                        for (let i25 = 0; i25 < len13; i25++) {
                          let data58 = data57[i25];
                          if (!(data58 === "320x50" || data58 === "468x60" || data58 === "728x90" || data58 === "320x100" || data58 === "300x250")) {
                            const err172 = { instancePath: instancePath + "/sites/" + i10 + "/placements/sidebar/sizes/" + i25, schemaPath: "#/properties/sites/items/properties/placements/properties/sidebar/properties/sizes/items/enum", keyword: "enum", params: { allowedValues: schema11.properties.sites.items.properties.placements.properties.sidebar.properties.sizes.items.enum }, message: "must be equal to one of the allowed values" };
                            if (vErrors === null) {
                              vErrors = [err172];
                            } else {
                              vErrors.push(err172);
                            }
                            errors++;
                          }
                        }
                        let i26 = data57.length;
                        let j12;
                        if (i26 > 1) {
                          outer4: for (; i26--; ) {
                            for (j12 = i26; j12--; ) {
                              if (func0(data57[i26], data57[j12])) {
                                const err173 = { instancePath: instancePath + "/sites/" + i10 + "/placements/sidebar/sizes", schemaPath: "#/properties/sites/items/properties/placements/properties/sidebar/properties/sizes/uniqueItems", keyword: "uniqueItems", params: { i: i26, j: j12 }, message: "must NOT have duplicate items (items ## " + j12 + " and " + i26 + " are identical)" };
                                if (vErrors === null) {
                                  vErrors = [err173];
                                } else {
                                  vErrors.push(err173);
                                }
                                errors++;
                                break outer4;
                              }
                            }
                          }
                        }
                      } else {
                        const err174 = { instancePath: instancePath + "/sites/" + i10 + "/placements/sidebar/sizes", schemaPath: "#/properties/sites/items/properties/placements/properties/sidebar/properties/sizes/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                        if (vErrors === null) {
                          vErrors = [err174];
                        } else {
                          vErrors.push(err174);
                        }
                        errors++;
                      }
                    }
                  } else {
                    const err175 = { instancePath: instancePath + "/sites/" + i10 + "/placements/sidebar", schemaPath: "#/properties/sites/items/properties/placements/properties/sidebar/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                    if (vErrors === null) {
                      vErrors = [err175];
                    } else {
                      vErrors.push(err175);
                    }
                    errors++;
                  }
                }
                if (data46["landing-secondary"] !== void 0) {
                  let data59 = data46["landing-secondary"];
                  if (data59 && typeof data59 == "object" && !Array.isArray(data59)) {
                    if (data59.enabled === void 0) {
                      const err176 = { instancePath: instancePath + "/sites/" + i10 + "/placements/landing-secondary", schemaPath: "#/properties/sites/items/properties/placements/properties/landing-secondary/required", keyword: "required", params: { missingProperty: "enabled" }, message: "must have required property 'enabled'" };
                      if (vErrors === null) {
                        vErrors = [err176];
                      } else {
                        vErrors.push(err176);
                      }
                      errors++;
                    }
                    if (data59.sizes === void 0) {
                      const err177 = { instancePath: instancePath + "/sites/" + i10 + "/placements/landing-secondary", schemaPath: "#/properties/sites/items/properties/placements/properties/landing-secondary/required", keyword: "required", params: { missingProperty: "sizes" }, message: "must have required property 'sizes'" };
                      if (vErrors === null) {
                        vErrors = [err177];
                      } else {
                        vErrors.push(err177);
                      }
                      errors++;
                    }
                    for (const key8 in data59) {
                      if (!(key8 === "enabled" || key8 === "sizes")) {
                        const err178 = { instancePath: instancePath + "/sites/" + i10 + "/placements/landing-secondary", schemaPath: "#/properties/sites/items/properties/placements/properties/landing-secondary/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key8 }, message: "must NOT have additional properties" };
                        if (vErrors === null) {
                          vErrors = [err178];
                        } else {
                          vErrors.push(err178);
                        }
                        errors++;
                      }
                    }
                    if (data59.enabled !== void 0) {
                      if (typeof data59.enabled !== "boolean") {
                        const err179 = { instancePath: instancePath + "/sites/" + i10 + "/placements/landing-secondary/enabled", schemaPath: "#/properties/sites/items/properties/placements/properties/landing-secondary/properties/enabled/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                        if (vErrors === null) {
                          vErrors = [err179];
                        } else {
                          vErrors.push(err179);
                        }
                        errors++;
                      }
                    }
                    if (data59.sizes !== void 0) {
                      let data61 = data59.sizes;
                      if (Array.isArray(data61)) {
                        if (data61.length > 5) {
                          const err180 = { instancePath: instancePath + "/sites/" + i10 + "/placements/landing-secondary/sizes", schemaPath: "#/properties/sites/items/properties/placements/properties/landing-secondary/properties/sizes/maxItems", keyword: "maxItems", params: { limit: 5 }, message: "must NOT have more than 5 items" };
                          if (vErrors === null) {
                            vErrors = [err180];
                          } else {
                            vErrors.push(err180);
                          }
                          errors++;
                        }
                        if (data61.length < 1) {
                          const err181 = { instancePath: instancePath + "/sites/" + i10 + "/placements/landing-secondary/sizes", schemaPath: "#/properties/sites/items/properties/placements/properties/landing-secondary/properties/sizes/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" };
                          if (vErrors === null) {
                            vErrors = [err181];
                          } else {
                            vErrors.push(err181);
                          }
                          errors++;
                        }
                        const len14 = data61.length;
                        for (let i27 = 0; i27 < len14; i27++) {
                          let data62 = data61[i27];
                          if (!(data62 === "320x50" || data62 === "468x60" || data62 === "728x90" || data62 === "320x100" || data62 === "300x250")) {
                            const err182 = { instancePath: instancePath + "/sites/" + i10 + "/placements/landing-secondary/sizes/" + i27, schemaPath: "#/properties/sites/items/properties/placements/properties/landing-secondary/properties/sizes/items/enum", keyword: "enum", params: { allowedValues: schema11.properties.sites.items.properties.placements.properties["landing-secondary"].properties.sizes.items.enum }, message: "must be equal to one of the allowed values" };
                            if (vErrors === null) {
                              vErrors = [err182];
                            } else {
                              vErrors.push(err182);
                            }
                            errors++;
                          }
                        }
                        let i28 = data61.length;
                        let j13;
                        if (i28 > 1) {
                          outer5: for (; i28--; ) {
                            for (j13 = i28; j13--; ) {
                              if (func0(data61[i28], data61[j13])) {
                                const err183 = { instancePath: instancePath + "/sites/" + i10 + "/placements/landing-secondary/sizes", schemaPath: "#/properties/sites/items/properties/placements/properties/landing-secondary/properties/sizes/uniqueItems", keyword: "uniqueItems", params: { i: i28, j: j13 }, message: "must NOT have duplicate items (items ## " + j13 + " and " + i28 + " are identical)" };
                                if (vErrors === null) {
                                  vErrors = [err183];
                                } else {
                                  vErrors.push(err183);
                                }
                                errors++;
                                break outer5;
                              }
                            }
                          }
                        }
                      } else {
                        const err184 = { instancePath: instancePath + "/sites/" + i10 + "/placements/landing-secondary/sizes", schemaPath: "#/properties/sites/items/properties/placements/properties/landing-secondary/properties/sizes/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                        if (vErrors === null) {
                          vErrors = [err184];
                        } else {
                          vErrors.push(err184);
                        }
                        errors++;
                      }
                    }
                  } else {
                    const err185 = { instancePath: instancePath + "/sites/" + i10 + "/placements/landing-secondary", schemaPath: "#/properties/sites/items/properties/placements/properties/landing-secondary/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                    if (vErrors === null) {
                      vErrors = [err185];
                    } else {
                      vErrors.push(err185);
                    }
                    errors++;
                  }
                }
                if (data46["footer-above-author"] !== void 0) {
                  let data63 = data46["footer-above-author"];
                  if (data63 && typeof data63 == "object" && !Array.isArray(data63)) {
                    if (data63.enabled === void 0) {
                      const err186 = { instancePath: instancePath + "/sites/" + i10 + "/placements/footer-above-author", schemaPath: "#/properties/sites/items/properties/placements/properties/footer-above-author/required", keyword: "required", params: { missingProperty: "enabled" }, message: "must have required property 'enabled'" };
                      if (vErrors === null) {
                        vErrors = [err186];
                      } else {
                        vErrors.push(err186);
                      }
                      errors++;
                    }
                    if (data63.sizes === void 0) {
                      const err187 = { instancePath: instancePath + "/sites/" + i10 + "/placements/footer-above-author", schemaPath: "#/properties/sites/items/properties/placements/properties/footer-above-author/required", keyword: "required", params: { missingProperty: "sizes" }, message: "must have required property 'sizes'" };
                      if (vErrors === null) {
                        vErrors = [err187];
                      } else {
                        vErrors.push(err187);
                      }
                      errors++;
                    }
                    for (const key9 in data63) {
                      if (!(key9 === "enabled" || key9 === "sizes")) {
                        const err188 = { instancePath: instancePath + "/sites/" + i10 + "/placements/footer-above-author", schemaPath: "#/properties/sites/items/properties/placements/properties/footer-above-author/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key9 }, message: "must NOT have additional properties" };
                        if (vErrors === null) {
                          vErrors = [err188];
                        } else {
                          vErrors.push(err188);
                        }
                        errors++;
                      }
                    }
                    if (data63.enabled !== void 0) {
                      if (typeof data63.enabled !== "boolean") {
                        const err189 = { instancePath: instancePath + "/sites/" + i10 + "/placements/footer-above-author/enabled", schemaPath: "#/properties/sites/items/properties/placements/properties/footer-above-author/properties/enabled/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                        if (vErrors === null) {
                          vErrors = [err189];
                        } else {
                          vErrors.push(err189);
                        }
                        errors++;
                      }
                    }
                    if (data63.sizes !== void 0) {
                      let data65 = data63.sizes;
                      if (Array.isArray(data65)) {
                        if (data65.length > 5) {
                          const err190 = { instancePath: instancePath + "/sites/" + i10 + "/placements/footer-above-author/sizes", schemaPath: "#/properties/sites/items/properties/placements/properties/footer-above-author/properties/sizes/maxItems", keyword: "maxItems", params: { limit: 5 }, message: "must NOT have more than 5 items" };
                          if (vErrors === null) {
                            vErrors = [err190];
                          } else {
                            vErrors.push(err190);
                          }
                          errors++;
                        }
                        if (data65.length < 1) {
                          const err191 = { instancePath: instancePath + "/sites/" + i10 + "/placements/footer-above-author/sizes", schemaPath: "#/properties/sites/items/properties/placements/properties/footer-above-author/properties/sizes/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" };
                          if (vErrors === null) {
                            vErrors = [err191];
                          } else {
                            vErrors.push(err191);
                          }
                          errors++;
                        }
                        const len15 = data65.length;
                        for (let i29 = 0; i29 < len15; i29++) {
                          let data66 = data65[i29];
                          if (!(data66 === "320x50" || data66 === "468x60" || data66 === "728x90" || data66 === "320x100" || data66 === "300x250")) {
                            const err192 = { instancePath: instancePath + "/sites/" + i10 + "/placements/footer-above-author/sizes/" + i29, schemaPath: "#/properties/sites/items/properties/placements/properties/footer-above-author/properties/sizes/items/enum", keyword: "enum", params: { allowedValues: schema11.properties.sites.items.properties.placements.properties["footer-above-author"].properties.sizes.items.enum }, message: "must be equal to one of the allowed values" };
                            if (vErrors === null) {
                              vErrors = [err192];
                            } else {
                              vErrors.push(err192);
                            }
                            errors++;
                          }
                        }
                        let i30 = data65.length;
                        let j14;
                        if (i30 > 1) {
                          outer6: for (; i30--; ) {
                            for (j14 = i30; j14--; ) {
                              if (func0(data65[i30], data65[j14])) {
                                const err193 = { instancePath: instancePath + "/sites/" + i10 + "/placements/footer-above-author/sizes", schemaPath: "#/properties/sites/items/properties/placements/properties/footer-above-author/properties/sizes/uniqueItems", keyword: "uniqueItems", params: { i: i30, j: j14 }, message: "must NOT have duplicate items (items ## " + j14 + " and " + i30 + " are identical)" };
                                if (vErrors === null) {
                                  vErrors = [err193];
                                } else {
                                  vErrors.push(err193);
                                }
                                errors++;
                                break outer6;
                              }
                            }
                          }
                        }
                      } else {
                        const err194 = { instancePath: instancePath + "/sites/" + i10 + "/placements/footer-above-author/sizes", schemaPath: "#/properties/sites/items/properties/placements/properties/footer-above-author/properties/sizes/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                        if (vErrors === null) {
                          vErrors = [err194];
                        } else {
                          vErrors.push(err194);
                        }
                        errors++;
                      }
                    }
                  } else {
                    const err195 = { instancePath: instancePath + "/sites/" + i10 + "/placements/footer-above-author", schemaPath: "#/properties/sites/items/properties/placements/properties/footer-above-author/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                    if (vErrors === null) {
                      vErrors = [err195];
                    } else {
                      vErrors.push(err195);
                    }
                    errors++;
                  }
                }
              } else {
                const err196 = { instancePath: instancePath + "/sites/" + i10 + "/placements", schemaPath: "#/properties/sites/items/properties/placements/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                if (vErrors === null) {
                  vErrors = [err196];
                } else {
                  vErrors.push(err196);
                }
                errors++;
              }
            }
            if (data26.googleUnits !== void 0) {
              let data67 = data26.googleUnits;
              if (Array.isArray(data67)) {
                if (data67.length > 30) {
                  const err197 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits", schemaPath: "#/properties/sites/items/properties/googleUnits/maxItems", keyword: "maxItems", params: { limit: 30 }, message: "must NOT have more than 30 items" };
                  if (vErrors === null) {
                    vErrors = [err197];
                  } else {
                    vErrors.push(err197);
                  }
                  errors++;
                }
                if (data67.length < 0) {
                  const err198 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits", schemaPath: "#/properties/sites/items/properties/googleUnits/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" };
                  if (vErrors === null) {
                    vErrors = [err198];
                  } else {
                    vErrors.push(err198);
                  }
                  errors++;
                }
                const len16 = data67.length;
                for (let i31 = 0; i31 < len16; i31++) {
                  let data68 = data67[i31];
                  if (data68 && typeof data68 == "object" && !Array.isArray(data68)) {
                    if (data68.id === void 0) {
                      const err199 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31, schemaPath: "#/properties/sites/items/properties/googleUnits/items/required", keyword: "required", params: { missingProperty: "id" }, message: "must have required property 'id'" };
                      if (vErrors === null) {
                        vErrors = [err199];
                      } else {
                        vErrors.push(err199);
                      }
                      errors++;
                    }
                    if (data68.name === void 0) {
                      const err200 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31, schemaPath: "#/properties/sites/items/properties/googleUnits/items/required", keyword: "required", params: { missingProperty: "name" }, message: "must have required property 'name'" };
                      if (vErrors === null) {
                        vErrors = [err200];
                      } else {
                        vErrors.push(err200);
                      }
                      errors++;
                    }
                    if (data68.description === void 0) {
                      const err201 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31, schemaPath: "#/properties/sites/items/properties/googleUnits/items/required", keyword: "required", params: { missingProperty: "description" }, message: "must have required property 'description'" };
                      if (vErrors === null) {
                        vErrors = [err201];
                      } else {
                        vErrors.push(err201);
                      }
                      errors++;
                    }
                    if (data68.enabled === void 0) {
                      const err202 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31, schemaPath: "#/properties/sites/items/properties/googleUnits/items/required", keyword: "required", params: { missingProperty: "enabled" }, message: "must have required property 'enabled'" };
                      if (vErrors === null) {
                        vErrors = [err202];
                      } else {
                        vErrors.push(err202);
                      }
                      errors++;
                    }
                    if (data68.weight === void 0) {
                      const err203 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31, schemaPath: "#/properties/sites/items/properties/googleUnits/items/required", keyword: "required", params: { missingProperty: "weight" }, message: "must have required property 'weight'" };
                      if (vErrors === null) {
                        vErrors = [err203];
                      } else {
                        vErrors.push(err203);
                      }
                      errors++;
                    }
                    if (data68.start === void 0) {
                      const err204 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31, schemaPath: "#/properties/sites/items/properties/googleUnits/items/required", keyword: "required", params: { missingProperty: "start" }, message: "must have required property 'start'" };
                      if (vErrors === null) {
                        vErrors = [err204];
                      } else {
                        vErrors.push(err204);
                      }
                      errors++;
                    }
                    if (data68.end === void 0) {
                      const err205 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31, schemaPath: "#/properties/sites/items/properties/googleUnits/items/required", keyword: "required", params: { missingProperty: "end" }, message: "must have required property 'end'" };
                      if (vErrors === null) {
                        vErrors = [err205];
                      } else {
                        vErrors.push(err205);
                      }
                      errors++;
                    }
                    if (data68.minScreen === void 0) {
                      const err206 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31, schemaPath: "#/properties/sites/items/properties/googleUnits/items/required", keyword: "required", params: { missingProperty: "minScreen" }, message: "must have required property 'minScreen'" };
                      if (vErrors === null) {
                        vErrors = [err206];
                      } else {
                        vErrors.push(err206);
                      }
                      errors++;
                    }
                    if (data68.maxScreen === void 0) {
                      const err207 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31, schemaPath: "#/properties/sites/items/properties/googleUnits/items/required", keyword: "required", params: { missingProperty: "maxScreen" }, message: "must have required property 'maxScreen'" };
                      if (vErrors === null) {
                        vErrors = [err207];
                      } else {
                        vErrors.push(err207);
                      }
                      errors++;
                    }
                    if (data68.placement === void 0) {
                      const err208 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31, schemaPath: "#/properties/sites/items/properties/googleUnits/items/required", keyword: "required", params: { missingProperty: "placement" }, message: "must have required property 'placement'" };
                      if (vErrors === null) {
                        vErrors = [err208];
                      } else {
                        vErrors.push(err208);
                      }
                      errors++;
                    }
                    if (data68.slot === void 0) {
                      const err209 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31, schemaPath: "#/properties/sites/items/properties/googleUnits/items/required", keyword: "required", params: { missingProperty: "slot" }, message: "must have required property 'slot'" };
                      if (vErrors === null) {
                        vErrors = [err209];
                      } else {
                        vErrors.push(err209);
                      }
                      errors++;
                    }
                    if (data68.size === void 0) {
                      const err210 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31, schemaPath: "#/properties/sites/items/properties/googleUnits/items/required", keyword: "required", params: { missingProperty: "size" }, message: "must have required property 'size'" };
                      if (vErrors === null) {
                        vErrors = [err210];
                      } else {
                        vErrors.push(err210);
                      }
                      errors++;
                    }
                    if (data68.format === void 0) {
                      const err211 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31, schemaPath: "#/properties/sites/items/properties/googleUnits/items/required", keyword: "required", params: { missingProperty: "format" }, message: "must have required property 'format'" };
                      if (vErrors === null) {
                        vErrors = [err211];
                      } else {
                        vErrors.push(err211);
                      }
                      errors++;
                    }
                    for (const key10 in data68) {
                      if (!func2.call(schema11.properties.sites.items.properties.googleUnits.items.properties, key10)) {
                        const err212 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31, schemaPath: "#/properties/sites/items/properties/googleUnits/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key10 }, message: "must NOT have additional properties" };
                        if (vErrors === null) {
                          vErrors = [err212];
                        } else {
                          vErrors.push(err212);
                        }
                        errors++;
                      }
                    }
                    if (data68.id !== void 0) {
                      let data69 = data68.id;
                      if (typeof data69 === "string") {
                        if (!pattern1.test(data69)) {
                          const err213 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/id", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/id/pattern", keyword: "pattern", params: { pattern: "^[a-z0-9][a-z0-9-]{0,63}$" }, message: 'must match pattern "^[a-z0-9][a-z0-9-]{0,63}$"' };
                          if (vErrors === null) {
                            vErrors = [err213];
                          } else {
                            vErrors.push(err213);
                          }
                          errors++;
                        }
                      } else {
                        const err214 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/id", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                          vErrors = [err214];
                        } else {
                          vErrors.push(err214);
                        }
                        errors++;
                      }
                    }
                    if (data68.name !== void 0) {
                      let data70 = data68.name;
                      if (typeof data70 === "string") {
                        if (func4(data70) > 100) {
                          const err215 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/name", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/name/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" };
                          if (vErrors === null) {
                            vErrors = [err215];
                          } else {
                            vErrors.push(err215);
                          }
                          errors++;
                        }
                        if (func4(data70) < 1) {
                          const err216 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/name", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/name/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                          if (vErrors === null) {
                            vErrors = [err216];
                          } else {
                            vErrors.push(err216);
                          }
                          errors++;
                        }
                      } else {
                        const err217 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/name", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/name/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                          vErrors = [err217];
                        } else {
                          vErrors.push(err217);
                        }
                        errors++;
                      }
                    }
                    if (data68.description !== void 0) {
                      let data71 = data68.description;
                      if (typeof data71 === "string") {
                        if (func4(data71) > 500) {
                          const err218 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/description", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/description/maxLength", keyword: "maxLength", params: { limit: 500 }, message: "must NOT have more than 500 characters" };
                          if (vErrors === null) {
                            vErrors = [err218];
                          } else {
                            vErrors.push(err218);
                          }
                          errors++;
                        }
                        if (func4(data71) < 1) {
                          const err219 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/description", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/description/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                          if (vErrors === null) {
                            vErrors = [err219];
                          } else {
                            vErrors.push(err219);
                          }
                          errors++;
                        }
                      } else {
                        const err220 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/description", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/description/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                          vErrors = [err220];
                        } else {
                          vErrors.push(err220);
                        }
                        errors++;
                      }
                    }
                    if (data68.enabled !== void 0) {
                      if (typeof data68.enabled !== "boolean") {
                        const err221 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/enabled", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/enabled/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                        if (vErrors === null) {
                          vErrors = [err221];
                        } else {
                          vErrors.push(err221);
                        }
                        errors++;
                      }
                    }
                    if (data68.weight !== void 0) {
                      let data73 = data68.weight;
                      if (typeof data73 == "number" && isFinite(data73)) {
                        if (data73 > 1e6 || isNaN(data73)) {
                          const err222 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/weight", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/weight/maximum", keyword: "maximum", params: { comparison: "<=", limit: 1e6 }, message: "must be <= 1000000" };
                          if (vErrors === null) {
                            vErrors = [err222];
                          } else {
                            vErrors.push(err222);
                          }
                          errors++;
                        }
                        if (data73 < 0 || isNaN(data73)) {
                          const err223 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/weight", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/weight/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" };
                          if (vErrors === null) {
                            vErrors = [err223];
                          } else {
                            vErrors.push(err223);
                          }
                          errors++;
                        }
                      } else {
                        const err224 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/weight", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/weight/type", keyword: "type", params: { type: "number" }, message: "must be number" };
                        if (vErrors === null) {
                          vErrors = [err224];
                        } else {
                          vErrors.push(err224);
                        }
                        errors++;
                      }
                    }
                    if (data68.start !== void 0) {
                      let data74 = data68.start;
                      if (typeof data74 === "string") {
                        if (func4(data74) > 30) {
                          const err225 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/start", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/start/maxLength", keyword: "maxLength", params: { limit: 30 }, message: "must NOT have more than 30 characters" };
                          if (vErrors === null) {
                            vErrors = [err225];
                          } else {
                            vErrors.push(err225);
                          }
                          errors++;
                        }
                        if (func4(data74) < 1) {
                          const err226 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/start", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/start/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                          if (vErrors === null) {
                            vErrors = [err226];
                          } else {
                            vErrors.push(err226);
                          }
                          errors++;
                        }
                      } else {
                        const err227 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/start", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/start/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                          vErrors = [err227];
                        } else {
                          vErrors.push(err227);
                        }
                        errors++;
                      }
                    }
                    if (data68.end !== void 0) {
                      let data75 = data68.end;
                      if (typeof data75 === "string") {
                        if (func4(data75) > 30) {
                          const err228 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/end", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/end/maxLength", keyword: "maxLength", params: { limit: 30 }, message: "must NOT have more than 30 characters" };
                          if (vErrors === null) {
                            vErrors = [err228];
                          } else {
                            vErrors.push(err228);
                          }
                          errors++;
                        }
                        if (func4(data75) < 1) {
                          const err229 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/end", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/end/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                          if (vErrors === null) {
                            vErrors = [err229];
                          } else {
                            vErrors.push(err229);
                          }
                          errors++;
                        }
                      } else {
                        const err230 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/end", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/end/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                          vErrors = [err230];
                        } else {
                          vErrors.push(err230);
                        }
                        errors++;
                      }
                    }
                    if (data68.minScreen !== void 0) {
                      let data76 = data68.minScreen;
                      if (!(typeof data76 == "number" && (!(data76 % 1) && !isNaN(data76)) && isFinite(data76))) {
                        const err231 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/minScreen", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/minScreen/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                        if (vErrors === null) {
                          vErrors = [err231];
                        } else {
                          vErrors.push(err231);
                        }
                        errors++;
                      }
                      if (typeof data76 == "number" && isFinite(data76)) {
                        if (data76 > 1e4 || isNaN(data76)) {
                          const err232 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/minScreen", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/minScreen/maximum", keyword: "maximum", params: { comparison: "<=", limit: 1e4 }, message: "must be <= 10000" };
                          if (vErrors === null) {
                            vErrors = [err232];
                          } else {
                            vErrors.push(err232);
                          }
                          errors++;
                        }
                        if (data76 < 0 || isNaN(data76)) {
                          const err233 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/minScreen", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/minScreen/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" };
                          if (vErrors === null) {
                            vErrors = [err233];
                          } else {
                            vErrors.push(err233);
                          }
                          errors++;
                        }
                      }
                    }
                    if (data68.maxScreen !== void 0) {
                      let data77 = data68.maxScreen;
                      if (!(typeof data77 == "number" && (!(data77 % 1) && !isNaN(data77)) && isFinite(data77))) {
                        const err234 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/maxScreen", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/maxScreen/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                        if (vErrors === null) {
                          vErrors = [err234];
                        } else {
                          vErrors.push(err234);
                        }
                        errors++;
                      }
                      if (typeof data77 == "number" && isFinite(data77)) {
                        if (data77 > 1e4 || isNaN(data77)) {
                          const err235 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/maxScreen", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/maxScreen/maximum", keyword: "maximum", params: { comparison: "<=", limit: 1e4 }, message: "must be <= 10000" };
                          if (vErrors === null) {
                            vErrors = [err235];
                          } else {
                            vErrors.push(err235);
                          }
                          errors++;
                        }
                        if (data77 < 0 || isNaN(data77)) {
                          const err236 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/maxScreen", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/maxScreen/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" };
                          if (vErrors === null) {
                            vErrors = [err236];
                          } else {
                            vErrors.push(err236);
                          }
                          errors++;
                        }
                      }
                    }
                    if (data68.placement !== void 0) {
                      let data78 = data68.placement;
                      if (!(data78 === "content-bottom" || data78 === "article-middle" || data78 === "sidebar" || data78 === "landing-secondary" || data78 === "footer-above-author")) {
                        const err237 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/placement", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/placement/enum", keyword: "enum", params: { allowedValues: schema11.properties.sites.items.properties.googleUnits.items.properties.placement.enum }, message: "must be equal to one of the allowed values" };
                        if (vErrors === null) {
                          vErrors = [err237];
                        } else {
                          vErrors.push(err237);
                        }
                        errors++;
                      }
                    }
                    if (data68.slot !== void 0) {
                      let data79 = data68.slot;
                      if (typeof data79 === "string") {
                        if (!pattern7.test(data79)) {
                          const err238 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/slot", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/slot/pattern", keyword: "pattern", params: { pattern: "^[0-9]{6,20}$" }, message: 'must match pattern "^[0-9]{6,20}$"' };
                          if (vErrors === null) {
                            vErrors = [err238];
                          } else {
                            vErrors.push(err238);
                          }
                          errors++;
                        }
                      } else {
                        const err239 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/slot", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/slot/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                          vErrors = [err239];
                        } else {
                          vErrors.push(err239);
                        }
                        errors++;
                      }
                    }
                    if (data68.size !== void 0) {
                      let data80 = data68.size;
                      if (!(data80 === "320x50" || data80 === "468x60" || data80 === "728x90" || data80 === "320x100" || data80 === "300x250")) {
                        const err240 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/size", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/size/enum", keyword: "enum", params: { allowedValues: schema11.properties.sites.items.properties.googleUnits.items.properties.size.enum }, message: "must be equal to one of the allowed values" };
                        if (vErrors === null) {
                          vErrors = [err240];
                        } else {
                          vErrors.push(err240);
                        }
                        errors++;
                      }
                    }
                    if (data68.format !== void 0) {
                      let data81 = data68.format;
                      if (!(data81 === "fixed" || data81 === "responsive-horizontal")) {
                        const err241 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31 + "/format", schemaPath: "#/properties/sites/items/properties/googleUnits/items/properties/format/enum", keyword: "enum", params: { allowedValues: schema11.properties.sites.items.properties.googleUnits.items.properties.format.enum }, message: "must be equal to one of the allowed values" };
                        if (vErrors === null) {
                          vErrors = [err241];
                        } else {
                          vErrors.push(err241);
                        }
                        errors++;
                      }
                    }
                  } else {
                    const err242 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits/" + i31, schemaPath: "#/properties/sites/items/properties/googleUnits/items/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                    if (vErrors === null) {
                      vErrors = [err242];
                    } else {
                      vErrors.push(err242);
                    }
                    errors++;
                  }
                }
                let i32 = data67.length;
                let j15;
                if (i32 > 1) {
                  outer7: for (; i32--; ) {
                    for (j15 = i32; j15--; ) {
                      if (func0(data67[i32], data67[j15])) {
                        const err243 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits", schemaPath: "#/properties/sites/items/properties/googleUnits/uniqueItems", keyword: "uniqueItems", params: { i: i32, j: j15 }, message: "must NOT have duplicate items (items ## " + j15 + " and " + i32 + " are identical)" };
                        if (vErrors === null) {
                          vErrors = [err243];
                        } else {
                          vErrors.push(err243);
                        }
                        errors++;
                        break outer7;
                      }
                    }
                  }
                }
              } else {
                const err244 = { instancePath: instancePath + "/sites/" + i10 + "/googleUnits", schemaPath: "#/properties/sites/items/properties/googleUnits/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                if (vErrors === null) {
                  vErrors = [err244];
                } else {
                  vErrors.push(err244);
                }
                errors++;
              }
            }
          } else {
            const err245 = { instancePath: instancePath + "/sites/" + i10, schemaPath: "#/properties/sites/items/type", keyword: "type", params: { type: "object" }, message: "must be object" };
            if (vErrors === null) {
              vErrors = [err245];
            } else {
              vErrors.push(err245);
            }
            errors++;
          }
        }
        let i33 = data25.length;
        let j16;
        if (i33 > 1) {
          outer8: for (; i33--; ) {
            for (j16 = i33; j16--; ) {
              if (func0(data25[i33], data25[j16])) {
                const err246 = { instancePath: instancePath + "/sites", schemaPath: "#/properties/sites/uniqueItems", keyword: "uniqueItems", params: { i: i33, j: j16 }, message: "must NOT have duplicate items (items ## " + j16 + " and " + i33 + " are identical)" };
                if (vErrors === null) {
                  vErrors = [err246];
                } else {
                  vErrors.push(err246);
                }
                errors++;
                break outer8;
              }
            }
          }
        }
      } else {
        const err247 = { instancePath: instancePath + "/sites", schemaPath: "#/properties/sites/type", keyword: "type", params: { type: "array" }, message: "must be array" };
        if (vErrors === null) {
          vErrors = [err247];
        } else {
          vErrors.push(err247);
        }
        errors++;
      }
    }
    if (data.campaigns !== void 0) {
      let data82 = data.campaigns;
      if (Array.isArray(data82)) {
        if (data82.length > 1e3) {
          const err248 = { instancePath: instancePath + "/campaigns", schemaPath: "#/properties/campaigns/maxItems", keyword: "maxItems", params: { limit: 1e3 }, message: "must NOT have more than 1000 items" };
          if (vErrors === null) {
            vErrors = [err248];
          } else {
            vErrors.push(err248);
          }
          errors++;
        }
        if (data82.length < 0) {
          const err249 = { instancePath: instancePath + "/campaigns", schemaPath: "#/properties/campaigns/minItems", keyword: "minItems", params: { limit: 0 }, message: "must NOT have fewer than 0 items" };
          if (vErrors === null) {
            vErrors = [err249];
          } else {
            vErrors.push(err249);
          }
          errors++;
        }
        const len17 = data82.length;
        for (let i34 = 0; i34 < len17; i34++) {
          let data83 = data82[i34];
          if (data83 && typeof data83 == "object" && !Array.isArray(data83)) {
            if (data83.id === void 0) {
              const err250 = { instancePath: instancePath + "/campaigns/" + i34, schemaPath: "#/properties/campaigns/items/required", keyword: "required", params: { missingProperty: "id" }, message: "must have required property 'id'" };
              if (vErrors === null) {
                vErrors = [err250];
              } else {
                vErrors.push(err250);
              }
              errors++;
            }
            if (data83.name === void 0) {
              const err251 = { instancePath: instancePath + "/campaigns/" + i34, schemaPath: "#/properties/campaigns/items/required", keyword: "required", params: { missingProperty: "name" }, message: "must have required property 'name'" };
              if (vErrors === null) {
                vErrors = [err251];
              } else {
                vErrors.push(err251);
              }
              errors++;
            }
            if (data83.description === void 0) {
              const err252 = { instancePath: instancePath + "/campaigns/" + i34, schemaPath: "#/properties/campaigns/items/required", keyword: "required", params: { missingProperty: "description" }, message: "must have required property 'description'" };
              if (vErrors === null) {
                vErrors = [err252];
              } else {
                vErrors.push(err252);
              }
              errors++;
            }
            if (data83.enabled === void 0) {
              const err253 = { instancePath: instancePath + "/campaigns/" + i34, schemaPath: "#/properties/campaigns/items/required", keyword: "required", params: { missingProperty: "enabled" }, message: "must have required property 'enabled'" };
              if (vErrors === null) {
                vErrors = [err253];
              } else {
                vErrors.push(err253);
              }
              errors++;
            }
            if (data83.weight === void 0) {
              const err254 = { instancePath: instancePath + "/campaigns/" + i34, schemaPath: "#/properties/campaigns/items/required", keyword: "required", params: { missingProperty: "weight" }, message: "must have required property 'weight'" };
              if (vErrors === null) {
                vErrors = [err254];
              } else {
                vErrors.push(err254);
              }
              errors++;
            }
            if (data83.start === void 0) {
              const err255 = { instancePath: instancePath + "/campaigns/" + i34, schemaPath: "#/properties/campaigns/items/required", keyword: "required", params: { missingProperty: "start" }, message: "must have required property 'start'" };
              if (vErrors === null) {
                vErrors = [err255];
              } else {
                vErrors.push(err255);
              }
              errors++;
            }
            if (data83.end === void 0) {
              const err256 = { instancePath: instancePath + "/campaigns/" + i34, schemaPath: "#/properties/campaigns/items/required", keyword: "required", params: { missingProperty: "end" }, message: "must have required property 'end'" };
              if (vErrors === null) {
                vErrors = [err256];
              } else {
                vErrors.push(err256);
              }
              errors++;
            }
            if (data83.minScreen === void 0) {
              const err257 = { instancePath: instancePath + "/campaigns/" + i34, schemaPath: "#/properties/campaigns/items/required", keyword: "required", params: { missingProperty: "minScreen" }, message: "must have required property 'minScreen'" };
              if (vErrors === null) {
                vErrors = [err257];
              } else {
                vErrors.push(err257);
              }
              errors++;
            }
            if (data83.maxScreen === void 0) {
              const err258 = { instancePath: instancePath + "/campaigns/" + i34, schemaPath: "#/properties/campaigns/items/required", keyword: "required", params: { missingProperty: "maxScreen" }, message: "must have required property 'maxScreen'" };
              if (vErrors === null) {
                vErrors = [err258];
              } else {
                vErrors.push(err258);
              }
              errors++;
            }
            if (data83.category === void 0) {
              const err259 = { instancePath: instancePath + "/campaigns/" + i34, schemaPath: "#/properties/campaigns/items/required", keyword: "required", params: { missingProperty: "category" }, message: "must have required property 'category'" };
              if (vErrors === null) {
                vErrors = [err259];
              } else {
                vErrors.push(err259);
              }
              errors++;
            }
            if (data83.sites === void 0) {
              const err260 = { instancePath: instancePath + "/campaigns/" + i34, schemaPath: "#/properties/campaigns/items/required", keyword: "required", params: { missingProperty: "sites" }, message: "must have required property 'sites'" };
              if (vErrors === null) {
                vErrors = [err260];
              } else {
                vErrors.push(err260);
              }
              errors++;
            }
            if (data83.placements === void 0) {
              const err261 = { instancePath: instancePath + "/campaigns/" + i34, schemaPath: "#/properties/campaigns/items/required", keyword: "required", params: { missingProperty: "placements" }, message: "must have required property 'placements'" };
              if (vErrors === null) {
                vErrors = [err261];
              } else {
                vErrors.push(err261);
              }
              errors++;
            }
            if (data83.variants === void 0) {
              const err262 = { instancePath: instancePath + "/campaigns/" + i34, schemaPath: "#/properties/campaigns/items/required", keyword: "required", params: { missingProperty: "variants" }, message: "must have required property 'variants'" };
              if (vErrors === null) {
                vErrors = [err262];
              } else {
                vErrors.push(err262);
              }
              errors++;
            }
            if (data83.alt === void 0) {
              const err263 = { instancePath: instancePath + "/campaigns/" + i34, schemaPath: "#/properties/campaigns/items/required", keyword: "required", params: { missingProperty: "alt" }, message: "must have required property 'alt'" };
              if (vErrors === null) {
                vErrors = [err263];
              } else {
                vErrors.push(err263);
              }
              errors++;
            }
            if (data83.destination === void 0) {
              const err264 = { instancePath: instancePath + "/campaigns/" + i34, schemaPath: "#/properties/campaigns/items/required", keyword: "required", params: { missingProperty: "destination" }, message: "must have required property 'destination'" };
              if (vErrors === null) {
                vErrors = [err264];
              } else {
                vErrors.push(err264);
              }
              errors++;
            }
            if (data83.disclosure === void 0) {
              const err265 = { instancePath: instancePath + "/campaigns/" + i34, schemaPath: "#/properties/campaigns/items/required", keyword: "required", params: { missingProperty: "disclosure" }, message: "must have required property 'disclosure'" };
              if (vErrors === null) {
                vErrors = [err265];
              } else {
                vErrors.push(err265);
              }
              errors++;
            }
            for (const key11 in data83) {
              if (!func2.call(schema11.properties.campaigns.items.properties, key11)) {
                const err266 = { instancePath: instancePath + "/campaigns/" + i34, schemaPath: "#/properties/campaigns/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key11 }, message: "must NOT have additional properties" };
                if (vErrors === null) {
                  vErrors = [err266];
                } else {
                  vErrors.push(err266);
                }
                errors++;
              }
            }
            if (data83.id !== void 0) {
              let data84 = data83.id;
              if (typeof data84 === "string") {
                if (!pattern1.test(data84)) {
                  const err267 = { instancePath: instancePath + "/campaigns/" + i34 + "/id", schemaPath: "#/properties/campaigns/items/properties/id/pattern", keyword: "pattern", params: { pattern: "^[a-z0-9][a-z0-9-]{0,63}$" }, message: 'must match pattern "^[a-z0-9][a-z0-9-]{0,63}$"' };
                  if (vErrors === null) {
                    vErrors = [err267];
                  } else {
                    vErrors.push(err267);
                  }
                  errors++;
                }
              } else {
                const err268 = { instancePath: instancePath + "/campaigns/" + i34 + "/id", schemaPath: "#/properties/campaigns/items/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                if (vErrors === null) {
                  vErrors = [err268];
                } else {
                  vErrors.push(err268);
                }
                errors++;
              }
            }
            if (data83.name !== void 0) {
              let data85 = data83.name;
              if (typeof data85 === "string") {
                if (func4(data85) > 100) {
                  const err269 = { instancePath: instancePath + "/campaigns/" + i34 + "/name", schemaPath: "#/properties/campaigns/items/properties/name/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" };
                  if (vErrors === null) {
                    vErrors = [err269];
                  } else {
                    vErrors.push(err269);
                  }
                  errors++;
                }
                if (func4(data85) < 1) {
                  const err270 = { instancePath: instancePath + "/campaigns/" + i34 + "/name", schemaPath: "#/properties/campaigns/items/properties/name/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                  if (vErrors === null) {
                    vErrors = [err270];
                  } else {
                    vErrors.push(err270);
                  }
                  errors++;
                }
              } else {
                const err271 = { instancePath: instancePath + "/campaigns/" + i34 + "/name", schemaPath: "#/properties/campaigns/items/properties/name/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                if (vErrors === null) {
                  vErrors = [err271];
                } else {
                  vErrors.push(err271);
                }
                errors++;
              }
            }
            if (data83.description !== void 0) {
              let data86 = data83.description;
              if (typeof data86 === "string") {
                if (func4(data86) > 500) {
                  const err272 = { instancePath: instancePath + "/campaigns/" + i34 + "/description", schemaPath: "#/properties/campaigns/items/properties/description/maxLength", keyword: "maxLength", params: { limit: 500 }, message: "must NOT have more than 500 characters" };
                  if (vErrors === null) {
                    vErrors = [err272];
                  } else {
                    vErrors.push(err272);
                  }
                  errors++;
                }
                if (func4(data86) < 1) {
                  const err273 = { instancePath: instancePath + "/campaigns/" + i34 + "/description", schemaPath: "#/properties/campaigns/items/properties/description/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                  if (vErrors === null) {
                    vErrors = [err273];
                  } else {
                    vErrors.push(err273);
                  }
                  errors++;
                }
              } else {
                const err274 = { instancePath: instancePath + "/campaigns/" + i34 + "/description", schemaPath: "#/properties/campaigns/items/properties/description/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                if (vErrors === null) {
                  vErrors = [err274];
                } else {
                  vErrors.push(err274);
                }
                errors++;
              }
            }
            if (data83.enabled !== void 0) {
              if (typeof data83.enabled !== "boolean") {
                const err275 = { instancePath: instancePath + "/campaigns/" + i34 + "/enabled", schemaPath: "#/properties/campaigns/items/properties/enabled/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                if (vErrors === null) {
                  vErrors = [err275];
                } else {
                  vErrors.push(err275);
                }
                errors++;
              }
            }
            if (data83.weight !== void 0) {
              let data88 = data83.weight;
              if (typeof data88 == "number" && isFinite(data88)) {
                if (data88 > 1e6 || isNaN(data88)) {
                  const err276 = { instancePath: instancePath + "/campaigns/" + i34 + "/weight", schemaPath: "#/properties/campaigns/items/properties/weight/maximum", keyword: "maximum", params: { comparison: "<=", limit: 1e6 }, message: "must be <= 1000000" };
                  if (vErrors === null) {
                    vErrors = [err276];
                  } else {
                    vErrors.push(err276);
                  }
                  errors++;
                }
                if (data88 < 0 || isNaN(data88)) {
                  const err277 = { instancePath: instancePath + "/campaigns/" + i34 + "/weight", schemaPath: "#/properties/campaigns/items/properties/weight/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" };
                  if (vErrors === null) {
                    vErrors = [err277];
                  } else {
                    vErrors.push(err277);
                  }
                  errors++;
                }
              } else {
                const err278 = { instancePath: instancePath + "/campaigns/" + i34 + "/weight", schemaPath: "#/properties/campaigns/items/properties/weight/type", keyword: "type", params: { type: "number" }, message: "must be number" };
                if (vErrors === null) {
                  vErrors = [err278];
                } else {
                  vErrors.push(err278);
                }
                errors++;
              }
            }
            if (data83.start !== void 0) {
              let data89 = data83.start;
              if (typeof data89 === "string") {
                if (func4(data89) > 30) {
                  const err279 = { instancePath: instancePath + "/campaigns/" + i34 + "/start", schemaPath: "#/properties/campaigns/items/properties/start/maxLength", keyword: "maxLength", params: { limit: 30 }, message: "must NOT have more than 30 characters" };
                  if (vErrors === null) {
                    vErrors = [err279];
                  } else {
                    vErrors.push(err279);
                  }
                  errors++;
                }
                if (func4(data89) < 1) {
                  const err280 = { instancePath: instancePath + "/campaigns/" + i34 + "/start", schemaPath: "#/properties/campaigns/items/properties/start/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                  if (vErrors === null) {
                    vErrors = [err280];
                  } else {
                    vErrors.push(err280);
                  }
                  errors++;
                }
              } else {
                const err281 = { instancePath: instancePath + "/campaigns/" + i34 + "/start", schemaPath: "#/properties/campaigns/items/properties/start/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                if (vErrors === null) {
                  vErrors = [err281];
                } else {
                  vErrors.push(err281);
                }
                errors++;
              }
            }
            if (data83.end !== void 0) {
              let data90 = data83.end;
              if (typeof data90 === "string") {
                if (func4(data90) > 30) {
                  const err282 = { instancePath: instancePath + "/campaigns/" + i34 + "/end", schemaPath: "#/properties/campaigns/items/properties/end/maxLength", keyword: "maxLength", params: { limit: 30 }, message: "must NOT have more than 30 characters" };
                  if (vErrors === null) {
                    vErrors = [err282];
                  } else {
                    vErrors.push(err282);
                  }
                  errors++;
                }
                if (func4(data90) < 1) {
                  const err283 = { instancePath: instancePath + "/campaigns/" + i34 + "/end", schemaPath: "#/properties/campaigns/items/properties/end/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                  if (vErrors === null) {
                    vErrors = [err283];
                  } else {
                    vErrors.push(err283);
                  }
                  errors++;
                }
              } else {
                const err284 = { instancePath: instancePath + "/campaigns/" + i34 + "/end", schemaPath: "#/properties/campaigns/items/properties/end/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                if (vErrors === null) {
                  vErrors = [err284];
                } else {
                  vErrors.push(err284);
                }
                errors++;
              }
            }
            if (data83.minScreen !== void 0) {
              let data91 = data83.minScreen;
              if (!(typeof data91 == "number" && (!(data91 % 1) && !isNaN(data91)) && isFinite(data91))) {
                const err285 = { instancePath: instancePath + "/campaigns/" + i34 + "/minScreen", schemaPath: "#/properties/campaigns/items/properties/minScreen/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                if (vErrors === null) {
                  vErrors = [err285];
                } else {
                  vErrors.push(err285);
                }
                errors++;
              }
              if (typeof data91 == "number" && isFinite(data91)) {
                if (data91 > 1e4 || isNaN(data91)) {
                  const err286 = { instancePath: instancePath + "/campaigns/" + i34 + "/minScreen", schemaPath: "#/properties/campaigns/items/properties/minScreen/maximum", keyword: "maximum", params: { comparison: "<=", limit: 1e4 }, message: "must be <= 10000" };
                  if (vErrors === null) {
                    vErrors = [err286];
                  } else {
                    vErrors.push(err286);
                  }
                  errors++;
                }
                if (data91 < 0 || isNaN(data91)) {
                  const err287 = { instancePath: instancePath + "/campaigns/" + i34 + "/minScreen", schemaPath: "#/properties/campaigns/items/properties/minScreen/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" };
                  if (vErrors === null) {
                    vErrors = [err287];
                  } else {
                    vErrors.push(err287);
                  }
                  errors++;
                }
              }
            }
            if (data83.maxScreen !== void 0) {
              let data92 = data83.maxScreen;
              if (!(typeof data92 == "number" && (!(data92 % 1) && !isNaN(data92)) && isFinite(data92))) {
                const err288 = { instancePath: instancePath + "/campaigns/" + i34 + "/maxScreen", schemaPath: "#/properties/campaigns/items/properties/maxScreen/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                if (vErrors === null) {
                  vErrors = [err288];
                } else {
                  vErrors.push(err288);
                }
                errors++;
              }
              if (typeof data92 == "number" && isFinite(data92)) {
                if (data92 > 1e4 || isNaN(data92)) {
                  const err289 = { instancePath: instancePath + "/campaigns/" + i34 + "/maxScreen", schemaPath: "#/properties/campaigns/items/properties/maxScreen/maximum", keyword: "maximum", params: { comparison: "<=", limit: 1e4 }, message: "must be <= 10000" };
                  if (vErrors === null) {
                    vErrors = [err289];
                  } else {
                    vErrors.push(err289);
                  }
                  errors++;
                }
                if (data92 < 0 || isNaN(data92)) {
                  const err290 = { instancePath: instancePath + "/campaigns/" + i34 + "/maxScreen", schemaPath: "#/properties/campaigns/items/properties/maxScreen/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" };
                  if (vErrors === null) {
                    vErrors = [err290];
                  } else {
                    vErrors.push(err290);
                  }
                  errors++;
                }
              }
            }
            if (data83.category !== void 0) {
              let data93 = data83.category;
              if (typeof data93 === "string") {
                if (!pattern1.test(data93)) {
                  const err291 = { instancePath: instancePath + "/campaigns/" + i34 + "/category", schemaPath: "#/properties/campaigns/items/properties/category/pattern", keyword: "pattern", params: { pattern: "^[a-z0-9][a-z0-9-]{0,63}$" }, message: 'must match pattern "^[a-z0-9][a-z0-9-]{0,63}$"' };
                  if (vErrors === null) {
                    vErrors = [err291];
                  } else {
                    vErrors.push(err291);
                  }
                  errors++;
                }
              } else {
                const err292 = { instancePath: instancePath + "/campaigns/" + i34 + "/category", schemaPath: "#/properties/campaigns/items/properties/category/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                if (vErrors === null) {
                  vErrors = [err292];
                } else {
                  vErrors.push(err292);
                }
                errors++;
              }
            }
            if (data83.sites !== void 0) {
              let data94 = data83.sites;
              if (Array.isArray(data94)) {
                if (data94.length > 500) {
                  const err293 = { instancePath: instancePath + "/campaigns/" + i34 + "/sites", schemaPath: "#/properties/campaigns/items/properties/sites/maxItems", keyword: "maxItems", params: { limit: 500 }, message: "must NOT have more than 500 items" };
                  if (vErrors === null) {
                    vErrors = [err293];
                  } else {
                    vErrors.push(err293);
                  }
                  errors++;
                }
                if (data94.length < 1) {
                  const err294 = { instancePath: instancePath + "/campaigns/" + i34 + "/sites", schemaPath: "#/properties/campaigns/items/properties/sites/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" };
                  if (vErrors === null) {
                    vErrors = [err294];
                  } else {
                    vErrors.push(err294);
                  }
                  errors++;
                }
                const len18 = data94.length;
                for (let i35 = 0; i35 < len18; i35++) {
                  let data95 = data94[i35];
                  if (typeof data95 === "string") {
                    if (!pattern1.test(data95)) {
                      const err295 = { instancePath: instancePath + "/campaigns/" + i34 + "/sites/" + i35, schemaPath: "#/properties/campaigns/items/properties/sites/items/pattern", keyword: "pattern", params: { pattern: "^[a-z0-9][a-z0-9-]{0,63}$" }, message: 'must match pattern "^[a-z0-9][a-z0-9-]{0,63}$"' };
                      if (vErrors === null) {
                        vErrors = [err295];
                      } else {
                        vErrors.push(err295);
                      }
                      errors++;
                    }
                  } else {
                    const err296 = { instancePath: instancePath + "/campaigns/" + i34 + "/sites/" + i35, schemaPath: "#/properties/campaigns/items/properties/sites/items/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                    if (vErrors === null) {
                      vErrors = [err296];
                    } else {
                      vErrors.push(err296);
                    }
                    errors++;
                  }
                }
                let i36 = data94.length;
                let j17;
                if (i36 > 1) {
                  const indices8 = {};
                  for (; i36--; ) {
                    let item8 = data94[i36];
                    if (typeof item8 !== "string") {
                      continue;
                    }
                    if (typeof indices8[item8] == "number") {
                      j17 = indices8[item8];
                      const err297 = { instancePath: instancePath + "/campaigns/" + i34 + "/sites", schemaPath: "#/properties/campaigns/items/properties/sites/uniqueItems", keyword: "uniqueItems", params: { i: i36, j: j17 }, message: "must NOT have duplicate items (items ## " + j17 + " and " + i36 + " are identical)" };
                      if (vErrors === null) {
                        vErrors = [err297];
                      } else {
                        vErrors.push(err297);
                      }
                      errors++;
                      break;
                    }
                    indices8[item8] = i36;
                  }
                }
              } else {
                const err298 = { instancePath: instancePath + "/campaigns/" + i34 + "/sites", schemaPath: "#/properties/campaigns/items/properties/sites/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                if (vErrors === null) {
                  vErrors = [err298];
                } else {
                  vErrors.push(err298);
                }
                errors++;
              }
            }
            if (data83.placements !== void 0) {
              let data96 = data83.placements;
              if (Array.isArray(data96)) {
                if (data96.length > 5) {
                  const err299 = { instancePath: instancePath + "/campaigns/" + i34 + "/placements", schemaPath: "#/properties/campaigns/items/properties/placements/maxItems", keyword: "maxItems", params: { limit: 5 }, message: "must NOT have more than 5 items" };
                  if (vErrors === null) {
                    vErrors = [err299];
                  } else {
                    vErrors.push(err299);
                  }
                  errors++;
                }
                if (data96.length < 1) {
                  const err300 = { instancePath: instancePath + "/campaigns/" + i34 + "/placements", schemaPath: "#/properties/campaigns/items/properties/placements/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" };
                  if (vErrors === null) {
                    vErrors = [err300];
                  } else {
                    vErrors.push(err300);
                  }
                  errors++;
                }
                const len19 = data96.length;
                for (let i37 = 0; i37 < len19; i37++) {
                  let data97 = data96[i37];
                  if (!(data97 === "content-bottom" || data97 === "article-middle" || data97 === "sidebar" || data97 === "landing-secondary" || data97 === "footer-above-author")) {
                    const err301 = { instancePath: instancePath + "/campaigns/" + i34 + "/placements/" + i37, schemaPath: "#/properties/campaigns/items/properties/placements/items/enum", keyword: "enum", params: { allowedValues: schema11.properties.campaigns.items.properties.placements.items.enum }, message: "must be equal to one of the allowed values" };
                    if (vErrors === null) {
                      vErrors = [err301];
                    } else {
                      vErrors.push(err301);
                    }
                    errors++;
                  }
                }
                let i38 = data96.length;
                let j18;
                if (i38 > 1) {
                  outer9: for (; i38--; ) {
                    for (j18 = i38; j18--; ) {
                      if (func0(data96[i38], data96[j18])) {
                        const err302 = { instancePath: instancePath + "/campaigns/" + i34 + "/placements", schemaPath: "#/properties/campaigns/items/properties/placements/uniqueItems", keyword: "uniqueItems", params: { i: i38, j: j18 }, message: "must NOT have duplicate items (items ## " + j18 + " and " + i38 + " are identical)" };
                        if (vErrors === null) {
                          vErrors = [err302];
                        } else {
                          vErrors.push(err302);
                        }
                        errors++;
                        break outer9;
                      }
                    }
                  }
                }
              } else {
                const err303 = { instancePath: instancePath + "/campaigns/" + i34 + "/placements", schemaPath: "#/properties/campaigns/items/properties/placements/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                if (vErrors === null) {
                  vErrors = [err303];
                } else {
                  vErrors.push(err303);
                }
                errors++;
              }
            }
            if (data83.variants !== void 0) {
              let data98 = data83.variants;
              if (Array.isArray(data98)) {
                if (data98.length > 5) {
                  const err304 = { instancePath: instancePath + "/campaigns/" + i34 + "/variants", schemaPath: "#/properties/campaigns/items/properties/variants/maxItems", keyword: "maxItems", params: { limit: 5 }, message: "must NOT have more than 5 items" };
                  if (vErrors === null) {
                    vErrors = [err304];
                  } else {
                    vErrors.push(err304);
                  }
                  errors++;
                }
                if (data98.length < 1) {
                  const err305 = { instancePath: instancePath + "/campaigns/" + i34 + "/variants", schemaPath: "#/properties/campaigns/items/properties/variants/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" };
                  if (vErrors === null) {
                    vErrors = [err305];
                  } else {
                    vErrors.push(err305);
                  }
                  errors++;
                }
                const len20 = data98.length;
                for (let i39 = 0; i39 < len20; i39++) {
                  let data99 = data98[i39];
                  if (data99 && typeof data99 == "object" && !Array.isArray(data99)) {
                    if (data99.src === void 0) {
                      const err306 = { instancePath: instancePath + "/campaigns/" + i34 + "/variants/" + i39, schemaPath: "#/properties/campaigns/items/properties/variants/items/required", keyword: "required", params: { missingProperty: "src" }, message: "must have required property 'src'" };
                      if (vErrors === null) {
                        vErrors = [err306];
                      } else {
                        vErrors.push(err306);
                      }
                      errors++;
                    }
                    if (data99.width === void 0) {
                      const err307 = { instancePath: instancePath + "/campaigns/" + i34 + "/variants/" + i39, schemaPath: "#/properties/campaigns/items/properties/variants/items/required", keyword: "required", params: { missingProperty: "width" }, message: "must have required property 'width'" };
                      if (vErrors === null) {
                        vErrors = [err307];
                      } else {
                        vErrors.push(err307);
                      }
                      errors++;
                    }
                    if (data99.height === void 0) {
                      const err308 = { instancePath: instancePath + "/campaigns/" + i34 + "/variants/" + i39, schemaPath: "#/properties/campaigns/items/properties/variants/items/required", keyword: "required", params: { missingProperty: "height" }, message: "must have required property 'height'" };
                      if (vErrors === null) {
                        vErrors = [err308];
                      } else {
                        vErrors.push(err308);
                      }
                      errors++;
                    }
                    for (const key12 in data99) {
                      if (!(key12 === "src" || key12 === "width" || key12 === "height")) {
                        const err309 = { instancePath: instancePath + "/campaigns/" + i34 + "/variants/" + i39, schemaPath: "#/properties/campaigns/items/properties/variants/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key12 }, message: "must NOT have additional properties" };
                        if (vErrors === null) {
                          vErrors = [err309];
                        } else {
                          vErrors.push(err309);
                        }
                        errors++;
                      }
                    }
                    if (data99.src !== void 0) {
                      let data100 = data99.src;
                      if (typeof data100 === "string") {
                        if (func4(data100) > 2048) {
                          const err310 = { instancePath: instancePath + "/campaigns/" + i34 + "/variants/" + i39 + "/src", schemaPath: "#/properties/campaigns/items/properties/variants/items/properties/src/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" };
                          if (vErrors === null) {
                            vErrors = [err310];
                          } else {
                            vErrors.push(err310);
                          }
                          errors++;
                        }
                        if (func4(data100) < 1) {
                          const err311 = { instancePath: instancePath + "/campaigns/" + i34 + "/variants/" + i39 + "/src", schemaPath: "#/properties/campaigns/items/properties/variants/items/properties/src/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                          if (vErrors === null) {
                            vErrors = [err311];
                          } else {
                            vErrors.push(err311);
                          }
                          errors++;
                        }
                      } else {
                        const err312 = { instancePath: instancePath + "/campaigns/" + i34 + "/variants/" + i39 + "/src", schemaPath: "#/properties/campaigns/items/properties/variants/items/properties/src/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                          vErrors = [err312];
                        } else {
                          vErrors.push(err312);
                        }
                        errors++;
                      }
                    }
                    if (data99.width !== void 0) {
                      let data101 = data99.width;
                      if (!(typeof data101 == "number" && (!(data101 % 1) && !isNaN(data101)) && isFinite(data101))) {
                        const err313 = { instancePath: instancePath + "/campaigns/" + i34 + "/variants/" + i39 + "/width", schemaPath: "#/properties/campaigns/items/properties/variants/items/properties/width/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                        if (vErrors === null) {
                          vErrors = [err313];
                        } else {
                          vErrors.push(err313);
                        }
                        errors++;
                      }
                      if (typeof data101 == "number" && isFinite(data101)) {
                        if (data101 > 728 || isNaN(data101)) {
                          const err314 = { instancePath: instancePath + "/campaigns/" + i34 + "/variants/" + i39 + "/width", schemaPath: "#/properties/campaigns/items/properties/variants/items/properties/width/maximum", keyword: "maximum", params: { comparison: "<=", limit: 728 }, message: "must be <= 728" };
                          if (vErrors === null) {
                            vErrors = [err314];
                          } else {
                            vErrors.push(err314);
                          }
                          errors++;
                        }
                        if (data101 < 1 || isNaN(data101)) {
                          const err315 = { instancePath: instancePath + "/campaigns/" + i34 + "/variants/" + i39 + "/width", schemaPath: "#/properties/campaigns/items/properties/variants/items/properties/width/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1" };
                          if (vErrors === null) {
                            vErrors = [err315];
                          } else {
                            vErrors.push(err315);
                          }
                          errors++;
                        }
                      }
                    }
                    if (data99.height !== void 0) {
                      let data102 = data99.height;
                      if (!(typeof data102 == "number" && (!(data102 % 1) && !isNaN(data102)) && isFinite(data102))) {
                        const err316 = { instancePath: instancePath + "/campaigns/" + i34 + "/variants/" + i39 + "/height", schemaPath: "#/properties/campaigns/items/properties/variants/items/properties/height/type", keyword: "type", params: { type: "integer" }, message: "must be integer" };
                        if (vErrors === null) {
                          vErrors = [err316];
                        } else {
                          vErrors.push(err316);
                        }
                        errors++;
                      }
                      if (typeof data102 == "number" && isFinite(data102)) {
                        if (data102 > 250 || isNaN(data102)) {
                          const err317 = { instancePath: instancePath + "/campaigns/" + i34 + "/variants/" + i39 + "/height", schemaPath: "#/properties/campaigns/items/properties/variants/items/properties/height/maximum", keyword: "maximum", params: { comparison: "<=", limit: 250 }, message: "must be <= 250" };
                          if (vErrors === null) {
                            vErrors = [err317];
                          } else {
                            vErrors.push(err317);
                          }
                          errors++;
                        }
                        if (data102 < 1 || isNaN(data102)) {
                          const err318 = { instancePath: instancePath + "/campaigns/" + i34 + "/variants/" + i39 + "/height", schemaPath: "#/properties/campaigns/items/properties/variants/items/properties/height/minimum", keyword: "minimum", params: { comparison: ">=", limit: 1 }, message: "must be >= 1" };
                          if (vErrors === null) {
                            vErrors = [err318];
                          } else {
                            vErrors.push(err318);
                          }
                          errors++;
                        }
                      }
                    }
                  } else {
                    const err319 = { instancePath: instancePath + "/campaigns/" + i34 + "/variants/" + i39, schemaPath: "#/properties/campaigns/items/properties/variants/items/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                    if (vErrors === null) {
                      vErrors = [err319];
                    } else {
                      vErrors.push(err319);
                    }
                    errors++;
                  }
                }
                let i40 = data98.length;
                let j19;
                if (i40 > 1) {
                  outer10: for (; i40--; ) {
                    for (j19 = i40; j19--; ) {
                      if (func0(data98[i40], data98[j19])) {
                        const err320 = { instancePath: instancePath + "/campaigns/" + i34 + "/variants", schemaPath: "#/properties/campaigns/items/properties/variants/uniqueItems", keyword: "uniqueItems", params: { i: i40, j: j19 }, message: "must NOT have duplicate items (items ## " + j19 + " and " + i40 + " are identical)" };
                        if (vErrors === null) {
                          vErrors = [err320];
                        } else {
                          vErrors.push(err320);
                        }
                        errors++;
                        break outer10;
                      }
                    }
                  }
                }
              } else {
                const err321 = { instancePath: instancePath + "/campaigns/" + i34 + "/variants", schemaPath: "#/properties/campaigns/items/properties/variants/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                if (vErrors === null) {
                  vErrors = [err321];
                } else {
                  vErrors.push(err321);
                }
                errors++;
              }
            }
            if (data83.alt !== void 0) {
              let data103 = data83.alt;
              if (typeof data103 === "string") {
                if (func4(data103) > 250) {
                  const err322 = { instancePath: instancePath + "/campaigns/" + i34 + "/alt", schemaPath: "#/properties/campaigns/items/properties/alt/maxLength", keyword: "maxLength", params: { limit: 250 }, message: "must NOT have more than 250 characters" };
                  if (vErrors === null) {
                    vErrors = [err322];
                  } else {
                    vErrors.push(err322);
                  }
                  errors++;
                }
                if (func4(data103) < 1) {
                  const err323 = { instancePath: instancePath + "/campaigns/" + i34 + "/alt", schemaPath: "#/properties/campaigns/items/properties/alt/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                  if (vErrors === null) {
                    vErrors = [err323];
                  } else {
                    vErrors.push(err323);
                  }
                  errors++;
                }
              } else {
                const err324 = { instancePath: instancePath + "/campaigns/" + i34 + "/alt", schemaPath: "#/properties/campaigns/items/properties/alt/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                if (vErrors === null) {
                  vErrors = [err324];
                } else {
                  vErrors.push(err324);
                }
                errors++;
              }
            }
            if (data83.destination !== void 0) {
              let data104 = data83.destination;
              if (typeof data104 === "string") {
                if (func4(data104) > 2048) {
                  const err325 = { instancePath: instancePath + "/campaigns/" + i34 + "/destination", schemaPath: "#/properties/campaigns/items/properties/destination/maxLength", keyword: "maxLength", params: { limit: 2048 }, message: "must NOT have more than 2048 characters" };
                  if (vErrors === null) {
                    vErrors = [err325];
                  } else {
                    vErrors.push(err325);
                  }
                  errors++;
                }
                if (func4(data104) < 1) {
                  const err326 = { instancePath: instancePath + "/campaigns/" + i34 + "/destination", schemaPath: "#/properties/campaigns/items/properties/destination/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                  if (vErrors === null) {
                    vErrors = [err326];
                  } else {
                    vErrors.push(err326);
                  }
                  errors++;
                }
              } else {
                const err327 = { instancePath: instancePath + "/campaigns/" + i34 + "/destination", schemaPath: "#/properties/campaigns/items/properties/destination/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                if (vErrors === null) {
                  vErrors = [err327];
                } else {
                  vErrors.push(err327);
                }
                errors++;
              }
            }
            if (data83.disclosure !== void 0) {
              let data105 = data83.disclosure;
              if (!(data105 === "Advertisement" || data105 === "Paid advertisement" || data105 === "House advertisement")) {
                const err328 = { instancePath: instancePath + "/campaigns/" + i34 + "/disclosure", schemaPath: "#/properties/campaigns/items/properties/disclosure/enum", keyword: "enum", params: { allowedValues: schema11.properties.campaigns.items.properties.disclosure.enum }, message: "must be equal to one of the allowed values" };
                if (vErrors === null) {
                  vErrors = [err328];
                } else {
                  vErrors.push(err328);
                }
                errors++;
              }
            }
          } else {
            const err329 = { instancePath: instancePath + "/campaigns/" + i34, schemaPath: "#/properties/campaigns/items/type", keyword: "type", params: { type: "object" }, message: "must be object" };
            if (vErrors === null) {
              vErrors = [err329];
            } else {
              vErrors.push(err329);
            }
            errors++;
          }
        }
        let i41 = data82.length;
        let j20;
        if (i41 > 1) {
          outer11: for (; i41--; ) {
            for (j20 = i41; j20--; ) {
              if (func0(data82[i41], data82[j20])) {
                const err330 = { instancePath: instancePath + "/campaigns", schemaPath: "#/properties/campaigns/uniqueItems", keyword: "uniqueItems", params: { i: i41, j: j20 }, message: "must NOT have duplicate items (items ## " + j20 + " and " + i41 + " are identical)" };
                if (vErrors === null) {
                  vErrors = [err330];
                } else {
                  vErrors.push(err330);
                }
                errors++;
                break outer11;
              }
            }
          }
        }
      } else {
        const err331 = { instancePath: instancePath + "/campaigns", schemaPath: "#/properties/campaigns/type", keyword: "type", params: { type: "array" }, message: "must be array" };
        if (vErrors === null) {
          vErrors = [err331];
        } else {
          vErrors.push(err331);
        }
        errors++;
      }
    }
  } else {
    const err332 = { instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" };
    if (vErrors === null) {
      vErrors = [err332];
    } else {
      vErrors.push(err332);
    }
    errors++;
  }
  validate10.errors = vErrors;
  return errors === 0;
}
export {
  stdin_default as default,
  validate
};
