
import { AppContext } from "@/provider/AppProvider";
import { AppContextType } from "@/types/custom-interface";
import { useContext } from "react"
const useGlobalContext = () => {
  return useContext(AppContext) as AppContextType
}

export default useGlobalContext;