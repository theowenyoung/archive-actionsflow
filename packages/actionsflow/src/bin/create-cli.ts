import path from "path";
import resolveCwd from "resolve-cwd";
import yargs from "yargs";
import log from "../log";
// eslint-disable-next-line @typescript-eslint/ban-types
const handlerP = (fn: Function) => (...args: unknown[]): void => {
  Promise.resolve(fn(...args)).then(
    () => process.exit(0),
    (err) => {
      log.error(err);
      process.exit(1);
    }
  );
};
function buildLocalCommands(cli: yargs.Argv) {
  const directory = path.resolve(`.`);
  const workflowInfo = {
    directory,
    workflowPackageJson: undefined,
  };

  function resolveLocalCommand(command: string) {
    try {
      const cmdPath = resolveCwd.silent(
        path.resolve(__dirname, `../commands/${command}`)
      );
      if (!cmdPath)
        return log.warn(
          `There was a problem loading the local ${command} command. Actionsflow may not be installed in your workflow's "node_modules" directory. Perhaps you need to run "npm install"? You might need to delete your "package-lock.json" as well.`
        );
      log.debug(`loading local command from: ${cmdPath}`);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const cmdModule = require(cmdPath);
      const cmd = cmdModule.default;
      if (cmd instanceof Function) {
        return cmd;
      }
      return log.warn(
        `Handler for command "${command}" is not a function. Your Actionsflow package might be corrupted, try reinstalling it and running the command again.`
      );
    } catch (err) {
      cli.showHelp();
      return log.warn(
        `There was a problem loading the local ${command} command. Actionsflow may not be installed. Perhaps you need to run "npm install"?`,
        err
      );
    }
  }
  function getCommandHandler(
    command: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    handler?: (args: yargs.Arguments, cmd: Function) => void
  ) {
    return (argv: yargs.Arguments): void => {
      const args = Object.assign(
        Object.assign(Object.assign({}, argv), workflowInfo)
      );
      if (argv.verbose) {
        log.setLevel("debug");
        args.logLevel = "debug";
      }
      const localCmd = resolveLocalCommand(command);
      log.debug(`running command: ${command}`);
      return handler ? handler(args, localCmd) : localCmd(args);
    };
  }

  cli.command({
    command: `build`,
    describe: `Build a Actionsflow workflows.`,
    builder: (_) =>
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
        }),
    handler: handlerP(
      getCommandHandler(`build`, (args, cmd) => {
        return cmd(args);
      })
    ),
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
    handler: handlerP(getCommandHandler(`clean`)),
  });
}

function getVersionInfo() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { version } = require(`../../package.json`);

  return `Actionsflow CLI version: ${version}`;
}
export const createCli = (argv: string[]): yargs.Arguments => {
  const cli = yargs(argv);
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

  const cliArgv = cli
    .wrap(cli.terminalWidth())
    .recommendCommands()
    .parse(argv.slice(2));
  if (!cliArgv._[0]) {
    cli.showHelp();
  }
  return cliArgv;
};
