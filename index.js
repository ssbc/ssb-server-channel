const FlumeView = require('flumeview-reduce')
const get = require('lodash/get')
const set = require('lodash/set')

const FLUME_VIEW_VERSION = 1.0

module.exports = {
  name: 'channel',
  version: require('./package.json').version,
  manifest: {
    get: 'async',
    stream: 'source',
    subscription: 'async'
  },
  init: (server, config) => {
    console.log('///// CHANNELS plugin loaded /////')

    const view = server._flumeUse(
      'channels',
      FlumeView(FLUME_VIEW_VERSION, reduce, map, null, initialState())
    )

    return {
      get: view.get,
      subscription: view.get,
      stream: view.stream,
    }
  }
}

function initialState() {
  return {}
}


function map(msg) {
  if (get(msg, 'value.content.type') !== 'channel') return null

  const author = msg.value.author
  const channel = get(msg, 'value.content.channel')
  const subscribed = get(msg, 'value.content.subscribed')

  if (typeof channel === undefined || typeof subscribed === undefined) {
    console.log('Malformed channel subscription', msg)
    return null
  }

  return {
    channel,
    author,
    subscribed
  }
}

function reduce(soFar, newSub) {
  process.stdout.write('c')
  const { channel, author, subscribed } = newSub

  let channelSubs = get(soFar, [channel], [])

  channelSubs = new Set(channelSubs)

  if (subscribed) {
    channelSubs.add(author)
  } else {
    channelSubs.delete(author)
  }

  soFar[channel] = [...channelSubs]

  return soFar
}

// state: 
// {
//   [Channel]: [ Set
//     FeedId
//   ]
// }


// {
//   'ssb-learning': [
//     '@ye14....',
//     '@weandre..',
//   ],
//   'brazil': [
//     '@weandre..',
//   ]
// }

// channel message: 
// value: {
//   author: FeedId,
//   content: {
//     {
//       type: 'channel',
//       channel: String,    // ssb-learning
//       subscribed: Boolean
//     }
//   }
// }

