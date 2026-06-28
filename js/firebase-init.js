import{initializeApp}from'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import{getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,onAuthStateChanged,updateProfile,setPersistence,browserLocalPersistence}from'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import{getFirestore,doc,getDoc,collection,getDocs,setDoc,updateDoc,deleteDoc,serverTimestamp,query,orderBy,limit}from'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
const firebaseConfig={apiKey:"AIzaSyAqJFXOd8yeRLX3EoXfoA2JE9NddxENrLg",authDomain:"studyquest-5a9a9.firebaseapp.com",projectId:"studyquest-5a9a9",storageBucket:"studyquest-5a9a9.firebasestorage.app",messagingSenderId:"133504548289",appId:"1:133504548289:web:51edcb1dea679da00b4340"};
const app=initializeApp(firebaseConfig);
const auth=getAuth(app);
const db=getFirestore(app);
// Persist the session in localStorage so users stay logged in across browser restarts.
setPersistence(auth,browserLocalPersistence).catch(()=>{}).finally(()=>{
  window._fb={auth,db,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,onAuthStateChanged,updateProfile,doc,getDoc,setDoc,updateDoc,deleteDoc,serverTimestamp,collection,getDocs,query,orderBy,limit};
  window._fbReady=true;
  window.dispatchEvent(new Event('fbready'));
});
