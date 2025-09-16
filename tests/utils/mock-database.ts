import { vi } from 'vitest';

// Enhanced mock database that properly simulates Drizzle query patterns
export function createMockDb() {
  const storedData: Map<string, any[]> = new Map();
  let idCounter = 1;

  // Initialize tables
  storedData.set('posts', []);

  function getTableData(tableName: string) {
    return storedData.get(tableName) || [];
  }

  function addToTable(tableName: string, data: any) {
    const tableData = getTableData(tableName);
    tableData.push(data);
    storedData.set(tableName, tableData);
  }

  function clearAllTables() {
    storedData.set('posts', []);
    idCounter = 1;
  }

  return {
    insert: vi.fn().mockImplementation((table) => {
      const tableName = 'posts'; // We only handle posts for now

      return {
        values: vi.fn().mockImplementation((data) => {
          const insertedData = {
            ...data,
            id: String(idCounter++),
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          addToTable(tableName, insertedData);

          return {
            returning: vi.fn().mockResolvedValue([insertedData]),
          };
        }),
      };
    }),

    select: vi.fn().mockReturnValue({
      from: vi.fn().mockImplementation((table) => {
        const tableName = 'posts';

        const createQueryBuilder = (data: any[]) => {
          const queryBuilder = {
            where: vi.fn().mockImplementation((condition) => {
              // For posts table, apply basic filtering
              // This is a simplified version - in reality we'd parse the condition
              let filteredData = data;

              // Simple heuristic: filter to published posts by default
              // unless we detect specific patterns
              if (tableName === 'posts') {
                // Basic published filtering for most queries
                filteredData = data.filter((item) => item.published === true);
              }

              return createQueryBuilder(filteredData);
            }),
            orderBy: vi.fn().mockImplementation((orderClause) => {
              const sortedData = [...data].reverse(); // Most recent first
              return createQueryBuilder(sortedData);
            }),
            limit: vi.fn().mockImplementation((limitValue) => {
              const limitedData = data.slice(0, limitValue);
              return createQueryBuilder(limitedData);
            }),
            offset: vi.fn().mockImplementation((offsetValue) => {
              const offsetData = data.slice(offsetValue);
              return createQueryBuilder(offsetData);
            }),
            then: (resolve: any) => {
              return Promise.resolve(data).then(resolve);
            },
          };

          // Make it thenable
          Object.defineProperty(queryBuilder, Symbol.toStringTag, { value: 'Promise' });
          return queryBuilder;
        };

        const tableData = getTableData(tableName);
        return createQueryBuilder(tableData);
      }),
    }),

    update: vi.fn().mockImplementation((table) => {
      const tableName = 'posts';

      return {
        set: vi.fn().mockImplementation((updateData) => ({
          where: vi.fn().mockImplementation((condition) => {
            const tableData = getTableData(tableName);
            if (tableData.length > 0) {
              const originalItem = tableData[0];
              const updatedItem = {
                ...originalItem,
                ...updateData,
                updatedAt: new Date(Date.now() + 1000), // Ensure different timestamp
              };
              // Update the item in the table
              tableData[0] = updatedItem;
              storedData.set(tableName, tableData);

              return {
                returning: vi.fn().mockResolvedValue([updatedItem]),
              };
            }

            return {
              returning: vi.fn().mockResolvedValue([]),
            };
          }),
        })),
      };
    }),

    delete: vi.fn().mockImplementation((table) => {
      const tableName = 'posts';

      return {
        where: vi.fn().mockImplementation((condition) => {
          const tableData = getTableData(tableName);
          if (tableData.length > 0) {
            tableData.splice(0, 1);
            storedData.set(tableName, tableData);
          }
          return Promise.resolve();
        }),
      };
    }),

    // Helper method for tests
    clearAll: () => clearAllTables(),
  };
}
