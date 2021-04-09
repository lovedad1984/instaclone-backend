import bcrypt from "bcryptjs";
import client from "../../client";

export default {
    Mutation: {
        createAccount: async (_, {
            firstName,
            lastName,
            username,
            email,
            password,
        }) => {
            // check if username or email are already on DB.
            try {
                const existingUser = await client.user.findFirst({
                    where: {
                        OR: [
                            {
                                username,
                            },
                            {
                                email,
                            },
                        ],
                    },
                });
                // console.log(existingUser)
                if(existingUser) {
                    throw new Error("This username/email is already taken.");
                }
                // hash password
                const uglyPassword = await bcrypt.hash(password, 10);
                console.log(uglyPassword);
                return client.user.create({data: {
                    username, email, firstName, lastName, password:uglyPassword,
                }})
            } catch(e) {
                return e;
            }
        },
        // save and return the user

    },
};