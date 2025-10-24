import java.util.*;

public class Main {
    public static void main(String[] args) {
        
        // Initialization of Queue (using LinkedList as implementation)
        Queue<Integer> q = new LinkedList<>();
        
        // Adding elements into the Queue
        q.add(1);
        q.offer(2); // offer() also adds element — same as add(), but safer
        q.add(8);
        
        System.out.println(q); // Prints the queue elements
        
        // Removing element from the front of the queue
        q.remove(); // Removes the front (head) element — here, it removes 1
        
        // Peek: Shows the element at the front without removing it
        System.out.println(q.peek()); // Here, it will print 2
        
        // Check if the queue is empty
        System.out.println(q.isEmpty()); // Returns true if queue is empty
        
        // Check if an element exists in the queue
        System.out.println(q.contains(8)); // Returns true if 8 is present
        
    }
}
