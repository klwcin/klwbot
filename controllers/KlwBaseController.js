// Requires and libs set
const Textract = require('textract')
const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const NaturalLanguageUnderstandingV1 =
    require('watson-developer-cloud/natural-language-understanding/v1.js')
const LanguageTranslatorV2 = require('watson-developer-cloud/language-translator/v2')
//const ConversationV1 = require('watson-developer-cloud/conversation/v1')

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
 * Base Controller for application
 */
module.exports = class KlwBaseController extends TelegramBaseController {
    /**
     * Manage the scope in runtime
     * @param {Scope} $ 
     */
    before($) {
        // Add async function to analyse text into scope
        $.analyse = async (term = '******') => {
            // Create promise to await the response
            // and resolve promise (res) in right time
            await new Promise((res) => {
                var txt = $.message.text.toLowerCase()
                            .replace(new RegExp(term,'gi'), '').trim()

                // If is a link
                if (
                    txt.startsWith('http') ||
                    txt.startsWith('www')
                ) {
                    // Get text from page
                    Textract.fromUrl(txt, (error, text) => {
                        if (error) {
                            console.log('error:', error)
                        } else {
                            txt = text
                        }

                        // Translate and analyse
                        language_translator.translate({
                            text: txt,
                            source : 'pt',
                            target: 'en' 
                        }, (err, translation) => {
                            if (err) {
                                console.log('error:', err)
                                res($)
                            } else {
                                // Append translation to message
                                $.message.translation = translation
        
                                // Append analysis to message
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
                                        res($)
                                    } else {
                                        $.message.analysis = response
                                        // console.log(JSON.stringify($.message.analysis, null, 2))
        
                                        // Resolve promise
                                        res($)
                                    }
                                })
                            }
                        })
                    })
                }
            })
        }

        // Add translation to scope
        $.sendTranslatedMessage = (message) => {
            language_translator.translate({
                text: message,
                source : 'en',
                target: 'pt' 
            }, (err, translation) => {
                if (err) {
                    console.log('error:', err)
                } else {
                    // console.log(JSON.stringify(translation, null, 2))
                    $.sendMessage(
                        translation.translations[0].translation
                    )
                }
            })
        }

        return $

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
}