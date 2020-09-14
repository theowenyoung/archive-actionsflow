import {
  connect as imapConnect,
  ImapSimple,
  ImapSimpleOptions,
} from "imap-simple";
import lodash from "lodash";
import { simpleParser, Source as ParserSource, Attachment } from "mailparser";
import {
  ITriggerClassType,
  ITriggerContructorParams,
  IHelpers,
  AnyObject,
  ITriggerOptions,
  IBinaryData,
} from "actionsflow-interface";

export default class Email implements ITriggerClassType {
  options: ITriggerOptions = {};
  helpers: IHelpers;
  shouldDeduplicate = true;
  getItemKey(item: AnyObject): string {
    // TODO adapt every cases
    if (item.messageId) return item.messageId as string;
    if (item.id) return item.id as string;
    return this.helpers.createContentDigest(item);
  }
  constructor({ helpers, options }: ITriggerContructorParams) {
    if (options) {
      this.options = options;
    }
    this.helpers = helpers;
  }

  async run(): Promise<AnyObject[]> {
    const options = this.options;
    let items: AnyObject[] = [];

    const imap = {
      port: 993,
      tls: true,
      authTimeout: 10000,
      ...(options.imap as AnyObject),
    } as AnyObject;

    if (!(imap && imap.host)) {
      throw new Error("No credentials got returned!");
    }

    const mailbox = (options.mailbox as string) || "INBOX";
    const postProcessAction =
      (options.post_process_action as string) || "nothing";
    const isDownloadAttachments =
      (options.is_download_attachments as boolean) || false;

    // Returns all the new unseen messages
    const getNewEmails = async (
      connection: ImapSimple
    ): Promise<AnyObject[]> => {
      const searchCriteria = ["UNSEEN"];

      let fetchOptions = {};

      fetchOptions = {
        bodies: [""],
        markSeen: postProcessAction === "read",
        struct: true,
      };

      const results = await connection.search(searchCriteria, fetchOptions);

      const newEmails: AnyObject[] = [];

      for (const message of results) {
        const part = lodash.find(message.parts, { which: "" });

        if (part === undefined) {
          throw new Error("Email part could not be parsed.");
        }
        const parsedEmail = await parseRawEmail.call(
          this,
          part.body,
          isDownloadAttachments
        );

        newEmails.push(parsedEmail);
      }

      return newEmails;
    };

    const config = ({
      imap: imap,
    } as unknown) as ImapSimpleOptions;

    // Connect to the IMAP server and open the mailbox
    // that we get informed whenever a new email arrives
    const imapConnection = await imapConnect(config);

    await imapConnection.openBox(mailbox);
    items = await getNewEmails(imapConnection);
    await imapConnection.end();
    // if need
    return items;
  }
}
export async function parseRawEmail(
  this: Email,
  messageEncoded: ParserSource,
  isDownloadAttachments: boolean
): Promise<AnyObject> {
  const responseData = ((await simpleParser(
    messageEncoded
  )) as unknown) as AnyObject;
  // for save space, no header
  // const headers: AnyObject = {};
  // for (const header of responseData.headerLines as {
  //   key: string;
  //   line: AnyObject;
  // }[]) {
  //   headers[header.key] = header.line;
  // }
  // responseData.headers = headers;
  responseData.headerLines = undefined;
  responseData.headers = undefined;
  const binaryData: IBinaryData[] = [];
  if (isDownloadAttachments && responseData.attachments) {
    for (
      let i = 0;
      i < ((responseData.attachments as unknown) as Attachment[]).length;
      i++
    ) {
      const attachment = ((responseData.attachments as unknown) as Attachment[])[
        i
      ];
      binaryData[i] = await this.helpers.prepareBinaryData(
        attachment.content,
        attachment.filename,
        attachment.contentType
      );
    }
  }
  if (responseData.attachments) {
    responseData.attachments = undefined;
  }

  return {
    ...responseData,
    attachments: binaryData,
  };
}
