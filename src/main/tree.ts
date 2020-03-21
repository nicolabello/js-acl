import {TreeNode} from "../models/tree-node";

export class Tree<T> {

    protected nodes: TreeNode<T>[] = [];

    public find(id: T): TreeNode<T> | undefined {
        return this.nodes.find(node => node.id === id);
    }

    public push(id: T, parentData?: T): TreeNode<T> | undefined {

        let node = this.find(id);

        if (node) {
            return node;
        }

        node = {
            id: id
        };

        if (parentData !== null && typeof parentData !== 'undefined') {

            const parentNode = this.find(parentData as T);

            if (parentNode) {
                node.parent = parentNode;
                this.nodes.push(node);
                return node;
            }

            return;

        }

        this.nodes.push(node);
        return node;

    }

}
