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

    public addResource(resource: Resource, parent?: Resource): boolean {
        return !!this.resources.push(resource, parent);
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
            return this.getRoleBranchModifier(roleNode, resourceNode, privilege) === Modifier.Allow
        }

        return false;

    }

    private getResourceBranchModifier(roleNode: TreeNode<Role>, resourceNode: TreeNode<Resource>, privilege: Privilege): Modifier | undefined {

        const modifier = this.privileges.getModifier(roleNode.id, resourceNode.id, privilege);

        if (modifier === Modifier.Allow || modifier === Modifier.Deny) {
            return modifier;
        }

        if (resourceNode.parent) {
            return this.getResourceBranchModifier(roleNode, resourceNode.parent, privilege);
        }

    }

    private getRoleBranchModifier(roleNode: TreeNode<Role>, resourceNode: TreeNode<Resource>, privilege: Privilege): Modifier | undefined {

        const modifier = this.getResourceBranchModifier(roleNode, resourceNode, privilege);

        if (modifier === Modifier.Allow || modifier === Modifier.Deny) {
            return modifier;
        }

        if (roleNode.parent) {
            return this.getRoleBranchModifier(roleNode.parent, resourceNode, privilege);
        }

    }

}
