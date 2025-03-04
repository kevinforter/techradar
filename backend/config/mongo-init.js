db.createUser({
  user: 'dbuser',
  pwd: 'dbfd1ba49a42ef537409775ae0066dd2',
  roles: [
    {
      role: 'readWrite',
      db: 'myDatabase',
    },
  ],
});
