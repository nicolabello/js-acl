import {TreeNode} from "../models/tree-node";

export class Tree<T> {

    protected nodes: TreeNode<T>[] = [];

    public find(data: T): TreeNode<T> | undefined {
        return this.nodes.find(node => node.data === data);
    }

    public push(data: T, parentData?: T): TreeNode<T> | undefined {

        let node = this.find(data);

        if (node) {
            return node;
        }

        node = {
            data: data
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
