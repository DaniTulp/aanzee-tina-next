import { SDK as DirectusSDK } from "@directus/sdk-js";
import {
  IConfigurationOptions,
  IStorageAPI
} from "@directus/sdk-js/dist/types/Configuration";
import { IAuthenticateResponse } from "@directus/sdk-js/dist/types/schemes/auth/Authenticate";
import {
  ILoginBody,
  ILoginCredentials,
  ILoginOptions
} from "@directus/sdk-js/dist/types/schemes/auth/Login";

export function createServerClient(options: {
  url: string;
  project: string;
  token: string;
}) {
  return new DirectusSDK({
    mode: "jwt",
    ...options,
  });
}

export function createBrowserClient(options: { url: string; project: string }) {
  return SDK.getInstance({
    mode: "jwt",
    persist: true,
    storage:
      typeof window !== "undefined"
        ? (window.sessionStorage as IStorageAPI)
        : null,
    ...options,
  });
}

/**
 * Created this as a singleton because each time a browser client is created
 * it fires of a refresh event.
 */
class SDK extends DirectusSDK {
  private static instance: DirectusSDK;
  private constructor(options: IConfigurationOptions) {
    super(options);
  }

  public static getInstance(options: IConfigurationOptions) {
    if (!SDK.instance) {
      SDK.instance = new SDK(options);
    }
    return SDK.instance;
  }

  private startInterval(fireImmediately?: boolean): void {
    if (fireImmediately) {
      this.refreshIfNeeded();
    }

    this.api.auth.refreshInterval = setInterval(
      this.refreshIfNeeded.bind(this),
      10000
    ) as any;
  }

  /**
   * The provided login method is really stupid and throws non-catchable errors.
   * @param credentials
   * @param options
   */
  public login(
    credentials: ILoginCredentials,
    options?: ILoginOptions
  ): Promise<IAuthenticateResponse> {
    this.config.token = undefined;

    if (
      credentials.persist ||
      (options && options.persist) ||
      this.config.persist
    ) {
      // use interval for login refresh when option persist enabled
      this.startInterval();
    }

    let body: ILoginBody = {
      email: credentials.email,
      password: credentials.password,
      mode: "jwt",
    };

    if (this.config.mode === "cookie") {
      body.mode = "cookie";
    }

    if (credentials.otp) {
      body.otp = credentials.otp;
    }

    const activeRequest = this.api.post("/auth/authenticate", body);

    if (this.config.mode === "jwt") {
      activeRequest
        .then((res: IAuthenticateResponse) => {
          // save new token in configuration
          this.config.token = res.data.token;
          return res;
        })
        .then((res: IAuthenticateResponse) => {
          this.config.token = res.data.token;
          this.config.localExp = new Date(
            Date.now() + (this.config.tokenExpirationTime || 0)
          ).getTime();

          return res;
        })
        .catch((error) => error);
    }

    return activeRequest;
  }
}
