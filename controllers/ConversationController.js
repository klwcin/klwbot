// Requires and libs set
const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const google = require('google')

// Set results page size for Google search
google.resultsPerPage = 5

/**
 * Controls the bot conversation and responses
 */
module.exports = class ConversationController extends TelegramBaseController {
    /**
     * Handler used to say hello as '/start'
     * @param {Scope} $
     */
    startHandler($) {
        $.sendMessage(
            'E aí galera? Se for rolar um café, tamos aí, ' + 
            'é só mandar um /remind que eu lembro todo mundo.' +
            '\nOutra coisa... lembram de onde fica a sala 2 né (B010)? ' +
            'se tiverem esquecido, é só mandar um /place que eu mostro.' +
            '\nSe precisarem de mim é só me chamar (@klwbot).'
        )
    }

    /**
     * Handler used to respond to bot direct mentions
     * @param {Scope} $
     */
    mentionHandler($) {
        var user = $.message.from.username

        // Is a question
        if ($.message.text.toLowerCase().includes('?')) {
            // Search on Google
            this.searchHandler($)
        // Not a question
        } else {
            $.sendMessage('Olá @' + user + '. Quais as novas?')
            // Wait for response
            $.waitForRequest.then($ => {
                // Same user
                if ($.message.from.username === user) {
                    $.sendMessage('Interessante... mas não sei o que dizer sobre isso. 🤔')
                // Other user
                } else {
                    $.sendMessage(
                        `Só um momento @${$.message.from.username}` +
                        'vou só responder @' + user + 'rapidinho. 😁'
                    )
    
                    // Wait again
                    $.waitForRequest.then($ => {
                        // Same user
                        if ($.message.from.username === user) {
                            $.sendMessage('Tem muita gente falando aqui. Depois a gente conversa.')
                        // Other user again
                        } else {
                            $.sendMessage('Calem-se! Calem-se! Vocês me deixam looouuuco! 😡😡😡')
                        }
                    })
                }
            })
        }
    }

    /**
     * Handle Google search
     * @param {Scope} $ 
     */
    searchHandler($) {
        //Remove mention from search
        var searchTerm = $.message.text.toLowerCase().replace(/@klwbot/gi, '')

        // Search on google
        google(searchTerm, (err, res) => {
            // Log the error, if is the case
            if (err) {
                if ($.message.text.toLowerCase().includes('@klwbot')) {
                    $.sendMessage('Interessante... mas não sei o que dizer sobre isso. 🤔')
                } else {
                    $.sendMessage('Infelizmente eu não achei nada cara... 🤷‍♂️')
                }
                console.error(err)
            // Use the results
            } else {
                // Respond to user to wait
                if ($.message.text.toLowerCase().includes('@klwbot')) {
                    $.sendMessage(
                        'Sabe, eu não sei muita coisa sobre isso, ' +
                        'mas pelas minhas pesquisas, talvez esses links ajudem:'
                    )
                } else {
                    $.sendMessage('Olha, eu achei isso aqui, espero que ajude:')
                }

                // For each link, send a message
                res.links.forEach(link => {
                    if (link.href !== null) {
                        $.sendMessage(link.href)
                    }
                })
            }
        })
    }

    /**
     * Return handlers as commands
     */
    get routes() {
        return {
            'startCommand': 'startHandler',
            'mentionCommand': 'mentionHandler',
            'searchCommand': 'searchHandler'
        }
    }
}