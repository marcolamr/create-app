import { Command } from 'commander';

export const run = async () => {
  const program = new Command();
  program.version('0.1.0');
  program.description('Create a new MD app');
  program.option('-p, --port <port>', 'Port to run the app on', '3000');
  program.option('-d, --debug', 'Enable debug mode');
  program.option('-v, --verbose', 'Enable verbose mode');
  program.option('-q, --quiet', 'Enable quiet mode');
  program.option('-s, --silent', 'Enable silent mode');
  program.option('-t, --trace', 'Enable trace mode');
  program.option('-f, --force', 'Enable force mode');

  console.log(program.opts());
};
