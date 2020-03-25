import { Acl } from './acl';

enum Roles {
  Guest = 'guest',
  Authenticated = 'authenticated',
  Admin = 'admin',
  User = 'user',
}

enum Resources {
  RestrictedArea = 'restricted-area',
  Articles = 'articles',
  ArticlesOwned = 'articles-owned',
  ArticlesNotOwned = 'articles-not-owned',
  AdminArea = 'admin-area',
}

function getDefaultAcl(): Acl<Roles | string, Resources | string> {
  const acl = new Acl<Roles | string, Resources | string>();

  acl.addRole(Roles.Guest);
  acl.addRole(Roles.Authenticated);
  acl.addRole(Roles.Admin, Roles.Authenticated);
  acl.addRole(Roles.User, Roles.Authenticated);

  acl.addResource(Resources.RestrictedArea);
  acl.addResource(Resources.Articles, Resources.RestrictedArea);
  acl.addResource(Resources.ArticlesOwned, Resources.Articles);
  acl.addResource(Resources.ArticlesNotOwned, Resources.Articles);
  acl.addResource(Resources.AdminArea, Resources.RestrictedArea);

  return acl;
}

test('Class instantiation', () => {
  const acl = new Acl();
  expect(acl).toBeDefined();
});

test('Deny by default', () => {
  const acl = getDefaultAcl();
  expect(acl.isAllowed(Roles.User, Resources.Articles, 'view')).toBeFalsy();
});

test('Deny nonexistent role', () => {
  const acl = getDefaultAcl();
  expect(acl.isAllowed('nonexistent', Resources.Articles, 'view')).toBeFalsy();
});

test('Deny nonexistent resource', () => {
  const acl = getDefaultAcl();
  expect(acl.isAllowed(Roles.User, 'nonexistent', 'view')).toBeFalsy();
});

test('Deny nonexistent privilege', () => {
  const acl = getDefaultAcl();
  expect(
    acl.isAllowed(Roles.User, Resources.Articles, 'nonexistent')
  ).toBeFalsy();
});

test('Allow if directly allowed', () => {
  const acl = getDefaultAcl();
  acl.allow(Roles.User, Resources.Articles, 'view');
  expect(acl.isAllowed(Roles.User, Resources.Articles, 'view')).toBeTruthy();
});

test('Allow child resources of allowed parent', () => {
  const acl = getDefaultAcl();
  acl.allow(Roles.User, Resources.Articles, 'view');
  expect(
    acl.isAllowed(Roles.User, Resources.ArticlesOwned, 'view')
  ).toBeTruthy();
});

test('Allow child roles of allowed parent', () => {
  const acl = getDefaultAcl();
  acl.allow(Roles.Authenticated, Resources.Articles, 'view');
  expect(acl.isAllowed(Roles.User, Resources.Articles, 'view')).toBeTruthy();
});

test('Allow child resources and roles of allowed parents', () => {
  const acl = getDefaultAcl();
  acl.allow(Roles.Authenticated, Resources.Articles, 'view');
  expect(
    acl.isAllowed(Roles.User, Resources.ArticlesOwned, 'view')
  ).toBeTruthy();
});

test('Deny if directly denied', () => {
  const acl = getDefaultAcl();
  acl.allow(Roles.Authenticated, Resources.Articles, 'view');
  acl.deny(Roles.User, Resources.Articles, 'view');
  expect(acl.isAllowed(Roles.User, Resources.Articles, 'view')).toBeFalsy();
});

test('Deny child resources of denied parent', () => {
  const acl = getDefaultAcl();
  acl.allow(Roles.Authenticated, Resources.Articles, 'view');
  acl.deny(Roles.User, Resources.Articles, 'view');
  expect(
    acl.isAllowed(Roles.User, Resources.ArticlesOwned, 'view')
  ).toBeFalsy();
});

test('Deny child roles of denied parent', () => {
  const acl = getDefaultAcl();
  acl.allow(Roles.Authenticated, Resources.Articles, 'view');
  acl.deny(Roles.User, Resources.Articles, 'view');
  acl.addRole('child-user', Roles.User);
  expect(acl.isAllowed('child-user', Resources.Articles, 'view')).toBeFalsy();
});

test('Deny child resources and roles of denied parents', () => {
  const acl = getDefaultAcl();
  acl.allow(Roles.Authenticated, Resources.Articles, 'view');
  acl.deny(Roles.User, Resources.Articles, 'view');
  acl.addRole('child-user', Roles.User);
  expect(
    acl.isAllowed('child-user', Resources.ArticlesOwned, 'view')
  ).toBeFalsy();
});

