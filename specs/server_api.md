# API Specification

## Base URL

`/api`

## Endpoints

### 1. POST /games

- **Description**: Creates a new game.
- **Request Body**:
  - `code` (string, required): The unique identifier for the game.
- **Responses**:
  - **201 Created**:

    ```json
    {
      "message": "Game created successfully",
      "game": { /* Game object */ }
    }
    ```

  - **400 Bad Request**:

    ```json
    {
      "error": "Game code is required"
    }
    ```

  - **500 Internal Server Error**:

    ```json
    {
      "error": "An error occurred while creating the game"
    }
    ```

### 2. GET /games

- **Description**: Retrieves the list of current games.
- **Responses**:
  - **200 OK**:

    ```json
    {
      "success": true,
      "data": [ /* Array of game status objects */ ]
    }
    ```

  - **500 Internal Server Error**:

    ```json
    {
      "success": false,
      "message": "Internal Server Error"
    }
    ```

## Game Status Object

- **Structure**:

  ```json
  {
    "status": "string",
    "code": "string",
    "players": ["string"], // List of player identifiers
    "problem": { /* Problem object */ }
  }
