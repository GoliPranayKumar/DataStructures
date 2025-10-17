import java.util.*;
public class Main
{
	public static void main(String[] args) {
		HashMap<Integer,Integer> Hm=new HashMap<>();//Declaration of Hashmap in java
		Hm.put(3,1);//To Put the Values into the Hashmap
		Hm.put(2,1);
		Hm.put(1,0);
		System.out.println(Hm.get(3));//Hm.get(key) is the method to get the Value of that Particular Key
		if(Hm.containsKey(1)){//This Method Checks Wheather the Key is Present in the hashmap or Not
		    System.out.println("True");
		}
		for(int i:Hm.keySet()){//keySet Return the Every Key to the Varaiable which is Present in the hashmap
		    System.out.println(i+" "+Hm.get(i));
		}
		//Suppose if you have an Array[]={1,2,3,4,1,1,}
		//Then how to set these numbers into the hashmap with their Repeating Frequencies in the Array
		//Here is the Optimized Way of doing this
		HashMap<Integer,Integer> pk=new HashMap<>();
		int arr[]={1,1,2,3,4,5,5};
		for(int j=0;j<arr.length;j++){
		    pk.put(arr[j],pk.getOrDefault(arr[j],0)+1);//Thsi Is the Optimised Way of Setting Key value pairs into the Hashmap and getOrDefault() methed set the Value+1 if there exists a key else the value to the new is set to be 1.
		}
		System.out.println("Here is the output\n");
		  for(int i:pk.keySet()){//keySet Return the Every Key to the Varaiable which is Present in the hashmap
		  
		    System.out.println(i+" "+pk.get(i));
		  
		
	}
}}
