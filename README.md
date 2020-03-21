# JS ACL

Provides a lightweight and flexible access control list (ACL) implementation for privileges management.

Inspired by [Zend ACL](https://framework.zend.com/manual/2.4/en/modules/zend.permissions.acl.intro.html).

## Installation and usage

### Installation

Using **npm**

```bash
npm install @nicolabello/js-acl
```

Using **yarn**

```bash
yarn add @nicolabello/js-acl
```

### Import

Using _import_ (ES6 way, e.g. **Angular**, **React**)

```js
import {Acl} from "@nicolabello/js-acl";
```

Using _require_ (CommonJS way, e.g. **Node.js**)

```js
const {Acl} = require('@nicolabello/js-acl');
```

### Usage

Create a new ACL

```js
const acl = new Acl();
```

Add the **roles** respecting the following tree

```
•
├── guest
└── authenticated
    ├── editor
    └── admin
```

```js
acl.addRole('guest');
acl.addRole('authenticated');
acl.addRole('editor', 'authenticated');
acl.addRole('admin', 'authenticated');
```

Add the **resources** respecting the following tree

```
•
└── restricted-area
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

Check privileges
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

## License

Licensed under the terms of [GNU General Public License Version 2 or later](http://www.gnu.org/licenses/gpl.html).
