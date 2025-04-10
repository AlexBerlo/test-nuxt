# System Architecture & Patterns

## Core System Architecture

```mermaid
flowchart LR
    Editor[Node Editor] --> State[XState Machine]
    State --> DB[(PostgreSQL)]
    Editor --> Image[Image Processor]
    Image --> R2[[Cloudflare R2]]
    DB --> API[Nuxt Server API]
    API --> Consumer[Story Viewer]
    Consumer --> Analytics[Completion Tracking]
    Analytics --> Creator[Creator Dashboard]
```

## Key Components

### 1. Node Editor
- Vue Flow integration for visual programming
- Scene node management
- Edge connections for progression
- Real-time state updates

### 2. State Management
- XState machines for story flow
- JSON-based state persistence
- Scene transition logic
- Progress tracking

### 3. Image Processing
- AI generation pipeline
- Upload handling
- Cloudflare R2 storage
- Image optimization

### 4. Story Consumption
- Progressive scene rendering
- Choice-based navigation
- State machine execution
- Completion tracking

### 5. Analytics System
- Per-story statistics
- Completion notifications
- Viewer tracking
- Engagement metrics

## Data Flow Patterns

### Story Creation
```mermaid
sequenceDiagram
    Creator->>Editor: Create Scene Node
    Editor->>Image: Process Image
    Image->>R2: Store Image
    Editor->>State: Update Machine
    State->>DB: Persist State
```

### Story Consumption
```mermaid
sequenceDiagram
    Consumer->>API: Request Story
    API->>DB: Load State Machine
    API->>R2: Fetch Images
    API->>Consumer: Render Scene
    Consumer->>Analytics: Track Progress
    Analytics->>Creator: Notify Completion
```

## State Machine Structure

```mermaid
stateDiagram-v2
    [*] --> InitialScene
    InitialScene --> Scene2: Option1
    InitialScene --> Scene3: Option2
    Scene2 --> Scene4: Option1
    Scene3 --> Scene4: Option1
    Scene4 --> [*]: Complete
```

## Design Patterns

1. **Node-Based Editor**
   - Drag-and-drop interface
   - Visual connection mapping
   - Real-time preview
   - State validation

2. **State Machine Serialization**
   - JSON structure
   - Version control
   - Migration support
   - Validation rules

3. **Image Management**
   - Async processing
   - Optimized storage
   - Caching strategy
   - Format standardization

4. **Analytics Pipeline**
   - Event streaming
   - Aggregation rules
   - Real-time updates
   - Data persistence

## Implementation Guidelines

1. **Scene Node Structure**
   ```typescript
   interface SceneNode {
     id: string;
     type: 'scene';
     position: { x: number; y: number };
     data: {
       image: string;
       options: ProgressionOption[];
     };
   }
   ```

2. **State Machine Format**
   ```typescript
   interface StoryMachine {
     id: string;
     version: string;
     initial: string;
     states: Record<string, SceneState>;
     context: StoryContext;
   }
   ```

3. **Analytics Events**
   ```typescript
   interface CompletionEvent {
     storyId: string;
     userId: string;
     path: string[];
     duration: number;
     timestamp: string;
   }
