import {Modifier, PrivilegeModifier, ResourcePrivileges, RoleResources} from "../models/privilege";

export class Privileges<Role, Resource, Privilege> {

    private data: RoleResources<Role, Resource, Privilege>[] = [];

    public allow(role: Role | Role[] | null, resource: Resource | Resource[] | null, privilege: Privilege | Privilege[] | null): void {
        this.setPrivileges(role, resource, privilege, Modifier.Allow);
    }

    public deny(role: Role | Role[] | null, resource: Resource | Resource[] | null, privilege: Privilege | Privilege[] | null): void {
        this.setPrivileges(role, resource, privilege, Modifier.Deny);
    }

    public getModifier(role: Role | null, resource: Resource | null, privilege: Privilege | null): Modifier | undefined {

        const resourcePrivileges = this.data.find(roleResources => roleResources.role === role)
            ?.resources.find(resourcePrivileges => resourcePrivileges.resource === resource);

        if (privilege === null) {
            return resourcePrivileges
                ?.privileges.find(privilegeModifier => privilegeModifier.privilege === privilege)
                ?.modifier;
        }

        return (resourcePrivileges?.privileges.find(privilegeModifier => privilegeModifier.privilege === privilege)
            || resourcePrivileges?.privileges.find(privilegeModifier => privilegeModifier.privilege === null))
            ?.modifier;

    }

    private getRole(role: Role | null): RoleResources<Role, Resource, Privilege> | undefined {
        return this.data.find(roleResources => roleResources.role === role);
    }

    private addRole(role: Role | null): RoleResources<Role, Resource, Privilege> {
        const roleResources: RoleResources<Role, Resource, Privilege> = {
            role: role,
            resources: []
        };
        this.data.push(roleResources);
        return roleResources;
    }

    private getResource(role: RoleResources<Role, Resource, Privilege>, resource: Resource | null): ResourcePrivileges<Resource, Privilege> | undefined {
        return role.resources.find(resourcePrivileges => resourcePrivileges.resource === resource);
    }

    private addResource(role: RoleResources<Role, Resource, Privilege>, resource: Resource | null): ResourcePrivileges<Resource, Privilege> {
        const resourcePrivileges: ResourcePrivileges<Resource, Privilege> = {
            resource: resource,
            privileges: []
        };
        role.resources.push(resourcePrivileges);
        return resourcePrivileges;
    }

    private getPrivilege(resource: ResourcePrivileges<Resource, Privilege>, privilege: Privilege | null): PrivilegeModifier<Privilege> | undefined {
        return resource.privileges.find(privilegeModifier => privilegeModifier.privilege === privilege);
    }

    private addPrivilege(resource: ResourcePrivileges<Resource, Privilege>, privilege: Privilege | null): PrivilegeModifier<Privilege> {
        const privilegeModifier: PrivilegeModifier<Privilege> = {
            privilege: privilege,
        };
        resource.privileges.push(privilegeModifier);
        return privilegeModifier;
    }

    private setPrivileges(role: Role | Role[] | null, resource: Resource | Resource[] | null, privilege: Privilege | Privilege[] | null, modifier: Modifier): void {

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
