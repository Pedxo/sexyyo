const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface ApiUser {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  has_pin: boolean;
  created_at?: string;
}

export interface ApiAccount {
  id: number;
  account_number: string;
  account_name: string;
  currency: string;
  symbol: string;
  balance: number;
  formatted_balance?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: ApiUser;
  accounts: ApiAccount[];
}

export interface CheckoutPayload {
  amount: number;
  currency: string;
  order_id: string;
  narration?: string;
  pin?: string;
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  reference: string;
  order_id: string;
  amount: number;
  currency: string;
  new_balance: number;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem("pedxo_auth_token");
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("pedxo_auth_token", token);
    } else {
      localStorage.removeItem("pedxo_auth_token");
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem("pedxo_auth_token");
    }
    return this.token;
  }

  async ensureToken(): Promise<string> {
    if (this.token) return this.token;
    const stored = localStorage.getItem("pedxo_auth_token");
    if (stored) {
      this.token = stored;
      return stored;
    }

    // Auto-login or register demo test user so direct route testing works out of the box
    try {
      const loginRes = await this.login({
        email: "demo@pedxo.com",
        password: "Password123!",
      });
      return loginRes.token;
    } catch {
      try {
        const regRes = await this.register({
          email: "demo@pedxo.com",
          password: "Password123!",
          first_name: "Clarissa",
          last_name: "Adeleke",
          transaction_pin: "123456",
        });
        return regRes.token;
      } catch (err: any) {
        console.warn("Auto-token generation failed:", err);
        return "";
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // If route requires auth and we don't have token, attempt auto-auth
    let token = this.getToken();
    if (!token && !endpoint.includes("/sexyyo/auth/login") && !endpoint.includes("/sexyyo/auth/register")) {
      token = await this.ensureToken();
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage =
        data.message || data.error || `HTTP error! status: ${response.status}`;
      const err = new Error(
        Array.isArray(errorMessage) ? errorMessage[0] : errorMessage
      );
      (err as any).data = data;
      (err as any).status = response.status;
      throw err;
    }

    return data as T;
  }

  // --- Auth APIs ---

  async register(payload: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    transaction_pin?: string;
  }): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>("/sexyyo/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (res.token) {
      this.setToken(res.token);
    }
    return res;
  }

  async login(payload: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>("/sexyyo/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (res.token) {
      this.setToken(res.token);
    }
    return res;
  }

  async getMe(): Promise<{ user: ApiUser; accounts: ApiAccount[] }> {
    return this.request<{ user: ApiUser; accounts: ApiAccount[] }>(
      "/sexyyo/auth/me"
    );
  }

  async setPin(pin: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(
      "/sexyyo/auth/pin",
      {
        method: "POST",
        body: JSON.stringify({ pin }),
      }
    );
  }

  async verifyOtp(
    email: string,
    otp: string
  ): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(
      "/sexyyo/auth/verify-otp",
      {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      }
    );
  }

  // --- Wallet APIs ---

  async getBalances(): Promise<ApiAccount[]> {
    return this.request<ApiAccount[]>("/sexyyo/wallet/balances");
  }

  async getDepositInfo(currency = "USD"): Promise<any> {
    return this.request<any>(
      `/sexyyo/wallet/deposit-info?currency=${encodeURIComponent(currency)}`
    );
  }

  // --- Transaction & Checkout APIs ---

  async checkout(payload: CheckoutPayload): Promise<CheckoutResponse> {
    return this.request<CheckoutResponse>("/sexyyo/transaction/checkout", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async getTransactionHistory(limit = 20, offset = 0): Promise<any> {
    return this.request<any>(
      `/sexyyo/transaction/history?limit=${limit}&offset=${offset}`
    );
  }

  async transfer(payload: {
    recipient_account_number: string;
    amount: number;
    currency: string;
    narration?: string;
    pin?: string;
  }): Promise<any> {
    return this.request<any>("/sexyyo/transaction/transfer", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async withdraw(payload: {
    currency: string;
    amount: number;
    destination_type: "bank" | "crypto";
    destination_account: string;
    bank_name?: string;
    crypto_network?: string;
    narration?: string;
    pin?: string;
  }): Promise<any> {
    return this.request<any>("/sexyyo/transaction/withdraw", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async lookupRecipient(query: string, currency: string): Promise<any> {
    return this.request<any>(
      `/sexyyo/transaction/lookup-recipient?query=${encodeURIComponent(
        query
      )}&currency=${encodeURIComponent(currency)}`
    );
  }

  async depositTopUp(payload: {
    account_number: string;
    amount: number;
    currency: string;
    reference?: string;
    narration?: string;
  }): Promise<any> {
    return this.request<any>("/sexyyo/transaction/deposit-topup", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}

export const api = new ApiService();
