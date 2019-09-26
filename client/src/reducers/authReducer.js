import { 
  FETCH_USER,
  
  REGISTRATION_FAILED,
  
  LOGIN_FAILED,
 
  AUTH_ERROR,

  LOGOUT_SUCCESS
} from "../actions/types";

const inistialState = {
 
  isLoading: false,
  isAuthenticated: false,
  user: null,
}
export default function(state = inistialState, action) {
  switch (action.type) {
    case FETCH_USER:
   
        return {
          ...state,
           user: action.payload,
           isAuthenticated: true,
           isLoading: false,
        };
 
      case AUTH_ERROR:
      case LOGIN_FAILED:
      case REGISTRATION_FAILED:
      case LOGOUT_SUCCESS:
      return {
        ...state,
         isAuthenticated: false,
         isLoading: false,
       
         user: null
      }

    default:
      return state;
  }
}
