export enum Modifier {
  Allow = 1,
  Deny = 0,
}

export interface PrivilegeModifier<Privilege> {
  privilege: Privilege | null;
  modifier?: Modifier;
}

export interface ResourcePrivileges<Resource, Privilege> {
  resource: Resource | null;
  privileges: PrivilegeModifier<Privilege>[];
}

export interface RoleResources<Role, Resource, Privilege> {
  role: Role | null;
  resources: ResourcePrivileges<Resource, Privilege>[];
}
