# JS ACL

Provides a lightweight and flexible access control list (ACL) implementation for privileges management.

Inspired by [Zend ACL](https://framework.zend.com/manual/2.4/en/modules/zend.permissions.acl.intro.html).

## Installation

Using **npm**

```bash
npm install @nicolabello/js-acl
```

Using **yarn**

```bash
yarn add @nicolabello/js-acl
```

## Import

Using _import_ (ES6 way, e.g. **Angular**, **React**)

```typescript
import {Acl} from '@nicolabello/js-acl';
```

Using _require_ (CommonJS way, e.g. **Node.js**)

```js
const {Acl} = require('@nicolabello/js-acl');
```

## Usage example

Create a new ACL

```js
const acl = new Acl();
```

Add the roles to match the following structure

```
guest
authenticated
├── editor
└── admin
```

```js
acl.addRole('guest');
acl.addRole('authenticated');
acl.addRole('editor', 'authenticated');
acl.addRole('admin', 'authenticated');
```

Add the resources to match the following structure

```
restricted-area
├── admin-area
└── articles
    └── created-articles
```

```js
acl.addResource('restricted-area');
acl.addResource('admin-area', 'restricted-area');
acl.addResource('articles', 'restricted-area');
acl.addResource('created-articles', 'articles');
```

Allow/deny privileges

```js
// Authenticated users can navigate to restricted area
acl.allow('authenticated', 'restricted-area', 'navigate');

// Admin only can navigate to admin area
acl.deny('authenticated', 'admin-area', 'navigate');
acl.allow('admin', 'admin-area', 'navigate');

// Editors can add articles and edit their own
acl.allow('editor', 'articles', 'add');
acl.allow('editor', 'created-articles', 'edit');

// Authenticated users can like all articles,
// but they can't like their own articles
acl.allow('authenticated', 'articles', 'like');
acl.deny('authenticated', 'created-articles', 'like');
```

Query privileges

```js
acl.isAllowed('authenticated', 'restricted-area', 'navigate'); // true
acl.isAllowed('editor', 'restricted-area', 'navigate'); // true

acl.isAllowed('authenticated', 'admin-area', 'navigate'); // false
acl.isAllowed('admin', 'admin-area', 'navigate'); // true
acl.isAllowed('editor', 'admin-area', 'navigate'); // false

acl.isAllowed('authenticated', 'articles', 'add'); // false
acl.isAllowed('editor', 'articles', 'add'); // true

acl.isAllowed('authenticated', 'articles', 'like'); // true
acl.isAllowed('authenticated', 'created-articles', 'like'); // false
acl.isAllowed('editor', 'created-articles', 'like'); // false
```

## Documentation

### Create a new ACL

```js
const acl = new Acl();
```

By default, you can use **string** or **number** types as **roles**, **resources** and **privileges**.

If you are using typescript then you can define your own types.

```typescript
enum Roles { Guest, Authenticated, Editor, Admin }
enum Resources { RestrictedArea, AdminArea, Articles, CreatedArticles }
enum Privileges {Navigate, Add, Like}

const acl = new Acl<Roles, Resources, Privileges>();
```

### Add roles

```js
acl.addRole('guest');
```

Add a parent as second parameter to inherit all the parent's privileges

```js
acl.addRole('editor', 'authenticated');
```

Use an array to add multiple roles at once, with or without parent

```js
acl.addRole(['guest', 'authenticated']);
acl.addRole(['editor', 'publisher'], 'authenticated');
```

### Add resources

```js
acl.addResource('restricted-area');
```

Add a parent as second parameter to inherit all the parent's privileges

```js
acl.addResource('created-articles', 'articles');
```

Use an array to add multiple resources at once, with or without parent

```js
acl.addResource(['restricted-area', 'personal-area']);
acl.addResource(['admin-area', 'articles'], 'restricted-area');
```

### Allow/deny privileges

By default, all privileges are denied if not explicitly allowed.

Allow/deny all privileges on all resources for all roles

```js
acl.allow(null, null);
acl.deny(null, null);
```

Allow/deny a privilege on all resources for all roles

```js
acl.allow(null, null, 'view');
acl.deny(null, null, 'view');
```

Allow/deny all privileges on all resources for a role

```js
acl.allow('admin', null);
acl.deny('admin', null);
```

Allow/deny a privilege on all resources for a role

```js
acl.allow('admin', null, 'edit');
acl.deny('admin', null, 'edit');
```

Allow/deny all privileges on a resource for all role

```js
acl.allow(null, 'articles');
acl.deny(null, 'articles');
```

Allow/deny a privilege on a resource for all roles

```js
acl.allow(null, 'articles', 'view');
acl.deny(null, 'articles', 'view');
```

Allow/deny all privileges on a resource for a role

```js
acl.allow('admin', 'admin-area');
acl.deny('admin', 'admin-area');
```

Allow/deny a privilege on a resource for a role

```js
acl.allow('admin', 'admin-area', 'navigate');
acl.deny('admin', 'admin-area', 'navigate');
```

Arrays can be used in any of the above to allow/deny multiple roles, resources and privileges

```js
acl.allow(['admin', 'publisher'], null, ['add', 'remove']);
acl.deny(null, ['article', 'category'], ['add', 'remove']);
```

### Query privileges

Query all privileges on all resources for all roles

```js
acl.isAllowed(null, null);
```

Query a privilege on all resources for all roles

```js
acl.isAllowed(null, null, 'view');
```

Query all privileges on all resources for a role

```js
acl.isAllowed('admin', null);
```

Query a privilege on all resources for a role

```js
acl.isAllowed('admin', null, 'edit');
```

Query all privileges on a resource for all roles

```js
acl.isAllowed(null, 'articles');
```

Query a privilege on a resource for all roles

```js
acl.isAllowed(null, 'articles', 'view');
```

Query all privileges on a resource for a role

```js
acl.isAllowed('admin', 'admin-area');
```

Query a privilege on a resource for a role

```js
acl.isAllowed('admin', 'admin-area', 'navigate');
```

## License

Licensed under the terms of [GNU General Public License Version 2 or later](http://www.gnu.org/licenses/gpl.html).
