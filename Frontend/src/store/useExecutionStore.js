import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useExecutionStore = create((set)=>({
    isExecuting:false,
    submission:null,
    
    submitCode: async ( source_code, language_id, stdin, expected_outputs, problemId) => {
        try {
            set({isExecuting:true});
            const res = await axiosInstance.post("/execute-code/submit" , { source_code, language_id, stdin, expected_outputs, problemId });

            set({submission:res.data.data.submission});
            toast.success(res.data.message);
        } catch (error) {
            toast.error("Code execution failed");
        }
        finally{
            set({isExecuting:false});
        }
    },
    
    executeCode: async ( source_code, language_id, stdin, expected_outputs, problemId) => {
        try {
            set({isExecuting:true});
            const res = await axiosInstance.post("/execute-code/execute" , { source_code, language_id, stdin, expected_outputs, problemId });

            set({submission:res.data.data.submission});
            toast.success(res.data.message);
        } catch (error) {
            toast.error("Code execution failed");
        }
        finally{
            set({isExecuting:false});
        }
    }
}))