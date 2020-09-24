import yargs from "yargs";
import { log } from "actionsflow-core";
import build from "../build";
import clean from "../clean";

export const buildCommandBuilder = (_: yargs.Argv): yargs.Argv =>
  _.option(`dest`, {
    alias: "d",
    type: `string`,
    describe: `workflows build dest path`,
    default: "./dist",
  })
    .option(`cwd`, {
      type: `string`,
      describe: `current workspace path`,
      default: process.cwd(),
    })
    .option(`include`, {
      alias: "i",
      type: "array",
      describe: `workflow files that should include, you can use <glob> patterns`,
      default: [],
    })
    .option(`exclude`, {
      alias: "e",
      type: "array",
      describe: `workflow files that should exclude, you can use <glob> patterns`,
      default: [],
    })
    .option("force", {
      alias: "f",
      type: "boolean",
      describe:
        "force update all triggers, it will ignore the update interval and cached deduplicate key",
    });
function buildLocalCommands(cli: yargs.Argv) {
  cli.command({
    command: `build`,
    describe: `Build a Actionsflow workflows.`,
    builder: buildCommandBuilder,
    handler: build as () => Promise<void>,
  });

  cli.command({
    command: `clean`,
    describe: `Wipe the local actionsflow environment including built assets and cache`,
    builder: (_) =>
      _.option(`dest`, {
        alias: "d",
        type: `string`,
        describe: `workflows build dest path`,
        default: "./dist",
      }).option(`base`, {
        alias: "b",
        type: `string`,
        describe: `workspace base path`,
        default: process.cwd(),
      }),
    handler: clean,
  });
}

function getVersionInfo() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { version } = require(`../../package.json`);

  return `Actionsflow CLI version: ${version}`;
}
export const createCli = (argv: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const cli = yargs;
    cli
      .scriptName(`actionsflow`)
      .usage(`Usage: $0 <command> [options]`)
      .alias(`h`, `help`)
      .alias(`v`, `version`)
      .option(`verbose`, {
        default: false,
        type: `boolean`,
        describe: `Turn on verbose output`,
        global: true,
      });

    buildLocalCommands(cli);
    cli.version(
      `version`,
      `Show the version of the Actionsflow CLI and the Actionsflow package in the current project`,
      getVersionInfo()
    );
    cli
      .wrap(cli.terminalWidth())
      .recommendCommands()
      .onFinishCommand((result) => {
        log.debug("finish command");
        return resolve(result);
      })
      .fail((msg, err) => {
        log.debug("fail command");
        if (msg || err) log.error(msg || err);
        reject(err);
      });
    const cliArgv = cli.parse(argv);
    if (!cliArgv._[0]) {
      cli.showHelp();
      return resolve();
    }
  });
};
