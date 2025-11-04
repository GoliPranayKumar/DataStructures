// Node class
class Node {
    int data;
    Node left, right;

    public Node(int data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

// Binary Search Tree class
class BinaryTree {
    Node root;

    public BinaryTree() {
        root = null;
    }

    public void insert(int data) {
        root = insertRec(root, data);
    }

    private Node insertRec(Node root, int data) {
        if (root == null) {
            return new Node(data);
        }
        if (data < root.data) {
            root.left = insertRec(root.left, data);
        } else if (data > root.data) {
            root.right = insertRec(root.right, data);
        }
        return root;
    }

    // 🔹 Inorder Traversal (Left → Root → Right)
    public void inorder() {
        System.out.print("Inorder: ");
        inorderRec(root);
        System.out.println();
    }
    private void inorderRec(Node root) {
        if (root != null) {
            inorderRec(root.left);
            System.out.print(root.data + " ");
            inorderRec(root.right);
        }
    }

    // 🔹 Preorder Traversal (Root → Left → Right)
    public void preorder() {
        System.out.print("Preorder: ");
        preorderRec(root);
        System.out.println();
    }
    private void preorderRec(Node root) {
        if (root != null) {
            System.out.print(root.data + " ");
            preorderRec(root.left);
            preorderRec(root.right);
        }
    }

    // 🔹 Postorder Traversal (Left → Right → Root)
    public void postorder() {
        System.out.print("Postorder: ");
        postorderRec(root);
        System.out.println();
    }
    private void postorderRec(Node root) {
        if (root != null) {
            postorderRec(root.left);
            postorderRec(root.right);
            System.out.print(root.data + " ");
        }
    }
}

// Main class to test the tree
public class Main {
    public static void main(String[] args) {
        BinaryTree tree = new BinaryTree();
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        tree.insert(2);
        tree.insert(4);
        tree.insert(6);
        tree.insert(8);

        tree.inorder();   // Output: 2 3 4 5 6 7 8 (sorted)
        tree.preorder();  // Output: 5 3 2 4 7 6 8
        tree.postorder(); // Output: 2 4 3 6 8 7 5
    }
}
