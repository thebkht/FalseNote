import { sql } from '@/lib/postgres';
import { NextResponse } from 'next/server';


export async function GET(request: Request) {
  try {
    // Create the Users table
    await sql(`
      CREATE TABLE IF NOT EXISTS Users (
        UserID SERIAL PRIMARY KEY,
        Username VARCHAR(255) UNIQUE NOT NULL,
        Name VARCHAR(255),
        Bio VARCHAR(255),
        Email VARCHAR(255),
        Password VARCHAR(255), -- Store hashed and salted password
        ProfilePicture VARCHAR(255), -- Store URL or BLOB for binary data
        GitHubProfileURL VARCHAR(255),
        Location VARCHAR(255),
        verified BOOLEAN DEFAULT false,
        falsemember BOOLEAN DEFAULT false,
        RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create the BlogPosts table
    await sql(`
      CREATE TABLE IF NOT EXISTS BlogPosts (
        PostID SERIAL PRIMARY KEY,
        Title VARCHAR(255) NOT NULL,
        Description VARCHAR(280),
        Content TEXT, -- For longer text content or markdown
        CreationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        LastUpdatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        AuthorID INT REFERENCES Users(UserID),
        CoverImage VARCHAR(255), -- Store URL or BLOB for binary data
        Visibility VARCHAR(255) DEFAULT 'Public' NOT NULL, -- Public, Private, or Unlisted
        Draft BOOLEAN DEFAULT FALSE,
        Views INT DEFAULT 0,
        Likes INT DEFAULT 0,
        Dislikes INT DEFAULT 0,
        url VARCHAR(255) UNIQUE NOT NULL
      );
    `);

    // Create the Comments table
    await sql(`
      CREATE TABLE IF NOT EXISTS Comments (
        CommentID SERIAL PRIMARY KEY,
        Content TEXT, -- For comment text or markdown
        CreationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        AuthorID INT REFERENCES Users(UserID),
        Likes INT DEFAULT 0,
        Dislikes INT DEFAULT 0,
        BlogPostID INT REFERENCES BlogPosts(PostID)
      );
    `);

    // Create the Tags table
    await sql(`
      CREATE TABLE IF NOT EXISTS Tags (
        TagID SERIAL PRIMARY KEY,
        TagName VARCHAR(255) NOT NULL
      );
    `);

    // Create the BlogPostTags table
    await sql(`
      CREATE TABLE IF NOT EXISTS BlogPostTags (
        BlogPostTagID SERIAL PRIMARY KEY,
        BlogPostID INT,
        TagID INT,
        FOREIGN KEY (BlogPostID) REFERENCES BlogPosts(PostID),
        FOREIGN KEY (TagID) REFERENCES Tags(TagID)
      );
    `);

    // Create the TagFollows table
    await sql(`
      CREATE TABLE IF NOT EXISTS TagFollows (
        TagFollowID SERIAL PRIMARY KEY,
        TagID INT REFERENCES Tags(TagID),
        UserID INT REFERENCES Users(UserID),
        CreationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create the Follows table
    await sql(`
      CREATE TABLE IF NOT EXISTS Follows (
        FollowID SERIAL PRIMARY KEY,
        FolloweeID INT REFERENCES Users(UserID),
        FollowerID INT REFERENCES Users(UserID),
        CreationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await sql(`
      CREATE TABLE IF NOT EXISTS Notifications (
        NotificationID SERIAL PRIMARY KEY,
        Type VARCHAR(255),
        Message VARCHAR(255),
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ReadAt TIMESTAMP,
        UserID INT REFERENCES Users(UserID),
        Sender_id INT NOT NULL 
      );
    `);
    

    // Create the UserSettings table
    await sql(`
    CREATE TABLE IF NOT EXISTS UserSettings (
      UserSettingID SERIAL PRIMARY KEY,
      Appearance VARCHAR(255) DEFAULT 'System',
      Language VARCHAR(255) DEFAULT 'English',
      UserID INT REFERENCES Users(UserID)
    );    
    `);

    


    return NextResponse.json({ result: 'Tables created successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}