#!/usr/bin/env node

'use strict';

const Gitter = require('node-gitter');
const Promise = require('bluebird');

const PER_PAGE = 500;

require('yargs')
  .command('list', 'Retrieve rooms and IDs', yargs => {
    return yargs.usage('$0 [options] list')
      .check(argv => {
        if (!argv.token) {
          argv.token = process.env.GITTER_TOKEN;
        }
        if (!argv.token) {
          return 'Please specify token via "--token <token>" or GITTER_TOKEN ' +
            'environment variable';
        }
        return true;
      });
  }, argv => {
    return new Gitter(argv.token).rooms.findAll()
      .then(roomList => {
        const rooms = roomList.map(room => {
          return `${room.id} : ${room.name}\n`;
        });
        rooms.forEach(room => {
          process.stdout.write(room);
        });
      });
  })
  .command('id', 'Retrieve by room ID', yargs => {
    return yargs.usage('$0 [options] id <room_id>')
      .example('id 3053736c7fd756bd5304c876')
      .demand(2, 2, 'Please specify "id <room_id>"')
      .check(argv => {
        if (!argv.token) {
          argv.token = process.env.GITTER_TOKEN;
        }
        if (!argv.token) {
          return 'Please specify token via "--token <token>" or GITTER_TOKEN ' +
            'environment variable';
        }
        if (!/^[a-zA-Z0-9]{24}$/.test(argv._[1])) {
          return 'Invalid room ID';
        }
        argv.roomId = argv._[1];
        return true;
      });
  }, argv => {
    return new Gitter(argv.token).rooms.find(argv.roomId)
      .then(room => {
        const messages = [];
        return Promise.coroutine(function* (limit) {
          let result;
          let beforeId;
          do {
            result = yield room.chatMessages({
              limit,
              beforeId
            });
            if (result.length) {
              messages.push(...result);
              beforeId = result[0].id;
              process.stderr.write('.');
            }
          } while (result.length);
          process.stderr.write('\n');
          return messages;
        })(PER_PAGE);
      })
      .then(messages => {
        process.stdout.write(JSON.stringify(messages, null, 2));
        process.stdout.write('\n');
      })
      .catch(err => {
        throw err;
      });
  })
  .demand(1, 'Please specify "id <room_id>" ')
  .strict()
  .usage('$0 [options] <command>')
  .showHelpOnFail(true)
  .help()
  .version()
  .options({
    token: {
      type: 'string',
      describe: 'Personal OAuth Gitter token; or use GITTER_TOKEN env var',
      global: true
    }
  }).argv;
