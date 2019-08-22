import Cookies from 'universal-cookie'
const cookies = new Cookies()
const initialState = {
    jwt: cookies.get('jwt'),
    userId: cookies.get('userId'),
    createdAt: cookies.get('createdAt'),
    expiresAt: cookies.get('expiresAt'),
    coins: 0,
    bet: 0
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

   if(action.type==='SAVE_COINS') {
    return {
           ...state,
           coins: action.coins
       }
   }
   if(action.type === 'SAVE_BET'){
       return {
           ...state,
           bet: action.bet
       }
   }
   return state
}

export default reducer