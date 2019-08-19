// Requires and libs set
const KlwbotBaseController = require('./KlwbotBaseController')
const User = require('../models/User')
const google = require('google')

// Set results page size for Google search
google.resultsPerPage = 5

/**
 * Controls the bot conversation and responses
 */
module.exports = class ConversationController extends KlwbotBaseController {
    /**
     * Handler used to say hello as '/start'
     * @param {Scope} $
     */
    startHandler($) {
        $.sendMessage(
            'E aí galera? Se for rolar um café, tamos aí.' +
            ' É só mandar um /remind que eu lembro todo mundo.' +
            '\nSe precisarem de mim é só me chamar (@klwbot).\n\n' +
            'Ou, em caso de dúvidas... é só mandar um /help que eu explico melhor. 😉'
        )
    }

    /**
     * Handler used to explain all commands
     * @param {Scope} $
     */
    helpHandler($) {
        $.sendMessage(
            'Tá beleza @' + this.user.username + ', saca só o que temos por enquanto:\n\n' +
            '/start: Manda aquela mensagem inicial de boas vindas, não dever ser mais útil agora.\n\n' +
            '/help: Bem, aqui estamos, né?\n\n' +
            '/hour: Diz a hora aqui no meu servidor. Vai que estamos em horários diferentes né?\n\n' +
            '/place: Manda a localização da Sala 2 (B010). Não é tão útil, na verdade.\n\n' +
            '/me: Pede sua localização e compara com a da Sala 2 (B010). Pra saber se você está perto.\n\n' +
            '/toast: Me chama pra brindar.\n\n' +
            '/search $term: Faz uma busca rápida no Google usando $term como parâmetro.' +
            ' Mas sem abusar, só 5 resultados. Não quero deixar meu amigo Google com raiva.\n\n' +
            '/remind $time: Bem, se não passar o $time, vai lembrar a galera nas horas padrão.' +
            ' Se passar o $time, cria um reminder para a hora escolhida (O formado é hh:mm).\n\n' +
            '/stop: Apaga o reminder das horas padrão. Por favor evite fazer isso. Sério mesmo.\n\n' +
            'No mais, você sempre pode tentar conversar comigo me mencionando (@klwbot).' +
            ' Vou fazer meu possível para responder.'
        )
    }

    /**
     * Handler used to respond to bot direct mentions
     * @param {Scope} $
     */
    mentionHandler($) {
        // Is a question
        if ($.message.text.toLowerCase().includes('?')) {
            // Search on Google
            this.searchHandler($)
            // Not a question
        } else {
            $.sendMessage('Olá @' + this.user.username + '. Quais as novas?')
            // Wait for response
            $.waitForRequest.then(($) => {
                // Same user
                if ($.message.from.username === this.user.username) {
                    $.sendMessage('Interessante... mas não sei o que dizer sobre isso. 🤔')
                    // Other user
                } else {
                    $.sendMessage(
                        `Só um momento @${$.message.from.username}` +
                        'vou só responder @' + this.user.username + 'rapidinho. 😁'
                    )

                    // Wait again
                    $.waitForRequest.then(($) => {
                        // Same user
                        if ($.message.from.username === this.user.username) {
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
        let searchTerm = $.message.text.toLowerCase().replace(/@klwbot/gi, '').replace(/\/search /gi, '')

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
                // For each link, send a message, or pass the search if no links received
                if (res.links.length == 0) {
                    $.sendMessage(
                        'Infelizmente não consegui parsear as respostas do Google pra você sobre isso, ' +
                        'mas posso te passar o link da minha pesquisa:'
                    )
                    $.sendMessage(res.url)
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

                    res.links.forEach(link => {
                        if (link.href !== null) {
                            $.sendMessage(link.href)
                        }
                    })
                }
            }
        })
    }

    /**
     * Says the hour in server
     * @param {Scope} $ 
     */
    hourHandler($) {
        let dateString = new Date().toLocaleTimeString()
        if (!dateString.includes('M')) {
            dateString = dateString + 'h'
        }

        $.sendMessage(
            'A hora aqui no servidor agora é: ' +
            dateString + '.'
        )
    }

    /**
     * Toasts
     * @param {Scope} $ 
     */
    toastHandler($) {
        $.sendMessage(
            'Um brinde a nós! E ao grande Kopi Luwak. ☕'
        )
    }

    /**
     * Return handlers as commands
     */
    get routes() {
        return {
            'startCommand': 'startHandler',
            'mentionCommand': 'mentionHandler',
            'searchCommand': 'searchHandler',
            'helpCommand': 'helpHandler',
            'hourCommand': 'hourHandler',
            'toastCommand': 'toastHandler'
        }
    }
}