import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import client from "../../client";

export default {
    Mutation: {
        // save and return the user
        login: async(_, {username, password}) => {
            // find user with args.username
            const user = await client.user.findFirst({where:{username}});
            if(!user) {
                return {
                    ok: false,
                    error: "User not found.",
                }
            }
            // check password with args.password
            const passwordOk = await bcrypt.compare(password, user.password);
            console.log('passwordok? ' + passwordOk);
            if(!passwordOk) {
                return {
                    ok: false,
                    error: "Incorrect passwrod."
                };
            }
            // issue a token and send it to the user
            const token = await jwt.sign({id:user.id}, process.env.SECRET_KEY);
            return {
                ok: true,
                token,
            }
        },
    },
};