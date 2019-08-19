import Cookies from 'universal-cookie'
const cookies = new Cookies()
const initialState = {
    jwt: cookies.get('jwt'),
    userId: cookies.get('userId'),
    createdAt: cookies.get('createdAt'),
    expiresAt: cookies.get('expiresAt')
}

const reducer = (state = initialState,action) => {
   if(action.type === 'SAVE_JWT'){
       console.log(action.value)
       return {
           ...state,
           jwt:action.value
       }
   }
   if(action.type === 'SAVE_ID'){
       console.log(action.value)
       return {
           ...state,
           userId:action.value
       }
   }
   if(action.type === 'SAVE_DATE') {
       console.log(action.createdAt,action.expiresAt)
       return {
        ...state,
        createdAt: action.createdAt,
        expiresAt: action.expiresAt
        }
   }
   return state
}

export default reducer