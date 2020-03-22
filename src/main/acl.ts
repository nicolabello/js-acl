import {Resources} from "./resources";
import {Roles} from "./roles";
import {Privileges} from "./privileges";
import {TreeNode} from "../models/tree-node";
import {Modifier} from "../models/privilege";

export class Acl<Role = string | number, Resource = string | number, Privilege = string | number> {

    private roles = new Roles<Role>();
    private resources = new Resources<Resource>();
    private privileges = new Privileges<Role, Resource, Privilege>();

    public addRole(role: Role | Role[], parent?: Role): boolean | boolean[] {
        if (Array.isArray(role)) {
            return role.map(r => !!this.roles.push(r, parent))
        }
        return !!this.roles.push(role, parent);
    }

    public addResource(resource: Resource | Resource[], parent?: Resource): boolean | boolean[] {
        if (Array.isArray(resource)) {
            return resource.map(r => !!this.resources.push(r, parent))
        }
        return !!this.resources.push(resource, parent);
    }

    public allow(role: Role | Role[] | null, resource: Resource | Resource[] | null, privilege: Privilege | Privilege[] | null = null): void {
        this.privileges.allow(role, resource, privilege);
    }

    public deny(role: Role | Role[] | null, resource: Resource | Resource[] | null, privilege: Privilege | Privilege[] | null = null): void {
        this.privileges.deny(role, resource, privilege);
    }

    public isAllowed(role: Role | null, resource: Resource | null, privilege: Privilege | null = null): boolean {

        const roleNode = this.roles.find(role);
        const resourceNode = this.resources.find(resource);

        if (roleNode && resourceNode) {
            return this.getRoleBranchModifier(roleNode, resourceNode, privilege) === Modifier.Allow
        }

        return false;

    }

    private getResourceBranchModifier(roleNode: TreeNode<Role>, resourceNode: TreeNode<Resource>, privilege: Privilege | null): Modifier | undefined {

        const modifier = this.privileges.getModifier(roleNode.id, resourceNode.id, privilege);

        if (modifier === Modifier.Allow || modifier === Modifier.Deny) {
            return modifier;
        }

        if (resourceNode.parent) {
            return this.getResourceBranchModifier(roleNode, resourceNode.parent, privilege);
        }

    }

    private getRoleBranchModifier(roleNode: TreeNode<Role>, resourceNode: TreeNode<Resource>, privilege: Privilege | null): Modifier | undefined {

        const modifier = this.getResourceBranchModifier(roleNode, resourceNode, privilege);

        if (modifier === Modifier.Allow || modifier === Modifier.Deny) {
            return modifier;
        }

        if (roleNode.parent) {
            return this.getRoleBranchModifier(roleNode.parent, resourceNode, privilege);
        }

    }

}
