# Music Library

A modern Angular application for managing a personal music collection.

## Project Overview

This application demonstrates best practices in Angular development, featuring a responsive interface for managing a library of songs with filtering, sorting, and CRUD operations.

## Architecture & Design Decisions

### Angular Signal-Based State Management

- **Reactive Architecture**: Leverages Angular signals for reactive state management throughout the application
- **Computed Values**: Uses computed signals to derive filtered song collections based on date filters
- **Component Signal-State Pattern**: Each component consumes reactive state through read-only signal accessors

### Component Structure

- **Feature-Based Organization**: Components are organized by feature (songs, filters, dialogs)
- **Reusable UI Elements**: Common UI patterns are abstracted into reusable components (for example, the date filter component is ready to be used with any new data source and service)

### Data Flow

- **Bidirectional Data Flow with Services**: Components consume state from services and can update service state directly (e.g., date filters), with services acting as the central state management layer
- **Immutable State Updates**: All state modifications use immutable update patterns (e.g., `update()` and `set()` methods on signals)
- **Server-Validated State Updates**: UI state is updated only after successful API responses, ensuring data consistency
- **Client-Side State Management**: Application maintains a single source of truth in a service-based store using signals, eliminating redundant network requests while preserving data integrity

### Testing

- **Comprehensive Test Coverage**: Unit tests for services and components using Jasmine/Karma
- **Isolated Testing**: Components and services are tested in isolation with mock dependencies
- **UI Interaction Testing**: Tests simulate user interactions to verify behavior

### UI/UX Considerations

- **Accessibility**: Implements ARIA attributes and semantic HTML for screen reader compatibility
- **Responsive Design**: Uses Material Design components with responsive layout patterns
- **Loading States**: Shows progress indicators during asynchronous operations
- **Error Handling**: Provides user feedback via snackbar notifications for success/error states

### Performance Optimizations

- **Change Detection Strategy**: Uses OnPush change detection to minimize rendering cycles
- **Lazy Loading**: Components are loaded on demand to reduce initial bundle size
- **Efficient Data Filtering**: Date filtering logic is optimized using computed signals

### Mock Backend Integration

- **Service Simulation**: Implements mock HTTP service to simulate backend calls
- **Configurable Latency**: Simulates network latency for realistic testing
- **Error Simulation**: Periodically simulates error responses for testing error handling

### SCSS

- **SASS Architecture**: Split into multiple files to organize styles.
- **Theme**: Custom theme set using PERA colors

## Technical Stack

- **Framework**: Angular 19
- **UI Library**: Angular Material
- **State Management**: Angular Signals
- **Styling**: SCSS with theme customization
- **Testing**: Jasmine/Karma
- **Code Quality**: ESLint, Prettier

## Getting Started

To run the application locally:

```bash
# Start development server
npm run start
```
