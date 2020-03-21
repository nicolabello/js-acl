import {Resources} from "./resources";
import {Roles} from "./roles";
import {Privileges} from "./privileges";
import {TreeNode} from "../models/tree-node";
import {Modifier} from "../models/privilege";

export class Acl<Role = string, Resource = string, Privilege = string> {

    private roles = new Roles<Role>();
    private resources = new Resources<Resource>();
    private privileges = new Privileges<Role, Resource, Privilege>();

    public addRole(role: Role, parent?: Role): boolean {
        return !!this.roles.push(role, parent);
    }

    public addRoles(roles: Role[], parentRole?: Role): boolean[] {
        return roles.map(roleId => this.addRole(roleId, parentRole));
    }

    public addResource(resource: Resource, parent?: Resource): boolean {
        return !!this.resources.push(resource, parent);
    }

    public addResources(resources: Resource[], parentResource?: Resource): boolean[] {
        return resources.map(resourceId => this.addResource(resourceId, parentResource));
    }

    public allow(role: Role | Role[], resource: Resource | Resource[], privilege: Privilege | Privilege[]): void {
        this.privileges.allow(role, resource, privilege);
    }

    public deny(role: Role | Role[], resource: Resource | Resource[], privilege: Privilege | Privilege[]): void {
        this.privileges.deny(role, resource, privilege);
    }

    public isAllowed(role: Role, resource: Resource, privilege: Privilege): boolean {

        const roleNode = this.roles.find(role);
        const resourceNode = this.resources.find(resource);

        if (roleNode && resourceNode) {
            return this.getModifier(roleNode, resourceNode, privilege) === Modifier.Allow
        }

        return false;

    }

    private getModifier(roleNode: TreeNode<Role>, resourceNode: TreeNode<Resource>, privilege: Privilege): Modifier | undefined {

        const modifier = this.privileges.getModifier(roleNode.data, resourceNode.data, privilege);

        if (modifier === Modifier.Allow || modifier === Modifier.Deny) {
            return modifier;
        }

        if (resourceNode.parent) {
            return this.getModifier(roleNode, resourceNode.parent, privilege);
        }

        if (roleNode.parent) {
            return this.getModifier(roleNode.parent, resourceNode, privilege);
        }

    }

}
