//Hashset is the data Structure it doesnt store the duplicate values.The need of hashset is It Finds 
//the elememt in O(1) time complexibility and Basically a set Type

import java.util.*;
public class Main
{
	public static void main(String[] args) {
		HashSet <Integer> hs=new HashSet<>(); //Declaration of HashSet
		    hs.add(1);                        //Add elements to HashSet
		    hs.add(2);
		    System.out.println(hs.size());    //Size() method returns the size of the HashSet
		    hs.remove(1);                     //To delete the element from the Hashset we use remove method()
		    System.out.println(hs);           //We can directly print the Hashset with the Name
		    if(hs.contains(2)){               //Checks whether the element is present in the Hashset or not
		        System.out.println("Undhi ra");
		    }
		    HashSet<Integer> hm=new HashSet<>();
            HashSet<Integer> pm=new HashSet<>();
            
            
            hm.add(1);
            hm.add(2);
            hm.add(2);
            hm.add(4);
            hm.add(5);
            
            
            pm.add(1);
            pm.add(2);
            
            pm.retainAll(hm);               //This methods retains all the common elements present in the two Hashsets
            for(int i:pm){                  //In hashSet we access elements directly
                System.out.println(i);
            }
		}
	}

