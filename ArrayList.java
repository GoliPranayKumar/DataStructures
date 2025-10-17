import java.util.*;

public class Main
{
	public static void main(String[] args) {
		ArrayList<Integer> al=new ArrayList<>();   //Declaration of ArrayList
		al.add(1);
		al.add(5);
		System.out.println(al);
		al.remove(1);
		System.out.println(al);
    System.out.println(al.toArray());
    System.out.println(al.contains()); //checks wheather element is Present or not
    System.out.println(al.size());     //Returns the Size 
		
	}
	Collection.sort(al);         //It will sort the Array list in ascending order
	
