const user = require("../models/user");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAuthorizationadmin } = require("./verifyToken");

const router = require("express").Router();


//update

router.put("/:id",verifyTokenAndAuthorization,async(req,res)=>{
if(req.body.password){
    req.body.password= CryptoJS.AES.encrypt(req.body.password,process.env.PASSWORD_SECRET).toString();
}
try {
    const  updatedUser = await user.findByIdAndUpdate(req.params.id,{
        $set:req.body
    },{new:true})
    res.status(200).json({
        status:"Sucess",
        message:"User name changed sucessfully"
    })
} catch (error) {
    res.status(500).json(error) 
}

}
)


//Delete method

router.delete("/:id",verifyTokenAndAuthorization, async (req,res)=>{
try {
   await user.findByIdAndDelete(req.params.id)
   res.status(200).json({
    status:"Sucess",
    message:"user deleted Sucessfully"
   }) 
} catch (error) {
    res.status(500).json(err)
}
}
)


//Get one user 
router.get("/userFind/:id", verifyTokenAndAuthorizationadmin, async (req, res) => {
    try {
        const foundUser = await user.findById(req.params.id);
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }
        //for showing only the details in the json
        const { password, ...others } = foundUser._doc;
      
      //  for seeing detail on json of the user or amdin
        res.status(200).json(others);
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/getAllUsers", verifyTokenAndAuthorizationadmin, async (req, res) => {
    try {
        const allUsers = await user.find();
        if (!allUsers || allUsers.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        // Assuming you want to exclude password from the response
        const usersWithoutPassword = allUsers.map(user => {
            const { password, ...others } = user._doc;
            return others;
        });
        res.status(200).json(usersWithoutPassword);
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ error: "Internal Server Error" });
    }
});


  module.exports = router;