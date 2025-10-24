import java.util.*;
public class Main
{
	public static void main(String[] args) {
	    
	    Stack<Integer> st = new Stack<>(); //Intialization of Stack
	    
	    st.push(1); //Adding elements into the Stack
	    st.add(2); //It does the same
	    st.add(8);
	    
	    System.out.println(st);
	    
	    st.pop(); //Removes the top Most element . Here in this case it will remove 2
	    
	    st.peek() ;//Print the the Top most elemet Here it is 2
	    
	    System.out.println(st.peek());
	    
	    System.out.println(st.isEmpty()); //Returns if it is Empty or Not 
	    
	    
	    System.out.println(st.search(8)); //This methods retrurn 1 if elemets present else -1 if not present
	    
	    
	    
	    
	    
	    
		
	}
}
