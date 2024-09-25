import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { auth } from '../firebase/config';

export const useAuth = () => {
  // userの型を User | null に変更
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // currentUser は User | null なので、そのままセット
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const signin = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  return { user, signin, logout };
};
