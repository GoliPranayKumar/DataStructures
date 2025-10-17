public class Main
{
	public static void main(String[] args) {
	
    String s="abab";
    String a="ab";
    System.out.println(s.startsWith(a) && s.endsWith(a));  //Checks whether It is Starting with a character or not wise versa for ending
    
    String gm="Pranay";
    String hm="Pra";
    if(gm.contains(hm)) System.out.println("True");  //It checks whether the String is present or not
    else System.out.println("False");
    
    
    String k="Hii, how are you?";
    String arr[]=k.split("\\W+");    //Used to Split the String and store in a array
        
        
    for(String i:arr){
    System.out.println(i);
            
    }
    String op="8779igjkgut@$^&$&..,,/k";   
    String temp=op.replaceAll("[^A-Za-z0-9]","");   //It remove the special character from the string it only allows A-Z ,a-z ,0-9
    System.out.println(temp);
    
    
    
    
    public static int minimumNumber(int n, String password) {
    int missing = 0;

    // Check each category directly
    if (!password.matches(".*[a-z].*")) missing++;                // lowercase
    if (!password.matches(".*[A-Z].*")) missing++;                // uppercase
    if (!password.matches(".*[0-9].*")) missing++;                // digit
    if (!password.matches(".*[!@#$%^&*()\\-+].*")) missing++;     // special

    // The answer is the larger of:
    //   - how many character types are missing
    //   - how many chars we need to reach length 6
    return Math.max(missing, 6 - password.length());
}


	}
}
