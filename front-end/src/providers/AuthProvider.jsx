import React, { useState, useContext } from "react";
import { FirebaseContext } from "./FirebaseProvider";
import {
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	createUserWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
import { useEffect } from "react";

export const AuthContext = React.createContext();

export const AuthProvider = (props) => {
	const children = props.children;

	const fbContext = useContext(FirebaseContext);
	const auth = fbContext.auth;

	const [error, setError] = useState(false);
	const [regError, setRegError] = useState(false);
	const [user, setUser] = useState(null);
	const [permission, setPermission] = useState(0)
	const [muid, setMuid] = useState("")

	const addUser = async ({permission, firstName, lastName, username, token, quadrant}) => {
		const req = await fetch("/api/user", {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify({permission, firstName, lastName, username, token, quadrant}),
		});
		const newUser = await req.json();
		console.log(newUser.firstName, "added");
		
	  };

	  const permissionChecker = async (key, username) => {
		const req = await fetch("/api/auth", {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify({key, username}),
		});
		const perm = await req.json();
		if(perm.permission){
			setPermission(perm.permission)
			setMuid(perm.muid)
		}
	  };



	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (user) => {
				setUser(user);
					if(user){
						permissionChecker(user.accessToken, user.displayName)
		} else {
			setPermission(0)
		}
		});
		return unsub; // to shut down onAuthStateChanged listener
	}, [auth]);

	const login = async (email, password) => {
		try {
			let userCred = await signInWithEmailAndPassword(auth, email, password);
			if (userCred) {
				await permissionChecker(userCred.user.accessToken, userCred.user.displayName)
			} else {
				console.log("Login failed!");
			}
		} catch (err) {
			console.log("AUTH FAILURE!", err.message);
			setError(true);
		}
	};

	const logout = async () => {
		await signOut(auth);
		setPermission(0)
	};

	const register = async (email, password, username, firstName, lastName, permission) => {
			try {
				let userCred = await createUserWithEmailAndPassword(
					auth,
					email,
					password
				);
				if (userCred) {
					const user = userCred.user
					const token = user.accessToken
					await updateProfile(user, {
						displayName: username,
					})
					addUser({permission, firstName, lastName, username, token})
					alert("Registration Successful! Please Sign in again!")
				} else {
					console.log("Registration failed!");
				}
			} catch (err) {
				alert("REGISTRATION FAILURE!", err.message);
				setRegError(true);
			}
			
			logout()

	};
	const theValues = { user, login, logout, error, register, regError, permission, muid };

	return (
		<AuthContext.Provider value={theValues}>{children}</AuthContext.Provider>
	);
};
