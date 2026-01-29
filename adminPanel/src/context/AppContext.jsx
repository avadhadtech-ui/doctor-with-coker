import {createContext} from 'react'
export const AppContext = createContext()

const AppContextProvider = (props) =>{
    const calculateAge = (dob) => {
            const today = new Date()
            const birthdate = new Date(dob)

            let age = today.getFullYear() - birthdate.getFullYear()

            return age
    }
     const months = [' ','Jan',"Feb","Mar","Apr","May","Jun","Jul","Aug",'Sep','Oct',"Nov",'Dec']
     const slotDateFormate = (slotDate) =>{
    const dateArr = slotDate.split('_')
    return dateArr[0]+ " " + months[Number(dateArr[1])] + " " + dateArr[2]
  } 
    const value = {
            calculateAge,
            slotDateFormate
    }
    return (
    <AppContext.Provider value={value}>
            {props.children}
    </AppContext.Provider>)
}
export default AppContextProvider