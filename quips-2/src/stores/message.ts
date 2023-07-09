import {ref} from 'vue'
import {defineStore} from 'pinia'
import {SystemContext} from '@/stores/chatGPTSystemContext'

export const useMessageStore = defineStore('ChatHistory', () => {
    // const count = ref(0)
    const messages = ref([{"role": "system", "content": SystemContext}]);

    const editingMessage = ref('')
// 2) "context change": This tells you when the situation in which the conversation is taking place changes. This could be you are now talking to a new person, are in a new environment, etc. Example (everything following a # symbol is a comment):
// {
//   "type": "context change",
//   "context": {
//     "datetime": "01/01/2023 13:15",  # current date and (approximate) time
//     "location": "London",  # current city
//     "specific location": "pub", # more specific location / type of location. E.g. home, pub, etc.
//     "interlocutor": { # The profile of the person you are currently speaking with
//       "name": "Lucy",
//       "gender": "female",
//       "relation": "wife",
//       "age": "40",
//       "other info": "loves classical music, poetry, and long walks. Married to you for 20 years."
//     },
//     "current context": "just watched your favourite football team, Manchester United, lose in the FA Cup Final", # up to date context of what is happening now
//   }
// }
//
// 3) "modification": This is an instruction to change the last generated responses in the desired way and resend it. There may be many of these after each suggested quip. You should apply the modifications in order, if you send an updated quip and another modification comes back, you should apply the modification to your updated quip, not the original. Example:
//
// {
// \t"type":  "modification",
// \t "text":  "more empathetic"
// }
//             `},
//             {
//                 "role": "user", "content": `
//             {
//   "type": "context change",
//   "context": {
//     "datetime": "01/01/2023 13:15”,
//     "location": "London",
//     "specific location": "pub",
//     "interlocutor": {
//       "name": "Lucy",
//       "gender": "female",
//       "relation": "wife",
//       "age": "40",
//       "other info": "loves classical music, poetry, and long walks. Married to you for 20 years."
//     },
//     "current context": "James just watched his favourite football team, Manchester United, lose in the FA Cup Final",
//   }
// }`

    const addMessage = function (messageBody, role) {
        messages.value.push({
            "role": role, "content": messageBody
        })
    }

    const changeEditMessage = function (message) {
        editingMessage.value = message
    }

    const response = ref([
        "How about the weather lately?",
        "Do you have any plans for the weekend?",
        "What kind of music do you enjoy listening to?"
    ])

    return {messages, editingMessage, addMessage, changeEditMessage, response}
})
