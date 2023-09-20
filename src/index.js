import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, getDocs,
  addDoc, deleteDoc, doc,
  onSnapshot,
  query, where,
  orderBy, serverTimestamp,
  getDoc,
  updateDoc,
} from 'firebase/firestore'
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signOut, signInWithEmailAndPassword,
  onAuthStateChanged, 
} from 'firebase/auth'

const firebaseConfig = {
  //get from firebase acc
  };

// init firebase app
initializeApp(firebaseConfig)

//init services
const db = getFirestore()
const auth = getAuth()

// collection ref
const colRef = collection(db, 'books')

// get collection date
getDocs(colRef)
  .then((snapshot) => {
      let books = []
      snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id })
      })
      // console.log(books)
  })
  .catch(err => {
      console.log(err.message)
  })

//real time collection data
const unsubCol = onSnapshot(colRef, (snapshot) => {
  let books = []
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id })
  })
  console.log(books)
})


//queries
const q = query(colRef, orderBy('createdAt'))

const ubsubDoc = onSnapshot(q, (snapshot) => {
  let books = []
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id })
  })
  console.log("createdAt",books)
})


//adding documents
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault()
  
  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt : serverTimestamp()
  })
  .then(() => {
    addBookForm.reset()
  })
})

//deleting documents
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'books', deleteBookForm.id.value)

  deleteDoc(docRef)
  .then(() => {
    deleteBookForm.reset()
  })

})


//get single document
const docRef = doc(db, 'books', 'k3RB0ckft5iNc3eSFrUM')

getDoc(docRef).then((doc) => {
  // console.log(doc.data(), doc.id)
})

// onSnapshot(docRef, (doc) => {
//   // console.log("onSnapshot", doc.data(), doc.id)
// })


//update a document form
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'books', updateForm.id.value)

  updateDoc(docRef, {
    title: 'updated title',
  })
  .then(() => {
    updateForm.reset()
  })
})


//signing users up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = signupForm.email.value
  const password = signupForm.password.value

  createUserWithEmailAndPassword(auth, email, password)
  .then((cred) => {
    // console.log("user created:", cred.user)
    signupForm.reset()
  })
  .catch((err) => {
    console.log(err.message)
  })
})

//logging in and out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {

  signOut(auth)
  .then(() => {
    // console.log("user signed out")
  })
  .catch((err) => {
    console.log(err.message)
  })
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email, password)
  .then((cred) => {
    // console.log("user logged in:", cred.user)
    loginForm.reset()
  })
  .catch((err) => {
    console.log(err.message)
  })
})


//subscribing to auth change
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log("user status changed:", user)
})


//unsubscribing from changes (auth & db)
// step 1: added const unsub to all subbed
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
  console.log("unsubbing")
  unsubCol(),
  ubsubDoc(),
  unsubAuth()
})