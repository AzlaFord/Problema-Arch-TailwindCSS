import {authLogin,createToken} from "./../../lib/auth";

export async function POST(request) {
    const body = await request.json();
    const { userName, password } = body;
    
    if (!userName) {
        return new Response(
            JSON.stringify({ message: "Login nu exista" }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
    
    if (!password) {
        return new Response(
            JSON.stringify({ message: "parola nu exista" }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
    const autentificare = await authLogin(userName,password)
    
    if (!autentificare.success) {
        return new Response(
            JSON.stringify({ message: autentificare.message }),
            {
                status: 401,
                headers: { "Content-Type": "application/json" }
            }
        );
    }

    const {user} = autentificare
    const token = await createToken(user)
    
    if (token.success) {
        return new Response(
            JSON.stringify({ message: "token primit reusit", token: token.token }),
            {
                status: 200,
                headers: { 
                    "Set-Cookie": `token=${encodeURIComponent(token.token)}; HttpOnly; Path=/; Max-Age=604800`,
                    "Content-Type": "application/json" }
            }
        );
    }else{
        return new Response(
            JSON.stringify({ message: "Eroare la generarea tokenului", } ),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}
