# WebSocket API Specification

## WebSocket Server

### Connection

- **Event**: `connection`
  - Triggered when a new client connects.

### Events

#### 1. CHAT

- **Description**: Sends a chat message to all players in the current game.
- **Message Structure**:

  ```json
  {
    "event": "CHAT",
    "message": "string"
  }
  ```

#### 2. JOIN_LOBBY

- **Description**: Allows a player to join an existing game lobby.
- **Message Structure**:

  ```json
  {
    "event": "JOIN_LOBBY",
    "identifier": "string",
    "lobby": "string"
  }
  ```

- **Responses**:
  - Error if game is not found:

    ```json
    {
      "event": "ERROR",
      "message": "GAME NOT FOUND"
    }
    ```

  - Error if game is in progress:

    ```json
    {
      "event": "ERROR",
      "message": "GAME IN PROGRESS"
    }
    ```

#### 3. SEND_CODE

- **Description**: Submits code for evaluation during the game.
- **Message Structure**:

  ```json
  {
    "event": "SEND_CODE",
    "code": "string",
    "language": "string"
  }
  ```

- **Responses**:
  - Error if game is not found:

    ```json
    {
      "event": "ERROR",
      "message": "GAME NOT FOUND"
    }
    ```

  - Error if game is not in progress:

    ```json
    {
      "event": "ERROR",
      "message": "GAME NOT IN PROGRESS"
    }
    ```

#### 4. PLAYER_STATUS_UPDATE

- **Description**: Updates the player's readiness status.
- **Message Structure**:

  ```json
  {
    "event": "PLAYER_STATUS_UPDATE",
    "status": "READY" | "NOT_READY"
  }
  ```

### Server Messages to Client

#### 1. GAME_STATUS_UPDATE

- **Description**: Notifies clients about game status updates.
- **Message Structure**:

  ```json
  {
    "event": "GAME_STATUS_UPDATE",
    "status": "start" | "end",
    "problem": { /* Problem data */ }
  }
  ```

#### 2. ERROR

- **Description**: Notifies clients of an error.
- **Message Structure**:

  ```json
  {
    "event": "ERROR",
    "message": "string"
  }
  ```

#### 3. SUBMISSION_RESPONSE

- **Description**: Responds to code submission.
- **Message Structure**:

  ```json
  {
    "event": "SUBMISSION_RESPONSE",
    "result": "success" | "error"
  }
  ```

## Client Handling

### Message Handling

- **On Message Received**:
  - Parses the incoming WebSocket message and handles events like `GAME_STATUS_UPDATE`, `ERROR`, and `SUBMISSION_RESPONSE`.
