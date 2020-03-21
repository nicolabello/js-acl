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

function getAcl(): Acl<Roles, Resources> {

    const acl = new Acl<Roles, Resources>();

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

test('Create empty acl', () => {
    const acl = new Acl();
    expect(acl).toBeDefined();
});

test('Disallow all by default', () => {
    const acl = getAcl();
    expect(acl.isAllowed(Roles.User, Resources.Articles, 'view')).toBeFalsy();
});

test('Query directly allowed', () => {
    const acl = getAcl();
    acl.allow(Roles.User, Resources.Articles, 'view');
    expect(acl.isAllowed(Roles.User, Resources.Articles, 'view')).toBeTruthy();
});

test('Query child resource allowed', () => {
    const acl = getAcl();
    acl.allow(Roles.User, Resources.Articles, 'view');
    expect(acl.isAllowed(Roles.User, Resources.ArticlesOwned, 'view')).toBeTruthy();
});
