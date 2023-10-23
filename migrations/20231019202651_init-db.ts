import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
     await knex.schema.createTable("users", (table) => {
          table.increments("id").primary();
          table.string("name");
          table.string("username").notNullable().unique();
          table.string("bio");
          table.string("email");
          table.string("image").notNullable();
          table.string("password");
          table.string("githubprofile");
          table.string("location");
          table.boolean("verified").defaultTo(false);
          table.string("verificationtoken");
          table.boolean("falsemember").defaultTo(false);
          table.timestamp("createdAt").defaultTo(knex.fn.now());
          table.timestamp("updatedAt").defaultTo(knex.fn.now());
     });
     await knex.schema.createTable("posts", (table) => {
          table.increments("id").primary();
          table.string("title").notNullable();
          table.text("content").notNullable();
          table.string("subtitle");
          table.string("cover");
          table.integer("authorId").unsigned().notNullable();
          table.foreign("authorId").references("users.id").onDelete("CASCADE");
          table.timestamp("createdAt").defaultTo(knex.fn.now());
          table.timestamp("updatedAt").defaultTo(knex.fn.now());
          table.string("url").notNullable().unique();
          table.string("visibility").defaultTo("public");
          table.boolean("updated").defaultTo(false);
          table.integer("views").defaultTo(0);
     });

     await knex.schema.createTable("comments", (table) => {
          table.increments("id").primary();
          table.text("content").notNullable();
          table.integer("authorId").unsigned().notNullable();
          table.foreign("authorId").references("users.id").onDelete("CASCADE");
          table.integer("postId").unsigned().notNullable();
          table.foreign("postId").references("posts.id").onDelete("CASCADE");
          table.timestamp("createdAt").defaultTo(knex.fn.now());
          table.timestamp("updatedAt").defaultTo(knex.fn.now());
     });

     await knex.schema.createTable("likes", (table) => {
          table.increments("id").primary();
          table.integer("authorId").unsigned().notNullable();
          table.foreign("authorId").references("users.id").onDelete("CASCADE");
          table.integer("postId").unsigned().notNullable();
          table.foreign("postId").references("posts.id").onDelete("CASCADE");
          table.timestamp("createdAt").defaultTo(knex.fn.now());
          table.timestamp("updatedAt").defaultTo(knex.fn.now());
     });

     await knex.schema.createTable("commentlikes", (table) => {
          table.increments("id").primary();
          table.integer("authorId").unsigned().notNullable();
          table.foreign("authorId").references("users.id").onDelete("CASCADE");
          table.integer("commentId").unsigned().notNullable();
          table.foreign("commentId").references("comments.id").onDelete("CASCADE");
          table.timestamp("createdAt").defaultTo(knex.fn.now());
          table.timestamp("updatedAt").defaultTo(knex.fn.now());
     });

     await knex.schema.createTable("tags", (table) => {
          table.increments("id").primary();
          table.string("name").notNullable().unique();
          table.timestamp("createdAt").defaultTo(knex.fn.now());
          table.timestamp("updatedAt").defaultTo(knex.fn.now());
     });

     await knex.schema.createTable("posttags", (table) => {
          table.increments("id").primary();
          table.integer("postId").unsigned().notNullable();
          table.foreign("postId").references("posts.id").onDelete("CASCADE");
          table.integer("tagId").unsigned().notNullable();
          table.foreign("tagId").references("tags.id").onDelete("CASCADE");
          table.timestamp("createdAt").defaultTo(knex.fn.now());
          table.timestamp("updatedAt").defaultTo(knex.fn.now());
     });

     await knex.schema.createTable("follows", (table) => {
          table.increments("id").primary();
          table.integer("followerId").unsigned().notNullable();
          table.foreign("followerId").references("users.id").onDelete("CASCADE");
          table.integer("followingId").unsigned().notNullable();
          table.foreign("followingId").references("users.id").onDelete("CASCADE");
          table.timestamp("createdAt").defaultTo(knex.fn.now());
          table.timestamp("updatedAt").defaultTo(knex.fn.now());
     } );

     await knex.schema.createTable("tagfollows", (table) => {
          table.increments("id").primary();
          table.integer("tagId").unsigned().notNullable();
          table.foreign("tagId").references("tags.id").onDelete("CASCADE");
          table.integer("followerId").unsigned().notNullable();
          table.foreign("followerId").references("users.id").onDelete("CASCADE");
          table.timestamp("createdAt").defaultTo(knex.fn.now());
          table.timestamp("updatedAt").defaultTo(knex.fn.now());
     });

     await knex.schema.createTable("notifications", (table) => {
          table.increments("id").primary();
          table.integer("receiverId").unsigned().notNullable();
          table.foreign("receiverId").references("users.id").onDelete("CASCADE");
          table.string("content").notNullable();
          table.string("type").notNullable();
          table.string("url");
          table.boolean("read").defaultTo(false);
          table.integer("senderId").unsigned().notNullable();
          table.timestamp("createdAt").defaultTo(knex.fn.now());
          table.timestamp("updatedAt").defaultTo(knex.fn.now());
     });

     await knex.schema.createTable("bookmarks", (table) => {
          table.increments("id").primary();
          table.integer("userId").unsigned().notNullable();
          table.foreign("userId").references("users.id").onDelete("CASCADE");
          table.integer("postId").unsigned().notNullable();
          table.foreign("postId").references("posts.id").onDelete("CASCADE");
          table.timestamp("createdAt").defaultTo(knex.fn.now());
          table.timestamp("updatedAt").defaultTo(knex.fn.now());
     });

     await knex.schema.createTable("usersettings", (table) => {
          table.increments("id").primary();
          table.integer("userId").unsigned().notNullable();
          table.foreign("userId").references("users.id").onDelete("CASCADE");
          table.string("appearance").defaultTo("system");
          table.string("language").defaultTo("en");
          table.timestamp("createdAt").defaultTo(knex.fn.now());
          table.timestamp("updatedAt").defaultTo(knex.fn.now());
     });
}


export async function down(knex: Knex): Promise<void> {
     await knex.schema.dropTable("usersettings");
     await knex.schema.dropTable("bookmarks");
     await knex.schema.dropTable("notifications");
     await knex.schema.dropTable("tagfollows");
     await knex.schema.dropTable("follows");
     await knex.schema.dropTable("posttags");
     await knex.schema.dropTable("tags");
     await knex.schema.dropTable("commentlikes");
     await knex.schema.dropTable("likes");
     await knex.schema.dropTable("comments");
     await knex.schema.dropTable("posts");
     await knex.schema.dropTable("users");
}