test('Allow all', () => {
  const acl = getDefaultAcl();
  acl.allow(null, null);
  expect(acl.isAllowed(null, null)).toBeTruthy();
  expect(acl.isAllowed(Roles.User, null)).toBeTruthy();
  expect(acl.isAllowed(Roles.User, Resources.Articles)).toBeTruthy();
  expect(acl.isAllowed(Roles.User, Resources.Articles, 'view')).toBeTruthy();
});

test('Deny nonexistent role', () => {
  const acl = getDefaultAcl();
  acl.allow(null, null);
  expect(acl.isAllowed('nonexistent', Resources.Articles, 'view')).toBeFalsy();
});

test('Deny nonexistent resource', () => {
  const acl = getDefaultAcl();
  acl.allow(null, null);
  expect(acl.isAllowed(Roles.User, 'nonexistent', 'view')).toBeFalsy();
});

test('Allow nonexistent privilege', () => {
  const acl = getDefaultAcl();
  acl.allow(null, null);
  expect(
    acl.isAllowed(Roles.User, Resources.Articles, 'nonexistent')
  ).toBeTruthy();
});

test('Allow any resource and privilege on specific role', () => {
  const acl = getDefaultAcl();
  acl.allow(Roles.Authenticated, null);
  expect(acl.isAllowed(Roles.Authenticated, null)).toBeTruthy();
  expect(
    acl.isAllowed(Roles.Authenticated, Resources.AdminArea, 'view')
  ).toBeTruthy();
});

test('Allow any resource and privilege on child role', () => {
  const acl = getDefaultAcl();
  acl.allow(Roles.Authenticated, null);
  expect(acl.isAllowed(Roles.User, null)).toBeTruthy();
  expect(acl.isAllowed(Roles.User, Resources.AdminArea, 'view')).toBeTruthy();
});

test('Deny a specific resource', () => {
  const acl = getDefaultAcl();
  acl.allow(Roles.Authenticated, null);
  acl.deny(Roles.Authenticated, Resources.AdminArea);
  expect(acl.isAllowed(Roles.Authenticated, Resources.Articles)).toBeTruthy();
  expect(acl.isAllowed(Roles.User, Resources.Articles)).toBeTruthy();
  expect(acl.isAllowed(Roles.Authenticated, Resources.AdminArea)).toBeFalsy();
  expect(acl.isAllowed(Roles.User, Resources.AdminArea)).toBeFalsy();
});

test('Deny a specific privilege', () => {
  const acl = getDefaultAcl();
  acl.allow(Roles.Authenticated, Resources.Articles);
  acl.deny(Roles.Authenticated, Resources.Articles, 'delete');
  expect(
    acl.isAllowed(Roles.Authenticated, Resources.Articles, 'view')
  ).toBeTruthy();
  expect(acl.isAllowed(Roles.User, Resources.Articles, 'view')).toBeTruthy();
  expect(
    acl.isAllowed(Roles.Authenticated, Resources.Articles, 'delete')
  ).toBeFalsy();
  expect(acl.isAllowed(Roles.User, Resources.Articles, 'delete')).toBeFalsy();
});

test('Readme examples', () => {
  const acl = new Acl();

  acl.addRole('guest');
  acl.addRole('authenticated');
  acl.addRole('editor', 'authenticated');
  acl.addRole('admin', 'authenticated');

  acl.addResource('restricted-area');
  acl.addResource('admin-area', 'restricted-area');
  acl.addResource('articles', 'restricted-area');
  acl.addResource('created-articles', 'articles');

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

  expect(
    acl.isAllowed('authenticated', 'restricted-area', 'navigate')
  ).toBeTruthy();
  expect(acl.isAllowed('editor', 'restricted-area', 'navigate')).toBeTruthy();

  expect(acl.isAllowed('authenticated', 'admin-area', 'navigate')).toBeFalsy();
  expect(acl.isAllowed('admin', 'admin-area', 'navigate')).toBeTruthy();
  expect(acl.isAllowed('editor', 'admin-area', 'navigate')).toBeFalsy();

  expect(acl.isAllowed('authenticated', 'articles', 'add')).toBeFalsy();
  expect(acl.isAllowed('editor', 'articles', 'add')).toBeTruthy();

  expect(acl.isAllowed('authenticated', 'articles', 'like')).toBeTruthy();
  expect(
    acl.isAllowed('authenticated', 'created-articles', 'like')
  ).toBeFalsy();
  expect(acl.isAllowed('editor', 'created-articles', 'like')).toBeFalsy();
});
