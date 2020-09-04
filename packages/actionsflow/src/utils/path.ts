export function getTriggerWebhookBasePath(
  workflowRelativePath: string,
  triggerName: string
): string {
  const regexPageExtension = new RegExp(
    `\\.+(?:${["yml", "yaml"].join("|")})$`
  );
  let pageName = "/" + workflowRelativePath.replace(/\\+/g, "/");
  pageName = pageName.replace(regexPageExtension, "");
  pageName = `${pageName}/${triggerName}`;
  return pageName;
}

export function isMatchWebhookBasePath(
  path: string,
  basePath: string
): boolean {
  const regex = new RegExp(`^${basePath}\\/`);
  const isSubPath = regex.test(path);
  return isSubPath || path === basePath;
}
