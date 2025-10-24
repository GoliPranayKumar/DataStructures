import java.util.*;

public class Main {
    public static void main(String[] args) {
        
        // Initialization of PriorityQueue as a Max Heap
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        
        // Adding elements into the Max Heap
        maxHeap.add(10);
        maxHeap.add(5);
        maxHeap.add(20);
        maxHeap.add(15);
        
        System.out.println(maxHeap); // Internal order may vary, but largest element is at the head
        
        // Peek: Shows the largest element (head of the max heap)
        System.out.println("Top (largest) element: " + maxHeap.peek());
        
        // Removing elements (removes the largest first)
        maxHeap.remove(); // Removes the head (largest element)
        System.out.println("After removing one element: " + maxHeap);
        
        // Poll: removes and returns the head (largest element)
        System.out.println("Polled element: " + maxHeap.poll());
        System.out.println("After polling: " + maxHeap);
        
        // Check if empty
        System.out.println("Is empty: " + maxHeap.isEmpty());
        
        // Check if it contains a specific element
        System.out.println("Contains 20? " + maxHeap.contains(20));
    }
}
