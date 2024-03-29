export const START_TAG =
  /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
export const END_TAG = /^<\/([-A-Za-z0-9_]+)[^>]*>/;
export const ATTRIBUTE =
  /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

// Empty Elements - HTML 5
export const EMPTY = [
  "area",
  "base",
  "basefont",
  "br",
  "col",
  "frame",
  "hr",
  "img",
  "input",
  "slot",
  "link",
  "meta",
  "param",
  "embed",
  "command",
  "keygen",
  "source",
  "track",
  "wbr",
];

// Block Elements - HTML 5
export const BLOCK = [
  "a",
  "address",
  "article",
  "applet",
  "aside",
  "audio",
  "blockquote",
  "button",
  "canvas",
  "center",
  "dd",
  "del",
  "dir",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hgroup",
  "hr",
  "iframe",
  "ins",
  "isindex",
  "li",
  "map",
  "menu",
  "noframes",
  "noscript",
  "object",
  "ol",
  "output",
  "p",
  "pre",
  "section",
  "script",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "ul",
  "video",
];
// Inline Elements - HTML 5
export const INLINE = [
  "abbr",
  "acronym",
  "applet",
  "b",
  "basefont",
  "bdo",
  "big",
  "br",
  "button",
  "cite",
  "code",
  "del",
  "dfn",
  "em",
  "font",
  "i",
  "iframe",
  "input",
  "slot",
  "ins",
  "kbd",
  "label",
  "map",
  "object",
  "q",
  "s",
  "samp",
  "script",
  "select",
  "small",
  "span",
  "strike",
  "strong",
  "sub",
  "sup",
  "textarea",
  "tt",
  "u",
  "var",
];

// Elements that you can, intentionally, leave open
// (and which close themselves)
export const CLOES_SELF = [
  "colgroup",
  "dd",
  "dt",
  "li",
  "options",
  "p",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
]; 

// Attributes that have their values filled in disabled="disabled"
export const FILL_ATTRS = [
  "checked",
  "compact",
  "declare",
  "defer",
  "disabled",
  "ismap",
  "multiple",
  "nohref",
  "noresize",
  "noshade",
  "nowrap",
  "readonly",
  "selected",
];

// Special Elements (can contain anything)
export const SPECIAL = ["script", "style"];

// Yunjs custom tag
export const YUN_CUSTOM = ["foreach", "if", "else-if", "else", "switch", "case"];
