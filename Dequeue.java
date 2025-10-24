import java.util.*;

public class Main {
    public static void main(String[] args) {
        
        // Initialization of Deque (using ArrayDeque implementation)
        Deque<Integer> dq = new ArrayDeque<>();
        
        // Adding elements into the Deque
        dq.add(1);            // Adds element at the rear (same as addLast)
        dq.addFirst(2);       // Adds element at the front
        dq.addLast(8);        // Adds element at the rear
        
        System.out.println(dq); // Prints all elements
        
        // Removing elements
        dq.removeFirst();     // Removes element from the front
        dq.removeLast();      // Removes element from the rear
        
        System.out.println(dq); // Prints after removals
        
        // Peek operations
        System.out.println("Front element: " + dq.peekFirst()); // Looks at the front
        System.out.println("Rear element: " + dq.peekLast());   // Looks at the rear
        
        // Check if empty
        System.out.println(dq.isEmpty()); // Returns true if Deque is empty
        
        // Check if a specific element exists
        System.out.println(dq.contains(8)); // Returns true if 8 is present
    }
}
