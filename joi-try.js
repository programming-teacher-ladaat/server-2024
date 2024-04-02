const Joi = require('joi');

const schema = Joi.object({ // כל סכמה היא אוביקט
    username: Joi.string() // מחרוזת
        .alphanum() // אותיות/מספרים
        .min(3) // אורך מינימלי 3
        .max(30) // אורך מקסימלי 30
        .required(), // חובה

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')), // ביטוי רגולרי

    repeat_password: Joi.ref('password'), // השוואה לשדה אחר בסכמה

    access_token: [
        Joi.string(),
        Joi.number()
    ], // או מספר או מחרוזת

    birth_year: Joi.number() // מספר
        .integer() // שלם
        .min(1900) // מינימום
        .max(2013), // מקסימום

    email: Joi.string() // מחרוזת
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})
    .with('username', 'birth_year')
    .xor('password', 'access_token')
    .with('password', 'repeat_password');
// לסכמה הנוכחית יש כמה אפשרויות

schema.validate({ username: 'abc', birth_year: 1994 });
// -> { value: { username: 'abc', birth_year: 1994 } }

schema.validate({});
// -> { value: {}, error: '"username" is required' }

// Also -

// try {
//     const value = await schema.validateAsync({ username: 'abc', birth_year: 1994 });
//     console.log(value);
// }
// catch (err) { }
