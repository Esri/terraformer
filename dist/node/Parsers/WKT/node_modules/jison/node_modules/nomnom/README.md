# nomnom
nomnom is an option parser for node and CommonJS. It noms your args and gives them back to you in a hash.

	var options = require("nomnom")
	    .opts({
	        version: {
	          	string: '--version',
	            help: 'print version and exit',
	            callback: function() {
	                return "version 1.2.4";
	            }
	        },
	        debug : {
	            string: '-d, --debug',
	            help: 'Print debugging info'
	        },
	        config: {
	            string: '-c PATH, --config=PATH',
	            default: 'config.json',
	            help: 'JSON file with tests to run'
	        }
	    })
	    .parseArgs();

	if(options.debug)
	    // do stuff
	
You don't have to specify anything if you don't want to:

	var options = require("nomnom").parseArgs();

	var url = options[0];      // get the first positional arg
	var debug = options.debug  // see if --debug was specified
	var verbose = options.v    // see if -v was specified

# Install
for [node.js](http://nodejs.org/) and [npm](http://github.com/isaacs/npm):

	npm install nomnom

# Commands
Nomnom supports command-based interfaces (e.g. with git: `git add -p` and `git rebase -i` where `add` and `rebase` are the commands):

	var parser = require("nomnom");
	
	parser.command('browser')
	    .callback(runBrowser)
	    .help("run browser tests");
	
	parser.command('sanity')
	    .opts({
	        filename: {
	            position: 1,
	            help: 'test file to run'
	        },
	        config: {
	            string: '-c FILE, --config=FILE',
	            default: 'config.json',
	            help: 'json file with tests to run'
	        }
	    })
	    .callback(function(options) {
	         runSanity(options.filename);
	    })
	    .help("run the sanity tests")
	
	parser.parseArgs();
	
Each command generates its own usage message when `-h` or `--help` is specified with the command.

# More Details
Nomnom supports args like `-d`, `--debug`, `--no-debug`, `--file=test.txt`, `-f test.txt`, `-xvf`, and positionals. Positionals are arguments that don't fit the `-a` or `--atomic` format and aren't attached to an option.

Values are JSON parsed, so `--debug=true --count=3 --file=log.txt` would give you:

	{
	    "debug": true,
	    "count": 3,
	    "file": "log.txt"
	}

# Usage
Nomnom prints out a usage message if `--help` or `-h` is an argument. Usage for these options in `test.js`:

	var options = nomnom.opts({
	    action: {
	        position: 0,
	        help: "either 'test', 'run', or 'xpi'" 
	    },
	    config: {
	        string: '-c FILE, --config=FILE',
	        help: 'json file with tests to run',
	    },
	    debug: {
	        string: '-d, --debug',
	        help: 'Print debugging info'
	    }
	}).parseArgs();

...would look like this:

	Usage: node test.js <action> [options]
	
	<action>		either 'test', 'run', or 'xpi'
	
	options:
	-c FILE, --config=FILE		json file with tests to run
	-d, --debug		Print debugging info


# Options hash
The options hash that is passed to `nomnom.opts()` is a hash keyed on option name. Each option specification can have the following fields:

#### string

specifies what command line arguments to match on and wether the option takes an argument.

To attach an option to `--version` use `"--version"`
	
To attach to `-v` or `--version` use `"-v, --version"`
	
To attach to `-c` and `--config` and require an argument use `"-c FILE, --config=FILE"`
	
The metavar (e.g. `"FILE"`) is just a guide and can be any string. Note that `string` will be used when printing the usage for this option.

#### help

A string description of the option for the usage printout.

#### default

The value to give the option if it's not specified in the arguments.

#### callback

A callback that will be executed as soon as the option is encountered. If the callback returns a string it will print the string and exit:

	var opts = {
	    version: {
	        string: '--version',
	        callback: function() {
	            return "version 1.2.4";
	        }
	    },
	    date: {
	        string: '-y YYYY-MM-DD, --date=YYYY-MM-DD',
	        callback: function(date) {
	          if(!(/^\d{4}\-\d\d\-\d\d$/).test(date))
	            return "date must be in format yyyy-mm-dd";
	        }
	    }
	}

#### position

The position of the option if it's a positional argument. If the option should be matched to the first positional arg use position `0`

#### required

If this is set to `true` and the option isn't in the args, a message will be printed and the program will exit.


# Parser interface
`require("nomnom")` will give you the option parser. You can also make an instance of a parser with `require("nomnom")()`. You can chain any of these functions off of a parser:

#### opts

The options hash.

#### usage

The string that will override the default generated usage message.

#### help

A string that is appended to the usage.

#### scriptName

Nomnom can't detect the alias used to run your script. You can use `scriptName` to provide the correct name instead of e.g. `node test.js`.

#### printFunc

Overrides the usage printing function:

	nomnom.printFunc(function(usage) {
	    console.log(usage);
	});

#### command

Takes a command name and gives you a command object on which you can chain command options.

#### callback

A callback that will be called with the parsed options. If any commands are specified, this is only called if no command was used.

#### globalOpts

The global options when commands are specified. Any options in here will be included in the usage string for any command.

#### parseArgs

Parses node's `process.argv` and returns the parsed options hash. You can also provide argv:

	var options = nomnom.parseArgs(["-xvf", "--atomic=true"])

# Command interface
A command is specified with `nomnom.command('name')`. All these functions can be chained on a command:

#### opts

The options for this command.

#### callback

A callback that will be called with the parsed options when the command is used.

#### help

A help string describing the function of this command.



