import {fromJS} from 'immutable';
import RethinkDB from 'rethinkdb';

import {
  AUTHENTICATION_PROVIDER_TABLE,
  SECRET_TABLE,
  TYPE_TABLE,
  USER_TABLE
} from '../db/DBConstants';

export const TEST_DATA = fromJS({
  tables: {
    User: [
      {id: '94b90d89-22b6-4abf-b6ad-2780bf9d0408', handle: 'fson'},
      {id: 'bbd1db98-4ac4-40a7-b514-968059c3dbac', handle: 'freiksenet'},
    ],
    Micropost: [
      {
        author: {
          value: 'bbd1db98-4ac4-40a7-b514-968059c3dbac',
          type: 'User',
        },
        id: 'f2f7fb49-3581-4caa-b84b-e9489eb47d84',
        createdAt: new Date('2015-04-10T10:24:52.163Z'),
        text: 'Test text',
        tags: [],
      },
      {
        author: {
          value: 'bbd1db98-4ac4-40a7-b514-968059c3dbac',
          type: 'User',
        },
        id: 'f2f7fb49-3581-4caa-b84b-e9489eb47d82',
        createdAt: new Date('2015-04-11T10:24:52.163Z'),
        text: 'Test text 2',
        tags: ['test', 'two'],
      },
      {
        author: {
          value: 'bbd1db98-4ac4-40a7-b514-968059c3dbac',
          type: 'User',
        },
        id: 'f2f7fb49-3581-4caa-b84b-e9489eb47d83',
        createdAt: new Date('2015-04-12T10:24:52.163Z'),
        text: 'Test text 3',
        tags: ['test', 'three'],
      },
      {
        author: {
          value: 'bbd1db98-4ac4-40a7-b514-968059c3dbac',
          type: 'User',
        },
        id: 'f2f7fb49-3581-4caa-b84b-e9489eb47d80',
        createdAt: new Date('2015-04-13T10:24:52.163Z'),
        text: 'Test text 4',
        tags: ['test', 'four'],
      },
      {
        author: {
          value: 'bbd1db98-4ac4-40a7-b514-968059c3dbac',
          type: 'User',
        },
        id: 'f2f7fb49-3581-4caa-b84b-e9489eb47d85',
        createdAt: new Date('2015-04-15T10:24:52.163Z'),
        text: 'Test text 5',
      },
      {
        author: {
          value: 'bbd1db98-4ac4-40a7-b514-968059c3dbac',
          type: 'User',
        },
        id: 'f2f7fb49-3581-4caa-b84b-e9489eb47d86',
        createdAt: new Date('2015-04-16T10:24:52.163Z'),
        text: 'Test text 6',
      },
      {
        author: {
          value: 'bbd1db98-4ac4-40a7-b514-968059c3dbac',
          type: 'User',
        },
        id: 'f2f7fb49-3581-4caa-b84b-e9489eb47d87',
        createdAt: new Date('2015-04-17T10:24:52.163Z'),
        text: 'Test text 7',
      },
    ],
    [AUTHENTICATION_PROVIDER_TABLE]: [
      {
        id: 'f2f7fb49-3581-4eou-b84b-e9489eb47d80',
        type: 'github',
        clientID: 'fakeClientId',
        clientSecret: 'fakeClientSecret',
        isEnabled: true,
      },
    ],
    [USER_TABLE]: [],
    [SECRET_TABLE]: [
      {
        value: 'secret',
      },
    ],
    [TYPE_TABLE]: [
      {
        kind: 'OBJECT',
        name: 'Category',
        interfaces: [],
        fields: [
          {
            name: 'name',
            type: 'string',
          },
        ],
        indexes: [],
      },
      {
        kind: 'OBJECT',
        name: 'User',
        interfaces: ['Node'],
        fields: [
          {
            name: 'id',
            type: 'id',
            isRequired: true,
          },
          {
            name: 'handle',
            type: 'string',
          },
          {
            name: 'email',
            type: 'string',
          },
          {
            name: 'microposts',
            type: 'connection',
            ofType: 'Micropost',
            reverseName: 'author',
          },
        ],
        indexes: [],
      },
      {
        kind: 'OBJECT',
        name: 'Micropost',
        interfaces: ['Node'],
        fields: [
          {
            name: 'id',
            type: 'id',
            isRequired: true,
          },
          {
            name: 'text',
            type: 'string',
          },
          {
            name: 'createdAt',
            type: 'datetime',
          },
          {
            name: 'author',
            type: 'User',
            reverseName: 'microposts',
          },
          {
            name: 'tags',
            type: 'list',
            ofType: 'string',
          },
          {
            name: 'categories',
            type: 'list',
            ofType: 'Category',
          },
          {
            name: 'mainCategory',
            type: 'Category',
          },
        ],
        indexes: [],
      },
    ],
  },
});

export function createEmptyDatabase(conn, dbName) {
  return RethinkDB.dbCreate(dbName).run(conn);
}

export async function createTestDatabase(conn, dbName) {
  await createEmptyDatabase(conn, dbName);
  await* TEST_DATA.get('tables').map(async function (data, table) {
    await RethinkDB.db(dbName).tableCreate(table).run(conn);
    await RethinkDB.db(dbName)
      .table(table)
      .insert(data.toJS())
      .run(conn);
  }).toArray();
}

export async function deleteTestDatabase(conn, dbName) {
  await RethinkDB.dbDrop(dbName).run(conn);
}
