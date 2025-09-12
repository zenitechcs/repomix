import process from 'node:process';
import { Option, program } from 'commander';
import pc from 'picocolors';
import { getVersion } from '../core/file/packageJsonParse.js';
import { RepomixError, handleError } from '../shared/errorHandle.js';
import { logger, repomixLogLevels } from '../shared/logger.js';
import { runDefaultAction } from './actions/defaultAction.js';
import { runInitAction } from './actions/initAction.js';
import { runMcpAction } from './actions/mcpAction.js';
import { runRemoteAction } from './actions/remoteAction.js';
import { runVersionAction } from './actions/versionAction.js';
import type { CliOptions } from './types.js';

// Semantic mapping for CLI suggestions
// This maps conceptually related terms (not typos) to valid options
const semanticSuggestionMap: Record<string, string[]> = {
  exclude: ['--ignore'],
  reject: ['--ignore'],
  omit: ['--ignore'],
  skip: ['--ignore'],
  blacklist: ['--ignore'],
  save: ['--output'],
  export: ['--output'],
  out: ['--output'],
  file: ['--output'],
  format: ['--style'],
  type: ['--style'],
  syntax: ['--style'],
  debug: ['--verbose'],
  detailed: ['--verbose'],
  silent: ['--quiet'],
  mute: ['--quiet'],
  add: ['--include'],
  with: ['--include'],
  whitelist: ['--include'],
  clone: ['--remote'],
  git: ['--remote'],
  minimize: ['--compress'],
  reduce: ['--compress'],
  'strip-comments': ['--remove-comments'],
  'no-comments': ['--remove-comments'],
  print: ['--stdout'],
  console: ['--stdout'],
  terminal: ['--stdout'],
  pipe: ['--stdin'],
};

