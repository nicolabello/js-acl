import {Acl} from "./acl";

enum Roles {
    Guest = 'guest',
    Authenticated = 'authenticated',
    Admin = 'admin',
    User = 'user'
}

enum Resources {
    RestrictedArea = 'restricted-area',
    Articles = 'articles',
    ArticlesOwned = 'articles-owned',
    ArticlesNotOwned = 'articles-not-owned',
    AdminArea = 'admin-area'
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
    expect(acl.isAllowed(Roles.User, Resources.Articles, 'view')).toBeFalsy();
});

test('Deny nonexistent privilege', () => {
    const acl = getDefaultAcl();
    expect(acl.isAllowed(Roles.User, Resources.Articles, 'nonexistent')).toBeFalsy();
});

test('Allow if directly allowed', () => {
    const acl = getDefaultAcl();
    acl.allow(Roles.User, Resources.Articles, 'view');
    expect(acl.isAllowed(Roles.User, Resources.Articles, 'view')).toBeTruthy();
});

test('Allow child resources of allowed parent', () => {
    const acl = getDefaultAcl();
    acl.allow(Roles.User, Resources.Articles, 'view');
    expect(acl.isAllowed(Roles.User, Resources.ArticlesOwned, 'view')).toBeTruthy();
});

test('Allow child roles of allowed parent', () => {
    const acl = getDefaultAcl();
    acl.allow(Roles.Authenticated, Resources.Articles, 'view');
    expect(acl.isAllowed(Roles.User, Resources.Articles, 'view')).toBeTruthy();
});

test('Allow child resources and roles of allowed parents', () => {
    const acl = getDefaultAcl();
    acl.allow(Roles.Authenticated, Resources.Articles, 'view');
    expect(acl.isAllowed(Roles.User, Resources.ArticlesOwned, 'view')).toBeTruthy();
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
    expect(acl.isAllowed(Roles.User, Resources.ArticlesOwned, 'view')).toBeFalsy();
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
    expect(acl.isAllowed('child-user', Resources.ArticlesOwned, 'view')).toBeFalsy();
});
