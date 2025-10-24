import java.util.*;

public class Main {
    public static void main(String[] args) {
        
        // Initialization of PriorityQueue (Min Heap by default)
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        
        // Adding elements into the PriorityQueue
        pq.add(10);
        pq.add(5);
        pq.add(20);
        pq.add(15);
        
        System.out.println(pq); // Order may not look sorted, but smallest is always at head
        
        // Peek: Shows the smallest element (head of the min heap)
        System.out.println("Top (smallest) element: " + pq.peek());
        
        // Removing elements (removes the smallest first)
        pq.remove(); // Removes the head element — here, 5
        System.out.println("After removing one element: " + pq);
        
        // Poll: also removes and returns the head element
        System.out.println("Polled element: " + pq.poll());
        System.out.println("After polling: " + pq);
        
        // Check if queue is empty
        System.out.println("Is empty: " + pq.isEmpty());
        
        // Check if it contains an element
        System.out.println("Contains 20? " + pq.contains(20));
    }
}
