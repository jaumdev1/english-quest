# API Structure - English Words App

## Overview
This application uses a simulated API structure with localStorage for data persistence. The system is organized around Users, Decks, and Words, with proper relationships between them.

## Data Models

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt?: Date;
}
```

### Deck
```typescript
interface Deck {
  id: string;
  name: string;
  description?: string;
  userId: string;        // References User.id
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;     // Auto-calculated
  isPublic: boolean;
}
```

### Word
```typescript
interface Word {
  id: string;
  english: string;
  portuguese: string;
  notes?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  deckId: string;        // References Deck.id
  createdAt: Date;
  lastReviewed?: Date;
  reviewCount: number;
}
```

## API Structure

### UsersAPI (`src/api/users.ts`)
- **create(userData)**: Create new user
- **getById(id)**: Get user by ID
- **getByEmail(email)**: Get user by email
- **update(id, updates)**: Update user
- **updateLastLogin(id)**: Update last login timestamp
- **delete(id)**: Delete user
- **createDefaultUser()**: Migration - create default user for development

### DecksAPI (`src/api/decks.ts`)
- **create(deckData, userId)**: Create new deck for user
- **getByUserId(userId)**: Get all decks for a user
- **getById(id)**: Get deck by ID
- **update(id, updates)**: Update deck
- **delete(id)**: Delete deck
- **getPublicDecks()**: Get all public decks
- **updateWordCount(deckId)**: Update word count for deck
- **createDefaultDeck(userId)**: Migration - create default deck for user

### WordsAPI (`src/api/words.ts`)
- **create(wordData)**: Create new word (requires deckId)
- **getAll()**: Get all words
- **getByDeckId(deckId)**: Get all words in a deck
- **getById(id)**: Get word by ID
- **update(id, updates)**: Update word
- **delete(id)**: Delete word
- **deleteByDeckId(deckId)**: Delete all words in a deck
- **markAsReviewed(id)**: Mark word as reviewed
- **search(searchTerm, deckId?, difficulty?)**: Search words with filters
- **createDefaultWords(deckId)**: Migration - create default words for deck

### AuthAPI (`src/api/auth.ts`)
- **getCurrentUser()**: Get current logged user
- **signInWithGoogle()**: Simulate Google OAuth login
- **signOut()**: Logout user
- **migrateUserData()**: Migration - setup default data for new users

## Hooks

### useAuth (`src/hooks/useAuth.ts`)
- **user**: Current user state
- **loading**: Loading state
- **initialized**: App initialization state
- **login()**: Login function
- **logout()**: Logout function

### useDecks (`src/hooks/useDecks.ts`)
- **decks**: User's decks
- **loading**: Loading state
- **error**: Error state
- **createDeck()**: Create new deck
- **updateDeck()**: Update deck
- **deleteDeck()**: Delete deck
- **getDeckById()**: Get deck by ID
- **updateDeckWordCount()**: Update word count
- **loadDecks()**: Load user's decks

### useWordsAPI (`src/hooks/useWordsAPI.ts`)
- **words**: Words state
- **loading**: Loading state
- **error**: Error state
- **createWord()**: Create new word
- **loadWords()**: Load all words
- **loadWordsByDeck()**: Load words by deck
- **getWordById()**: Get word by ID
- **searchWords()**: Search words
- **updateWord()**: Update word
- **markAsReviewed()**: Mark as reviewed
- **deleteWord()**: Delete word
- **deleteWordsByDeck()**: Delete words by deck
- **clearError()**: Clear error state

## Components

### DeckCard (`src/components/DeckCard.tsx`)
- Display deck information
- Handle deck selection, editing, and deletion

### DeckModal (`src/components/DeckModal.tsx`)
- Modal for creating/editing decks
- Form validation
- Public/private toggle

### AddWordModal (`src/components/AddWordModal.tsx`)
- Modal for adding/editing words
- Deck selection
- Form validation

## Data Flow

1. **User Authentication**: User logs in via Google OAuth (simulated)
2. **Data Migration**: If new user, create default deck and words
3. **Deck Management**: Users can create, edit, and delete decks
4. **Word Management**: Words are always associated with a deck
5. **Study Sessions**: Study sessions are tied to specific decks

## Storage Keys

- `english-users-api`: User data
- `english-decks-api`: Deck data
- `english-words-api`: Word data
- `english-quest-user`: Current user session

## Migration System

The app includes automatic migration for development:
- Creates default user if none exists
- Creates default deck for new users
- Creates sample words in the default deck
- Updates deck word counts automatically

## Future OAuth Integration

The system is prepared for Google OAuth integration:
- User model supports OAuth fields
- Auth flow is separated from data management
- User creation/update handles OAuth data
- Session management is OAuth-ready

## Benefits of New Structure

### 🚀 **Scalability**
- Hierarchical data organization (User → Deck → Word)
- Support for multiple decks per user
- Public/private deck system

### 🛡️ **Data Integrity**
- Proper relationships between entities
- Automatic word count updates
- Cascade deletion support

### 🔧 **User Experience**
- Deck-based organization
- Easy deck switching
- Visual deck management

### 🎯 **OAuth Ready**
- User model designed for OAuth
- Session management prepared
- Migration system for new users 