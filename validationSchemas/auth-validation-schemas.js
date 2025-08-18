
const signInValidationSchema = {
    email: {
        isEmail: {
            errorMessage: "Enter a valid email"
        },
        notEmpty: {
            errorMessage: "Email cannot be empty"
        }
    },
    password: {
        notEmpty: {
            errorMessage: "Password cannot be empty"
        },
        isLength: {
            options: {min: 6, max: 12},
            errorMessage: "Password must be between the range of 6 to 12 characters long"
        }
    }
}

const signUpValidationSchema = {
    ...signInValidationSchema,
    name: {
        notEmpty: {
            errorMessage: "Name cannot be empty",
        },
    }
}


module.exports = {
    signInValidationSchema,
    signUpValidationSchema
}