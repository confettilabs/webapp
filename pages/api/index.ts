import { ApolloServer } from 'apollo-server-micro';
import { GraphQLDate } from 'graphql-iso-date';
import { asNexusMethod, makeSchema, nonNull, nullable, objectType, stringArg } from 'nexus';
import path from 'path';
import prisma from '../../lib/prisma';

export const GQLDate = asNexusMethod(GraphQLDate, `date`);

const User = objectType({
  name: `User`,
  definition(t) {
    t.int(`id`);
    t.string(`name`);
    t.string(`email`);
    t.field(`profile`, {
      type: `Profile`,
    });
    t.list.field(`posts`, {
      type: `Post`,
      resolve: (parent) =>
        prisma.user
          .findUnique({
            where: { id: Number(parent.id) },
          })
          .posts(),
    });
  },
});

const Profile = objectType({
  name: `Profile`,
  definition(t) {
    t.string(`id`);
    t.string(`bio`);
    t.string(`user`);
  },
});

const Post = objectType({
  name: `Post`,
  definition(t) {
    t.int(`id`);
    t.string(`title`);
    t.nullable.string(`content`);
    t.boolean(`published`);
    t.nullable.field(`author`, {
      type: `User`,
      resolve: (parent) =>
        prisma.post
          .findUnique({
            where: { id: Number(parent.id) },
          })
          .author(),
    });
  },
});

const Query = objectType({
  name: `Query`,
  definition(t) {
    t.field(`post`, {
      type: `Post`,
      args: {
        postId: nonNull(stringArg()),
      },
      resolve: (_, args) =>
        prisma.post.findUnique({
          where: { id: Number(args.postId) },
        }),
    });

    t.list.field(`feed`, {
      type: `Post`,
      resolve: (_parent, _args) =>
        prisma.post.findMany({
          where: { published: true },
        }),
    });

    t.list.field(`drafts`, {
      type: `Post`,
      resolve: (_parent, _args, ctx) =>
        prisma.post.findMany({
          where: { published: false },
        }),
    });

    t.list.field(`filterPosts`, {
      type: `Post`,
      args: {
        searchString: nullable(stringArg()),
      },
      resolve: (_, { searchString }, ctx) =>
        prisma.post.findMany({
          where: {
            OR: [{ title: { contains: searchString as string } }, { content: { contains: searchString as string } }],
          },
        }),
    });
  },
});

const Mutation = objectType({
  name: `Mutation`,
  definition(t) {
    t.field(`signupUser`, {
      type: `User`,
      args: {
        name: stringArg(),
        email: nonNull(stringArg()),
      },
      resolve: (_, { name, email }, ctx) =>
        prisma.user.create({
          data: {
            name,
            email,
          },
        }),
    });

    t.nullable.field(`deletePost`, {
      type: `Post`,
      args: {
        postId: stringArg(),
      },
      resolve: (_, { postId }, ctx) =>
        prisma.post.delete({
          where: { id: Number(postId) },
        }),
    });

    t.field(`createDraft`, {
      type: `Post`,
      args: {
        title: nonNull(stringArg()),
        content: stringArg(),
        authorEmail: stringArg(),
      },
      resolve: (_, { title, content, authorEmail }, ctx) =>
        prisma.post.create({
          data: {
            title,
            content,
            published: false,
            author: {
              connect: { email: authorEmail as string },
            },
          },
        }),
    });

    t.nullable.field(`publish`, {
      type: `Post`,
      args: {
        postId: stringArg(),
      },
      resolve: (_, { postId }, ctx) =>
        prisma.post.update({
          where: { id: Number(postId) },
          data: { published: true },
        }),
    });
  },
});

export const schema = makeSchema({
  types: [Query, Mutation, Post, User, GQLDate, Profile],
  outputs: {
    typegen: path.join(process.cwd(), `pages/api/nexus-typegen.ts`),
    schema: path.join(process.cwd(), `pages/api/schema.graphql`),
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default new ApolloServer({ schema }).createHandler({
  path: `/api`,
});