export const run = async () => {
  try {
    program
      .description('Repomix - Pack your repository into a single AI-friendly file')
      .argument('[directories...]', 'list of directories to process', ['.'])
      // Basic Options
      .optionsGroup('Basic Options')
      .option('-v, --version', 'show version information and exit')
      // CLI Input/Output Options
      .optionsGroup('CLI Input/Output Options')
      .addOption(
        new Option(
          '--verbose',
          'enable detailed debug logging (shows file processing, token counts, and configuration details)',
        ).conflicts('quiet'),
      )
      .addOption(
        new Option('--quiet', 'suppress all console output except errors (useful for scripting)').conflicts('verbose'),
      )
      .addOption(
        new Option(
          '--stdout',
          'write packed output directly to stdout instead of a file (suppresses all logging)',
        ).conflicts('output'),
      )
      .option('--stdin', 'read file paths from stdin, one per line (specified files are processed directly)')
      .option('--copy', 'copy the generated output to system clipboard after processing')
      .option(
        '--token-count-tree [threshold]',
        'show file tree with token counts; optional threshold to show only files with ≥N tokens (e.g., --token-count-tree 100)',
        (value: string | boolean) => {
          if (typeof value === 'string') {
            const parsed = Number.parseInt(value, 10);
            if (Number.isNaN(parsed)) {
              throw new RepomixError(`Invalid token count threshold: '${value}'. Must be a valid number.`);
            }
            return parsed;
          }
          return value;
        },
      )
      .option(
        '--top-files-len <number>',
        'number of largest files to show in summary (default: 5, e.g., --top-files-len 20)',
        Number.parseInt,
      )
      // Repomix Output Options
      .optionsGroup('Repomix Output Options')
      .option('-o, --output <file>', 'output file path (default: repomix-output.xml, use "-" for stdout)')
      .option('--style <type>', 'output format: xml, markdown, or plain (default: xml)')
      .option(
        '--parsable-style',
        'escape special characters to ensure valid XML/Markdown (needed when output contains code that breaks formatting)',
      )
      .option(
        '--compress',
        'extract essential code structure (classes, functions, interfaces) using Tree-sitter parsing',
      )
      .option('--output-show-line-numbers', 'prefix each line with its line number in the output')
      .option('--no-file-summary', 'omit the file summary section from output')
      .option('--no-directory-structure', 'omit the directory tree visualization from output')
      .option('--no-files', 'generate metadata only without file contents (useful for repository analysis)')
      .option('--remove-comments', 'strip all code comments before packing')
      .option('--remove-empty-lines', 'remove blank lines from all files')
      .option('--truncate-base64', 'truncate long base64 data strings to reduce output size')
      .option('--header-text <text>', 'custom text to include at the beginning of the output')
      .option('--instruction-file-path <path>', 'path to file containing custom instructions to include in output')
      .option('--include-empty-directories', 'include folders with no files in directory structure')
      .option(
        '--no-git-sort-by-changes',
        "don't sort files by git change frequency (default: most changed files first)",
      )
      .option('--include-diffs', 'add git diff section showing working tree and staged changes')
      .option('--include-logs', 'add git commit history with messages and changed files')
      .option(
        '--include-logs-count <count>',
        'number of recent commits to include with --include-logs (default: 50)',
        Number.parseInt,
      )
      // File Selection Options
      .optionsGroup('File Selection Options')
      .option(
        '--include <patterns>',
        'include only files matching these glob patterns (comma-separated, e.g., "src/**/*.js,*.md")',
      )
      .option('-i, --ignore <patterns>', 'additional patterns to exclude (comma-separated, e.g., "*.test.js,docs/**")')
      .option('--no-gitignore', "don't use .gitignore rules for filtering files")
      .option('--no-default-patterns', "don't apply built-in ignore patterns (node_modules, .git, build dirs, etc.)")
      // Remote Repository Options
      .optionsGroup('Remote Repository Options')
      .option('--remote <url>', 'clone and pack a remote repository (GitHub URL or user/repo format)')
      .option('--remote-branch <name>', "specific branch, tag, or commit to use (default: repository's default branch)")
      // Configuration Options
      .optionsGroup('Configuration Options')
      .option('-c, --config <path>', 'use custom config file instead of repomix.config.json')
      .option('--init', 'create a new repomix.config.json file with defaults')
      .option('--global', 'with --init, create config in home directory instead of current directory')
      // Security Options
      .optionsGroup('Security Options')
      .option('--no-security-check', 'skip scanning for sensitive data like API keys and passwords')
      // Token Count Options
      .optionsGroup('Token Count Options')
      .option(
        '--token-count-encoding <encoding>',
        'tokenizer model for counting: o200k_base (GPT-4o), cl100k_base (GPT-3.5/4), etc. (default: o200k_base)',
      )
      // MCP
      .optionsGroup('MCP')
      .option('--mcp', 'run as Model Context Protocol server for AI tool integration')
      .action(commanderActionEndpoint);

    // Custom error handling function
    const configOutput = program.configureOutput();
    const originalOutputError = configOutput.outputError || ((str, write) => write(str));

    program.configureOutput({
      outputError: (str, write) => {
        // Check if this is an unknown option error
        if (str.includes('unknown option')) {
          const match = str.match(/unknown option '?(-{1,2}[^ ']+)'?/i);
          if (match?.[1]) {
            const unknownOption = match[1];
            const cleanOption = unknownOption.replace(/^-+/, '');

            // Check if the option has a semantic match
            const semanticMatches = semanticSuggestionMap[cleanOption];
            if (semanticMatches) {
              // We have a direct semantic match
              logger.error(`✖ Unknown option: ${unknownOption}`);
              logger.info(`Did you mean: ${semanticMatches.join(' or ')}?`);
              return;
            }
          }
        }

        // Fall back to the original Commander error handler
        originalOutputError(str, write);
      },
    });

    await program.parseAsync(process.argv);
  } catch (error) {
    handleError(error);
    process.exit(1);
  }
};

const commanderActionEndpoint = async (directories: string[], options: CliOptions = {}) => {
  await runCli(directories, process.cwd(), options);
};

export const runCli = async (directories: string[], cwd: string, options: CliOptions) => {
  // Detect stdout mode
  // NOTE: For compatibility, currently not detecting pipe mode
  const isForceStdoutMode = options.output === '-';
  if (isForceStdoutMode) {
    options.stdout = true;
  }

  // Set log level based on verbose and quiet flags
  if (options.quiet) {
    logger.setLogLevel(repomixLogLevels.SILENT);
  } else if (options.verbose) {
    logger.setLogLevel(repomixLogLevels.DEBUG);
  } else {
    logger.setLogLevel(repomixLogLevels.INFO);
  }

  // In stdout mode, set log level to SILENT
  if (options.stdout) {
    logger.setLogLevel(repomixLogLevels.SILENT);
  }

  logger.trace('directories:', directories);
  logger.trace('cwd:', cwd);
  logger.trace('options:', options);

  if (options.mcp) {
    return await runMcpAction();
  }

  if (options.version) {
    await runVersionAction();
    return;
  }

  // Skip version header in stdin mode to avoid interfering with piped output from interactive tools like fzf
  if (!options.stdin) {
    const version = await getVersion();
    logger.log(pc.dim(`\n📦 Repomix v${version}\n`));
  }

  if (options.init) {
    await runInitAction(cwd, options.global || false);
    return;
  }

  if (options.remote) {
    return await runRemoteAction(options.remote, options);
  }

  return await runDefaultAction(directories, cwd, options);
};
