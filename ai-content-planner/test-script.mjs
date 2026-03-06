import { createClient } from '@insforge/sdk';

const insforge = createClient({
    baseUrl: 'https://pvns8pz7.us-east.insforge.app',
    anonKey: 'ik_a1f41892de27ea33eccfbaf269777770'
});

async function run() {
    console.log("Testing AI...");
    try {
        const completion = await insforge.ai.chat.completions.create({
            model: 'openai/gpt-4o',
            messages: [{
                role: 'user',
                content: `Generate 1 idea for a blog post. Return JSON array with title and description.`
            }]
        });
        console.log("AI Response:", completion.choices?.[0]?.message?.content);
    } catch (err) {
        console.error("AI Error:", err.message || err);
    }

    console.log("Testing Fetch Ideas...");
    const { data, error } = await insforge.database.from('content_ideas').select('*').limit(5);
    console.log("DB Ideas Fetch:", { data, error });

    console.log("Testing Fetch Plans...");
    const { data: plans, error: pError } = await insforge.database.from('content_plans').select('*').limit(5);
    console.log("DB Plans Fetch:", { data: plans, error: pError });
}
run();
