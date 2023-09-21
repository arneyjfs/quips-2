import OpenAIClient from "@/repositories/Clients/OpenAIClient";

const resource = '/chat/completions';

console.log(OpenAIClient.get('models'))

export default {
    generate_response(messages) {

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        const data = {
            "model": "gpt-4-0613",
            "temperature": 0.5,
            "top_p": 0.5,
            "messages": messages.concat([{"role": "user", "content": 'Instruction: generate JSON suggestions'}])
        }

        return OpenAIClient.post(`${resource}`, data, config);
    },

    modify_response(messages, response, hint) {

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        const data = {
            "model": "gpt-4-0613",
            "temperature": 0.5,
            "top_p": 0.5,
            "messages": messages.concat([
                {
                    "role": "user",
                    "content": `Instruction: given the context of the conversation, suggest alternatives to '`
                        + response + `' with the following hint: '` + hint + `'. Respond with alternatives in JSON.`
                }])
        }

        return OpenAIClient.post(`${resource}`, data, config);
    },

    modify_all_responses(messages, all_responses, hint) {

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        const data = {
            "model": "gpt-4-0613",
            "temperature": 0.5,
            "top_p": 0.5,
            "messages": messages.concat([
                {
                    "role": "user",
                    "content": `Instruction: Your previous suggestions were: '` + all_responses.join(`', '`)
                        + `'. Given the context of the conversation, make alternatives suggestions based off the following hint: '`
                        + hint + `'. Respond with alternatives in JSON.`
                }])
        }

        return OpenAIClient.post(`${resource}`, data, config);
    },

    generateConversationStarters(messages) {

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        const data = {
            "model": "gpt-4-0613",
            "temperature": 1,
            "top_p": 1,
            "messages": messages.concat([
                {
                    "role": "user",
                    "content": `Instruction: Generate conversation starters'. Respond with suggestions in JSON.`
                }])
        }

        return OpenAIClient.post(`${resource}`, data, config);
    },

    generateConversationStartersWithHint(messages, hint) {

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        const data = {
            "model": "gpt-4-0613",
            "temperature": 1,
            "top_p": 1,
            "messages": messages.concat([
                {
                    "role": "user",
                    "content": `Instruction: Generate conversation starters based on the following hint: '` + hint +
                        `'. Respond with suggestions in JSON.`
                }])
        }

        return OpenAIClient.post(`${resource}`, data, config);
    }
};