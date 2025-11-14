# API Documentation

This document provides a reference for the Convex server functions (queries, mutations, and actions) that make up the backend API of the EventFlow application.

## Authentication

All API endpoints require authentication via a JSON Web Token (JWT) issued by Clerk. The token must be included in the `Authorization` header of each request. Unauthenticated requests will result in an error.

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of a request. In addition, the response body may contain an error message with more details.

- `200 OK`: The request was successful.
- `400 Bad Request`: The request was malformed (e.g., missing parameters).
- `401 Unauthorized`: The request lacks valid authentication credentials.
- `403 Forbidden`: The authenticated user does not have permission to perform the action.
- `404 Not Found`: The requested resource could not be found.
- `500 Internal Server Error`: An unexpected error occurred on the server.

## Endpoints

The API is organized by functionality, with endpoints for managing users, events, participants, agenda items, and AI interactions.

---

### Agendas (`convex/agendas.ts`)

#### `createAgendaItem` (Mutation)

Creates a new agenda item for an event.

- **Requires**: Authentication, user must be a participant of the event.
- **Request Schema**:
  ```json
  {
    "eventId": "Id<'events'>",
    "title": "string",
    "duration": "number",
    "startTime": "string",
    "endTime": "string" (optional),
    "description": "string" (optional),
    "type": "'presentation' | 'discussion' | 'break' | 'activity'"
  }
  ```
- **Response Schema**:
  ```json
  {
    "agendaItemId": "Id<'agendaItems'>"
  }
  ```

#### `updateAgendaItem` (Mutation)

Updates an existing agenda item.

- **Requires**: Authentication.
- **Request Schema**:
  ```json
  {
    "agendaItemId": "Id<'agendaItems'>",
    "title": "string" (optional),
    "duration": "number" (optional),
    "startTime": "string" (optional),
    "endTime": "string" (optional),
    "description": "string" (optional),
    "type": "'presentation' | 'discussion' | 'break' | 'activity'" (optional)
  }
  ```

#### `deleteAgendaItem` (Mutation)

Deletes an agenda item and its associated votes.

- **Requires**: Authentication.
- **Request Schema**:
  ```json
  {
    "agendaItemId": "Id<'agendaItems'>"
  }
  ```

#### `reorderAgendaItems` (Mutation)

Reorders the agenda items for an event.

- **Requires**: Authentication.
- **Request Schema**:
  ```json
  {
    "eventId": "Id<'events'>",
    "orderedAgendaItemIds": "Array<Id<'agendaItems'>>"
  }
  ```

#### `voteOnAgendaItem` (Mutation)

Toggles a vote on an agenda item for the current user.

- **Requires**: Authentication.
- **Request Schema**:
  ```json
  {
    "agendaItemId": "Id<'agendaItems'>",
    "eventId": "Id<'events'>"
  }
  ```

---

### AI (`convex/ai.ts`)

#### `getMessages` (Query)

Retrieves the AI chat messages for an event.

- **Requires**: Authentication, user must be an 'owner' or 'editor' of the event.
- **Request Schema**:
  ```json
  {
    "eventId": "Id<'events'>"
  }
  ```
- **Response Schema**: An array of message objects.

#### `sendMessage` (Mutation)

Sends a message in the AI chat. Triggers an AI response if the role is 'user'.

- **Requires**: Authentication, user must be an 'owner' or 'editor' of the event.
- **Request Schema**:
  ```json
  {
    "eventId": "Id<'events'>",
    "content": "string",
    "role": "'user' | 'assistant'"
  }
  ```

---

### Events (`convex/events.ts`)

#### `createEvent` (Mutation)

Creates a new event.

- **Requires**: Authentication.
- **Request Schema**:
  ```json
  {
    "title": "string",
    "date": "string",
    "duration": "number",
    "status": "'upcoming' | 'draft' | 'completed'",
    "expectedParticipants": "number",
    "goals": "string" (optional),
    "tone": "'formal' | 'casual'",
    "isPublic": "boolean"
  }
  ```
- **Response Schema**:
  ```json
  {
    "eventId": "Id<'events'>"
  }
  ```

#### `getEvents` (Query)

Retrieves all events for the current user.

- **Requires**: Authentication.
- **Response Schema**: An array of event objects with details.

#### `getEvent` (Query)

Retrieves a single event by its ID.

- **Requires**: Authentication, user must be a participant of the event.
- **Request Schema**:
  ```json
  {
    "eventId": "Id<'events'>"
  }
  ```
- **Response Schema**: An event object with details.

#### `updateEvent` (Mutation)

Updates an existing event.

- **Requires**: Authentication, user must be the owner of the event.
- **Request Schema**:
  ```json
  {
    "eventId": "Id<'events'>",
    "title": "string",
    "date": "string",
    "duration": "number",
    "status": "'upcoming' | 'draft' | 'completed'",
    "expectedParticipants": "number",
    "goals": "string" (optional),
    "tone": "'formal' | 'casual'",
    "isPublic": "boolean"
  }
  ```

#### `deleteEvent` (Mutation)

Deletes an event and all associated data.

- **Requires**: Authentication, user must be the owner of the event.
- **Request Schema**:
  ```json
  {
    "eventId": "Id<'events'>"
  }
  ```

---

### Participants (`convex/participants.ts`)

#### `addParticipant` (Mutation)

Adds a participant to an event.

- **Requires**: Authentication, user must be an 'owner' or 'editor' of the event.
- **Request Schema**:
  ```json
  {
    "eventId": "Id<'events'>",
    "participantId": "Id<'users'>",
    "role": "'editor' | 'viewer'"
  }
  ```

#### `removeParticipant` (Mutation)

Removes a participant from an event.

- **Requires**: Authentication, user must be the owner of the event.
- **Request Schema**:
  ```json
  {
    "eventId": "Id<'events'>",
    "participantId": "Id<'participants'>"
  }
  ```

#### `updateParticipantRole` (Mutation)

Updates the role of a participant.

- **Requires**: Authentication, user must be the owner of the event.
- **Request Schema**:
  ```json
  {
    "participantId": "Id<'participants'>",
    "role": "'editor' | 'viewer'"
  }
  ```

---

### Users (`convex/users.ts`)

#### `createUser` (Mutation)

Creates a new user or updates an existing one. Typically called via Clerk webhook.

- **Request Schema**:
  ```json
  {
    "name": "string",
    "email": "string",
    "picture": "string",
    "clerkId": "string"
  }
  ```

#### `findUserByEmail` (Query)

Finds a user by their email address.

- **Requires**: Authentication.
- **Request Schema**:
  ```json
  {
    "email": "string"
  }
  ```
- **Response Schema**: A user object or null.

#### `getCurrentUser` (Query)

Retrieves the currently authenticated user.

- **Requires**: Authentication.
- **Response Schema**: A user object or null.
