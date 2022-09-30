import {
  START_TAG,
  END_TAG,
  ATTRIBUTE,
  EMPTY,
  BLOCK,
  INLINE,
  CLOES_SELF,
  FILL_ATTRS,
  SPECIAL,
} from "../shared/constants";

// HTML tag node
class Node {
  node?: string;
  tag?: string;
  attribute?: Object;
  children?: Array<Node>;
}

let buffArray = [];
const handlerDefault = {
  start: function (tag, attrs, unary) {
    // node for this element
    let node: Node = {
      node: "element",
      tag: tag,
    };
    if (attrs.length !== 0) {
      // @ts-ignore
      node.attributes = attrs.reduce(function (pre, attr) {
        var name = attr.name;
        var value = attr.value;

        if (value.match(/ /)) {
          value = value.split(" ");
        }

        // if attr already exists
        // merge it
        if (pre[name]) {
          if (Array.isArray(pre[name])) {
            // already array, push to last
            pre[name].push(value);
          } else {
            // single value, make it array
            pre[name] = [pre[name], value];
          }
        } else {
          // not exist, put it
          pre[name] = value;
        }

        return pre;
      }, {});
    }
    if (unary) {
      // if this tag dosen't have end tag
      // like <img src="hoge.png"/>
      // add to parents
      var parent = buffArray[0];
      if (parent && parent.children === undefined) {
        parent.children = [];
      }
      parent.children.push(node);
    } else {
      buffArray.unshift(node);
    }
  },
  end: function (tag, results) {
    // merge into parent tag
    var node = buffArray.shift();
    if (node.tag !== tag) console.error("invalid state: mismatch end tag");

    if (buffArray.length === 0) {
      results.children.push(node);
    } else {
      var parent = buffArray[0];
      if (parent.children === undefined) {
        parent.children = [];
      }
      parent.children.push(node);
    }
  },
  chars: function (text, results) {
    var node = {
      node: "text",
      text: text,
    };
    if (buffArray.length === 0) {
      results.children.push(node);
    } else {
      var parent = buffArray[0];
      if (parent.children === undefined) {
        parent.children = [];
      }
      parent.children.push(node);
    }
  },
  comment: function (text, results) {
    var node = {
      node: "comment",
      text: text,
    };
    var parent = buffArray[0];
    if (parent.children === undefined) {
      parent.children = [];
    }
    parent.children.push(node);
  },
};

// Convert template to json AST
export function html2json(html, handler = handlerDefault) {
  let results = {
    node: "root",
    children: [],
  };
  let index,
    chars,
    match,
    stack: Array<Object> & { last?: Function } = [],
    last = html;
  stack.last = function () {
    return this[this.length - 1];
  };

  while (html) {
    chars = true;
    // Make sure we're not in a script or style element
    if (!stack.last() || !SPECIAL.includes(stack.last())) {
      // Comment
      if (html.indexOf("<!--") == 0) {
        index = html.indexOf("-->");
        if (index >= 0) {
          if (handler.comment)
            handler.comment(html.substring(4, index), results);
          html = html.substring(index + 3);
          chars = false;
        }
        // end tag
      } else if (html.indexOf("</") == 0) {
        match = html.match(END_TAG);
        if (match) {
          html = html.substring(match[0].length);
          match[0].replace(END_TAG, parseEndTag);
          chars = false;
        }
        // start tag
      } else if (html.indexOf("<") == 0) {
        match = html.match(START_TAG);
        if (match) {
          html = html.substring(match[0].length);
          match[0].replace(START_TAG, parseStartTag);
          chars = false;
        }
      }

      if (chars) {
        index = html.indexOf("<");
        var text = index < 0 ? html : html.substring(0, index);
        html = index < 0 ? "" : html.substring(index);

        if (handler.chars) handler.chars(text, results);
      }
    } else {
      html = html.replace(
        new RegExp("([\\s\\S]*?)</" + stack.last() + "[^>]*>"),
        function (_, text) {
          text = text.replace(
            /<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g,
            "$1$2"
          );
          if (handler.chars) handler.chars(text, results);

          return "";
        }
      );

      parseEndTag("", stack.last());
    }

    if (html == last) throw "Parse Error: " + html;
    last = html;
  }

  // Clean up any remaining tags
  parseEndTag();

  function parseStartTag(tag, tagName, rest, unary) {
    tagName = tagName.toLowerCase();

    if (BLOCK.includes(tagName)) {
      while (stack.last() && INLINE.includes(stack.last())) {
        parseEndTag("", stack.last());
      }
    }

    if (CLOES_SELF.includes(tagName) && stack.last() == tagName) {
      parseEndTag("", tagName);
    }

    unary = EMPTY.includes(tagName) || !!unary;

    if (!unary) stack.push(tagName);

    if (handler.start) {
      var attrs = [];

      rest.replace(ATTRIBUTE, function (match, name) {
        var value = arguments[2]
          ? arguments[2]
          : arguments[3]
          ? arguments[3]
          : arguments[4]
          ? arguments[4]
          : FILL_ATTRS.includes(name)
          ? name
          : "";

        attrs.push({
          name: name,
          value: value,
          escaped: value.replace(/(^|[^\\])"/g, '$1\\"'), //"
        });
      });

      if (handler.start) handler.start(tagName, attrs, unary);
    }
  }

  function parseEndTag(tag?, tagName?) {
    // If no tag name is provided, clean shop
    if (!tagName) var pos = 0;
    // Find the closest opened tag of the same type
    else
      for (var pos = stack.length - 1; pos >= 0; pos--)
        if (stack[pos] == tagName) break;

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--)
        if (handler.end) handler.end(stack[i], results);

      // Remove the open elements from the stack
      stack.length = pos;
    }
  }
  return results;
}

// Convert json AST to HTML code
export function json2html(json) {
  let children = "";
  if (json.children) {
    children = json.children
      .map(function (c) {
        return json2html(c);
      })
      .join("");
  }

  let attr = "";
  if (json.attributes) {
    attr = Object.keys(json.attributes)
      .map(function (key) {
        let value = json.attributes[key];
        if (Array.isArray(value)) value = value.join(" ");
        return key + "=" + '"' + value + '"';
      })
      .join(" ");
    if (attr !== "") attr = " " + attr;
  }

  if (json.node === "element") {
    let tag = json.tag;
    if (EMPTY.indexOf(tag) > -1) {
      // empty element
      return "<" + json.tag + attr + "/>";
    }

    // non empty element
    var open = "<" + json.tag + attr + ">";
    var close = "</" + json.tag + ">";
    return open + children + close;
  }

  if (json.node === "text") {
    return json.text;
  }

  if (json.node === "comment") {
    return "<!--" + json.text + "-->";
  }

  if (json.node === "root") {
    return children;
  }
}
