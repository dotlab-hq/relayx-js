export interface RelayXOptions {
    /**
     * The RelayX API endpoint.
     * @default "https://relayx.wpsadi.dev/api/send-sms"
     */
    endpoint?: string;
}

export interface SendSMSParams {
    /** Phone number including country code (e.g. "+14155552671") */
    number: string;
    /** The SMS message body */
    message: string;
}

export interface SendSMSResponse {
    success: boolean;
    message?: string;
    [key: string]: unknown;
}

const DEFAULT_ENDPOINT = "https://relayx.wpsadi.dev/api/send-sms";

export class RelayX {
    private readonly apiKey: string;
    private readonly endpoint: string;

    /**
     * Create a new RelayX client.
     *
     * @param apiKey  Your RelayX API key. Omit to fall back to the
     *                `RELAYX_API_KEY` environment variable.
     * @param options Optional configuration.
     */
    constructor( apiKey?: string, options?: RelayXOptions ) {
        const resolvedKey = apiKey ?? process.env["RELAYX_API_KEY"];

        if ( !resolvedKey ) {
            throw new Error(
                "RelayX: API key is required. " +
                "Pass it as the first argument or set the RELAYX_API_KEY environment variable.",
            );
        }

        this.apiKey = resolvedKey;
        this.endpoint = options?.endpoint ?? DEFAULT_ENDPOINT;
    }

    /**
     * Send an SMS message.
     *
     * @param params  `number` (with country code) and `message`.
     * @returns       The API response.
     * @throws        On network errors or non-2xx HTTP responses.
     */
    async sendSMS( params: SendSMSParams ): Promise<SendSMSResponse> {
        const { number, message } = params;

        if ( !number || typeof number !== "string" ) {
            throw new TypeError(
                "RelayX: `number` must be a non-empty string with a country code.",
            );
        }

        if ( !message || typeof message !== "string" ) {
            throw new TypeError( "RelayX: `message` must be a non-empty string." );
        }

        const response = await fetch( this.endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify( { number, message } ),
        } );

        if ( !response.ok ) {
            const body = await response.text().catch( () => "(empty)" );
            throw new Error( `RelayX: API error ${response.status} – ${body}` );
        }

        return ( await response.json() ) as SendSMSResponse;
    }
}

export default RelayX;
