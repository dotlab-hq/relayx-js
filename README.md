# @dotlab-hq/relayx-js

Official JavaScript / TypeScript SDK for the [RelayX](https://relayx.wpsadi.dev) SMS API.

## Installation

```bash
# npm
npm install @dotlab-hq/relayx-js

# yarn
yarn add @dotlab-hq/relayx-js

# pnpm
pnpm add @dotlab-hq/relayx-js

# bun
bun add @dotlab-hq/relayx-js
```

## Quick start

```ts
import RelayX from "@dotlab-hq/relayx-js";

const relayx = new RelayX("your-api-key");

const result = await relayx.sendSMS({
  number: "+14155552671", // with country code
  message: "Hello from RelayX!",
});

console.log(result);
```

## Configuration

### `new RelayX(apiKey?, options?)`

| Parameter | Type | Default | Description |
|---|---|---|---|
| `apiKey` | `string` | `process.env.RELAYX_API_KEY` | Your RelayX API key. If omitted the SDK reads `RELAYX_API_KEY` from the environment. |
| `options.endpoint` | `string` | `https://relayx.wpsadi.dev/api/send-sms` | Override the API endpoint (useful for self-hosted deployments or testing). |

### API key from environment

Set `RELAYX_API_KEY` in your environment and omit the first argument:

```ts
// process.env.RELAYX_API_KEY is read automatically
const relayx = new RelayX();
```

### Custom endpoint

```ts
const relayx = new RelayX("your-api-key", {
  endpoint: "https://my-proxy.example.com/send-sms",
});
```

## Methods

### `relayx.sendSMS(params)`

Send an SMS message.

**Parameters**

| Field | Type | Description |
|---|---|---|
| `number` | `string` | Recipient phone number **including the country code** (e.g. `"+14155552671"`). |
| `message` | `string` | The text body of the SMS. |

**Returns** `Promise<SendSMSResponse>`

```ts
interface SendSMSResponse {
  success: boolean;
  message?: string;
  [key: string]: unknown;
}
```

**Example**

```ts
const response = await relayx.sendSMS({
  number: "+14155552671",
  message: "Your verification code is 123456",
});

if (response.success) {
  console.log("SMS sent!");
}
```

**Errors**

The method throws an `Error` for:

- Missing or empty `number` / `message`.
- Non-2xx HTTP responses from the API (the status code and response body are included in the error message).
- Network-level failures.

## TypeScript

The package ships its own `.d.ts` declarations — no additional `@types` package needed.

```ts
import RelayX, { type SendSMSParams, type SendSMSResponse } from "@dotlab-hq/relayx-js";
```

## License

MIT
