declare module "cache-manager-fs-hash";
declare module "xml2js" {
  export interface Options {
    async?: boolean;
    attrkey?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attrNameProcessors?: Array<(name: string) => any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attrValueProcessors?: Array<(value: string, name: string) => any>;
    charkey?: string;
    charsAsChildren?: boolean;
    childkey?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    emptyTag?: any;
    explicitArray?: boolean;
    explicitCharkey?: boolean;
    explicitChildren?: boolean;
    explicitRoot?: boolean;
    ignoreAttrs?: boolean;
    includeWhiteChars?: boolean;
    mergeAttrs?: boolean;
    normalize?: boolean;
    normalizeTags?: boolean;
    strict?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tagNameProcessors?: Array<(name: string) => any>;
    trim?: boolean;
    // eslint-disable-next-line @typescript-eslint/ban-types
    validator?: Function;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    valueProcessors?: Array<(value: string, name: string) => any>;
    xmlns?: boolean;
  }
}
