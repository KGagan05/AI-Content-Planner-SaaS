import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import fs from "fs";

async function run() {
    const customEnv = { ...process.env };
    customEnv.API_KEY = "ik_a1f41892de27ea33eccfbaf269777770";
    customEnv.API_BASE_URL = "https://pvns8pz7.us-east.insforge.app";

    const transport = new StdioClientTransport({
        command: "npx",
        args: ["-y", "@insforge/mcp@latest"],
        env: customEnv
    });

    const client = new Client({ name: "my-client", version: "1.0.0" }, { capabilities: {} });
    await client.connect(transport);

    console.log("Fetching auth-sdk...");
    const result = await client.callTool({ name: "fetch-docs", arguments: { docType: "auth-sdk" } });
    if (!result.isError) {
        fs.writeFileSync('auth-sdk.md', result.content[0].text);
        console.log("Success");
    } else {
        console.error("Error", result);
    }

    process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
