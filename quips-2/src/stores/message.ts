import {ref} from 'vue'
import {defineStore} from 'pinia'
import {SystemContext} from '@/stores/chatGPTSystemContext'

export const useMessageStore = defineStore('ChatHistory', () => {
    // const count = ref(0)
    const messages = ref(
        [
            {"role": "system", "content": SystemContext},
            {
                "role": "user", "content": `
            {
  "type": "context change",
  "context": {
    "datetime": "01/01/2023 13:15”,
    "location": "London",
    "specific location": "pub",
    "interlocutor": {
      "name": "Lucy",
      "gender": "female",
      "relation": "wife",
      "age": "40",
      "other info": "loves classical music, poetry, and long walks. Married to you for 20 years."
    },
    "current context": "James just watched his favourite football team, Manchester United, lose in the FA Cup Final",
  }
}`
            }
        ]
    );
    function addMessage(messageBody) {
        messages.value.push(messageBody)
    }

    return {messages}
})
