import has from "lodash.has";
import { AnyObject } from "actionsflow-interface";
interface IOptions {
  interpolate?: RegExp;
  includeVariableRegex?: RegExp;
  shouldReplaceUndefinedToEmpty?: boolean;
}
interface IVariableHandleOptions {
  text: string;
  regex: RegExp;
  regexResult: RegExpExecArray;
  currentIndex: number;
  shouldReplaceUndefinedToEmpty: boolean;
  context: AnyObject;
}
const variableHandle = ({
  text,
  regex,
  regexResult,
  currentIndex,
  shouldReplaceUndefinedToEmpty,
  context,
}: IVariableHandleOptions) => {
  if (shouldReplaceUndefinedToEmpty) {
    const functionRegex = /toJson\(([\S\s]*?)\)/;
    const matched = functionRegex.exec(regexResult[1]);
    let variableName = regexResult[1];
    if (matched) {
      variableName = matched[1];
    }
    variableName = variableName.trim();

    if (has(context, variableName)) {
      return [
        JSON.stringify(
          text.slice(currentIndex, regex.lastIndex - regexResult[0].length)
        ),
        "(" + regexResult[1] + ")",
      ];
    } else {
      return [
        JSON.stringify(
          text.slice(currentIndex, regex.lastIndex - regexResult[0].length)
        ),
      ];
    }
  } else {
    return [
      JSON.stringify(
        text.slice(currentIndex, regex.lastIndex - regexResult[0].length)
      ),
      "(" + regexResult[1] + ")",
    ];
  }
};
export const template = function (
  text: string,
  context: AnyObject,
  options?: IOptions
): string {
  let includeVariableRegex = /(^on)|(^secrets)|(^toJson\(on\.?)/;
  let interpolate = /\$\{\{([\S\s]*?)\}\}/g;
  let shouldReplaceUndefinedToEmpty = false;
  if (options) {
    if (options.interpolate) {
      interpolate = options.interpolate;
    }
    if (options.includeVariableRegex) {
      includeVariableRegex = options.includeVariableRegex;
    }
    if (typeof options.shouldReplaceUndefinedToEmpty !== "undefined") {
      shouldReplaceUndefinedToEmpty = options.shouldReplaceUndefinedToEmpty;
    }
  }
  // Andrea Giammarchi - WTFPL License
  const stringify = JSON.stringify;
  const re = interpolate;
  let evaluate: string[] = [],
    i = 0,
    m;

  while ((m = re.exec(text))) {
    if (includeVariableRegex) {
      if (includeVariableRegex.exec(m[1].trim())) {
        // yes
        evaluate = evaluate.concat(
          variableHandle({
            regex: re,
            currentIndex: i,
            regexResult: m,
            shouldReplaceUndefinedToEmpty,
            text,
            context,
          })
        );
        i = re.lastIndex;
      } else {
        evaluate.push(stringify(text.slice(i, re.lastIndex)));
        i = re.lastIndex;
      }
    } else {
      evaluate = evaluate.concat(
        variableHandle({
          regex: re,
          currentIndex: i,
          regexResult: m,
          shouldReplaceUndefinedToEmpty,
          text,
          context,
        })
      );
      i = re.lastIndex;
    }
  }
  evaluate.push(stringify(text.slice(i)));
  // Function is needed to opt out from possible "use strict" directive
  return Function(
    "var toJson = function(obj){return JSON.stringify(obj,null,2)};with(this)return" +
      evaluate.join("+")
  ).call(context);
};
