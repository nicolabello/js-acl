export enum Modifier {
    Allow = 1,
    Deny = 0
}

export interface PrivilegeModifier<Privilege> {
    privilege: Privilege;
    modifier?: Modifier;
}

export interface ResourcePrivileges<Resource, Privilege> {
    resource: Resource;
    privileges: PrivilegeModifier<Privilege>[];
}

export interface RoleResources<Role, Resource, Privilege> {
    role: Role;
    resources: ResourcePrivileges<Resource, Privilege>[];
}
