import loaderUtils from "loader-utils"
import { loader } from 'webpack';
import * as path from 'path'
import * as qs from 'querystring'

/**
 *
 * @param {string|Buffer} content Content of the resource file
 * @param {object} [map] SourceMap data consumable by https://github.com/mozilla/source-map
 * @param {any} [meta] Meta data, could be anything
 */
export default function (
    content: string,
    map: object,
    meta: any
  ) { 
  // 获取到用户给当前 Loader 传入的 options
  const options = loaderUtils.getOptions(this);
  return content;
};