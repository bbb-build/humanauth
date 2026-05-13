interface AgentRow {
  id: string;
  user_id: string;
  address: string;
  encrypted_private_key: string;
  agentbook_tx_hash: string | null;
  scopes: string[];
  created_at: string;
  revoked_at: string | null;
  last_used_at: string | null;
}

type Filter = {
  column: keyof AgentRow;
  op: "eq" | "is";
  value: unknown;
};

let sequence = 0;

export const agentRows: AgentRow[] = [];

export function resetSupabaseMock(): void {
  sequence = 0;
  agentRows.splice(0, agentRows.length);
}

function nextId(): string {
  sequence += 1;
  return `00000000-0000-4000-8000-${sequence.toString().padStart(12, "0")}`;
}

function matches(row: AgentRow, filters: Filter[]): boolean {
  return filters.every((filter) => {
    if (filter.op === "eq") return row[filter.column] === filter.value;
    if (filter.value === null) return row[filter.column] === null;
    return row[filter.column] === filter.value;
  });
}

function project(row: AgentRow, columns: string | null): Record<string, unknown> {
  if (!columns || columns === "*") return { ...row };
  const selected = columns.split(",").map((column) => column.trim());
  return Object.fromEntries(selected.map((column) => [column, row[column as keyof AgentRow]]));
}

class QueryBuilder {
  private filters: Filter[] = [];
  private selectColumns: string | null = null;

  constructor(
    private readonly operation: "select" | "insert" | "update",
    private readonly payload?: Record<string, unknown>,
  ) {}

  select(columns: string): this {
    this.selectColumns = columns;
    return this;
  }

  eq(column: keyof AgentRow, value: unknown): this {
    this.filters.push({ column, op: "eq", value });
    return this;
  }

  is(column: keyof AgentRow, value: unknown): this {
    this.filters.push({ column, op: "is", value });
    return this;
  }

  order(_column: keyof AgentRow, _opts: { ascending: boolean }): this {
    return this;
  }

  single<T>(): Promise<{ data: T | null; error: null }> {
    if (this.operation !== "insert" || !this.payload) {
      throw new Error("single is only implemented for insert in this mock");
    }
    const row: AgentRow = {
      id: nextId(),
      user_id: this.payload.user_id as string,
      address: this.payload.address as string,
      encrypted_private_key: this.payload.encrypted_private_key as string,
      agentbook_tx_hash: null,
      scopes: this.payload.scopes as string[],
      created_at: new Date().toISOString(),
      revoked_at: null,
      last_used_at: null,
    };
    agentRows.push(row);
    return Promise.resolve({ data: project(row, this.selectColumns) as T, error: null });
  }

  maybeSingle<T>(): Promise<{ data: T | null; error: null }> {
    const row = agentRows.find((candidate) => matches(candidate, this.filters));
    return Promise.resolve({
      data: row ? (project(row, this.selectColumns) as T) : null,
      error: null,
    });
  }

  then<TResult1 = { data: unknown[] | null; error: null }, TResult2 = never>(
    onfulfilled?: ((value: { data: unknown[] | null; error: null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  private execute(): Promise<{ data: unknown[] | null; error: null }> {
    if (this.operation === "update" && this.payload) {
      for (const row of agentRows.filter((candidate) => matches(candidate, this.filters))) {
        Object.assign(row, this.payload);
      }
      return Promise.resolve({ data: null, error: null });
    }

    const rows = agentRows
      .filter((candidate) => matches(candidate, this.filters))
      .map((row) => project(row, this.selectColumns));
    return Promise.resolve({ data: rows, error: null });
  }
}

export function getSupabaseAdminMock() {
  return {
    from(table: string) {
      if (table !== "ha_agents") throw new Error(`Unexpected table: ${table}`);
      return {
        insert(payload: Record<string, unknown>) {
          return new QueryBuilder("insert", payload);
        },
        select(columns: string) {
          return new QueryBuilder("select").select(columns);
        },
        update(payload: Record<string, unknown>) {
          return new QueryBuilder("update", payload);
        },
      };
    },
  };
}
