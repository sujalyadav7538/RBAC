import bcrypt from 'bcryptjs';

export const hashedPassword=async(Password)=>{
       const pass=await bcrypt.hash(Password,10); 
       return pass;
};

export const comparePassword=async(Password,original)=>{
       const compare= await bcrypt.compare(Password,original);
       return compare;
}

