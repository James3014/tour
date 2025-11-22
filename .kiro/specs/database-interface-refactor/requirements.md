# Requirements Document

## Introduction

當前系統有個垃圾設計：為了更新一個 Item，要遍歷所有 Trip、所有 Day、所有 Item（O(n³)）。這不是理論問題，這是真實的性能災難。

**Linus 原則：**
- **數據結構優先**：數據庫應該直接操作 Item，而不是通過 Trip
- **消除特殊情況**：統一用 Zod 驗證，不要手動 if/else
- **簡單實用**：從 MemoryDB 到 Prisma 應該只改一個文件

## Glossary

- **Database**: 數據持久化接口，定義所有數據操作
- **MemoryDB**: 開發用的內存實現
- **Prisma**: 生產用的 ORM
- **Trip**: 旅程（1 個 Trip 有多個 Day）
- **Day**: 天數（1 個 Day 有多個 Item）
- **Item**: 行程項目（屬於 1 個 Day）
- **ChecklistItem**: 檢查清單（屬於 1 個 Trip）
- **PackingItem**: 打包清單（屬於 1 個 Trip）

## Requirements

### Requirement 1

**User Story:** As a developer, I want to update an Item directly, so that I don't have to load 6000 objects to change one title.

#### Acceptance Criteria

1. WHEN the Database updates an Item THEN it SHALL call `updateItem(id, data)` without loading Trip
2. WHEN the Database deletes an Item THEN it SHALL call `deleteItem(id)` without traversing Days
3. WHEN the Database creates an Item THEN it SHALL call `createItem(dayId, data)` and return the new Item
4. WHEN the Database queries an Item THEN it SHALL return the Item in O(1) time
5. IF the parent Day does not exist THEN the Database SHALL throw an error

### Requirement 2

**User Story:** As a developer, I want to add/delete Days dynamically, so that users can customize trip length.

#### Acceptance Criteria

1. WHEN the Database creates a Day THEN it SHALL call `createDay(tripId, data)` and return the new Day
2. WHEN the Database updates a Day THEN it SHALL call `updateDay(id, data)` directly
3. WHEN the Database deletes a Day THEN it SHALL cascade delete all Items in that Day
4. WHEN the Database deletes a Day THEN it SHALL reorder remaining Days' day_index automatically
5. IF the parent Trip does not exist THEN the Database SHALL throw an error

### Requirement 3

**User Story:** As a developer, I want one validation strategy, so that I don't have to remember which endpoint uses what.

#### Acceptance Criteria

1. WHEN any API receives input THEN the system SHALL validate with Zod schemas
2. WHEN validation fails THEN the system SHALL return 400 with Zod error details
3. WHEN a date field is provided THEN the system SHALL use `z.coerce.date()` to handle strings and Dates
4. WHEN an optional field is omitted THEN the system SHALL treat it as undefined (no special case)
5. WHEN a nullable field receives empty string THEN the system SHALL normalize to null

### Requirement 4

**User Story:** As a developer, I want to switch from MemoryDB to Prisma by changing one import, so that migration is trivial.

#### Acceptance Criteria

1. WHEN the Database interface is defined THEN it SHALL use only domain types (no Prisma types)
2. WHEN switching from MemoryDB to Prisma THEN the API layer SHALL change zero lines
3. WHEN the Database implementation changes THEN all tests SHALL pass without modification
4. WHEN Prisma-specific features are needed THEN they SHALL stay inside `lib/db/prisma.ts`
5. THE Database interface SHALL not expose implementation details (no `include`, no `select`)

### Requirement 5

**User Story:** As a frontend developer, I want simple API responses, so that I can update state without transformations.

#### Acceptance Criteria

1. WHEN an Item is updated THEN the API SHALL return the updated Item
2. WHEN an Item is created THEN the API SHALL return the Item with generated ID
3. WHEN an Item is deleted THEN the API SHALL return `{ success: true }`
4. WHEN a Day is created THEN the API SHALL return the Day with empty `items: []`
5. WHEN any operation fails THEN the API SHALL return `{ error: string }` with HTTP status

### Requirement 6

**User Story:** As a developer, I want clear layers, so that I know where to put code.

#### Acceptance Criteria

1. THE API layer SHALL validate input and call Database methods
2. THE Database layer SHALL only do CRUD (no business logic)
3. THE service layer SHALL be pure functions (input → Database → output)
4. WHEN validation happens THEN it SHALL be at API boundary (not in Database)
5. WHEN business logic is needed THEN it SHALL be in service functions (not in API routes)

### Requirement 7

**User Story:** As a developer, I want consistent errors, so that I can debug quickly.

#### Acceptance Criteria

1. WHEN a Database operation fails THEN it SHALL throw an Error with message
2. WHEN an API catches an error THEN it SHALL log to console.error
3. WHEN an entity is not found THEN the system SHALL return 404 with `{ error: "Trip not found" }`
4. WHEN validation fails THEN the system SHALL return 400 with Zod details
5. WHEN an unexpected error occurs THEN the system SHALL return 500 with `{ error: message }`

### Requirement 8

**User Story:** As a developer, I want MemoryDB to behave like Prisma, so that tests match production.

#### Acceptance Criteria

1. WHEN MemoryDB deletes a Trip THEN it SHALL cascade delete Days, Items, ChecklistItems, PackingItems
2. WHEN MemoryDB creates an Item THEN it SHALL throw if parent Day does not exist
3. WHEN MemoryDB updates a non-existent entity THEN it SHALL throw "Entity not found"
4. WHEN MemoryDB is used THEN it SHALL not support Prisma-specific syntax (keep it simple)
5. THE MemoryDB SHALL use Map for O(1) lookups (not Array.find)

### Requirement 9

**User Story:** As a developer, I want TypeScript to catch bugs, so that I don't ship broken code.

#### Acceptance Criteria

1. WHEN the Database interface is defined THEN all methods SHALL have explicit return types
2. WHEN Partial types are used THEN they SHALL only allow valid fields (no typos)
3. WHEN IDs are passed THEN they SHALL be typed as `string` (UUID)
4. WHEN dates are handled THEN they SHALL be `Date | null` (no string dates in domain layer)
5. THE system SHALL compile with zero TypeScript errors

### Requirement 10

**User Story:** As a developer, I want tests that don't need mocks, so that tests are simple and fast.

#### Acceptance Criteria

1. WHEN testing Database operations THEN tests SHALL use MemoryDB (no mocks)
2. WHEN testing API endpoints THEN they SHALL use MemoryDB (no real database)
3. WHEN testing service functions THEN they SHALL be pure (easy to test)
4. WHEN tests run THEN they SHALL be independent (no shared state)
5. THE MemoryDB SHALL reset between tests (clean slate)
