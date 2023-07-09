import OpenAIClient from "@/repositories/Clients/OpenAIClient";

const resource = '/chat/completions';

console.log(OpenAIClient.get('models'))

export default {
    generate_repsonse(messages) {

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        const data = {
            "model": "gpt-3.5-turbo",
            "temperature": 0.5,
            "top_p": 0.5,
            "messages": messages.concat([{"role": "user", "content": 'Instruction: generate JSON suggestions'}])
        }

        return OpenAIClient.post(`${resource}`, data, config);
    },

    modify_repsonse(messages, response, hint) {

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        const data = {
            "model": "gpt-3.5-turbo",
            "temperature": 0.5,
            "top_p": 0.5,
            "messages": messages.concat([
                {"role": "user", "content": `Instruction: modify the suggestion, '` + response + `'. Hint: ` + hint
                        + '. Respond with more JSON suggestions'}])
        }

        return OpenAIClient.post(`${resource}`, data, config);
    },

    // MANY OTHER ENDPOINT RELATED STUFFS
};
