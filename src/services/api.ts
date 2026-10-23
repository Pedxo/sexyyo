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

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

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
