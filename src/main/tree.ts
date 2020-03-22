import {TreeNode} from "../models/tree-node";

export class Tree<T> {

    protected nodes: TreeNode<T>[] = [];

    public find(id: T | null): TreeNode<T> | undefined {
        return this.nodes.find(node => node.id === id);
    }

    public push(id: T, parentId?: T): TreeNode<T> | undefined {

        let node = this.find(id);

        if (node) {
            return node;
        }

        node = {
            id: id
        };

        if (parentId !== null && typeof parentId !== 'undefined') {

            const parentNode = this.find(parentId as T);

            if (parentNode) {
                node.parent = parentNode;
                this.nodes.push(node);
                return node;
            }

            return;

        }

        let parentNode = this.find(null);

        if(!parentNode) {

            parentNode = {
                id: null
            };

            this.nodes.push(parentNode);

        }

        node.parent = parentNode;
        this.nodes.push(node);
        return node;

    }

}
