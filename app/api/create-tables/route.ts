import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Create the Users table
    await sql`
      CREATE TABLE IF NOT EXISTS Users (
        UserID SERIAL PRIMARY KEY,
        Username VARCHAR(255) UNIQUE NOT NULL,
        Name VARCHAR(255),
        Bio VARCHAR(255),
        Email VARCHAR(255),
        Password VARCHAR(255), -- Store hashed and salted password
        ProfilePicture VARCHAR(255), -- Store URL or BLOB for binary data
        GitHubProfileURL VARCHAR(255),
        RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create the BlogPosts table
    await sql`
      CREATE TABLE IF NOT EXISTS BlogPosts (
        PostID SERIAL PRIMARY KEY,
        Title VARCHAR(255) NOT NULL,
        Content TEXT, -- For longer text content or markdown
        CreationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        LastUpdatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        AuthorID INT REFERENCES Users(UserID),
        BlogPostID INT
      );
    `;

    // Create the Comments table
    await sql`
      CREATE TABLE IF NOT EXISTS Comments (
        CommentID SERIAL PRIMARY KEY,
        Content TEXT, -- For comment text or markdown
        CreationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        AuthorID INT REFERENCES Users(UserID),
        BlogPostID INT REFERENCES BlogPosts(PostID)
      );
    `;

    // Create the Tags table
    await sql`
      CREATE TABLE IF NOT EXISTS Tags (
        TagID SERIAL PRIMARY KEY,
        TagName VARCHAR(255) NOT NULL
      );
    `;

    // Create the BlogPostTags table
    await sql`
      CREATE TABLE IF NOT EXISTS BlogPostTags (
        BlogPostTagID SERIAL PRIMARY KEY,
        BlogPostID INT,
        TagID INT,
        FOREIGN KEY (BlogPostID) REFERENCES BlogPosts(PostID),
        FOREIGN KEY (TagID) REFERENCES Tags(TagID)
      );
    `;

    return NextResponse.json({ result: 'Tables created successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
