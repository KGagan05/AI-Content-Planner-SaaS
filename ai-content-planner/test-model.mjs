import { createClient } from '@insforge/sdk';

const insforge = createClient({
    baseUrl: 'https://pvns8pz7.us-east.insforge.app',
    anonKey: 'ik_a1f41892de27ea33eccfbaf269777770'
});

async function run() {
    console.log("Testing gpt-4o-mini...");
    try {
        const completion = await insforge.ai.chat.completions.create({
            model: 'openai/gpt-4o-mini',
            messages: [{ role: 'user', content: 'Say hello' }]
        });
        console.log("Response:", completion.choices[0].message.content);
    } catch (err) {
        console.error("Error:", err.message || err);
    }
}
run();
