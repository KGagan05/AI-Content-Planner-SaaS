import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function run() {
    const customEnv = { ...process.env, API_KEY: "ik_a1f41892de27ea33eccfbaf269777770", API_BASE_URL: "https://pvns8pz7.us-east.insforge.app" };
    const transport = new StdioClientTransport({ command: "npx", args: ["-y", "@insforge/mcp@latest"], env: customEnv });
    const client = new Client({ name: "my-client", version: "1.0.0" }, { capabilities: {} });
    await client.connect(transport);
    const tools = await client.listTools();
    console.log(JSON.stringify(tools, null, 2));
    process.exit(0);
}
run().catch(console.error);
