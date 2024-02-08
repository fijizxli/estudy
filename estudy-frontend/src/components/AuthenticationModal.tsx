import {useAuth} from "../context";
import Register from "./Register";
import Login from "./Login";

export default function AuthenticationModal() {
    const { authModalType } = useAuth();
    switch (authModalType) {
        case "Login":
            return <Login />;
        case "Register":
            return <Register />;
        default:
            return null;
    }
}
