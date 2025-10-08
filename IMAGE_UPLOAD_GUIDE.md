# Image Upload System Usage Guide

## Overview
The Portfolio project now includes a comprehensive image upload system that allows administrators to upload images directly to the server and manage them through a user-friendly interface.

## Features
- **Direct file uploads** to the server
- **URL input support** for external images
- **Image gallery** with preview thumbnails
- **File management** (view, select, delete)
- **Dual-mode interface** switching between upload and URL input
- **Admin-only access** with authentication

## Backend API Endpoints

### 1. Upload Image
**POST** `/api/upload/image`
- **Authentication**: Required (Admin only)
- **Content-Type**: `multipart/form-data`
- **Field**: `image` (file)
- **Allowed formats**: PNG, JPG, JPEG, GIF, WebP
- **Max size**: 5MB

**Response:**
```json
{
  "success": true,
  "url": "/uploads/images/1704123456789-random123-image.png",
  "filename": "1704123456789-random123-image.png",
  "originalName": "my-image.png",
  "size": 245760
}
```

### 2. List Images
**GET** `/api/upload/images`
- **Authentication**: Required (Admin only)

**Response:**
```json
{
  "images": [
    {
      "filename": "1704123456789-random123-image.png",
      "url": "/uploads/images/1704123456789-random123-image.png",
      "size": 245760,
      "createdAt": "2024-01-01T12:00:00.000Z",
      "modifiedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

### 3. Delete Image
**DELETE** `/api/upload/image/:filename`
- **Authentication**: Required (Admin only)

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

### 4. Static File Serving
**GET** `/uploads/images/:filename`
- **Authentication**: Not required
- **Purpose**: Serve uploaded images

## Frontend Components

### 1. ImageInput Component
Located: `apps/frontend/src/components/ImageInput.tsx`

**Props:**
- `value?: string` - Current image URL/path
- `onChange: (url: string | null) => void` - Callback when image changes
- `label?: string` - Display label
- `className?: string` - CSS classes

**Usage:**
```tsx
import ImageInput from './components/ImageInput'

function MyComponent() {
  const [imageUrl, setImageUrl] = useState<string>('')
  
  return (
    <ImageInput
      value={imageUrl}
      onChange={setImageUrl}
      label="Cover Image"
    />
  )
}
```

### 2. ImageGallery Component
Located: `apps/frontend/src/components/ImageGallery.tsx`

**Props:**
- `onSelect?: (url: string) => void` - Callback when image is selected
- `className?: string` - CSS classes

**Features:**
- Grid layout with responsive thumbnails
- Click to select functionality
- Delete confirmation dialog
- File size display
- Loading and error states

### 3. ImageManager Component
Located: `apps/frontend/src/components/ImageManager.tsx`

**Props:**
- `value?: string` - Current image URL/path
- `onChange: (url: string | null) => void` - Callback when image changes
- `label?: string` - Display label
- `className?: string` - CSS classes

**Features:**
- Combines ImageInput and ImageGallery
- Mode switching (Upload/URL/Gallery)
- Seamless integration with forms

## Integration Examples

### PostEditor Integration
The `PostEditor` component now uses `ImageManager` for cover image selection:

```tsx
// In PostEditor.tsx
<ImageManager
  value={post.coverImage}
  onChange={(url) => setPost({...post, coverImage: url || ''})}
  label="Cover Image"
/>
```

### AdminDashboard Integration
The admin dashboard includes `ImageManager` for hero image management:

```tsx
// In AdminDashboard.tsx
<ImageManager
  value={settings.heroImage}
  onChange={(url) => setSettings({...settings, heroImage: url || ''})}
  label="Hero Image"
/>
```

## File Storage Structure
```
/workspaces/Portfolio/apps/backend/
├── uploads/
│   └── images/
│       ├── 1704123456789-abc123-hero.jpg
│       ├── 1704123456789-def456-post-cover.png
│       └── 1704123456789-ghi789-gallery-item.webp
```

**File Naming Convention:**
- Timestamp (milliseconds since epoch)
- Random 6-character string
- Original filename (sanitized)
- Example: `1704123456789-abc123-my-image.jpg`

## Security Features
- **Authentication required** for all upload operations
- **Admin role verification** via middleware
- **File type validation** (images only)
- **File size limits** (5MB maximum)
- **Filename sanitization** to prevent path traversal
- **MIME type checking** for additional security

## Error Handling
The system provides comprehensive error handling:

**Upload Errors:**
- Invalid file types
- File size exceeded
- Missing authentication
- Server storage issues

**Gallery Errors:**
- Network connectivity issues
- Permission errors
- File not found scenarios

**Frontend Feedback:**
- Loading spinners during uploads
- Progress indicators
- Error messages with retry options
- Success confirmations

## Development Usage

### Starting the System
```bash
# Start backend (from repo root)
cd apps/backend
pnpm dev  # Runs on http://localhost:4000

# Start frontend (from repo root)
cd apps/frontend
pnpm dev  # Runs on http://localhost:5173
```

### Testing the Upload System
1. Navigate to `http://localhost:5173` in your browser
2. Log in as an admin user
3. Go to the Admin Dashboard
4. Use the Hero Image section to test uploads
5. Create/edit posts to test cover image functionality

### API Testing with curl
```bash
# Upload an image
curl -X POST http://localhost:4000/api/upload/image \
  -H "Cookie: your-auth-cookie" \
  -F "image=@/path/to/image.jpg"

# List images
curl -X GET http://localhost:4000/api/upload/images \
  -H "Cookie: your-auth-cookie"

# Delete an image
curl -X DELETE http://localhost:4000/api/upload/image/filename.jpg \
  -H "Cookie: your-auth-cookie"
```

## Configuration
The upload system uses the following configuration:

**Environment Variables:**
- `NODE_ENV` - Environment mode
- `JWT_SECRET` - For authentication
- `DATABASE_URL` - Database connection

**Upload Settings:**
- Max file size: 5MB
- Allowed types: PNG, JPG, JPEG, GIF, WebP
- Storage location: `uploads/images/`
- URL prefix: `/uploads/images/`

## Troubleshooting

### Common Issues
1. **"No file uploaded" error**
   - Ensure the form uses `multipart/form-data` encoding
   - Check the field name is exactly `image`

2. **"Invalid file type" error**
   - Only image files are accepted
   - Check MIME type and file extension

3. **Authentication errors**
   - Ensure user is logged in as admin
   - Check JWT cookie is being sent

4. **File not found errors**
   - Verify file exists in uploads directory
   - Check filename matches exactly

### Debugging Tips
- Check browser network tab for request details
- Look at server logs for detailed error messages
- Verify file permissions on uploads directory
- Test with small image files first

This comprehensive system provides a robust foundation for image management in the Portfolio project, supporting both file uploads and URL inputs with a user-friendly admin interface.