export interface TreeNode<T> {
  id: T | null;
  parent?: TreeNode<T>;
}
