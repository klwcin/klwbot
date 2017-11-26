// Requires and libs set
const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const google = require('google')
const NaturalLanguageUnderstandingV1 =
        require('watson-developer-cloud/natural-language-understanding/v1.js')
const LanguageTranslatorV2 = require('watson-developer-cloud/language-translator/v2')
//const ConversationV1 = require('watson-developer-cloud/conversation/v1')

// Set results page size for Google search
google.resultsPerPage = 5

// Variables (IBM Watson)
var language_translator = new LanguageTranslatorV2({
    username: process.env.LANGUAGE_USER,
    password: process.env.LANGUAGE_PASS,
    url: 'https://gateway.watsonplatform.net/language-translator/api'
})
var nlu = new NaturalLanguageUnderstandingV1({
    username: process.env.NLU_USER,
    password: process.env.NLU_PASS,
    version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2017_02_27
})
/*var conversation = new ConversationV1({
    username: process.env.CONVERSATION_USER,
    password: process.env.CONVERSATION_PASS,
    version_date: ConversationV1.VERSION_DATE_2017_05_26
})*/

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
            'Tá beleza @' + $.message.from.username + ', saca só o que temos por enquanto:\n\n' +
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
        var user = $.message.from.username

        // Is a question
        if ($.message.text.toLowerCase().includes('?')) {
            // Search on Google
            this.searchHandler($)
        // Not a question
        } else {
            $.sendMessage('Olá @' + user + '. Quais as novas?')
            // Wait for response
            $.waitForRequest.then(($) => {
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
                    $.waitForRequest.then(($) => {
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
     * Says the hour in server
     * @param {Scope} $ 
     */
    hourHandler($) {
        $.sendMessage(
            'A hora aqui no servidor agora é: ' +
            new Date().toLocaleTimeString() + 'h.'
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
     * Natural language Understanding
     * (translate from portuguese to english before analyse)
     * @param {Scope} $ 
     */
    nluHandler($) {
        language_translator.translate({
            text: $.message.text, source : 'pt', target: 'en' 
        }, (err, translation) => {
            if (err) {
                console.log('error:', err)
            } else {
                var trans = translation.translations[0].translation
                nlu.analyze({
                    'html': trans,
                    'features': {
                      'concepts': {},
                      'keywords': {},
                      'emotion': {},
                      'categories': {},
                      //'entities': {},
                      //'metadata': {},
                      //'relations': {},
                      //'semantic_roles': {},
                      'sentiment': {}
                    }
                }, (err, response) => {
                    if (err) {
                        console.log('error:', err)
                    } else {
                        console.log(JSON.stringify(response, null, 2))
                        $.sendMessage('É sobre esse tema que estamos falando né?')
                        $.sendMessage(response.concepts[0].dbpedia_resource)
                    }
                })
            }
        })

        /*conversation.message({
            input: { text: $.message.text },
            workspace_id: process.env.CONVERSATION_WORKSPACE_ID
           }, function(err, response) {
               if (err) {
                 console.error(err)
               } else {
                 console.log(JSON.stringify(response, null, 2))
               }
        })*/
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
            'toastCommand': 'toastHandler',
            'nluCommand': 'nluHandler'
        }
    }
}