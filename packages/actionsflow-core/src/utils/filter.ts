import { ITrigger, IWorkflowData } from "actionsflow-interface";
/**
 * get raw triggers from workflow data
 * @param doc
 */
export const getRawTriggers = (doc: IWorkflowData): ITrigger[] => {
  const triggers = [];
  if (doc && doc.on) {
    const onObj = doc.on as Record<string, Record<string, unknown>>;
    const keys = Object.keys(onObj);

    for (let index = 0; index < keys.length; index++) {
      const key = keys[index] as string;
      let options = {};
      if (onObj && onObj[key]) {
        options = onObj[key];
      }
      triggers.push({
        name: key,
        options: options,
      });
    }
  }
  return triggers;
};
