# Technical Context

## Technology Stack

### Frontend
- **Framework**: Nuxt 3
- **UI Components**: Vue 3
- **Flow Editor**: Vue Flow
- **State Management**: XState
- **Styling**: CSS/SCSS
- **TypeScript**: Full type coverage

### Backend
- **Server**: Nuxt/Nitro
- **Database**: PostgreSQL
- **ORM**: Drizzle
- **Storage**: Cloudflare R2
- **Authentication**: GitHub OAuth

### AI/Image Processing
- **Generation**: Replicate API
- **Object Detection**: Custom API
- **Image Description**: AI-powered analysis
- **Upload Processing**: Server-side optimization

## Development Environment

### Required Tools
- Node.js 18+
- pnpm package manager
- PostgreSQL 14+
- Cloudflare R2 credentials
- GitHub OAuth setup

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/multivia

# Storage
CLOUDFLARE_ACCOUNT_ID=xxx
CLOUDFLARE_ACCESS_KEY=xxx
CLOUDFLARE_SECRET_KEY=xxx
R2_BUCKET_NAME=multivia-assets

# Authentication
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx

# AI Services
REPLICATE_API_TOKEN=xxx
```

## API Structure

### Story Management
```typescript
// Story CRUD operations
POST   /api/stories
GET    /api/stories
GET    /api/stories/:id
PUT    /api/stories/:id
DELETE /api/stories/:id

// Scene operations
POST   /api/stories/:id/scenes
GET    /api/stories/:id/scenes/:sceneId
PUT    /api/stories/:id/scenes/:sceneId
DELETE /api/stories/:id/scenes/:sceneId

// Analytics
GET    /api/stories/:id/stats
GET    /api/stories/:id/completions
```

### Image Processing
```typescript
// Image operations
POST   /api/generate-image
POST   /api/upload-image
GET    /api/detect-objects
POST   /api/describe-image
```

## Database Schema

### Core Tables
```sql
-- Stories
CREATE TABLE stories (
  id UUID PRIMARY KEY,
  creator_id UUID NOT NULL,
  title TEXT NOT NULL,
  state_machine JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- Scenes
CREATE TABLE scenes (
  id UUID PRIMARY KEY,
  story_id UUID NOT NULL,
  image_url TEXT,
  options JSONB,
  position JSONB,
  FOREIGN KEY (story_id) REFERENCES stories(id)
);

-- Completions
CREATE TABLE completions (
  id UUID PRIMARY KEY,
  story_id UUID NOT NULL,
  user_id UUID NOT NULL,
  path JSONB NOT NULL,
  duration INTEGER NOT NULL,
  completed_at TIMESTAMP NOT NULL,
  FOREIGN KEY (story_id) REFERENCES stories(id)
);
```

## Performance Considerations

### Image Optimization
- Automatic resizing for different viewports
- WebP format conversion
- Lazy loading implementation
- R2 edge caching

### State Machine
- Efficient JSON serialization
- Incremental state updates
- Optimistic UI updates
- State validation caching

### Analytics
- Batch processing for completions
- Aggregated statistics caching
- Real-time notification filtering
- Efficient data querying

## Security Measures

### Authentication
- GitHub OAuth flow
- JWT token management
- Role-based access control
- Session handling

### Data Protection
- Input validation
- XSS prevention
- CSRF protection
- Rate limiting

### Storage
- Signed R2 URLs
- Expiring access tokens
- File type validation
- Size restrictions
