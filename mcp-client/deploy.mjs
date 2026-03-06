import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function run() {
    console.log("Setting up client transport...");
    const customEnv = { ...process.env, API_KEY: "ik_a1f41892de27ea33eccfbaf269777770", API_BASE_URL: "https://pvns8pz7.us-east.insforge.app" };
    const transport = new StdioClientTransport({ command: "npx", args: ["-y", "@insforge/mcp@latest"], env: customEnv });
    const client = new Client({ name: "deploy-client", version: "1.0.0" }, { capabilities: {} });
    await client.connect(transport);

    console.log("Calling create-deployment tool for out dir...");
    try {
        const result = await client.callTool({
            name: "create-deployment",
            arguments: {
                sourceDirectory: "/tmp/ai-content-planner-dist",
                projectSettings: {
                    buildCommand: null,
                    outputDirectory: null,
                    installCommand: null,
                    devCommand: null,
                    rootDirectory: null
                },
                envVars: [],
                meta: { description: "Production Deployment (Static Content)" }
            }
        });

        console.log("Deployment Result:");
        console.log(JSON.stringify(result, null, 2));
    } catch (e) {
        console.error("Error calling create-deployment tool:", e);
    }

    process.exit(0);
}
run().catch(console.error);
