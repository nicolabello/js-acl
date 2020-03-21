import {Modifier, PrivilegeModifier, ResourcePrivileges, RoleResources} from "../models/privilege";

export class Privileges<Role = string, Resource = string, Privilege = string> {

    private data: RoleResources<Role, Resource, Privilege>[] = [];

    public allow(role: Role | Role[], resource: Resource | Resource[], privilege: Privilege | Privilege[]): void {
        this.setPrivileges(role, resource, privilege, Modifier.Allow);
    }

    public deny(role: Role | Role[], resource: Resource | Resource[], privilege: Privilege | Privilege[]): void {
        this.setPrivileges(role, resource, privilege, Modifier.Deny);
    }

    public getModifier(role: Role, resource: Resource, privilege: Privilege): Modifier | undefined {
        return this.data.find(roleResources => roleResources.role === role)
            ?.resources.find(resourcePrivileges => resourcePrivileges.resource === resource)
            ?.privileges.find(privilegeModifier => privilegeModifier.privilege === privilege)
            ?.modifier;
    }

    private getRole(role: Role): RoleResources<Role, Resource, Privilege> | undefined {
        return this.data.find(roleResources => roleResources.role === role);
    }

    private addRole(role: Role): RoleResources<Role, Resource, Privilege> {
        const roleResources: RoleResources<Role, Resource, Privilege> = {
            role: role,
            resources: []
        };
        this.data.push(roleResources);
        return roleResources;
    }

    private getResource(role: RoleResources<Role, Resource, Privilege>, resource: Resource): ResourcePrivileges<Resource, Privilege> | undefined {
        return role.resources.find(resourcePrivileges => resourcePrivileges.resource === resource);
    }

    private addResource(role: RoleResources<Role, Resource, Privilege>, resource: Resource): ResourcePrivileges<Resource, Privilege> {
        const resourcePrivileges: ResourcePrivileges<Resource, Privilege> = {
            resource: resource,
            privileges: []
        };
        role.resources.push(resourcePrivileges);
        return resourcePrivileges;
    }

    private getPrivilege(resource: ResourcePrivileges<Resource, Privilege>, privilege: Privilege): PrivilegeModifier<Privilege> | undefined {
        return resource.privileges.find(privilegeModifier => privilegeModifier.privilege === privilege);
    }

    private addPrivilege(resource: ResourcePrivileges<Resource, Privilege>, privilege: Privilege): PrivilegeModifier<Privilege> {
        const privilegeModifier: PrivilegeModifier<Privilege> = {
            privilege: privilege,
        };
        resource.privileges.push(privilegeModifier);
        return privilegeModifier;
    }

    private setPrivileges(role: Role | Role[], resource: Resource | Resource[], privilege: Privilege | Privilege[], modifier: Modifier): void {

        const roles = Array.isArray(role) ? role : [role];
        const resources = Array.isArray(resource) ? resource : [resource];
        const privileges = Array.isArray(privilege) ? privilege : [privilege];

        for (const role of roles) {

            const roleResources = this.getRole(role) || this.addRole(role);

            for (const resource of resources) {

                const resourcePrivileges = this.getResource(roleResources, resource) || this.addResource(roleResources, resource);

                for (const privilege of privileges) {

                    const privilegeModifier = this.getPrivilege(resourcePrivileges, privilege) || this.addPrivilege(resourcePrivileges, privilege);

                    if (privilegeModifier) {
                        privilegeModifier.modifier = modifier;
                    }

                }

            }

        }

    }

}
